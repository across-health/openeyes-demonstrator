var express = require('express');
var router = express.Router();

var partiesResponse = require('../data/parties.json');
var parties = partiesResponse.parties;

var episodes = require('../data/episodes.json');

router.get('/patients', function(req, res) {
  res.render('patientList', { title: 'Patient list', partyCount: parties.length, parties: parties });
});

router.get('/patient/:id', function(req, res) {
  var partyId = req.params.id
  var patient = patientUtils.findByProperty(parties, "id", partyId);
  res.render('patient', { title: 'Patient details', patient: patient, patientUtils: patientUtils });
});

router.get('/patient/:id/episodes', function(req, res) {
  console.log('getting episodes for patient id = ' + req.params.id);
  res.json(episodes);
});

module.exports = router;
