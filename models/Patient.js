'use strict';

var Patient = function(data) {
  this.data = data;
}

Patient.prototype.data = {}

Patient.prototype.getAdditionalInfo = function(key) {
  for (var i=0; i<this.data.partyAdditionalInfo.length; i++) {
    if (this.data.partyAdditionalInfo[i].key === key) {
      return this.data.partyAdditionalInfo[i].value;
    }
  }
  return '';
}

module.exports = Patient;