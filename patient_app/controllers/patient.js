'use strict';

angular.module('patientApp.patient', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/patient_app/views/patient/patient.html',
      controller: 'PatientCtrl'
    })
    .when('/episode/:id', {
      templateUrl: '/patient_app/views/patient/episode.html',
      controller: 'EpisodeCtrl'
    });
}])

.controller('PatientCtrl', ['$scope', '$location', 'patientService', 'dataService', function($scope, $location, patientService, dataService) {
  var patientId = $location.absUrl().match('[0-9]+#')[0].replace('#', '');
  dataService.getEpisodes(patientId)
    .success(function(data) {
      $scope.episodeList = data.episodes;
      patientService.storeEpisodes(data.episodes);
    })
    .error(function(data) {
    });
  dataService.getPatient(patientId)
    .success(function(data) {
      $scope.patient = data;
      patientService.storePatient(data);
    })
    .error(function(data) {
    });
}])

.controller('EpisodeCtrl', ['$scope', '$routeParams', '$location', 'patientService', 'dataService', 'workflowService', function($scope, $routeParams, $location, patientService, dataService, workflowService) {
  // get episode
  var episodeId = $routeParams.id;
  if (patientService.getEpisodes().length == 0) {
    var patientId = $location.absUrl().match('[0-9]+#')[0].replace('#', '');
    dataService.getEpisodes(patientId)
      .success(function(data) {
        patientService.storeEpisodes(data.episodes);
        $scope.episode = patientService.getEpisodeById(episodeId);
        $scope.stageList = workflowService.processWorkflow($scope.episode);
        $scope.selectEvent($scope.episode.workflowData.selectedStageId, $scope.episode.workflowData.selectedEventId);
      })
      .error(function(data) {
      });
  } else {
    $scope.episode = patientService.getEpisodeById(episodeId);
  }

  $scope.selectEvent = function(stageId, eventId) {
    console.log('selecting event = ' + stageId + '/' + eventId);
    $scope.episode.workflowData.selectedStageId = stageId;
    $scope.episode.workflowData.selectedEventId = eventId;
    $scope.event = $scope.episode.workflowData[stageId].events[eventId];
  }

  $scope.removeEntry = function(eye, entryId) {
    var stageId = $scope.episode.workflowData.selectedStageId;
    var eventId = $scope.episode.workflowData.selectedEventId;
    $scope.episode.workflowData[stageId].events[eventId].visualAcuity[eye].splice(entryId, 1);
  };

  $scope.addEntry = function(eye) {
    var stageId = $scope.episode.workflowData.selectedStageId;
    var eventId = $scope.episode.workflowData.selectedEventId;
    $scope.episode.workflowData[stageId].events[eventId].visualAcuity[eye].push({"value": "", "method": ""});
  };

}]);
