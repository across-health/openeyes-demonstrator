'use strict';

// Declare app level module which depends on views, and components
angular.module('patientApp', [
  'ngRoute',
  'patientApp.patient',
  'patientApp.patientService',
  'patientApp.dataService',
  'patientApp.workflowService',
  'mm.foundation'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
