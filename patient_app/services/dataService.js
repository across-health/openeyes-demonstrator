'use strict';

angular.module('patientApp.dataService', [])

.service('dataService', ['$http', function($http) {

  return {
    getPatient: function(patientId) {
      console.log('getPatient');
      return $http.get('/api/patient/'+patientId);
    },
    getEpisodes: function(patientId) {
      console.log('dataService.getEpisodes');
      return $http.get('/api/patient/'+patientId+'/episodes');
    },
    postVisualAcuity: function(patientId, visualAcuity) {
      console.log('dataService.postVisualAcuity');
      return $http.post('/api/patient/'+patientId+'/visual-acuity', visualAcuity);
    }
  };

}]);
