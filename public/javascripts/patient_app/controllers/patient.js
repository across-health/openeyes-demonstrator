'use strict';

angular.module('patientApp.patient', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/javascripts/patient_app/views/patient/patient.html',
      controller: 'PatientCtrl'
    });
}])

.controller('PatientCtrl', [function() {
  console.log('here');
}]);