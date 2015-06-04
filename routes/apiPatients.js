var express = require('express');
var router = express.Router();

var partiesResponse = require('../data/parties.json');
var parties = partiesResponse.parties;

var episodes = require('../data/episodes.json');
var events = [require('../data/event1.json'), require('../data/event2.json'), require('../data/event3.json')];

router.get('/patient/:id/episodes', function(req, res) {
  res.json(episodes);
});

router.get('/patient/:id', function(req, res) {
  var partyId = req.params.id
  var patient = patientUtils.findByProperty(parties, "id", partyId);
  res.json(patient);
});

router.get('/patient/:patientId/episode/:episodeId/event/:eventId', function(req, res) {
  res.json(events[req.params.eventId-1]);
});

module.exports = router;
