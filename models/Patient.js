'use strict';

var Patient = function(data) {
  this.data = data;
}

Patient.prototype.data = {}

Patient.prototype.getNhsNo = function() {
  for (var i=0; i<this.data.partyAdditionalInfo.length; i++) {
    if (this.data.partyAdditionalInfo[i].key === 'uk.nhs.nhsnumber') {
      return this.data.partyAdditionalInfo[i].value;
    }
  }
  return 'not found';
}

module.exports = Patient;