var express = require('express');
var router = express.Router();

var partiesResponse = require('../data/parties.json');
var parties = partiesResponse.parties;

var episodes = require('../data/episodes.json');

router.get('/patient/:id/episodes', function(req, res) {
  console.log('getting episodes for patient id = ' + req.params.id);
  res.json(episodes);
});

router.get('/patient/:id', function(req, res) {
  var partyId = req.params.id
  var patient = patientUtils.findByProperty(parties, "id", partyId);
  res.json(patient);
});

module.exports = router;
