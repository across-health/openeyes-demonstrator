var express = require('express');
var request = require('request');
var router = express.Router();

var partiesResponse = require('../data/parties.json');
var parties = partiesResponse.parties;

var episodes = require('../data/episodes.json');

var ehrscapeBaseUrl = 'https://rest.ehrscape.com/rest/v1/';
var compositionEndpoint = 'composition/';
var compositionId = '49f085f8-fa4f-4d5c-a2f2-f62a1f0af4ab::across.c4h.ehrscape.com::1';
var compositionFormat = 'STRUCTURED';
var basicAuth = 'Basic YzRoX2Fjcm9zczpDQUJFUk1BbA==';

router.get('/patient/:id/episodes', function(req, res) {
  populateVisualAcuityComposition(function() {
    res.json(episodes);
  });
});

router.get('/patient/:id', function(req, res) {
  var partyId = req.params.id
  var patient = patientUtils.findByProperty(parties, "id", partyId);
  res.json(patient);
});

function populateVisualAcuityComposition(callback) {
  var options = {
    url: ehrscapeBaseUrl + compositionEndpoint + compositionId + '?format=' + compositionFormat,
    headers: {
      'Authorization': basicAuth
    }
  };
  function requestCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      episodes.episodes[1].workflowData['stage527901'].events['event3'].visualAcuity = translateVisualAcuityForUI(JSON.parse(body))
      callback();
    }
  }
  return request(options, requestCallback);
};

function translateVisualAcuityForUI(rawVisualAcuity) {
  var vaEvents = rawVisualAcuity.composition.visual_acuity_report.visual_acuity[0].any_event;
  var processedEntries = [];
  for (var i=0; i<vaEvents.length; i++) {
    console.log(vaEvents[i]);
    var entry = {};
    entry['method'] = vaEvents[i].test_name[0]['|code'] + '::' + vaEvents[i].test_name[0]['|value']
    var l = vaEvents[i].left_eye[0].notation[0].low_vision_score[0];
    var r = vaEvents[i].right_eye[0].notation[0].low_vision_score[0];
    entry['left_eye'] = { "value": l['|code'] + '::' + l['|value'] + '::' + l['|ordinal'] };
    entry['right_eye'] = { "value": r['|code'] + '::' + r['|value'] + '::' + r['|ordinal'] };
    console.log(entry);
    processedEntries.push(entry); 
  }
  return { "entries": processedEntries }
}

module.exports = router;
