var dateFormat = require('dateformat');
var request = require('request');

patientUtils = {

  findByProperty: function(parties, propertyName, propertyValue) {
    for(var i=0; i<parties.length; i++) {
      if (parties[i][propertyName] === propertyValue) {
        return parties[i];
      }
    }
  },

  formatDate: function(date, format) {
    if (format == undefined) {
      format = "mmmm d, yyyy";
    }
    return dateFormat(date, format);
  },

  getPatientByPartyId: function(partyId, callback) {
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
  },

  getAllPatients: function(callback) {
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
  }

};