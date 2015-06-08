'use strict';

angular.module('patientApp')
.directive('operationBooking', function () {
  return {
      templateUrl: '/patient_app/views/events/operationBooking.html',
  }
})
.directive('consentForm', function () {
  return {
      templateUrl: '/patient_app/views/events/consentForm.html',
  }
})
.directive('visualAcuity', function () {
  return {
      templateUrl: '/patient_app/views/events/visualAcuity.html',
  }
})
.directive('episodeWorkflow', function () {
  return {
      templateUrl: '/patient_app/views/episodes/workflow.html',
  }
})
.directive('episodeHeader', function () {
  return {
      templateUrl: '/patient_app/views/episodes/header.html',
  }
});