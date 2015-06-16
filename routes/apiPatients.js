var express = require('express');
var request = require('request');
var router = express.Router();

var partiesResponse = require('../data/parties.json');
var parties = partiesResponse.parties;

var episodes = require('../data/episodes.json');

// ehrScape details
var ehrscapeBaseUrl = 'https://rest.ehrscape.com/rest/v1/';
var ehrId = 'f3da219d-4ca6-461f-a9ea-a1ad5df069e9';
var templateId = 'Across - Visual Acuity Report';
var committerName = 'ACROSS';
var postFormat = 'FLAT';
var compositionEndpoint = 'composition/';
var queryEndpoint = 'query/';
var compositionId = '49f085f8-fa4f-4d5c-a2f2-f62a1f0af4ab::across.c4h.ehrscape.com::1';
var getFormat = 'STRUCTURED';
var basicAuth = 'Basic YzRoX2Fjcm9zczpDQUJFUk1BbA==';

router.get('/patient/:id', function(req, res) {
  var partyId = req.params.id
  var patient = patientUtils.findByProperty(parties, "id", partyId);
  res.json(patient);
});

router.get('/patient/:id/episodes', function(req, res) {
  getLatestVisualAcuityCompositionId(function(compositionId) {
    getVisualAcuityComposition(compositionId, function() {
      res.json(episodes);
    });
  });
});

router.post('/patient/:id/visual-acuity', function(req, res) {
  postVisualAcuityComposition(req.body, function(body) {
    res.json(body);
  });
});

function postVisualAcuityComposition(visualAcuity, callback) {
  var options = {
    url: ehrscapeBaseUrl + compositionEndpoint + '?ehrId=' + ehrId + '&templateId=' + templateId + '&committerName=' + committerName + '&format=' + postFormat,
    method: 'post',
    headers: {
      'Authorization': basicAuth,
    },
    body: translateVisualAcuityForSave(visualAcuity),
    json: true
  };
  function requestCallback(error, response, body) {
    callback(body);
  }
  return request(options, requestCallback);
}

function getVisualAcuityComposition(compositionId, callback) {
  var options = {
    url: ehrscapeBaseUrl + compositionEndpoint + compositionId + '?format=' + getFormat,
    headers: {
      'Authorization': basicAuth
    }
  };
  function requestCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      episodes.episodes[1].workflowData['stage527901'].events['event3'].visualAcuity = translateVisualAcuityForUI(JSON.parse(body));
      callback();
    }
  }
  return request(options, requestCallback);
};

function getLatestVisualAcuityCompositionId(callback) {
  var options = {
    url: ehrscapeBaseUrl + queryEndpoint + "?aql=select a/uid/value as uid_value, a/context/start_time/value as context_start_time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a[openEHR-EHR-COMPOSITION.report.v1] where a/name/value= 'Visual Acuity Report' order by a/context/start_time/value desc offset 0 limit 1",
    headers: {
      'Authorization': basicAuth
    }
  }
  function requestCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('old composition id = ' + compositionId);
      compositionId = JSON.parse(body).resultSet[0].uid_value;
      console.log('new composition id = ' + compositionId);
      callback(compositionId);
    }
  }
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
    processed[base+'/left_eye/notation/low_vision_score|code'] = left_eye[0];
    processed[base+'/left_eye/notation/low_vision_score|value'] = left_eye[1];
    processed[base+'/left_eye/notation/low_vision_score|ordinal'] = left_eye[2];
    processed[base+'/right_eye/notation/low_vision_score|code'] = right_eye[0];
    processed[base+'/right_eye/notation/low_vision_score|value'] = right_eye[1];
    processed[base+'/right_eye/notation/low_vision_score|ordinal'] = right_eye[2];
  }
  return processed;
}

function translateVisualAcuityForUI(rawVisualAcuity) {
  var vaEvents = rawVisualAcuity.composition.visual_acuity_report.visual_acuity[0].any_event;
  var processedEntries = [];
  for (var i=0; i<vaEvents.length; i++) {
    var entry = {};
    entry['method'] = vaEvents[i].test_name[0]['|code'] + '::' + vaEvents[i].test_name[0]['|value']
    var l = vaEvents[i].left_eye[0].notation[0].low_vision_score[0];
    var r = vaEvents[i].right_eye[0].notation[0].low_vision_score[0];
    entry['left_eye'] = { "value": l['|code'] + '::' + l['|value'] + '::' + l['|ordinal'] };
    entry['right_eye'] = { "value": r['|code'] + '::' + r['|value'] + '::' + r['|ordinal'] };
    processedEntries.push(entry); 
  }
  return { "entries": processedEntries }
}

module.exports = router;
