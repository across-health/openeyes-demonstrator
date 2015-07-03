var express = require('express');
var request = require('request');
var router = express.Router();

var episodes = require('../data/episodes.json');

router.get('/patient/:id', function(req, res) {
  var partyId = req.params.id
  patientUtils.getPatientByPartyId(partyId, function(data) {
    res.json(data.party);
  });
});

router.get('/patient/:id/episodes', function(req, res) {
  var partyId = req.params.id;
  getEhrIdBySubjectId(partyId, function(ehrId) {
    getLatestVisualAcuityCompositionId(ehrId, function(compositionId) {
      getVisualAcuityComposition(compositionId, function() {
        res.json(episodes);
      });
    });
  });

});

router.post('/patient/:id/visual-acuity', function(req, res) {
  postVisualAcuityComposition(req.body, function(body) {
    res.json(body);
  });
});

function getEhrIdBySubjectId(subjectId, callback) {
  var options = {
    url: ehrscapeUtils.ehrscapeBaseUrl + ehrscapeUtils.ehrEndpoint + '?subjectId=' + subjectId + '&subjectNamespace=' + ehrscapeUtils.subjectNamespace,
    headers: {
      'Authorization': ehrscapeUtils.basicAuth,
    },
  };
  function requestCallback(error, response, body) {
    console.log(new Date() - start + 'ms', '| GET', options.url.substr(0, 100), '|');
    ehr = JSON.parse(body);
    callback(ehr.ehrId);
  }
  var start = new Date();
  return request(options, requestCallback);
};

function postVisualAcuityComposition(visualAcuity, callback) {
  var options = {
    url: ehrscapeUtils.ehrscapeBaseUrl + ehrscapeUtils.compositionEndpoint + '?ehrId=' + ehrscapeUtils.ehrId + '&templateId=' + ehrscapeUtils.templateId + '&committerName=' + ehrscapeUtils.committerName + '&format=' + ehrscapeUtils.postFormat,
    method: 'post',
    headers: {
      'Authorization': ehrscapeUtils.basicAuth,
    },
    body: translateVisualAcuityForSave(visualAcuity),
    json: true
  };
  function requestCallback(error, response, body) {
    console.log(new Date() - start + 'ms', '| POST', options.url.substr(0, 100), '|');
    callback(body);
  }
  var start = new Date();
  return request(options, requestCallback);
};

function getVisualAcuityComposition(compositionId, callback) {
  var options = {
    url: ehrscapeUtils.ehrscapeBaseUrl + ehrscapeUtils.compositionEndpoint + compositionId + '?format=' + ehrscapeUtils.getFormat,
    headers: {
      'Authorization': ehrscapeUtils.basicAuth
    }
  };
  function requestCallback(error, response, body) {
    console.log(new Date() - start + 'ms', '| GET', options.url.substr(0, 100), '|');
    if (!error && response.statusCode == 200) {
      episodes.episodes[1].workflowData['stage527901'].events['event3'].visualAcuity = translateVisualAcuityForUI(JSON.parse(body));
      callback();
    }
  };
  var start = new Date();
  return request(options, requestCallback);
};

function getLatestVisualAcuityCompositionId(ehrId, callback) {
  var options = {
    url: ehrscapeUtils.ehrscapeBaseUrl + ehrscapeUtils.queryEndpoint + "?aql=select a/uid/value as uid_value, a/context/start_time/value as context_start_time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a[openEHR-EHR-COMPOSITION.report.v1] where a/name/value= 'Visual Acuity Report' order by a/context/start_time/value desc offset 0 limit 1",
    headers: {
      'Authorization': ehrscapeUtils.basicAuth
    }
  };
  function requestCallback(error, response, body) {
    console.log(new Date() - start + 'ms', '| GET', options.url.substr(0, 100), '|');
    if (!error && response.statusCode == 200) {
      var compositionId = JSON.parse(body).resultSet[0].uid_value;
      callback(compositionId);
    }
  };
  var start = new Date();
  return request(options, requestCallback);
};

