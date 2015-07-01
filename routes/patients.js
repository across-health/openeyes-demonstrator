var express = require('express');
var request = require('request');
var Patient = require("../models/Patient.js");
var router = express.Router();

router.get('/patients', function(req, res) {
  patientUtils.getAllPatients(function(data) {
    res.render('patientList', { title: 'Patient list', partyCount: data.parties.length, parties: data.parties });
  });
});

router.get('/patient/:id', function(req, res) {
  var partyId = req.params.id
  patientUtils.getPatientByPartyId(partyId, function(data) {
    var patient = new Patient(data.party);
    res.render('patient', { title: 'Patient details', patient: patient, patientUtils: patientUtils });  
  });
});

module.exports = router;
