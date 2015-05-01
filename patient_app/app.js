'use strict';

// Declare app level module which depends on views, and components
angular.module('patientApp', [
  'ngRoute',
  'patientApp.patient'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .otherwise({redirectTo: '/'});
}]);
