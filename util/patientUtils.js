var dateFormat = require('dateformat');

patientUtils = {

  findByProperty: function(parties, propertyName, propertyValue) {
    for(var i=0; i<parties.length; i++) {
      if (parties[i][propertyName] === propertyValue) {
        return parties[i];
      }
    }
  },

  formatDate: function(date) {
    var now = new Date();
    // Basic usage
    console.log(dateFormat(date, "mmmm dS, yyyy"));
    return dateFormat(date, "mmmm dS, yyyy");
  }

};