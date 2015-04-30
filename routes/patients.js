var express = require('express');
var router = express.Router();

var partiesResponse = require('../data/parties.json');
var parties = partiesResponse.parties;

router.get('/patients', function(req, res, next) {
  res.render('patientList', { title: 'Patient list', partyCount: parties.length, parties: parties });
});

router.get('/patient/:id', function(req, res, next) {
  var partyId = req.params.id
  var patient = patientUtils.findByProperty(parties, "id", partyId);
  res.render('patient', { title: 'Patient details', patient: patient });
});

module.exports = router;
