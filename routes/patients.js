var express = require('express');
var request = require('request');
var Patient = require("../models/Patient.js");
var router = express.Router();

router.get('/patients', function(req, res) {
  getAllPatients(function(data) {
    res.render('patientList', { title: 'Patient list', partyCount: data.parties.length, parties: data.parties });
  });
});

router.get('/patient/:id', function(req, res) {
  var partyId = req.params.id
  getPatientByPartyId(partyId, function(data) {
    var patient = new Patient(data.party);
    res.render('patient', { title: 'Patient details', patient: patient, patientUtils: patientUtils });  
  });
});

function getPatientByPartyId(partyId, callback) {
  var options = {
    url: ehrscapeUtils.ehrscapeBaseUrl + ehrscapeUtils.demographicEndpoint + 'party/' + partyId,
    headers: {
      'Authorization': ehrscapeUtils.basicAuth
    }
  };
  function requestCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(JSON.parse(body));
    }
  }
  return request(options, requestCallback);
};

function getAllPatients(callback) {
  var options = {
    url: ehrscapeUtils.ehrscapeBaseUrl + ehrscapeUtils.demographicEndpoint + 'party/query/?lastNames=*',
    headers: {
      'Authorization': ehrscapeUtils.basicAuth
    }
  };
  function requestCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(JSON.parse(body));
    }
  }
  return request(options, requestCallback);
};

module.exports = router;
