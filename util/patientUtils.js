patientUtils = {
    findByProperty: function(parties, propertyName, propertyValue) {
        for(var i=0; i<parties.length; i++) {
            if (parties[i][propertyName] === propertyValue) {
                return parties[i];
            }
        }
    }
};