function translateVisualAcuityForSave(visualAcuity) {
  console.log(visualAcuity);
  var now = new Date();
  var processed = {
    "ctx/composer_name": "Dr Joyce Smith",
    "ctx/health_care_facility|id": "999999-345",
    "ctx/health_care_facility|name": "Northumbria Community NHS",
    "ctx/id_namespace": "NHS-UK",
    "ctx/id_scheme": "2.16.840.1.113883.2.1.4.3",
    "ctx/language": "en",
    "ctx/territory": "GB",
    "ctx/time": now.toISOString(),
    "visual_acuity_report/visual_acuity:0/any_event:0/left_eye/eye_examined|code": "at0012",
    "visual_acuity_report/visual_acuity:0/any_event:0/right_eye/eye_examined|code": "at0013",
    "visual_acuity_report/visual_acuity:0/any_event:1/test_name|code": "at0137",
    "visual_acuity_report/visual_acuity:0/any_event:1/left_eye/eye_examined|code": "at0012",
    "visual_acuity_report/visual_acuity:0/any_event:1/left_eye/interpretation:0": "Poor vision.",
    "visual_acuity_report/visual_acuity:0/any_event:1/right_eye/eye_examined|code": "at0013",
    "visual_acuity_report/visual_acuity:0/any_event:1/right_eye/interpretation:0": "Corrected vision in right eye pretty still pretty poor"
  };
  for (var i=0; i<visualAcuity.entries.length; i++) {
    var base = "visual_acuity_report/visual_acuity:0/any_event:"+i;
    var method = visualAcuity.entries[i].method.split('::');
    var left_eye = visualAcuity.entries[i].left_eye.value.split('::');
    var right_eye = visualAcuity.entries[i].right_eye.value.split('::');
    processed[base+'/test_name|code'] = method[0];
    if (left_eye[0] == 'LVS') {
      processed[base+'/left_eye/notation/low_vision_score|code'] = left_eye[1];
      processed[base+'/left_eye/notation/low_vision_score|value'] = left_eye[2];
      processed[base+'/left_eye/notation/low_vision_score|ordinal'] = left_eye[3];
    }
    if (left_eye[0] == 'MS') {
      processed[base+'/left_eye/notation/metric_snellen|numerator'] = left_eye[1];
      processed[base+'/left_eye/notation/metric_snellen|denominator'] = left_eye[2];
    }
    if (right_eye[0] == 'LVS') {
      processed[base+'/right_eye/notation/low_vision_score|code'] = right_eye[1];
      processed[base+'/right_eye/notation/low_vision_score|value'] = right_eye[2];
      processed[base+'/right_eye/notation/low_vision_score|ordinal'] = right_eye[3];
    }
    if (right_eye[0] == 'MS') {
      processed[base+'/right_eye/notation/metric_snellen|numerator'] = right_eye[1];
      processed[base+'/right_eye/notation/metric_snellen|denominator'] = right_eye[2];
    }
  }
  return processed;
}

function translateVisualAcuityForUI(rawVisualAcuity) {
  var vaEvents = rawVisualAcuity.composition.visual_acuity_report.visual_acuity[0].any_event;
  var processedEntries = [];
  for (var i=0; i<vaEvents.length; i++) {
    var entry = {};
    entry['method'] = vaEvents[i].test_name[0]['|code'] + '::' + vaEvents[i].test_name[0]['|value']
    var lLvs = vaEvents[i].left_eye[0].notation[0].low_vision_score;
    var lMs = vaEvents[i].left_eye[0].notation[0].metric_snellen;
    var rLvs = vaEvents[i].right_eye[0].notation[0].low_vision_score;
    var rMs = vaEvents[i].right_eye[0].notation[0].metric_snellen;
    if (lLvs != undefined) {
      l = lLvs[0];
      entry['left_eye'] = { "value": 'LVS::' + l['|code'] + '::' + l['|value'] + '::' + l['|ordinal'] };
    }
    if (lMs != undefined) {
      l = lMs[0];
      entry['left_eye'] = { "value": 'MS::' + l['|numerator'] + '::' + l['|denominator'] };
    }
    if (rLvs != undefined) {
      r = rLvs[0];
      entry['right_eye'] = { "value": 'LVS::' + r['|code'] + '::' + r['|value'] + '::' + r['|ordinal'] };
    }
    if (rMs != undefined) {
      r = rMs[0];
      entry['right_eye'] = { "value": 'MS::' + r['|numerator'] + '::' + r['|denominator'] };
    }
    processedEntries.push(entry); 
  }
  return { "entries": processedEntries }
}

module.exports = router;
