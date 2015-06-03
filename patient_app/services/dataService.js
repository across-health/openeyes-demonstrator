'use strict';

angular.module('patientApp.dataService', [])

.service('dataService', ['$http', function($http) {

  return {
    getPatient: function(patientId) {
      console.log('getPatient');
      return $http.get('/api/patient/'+patientId);
    },
    getEpisodes: function(patientId) {
      console.log('getEpisodes');
      return $http.get('/api/patient/'+patientId+'/episodes');
    },
    getEvent: function(patientId, episodeId, eventId) {
      console.log('dataService.getEvent: ' + patientId + '/' + episodeId + '/' + eventId);
      return $http.get('/api/patient/' + patientId + '/episode/' + episodeId + '/event/' + eventId);
    }
  };

}]);
