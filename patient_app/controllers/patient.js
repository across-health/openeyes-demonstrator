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
    })
    .when('/episode/:id/workflow', {
      templateUrl: '/patient_app/views/patient/editWorkflow.html',
      controller: 'WorkflowCtrl'
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

.controller('EpisodeCtrl', ['$scope', '$routeParams', '$location', '$window', 'patientService', 'dataService', 'workflowService', function($scope, $routeParams, $location, $window, patientService, dataService, workflowService) {

  $scope.visualAcuitySaveButtonLabel = 'Save';

  $scope.selectEvent = function(stageId, eventId) {
    console.log('selecting event = ' + stageId + '/' + eventId);
    $scope.episode.workflowData.selectedStageId = stageId;
    $scope.episode.workflowData.selectedEventId = eventId;
    $scope.event = $scope.episode.workflowData[stageId].events[eventId];
  }

  // get episode
  var episodeId = $routeParams.id;
  var patientId = $location.absUrl().match('[0-9]+#')[0].replace('#', '');
  if (patientService.getEpisodes().length == 0) {
    console.log('EpisodeCtrl: no episodes found locally.');
    dataService.getEpisodes(patientId)
      .success(function(data) {
        patientService.storeEpisodes(data.episodes);
        $scope.episode = patientService.getEpisodeById(episodeId);
        $scope.prevEpisode = patientService.getPreviousEpisode(episodeId);
        $scope.stageList = workflowService.processWorkflow($scope.episode);
        $window.rawWorkflow = workflowService.rawWorkflow;
        $scope.selectEvent($scope.episode.workflowData.selectedStageId, $scope.episode.workflowData.selectedEventId);
      })
      .error(function(data) {
      });
  } else {
    console.log('EpisodeCtrl: episodes found locally.');
    $scope.episode = patientService.getEpisodeById(episodeId);
    $scope.prevEpisode = patientService.getPreviousEpisode(episodeId);

    $scope.stageList = workflowService.processWorkflow($scope.episode);
    $window.rawWorkflow = workflowService.rawWorkflow;
    $scope.selectEvent($scope.episode.workflowData.selectedStageId, $scope.episode.workflowData.selectedEventId);
  }

  $scope.removeEntry = function(entryId) {
    var stageId = $scope.episode.workflowData.selectedStageId;
    var eventId = $scope.episode.workflowData.selectedEventId;
    $scope.episode.workflowData[stageId].events[eventId].visualAcuity.entries.splice(entryId, 1);
  };

  $scope.addEntry = function() {
    var stageId = $scope.episode.workflowData.selectedStageId;
    var eventId = $scope.episode.workflowData.selectedEventId;
    var newEntry = {
      "entry": {
        "method": "",
        "left_eye": {
          "value": ""
        },
        "right_eye": {
          "value": ""
        },
      }
    };
    $scope.episode.workflowData[stageId].events[eventId].visualAcuity.entries.push(newEntry);
  };

  $scope.addEvent = function(stage, type) {
    if (type != undefined) {
      console.log('Adding event to stage :' + stage.name);
      $scope.episode.workflowData[stage.id].events["new"] = {
        "eventDate": stage.date,
        "type": type
      };
    }
  };

  $scope.saveVisualAcuity = function() {
    $scope.visualAcuitySaveButtonLabel = 'Saving...';
    dataService.postVisualAcuity(patientId, $scope.event.visualAcuity).success(function(data) {
      $scope.visualAcuitySaveButtonLabel = 'Save'
    });
  };

}])

.controller('WorkflowCtrl', ['$scope', '$routeParams', '$location', '$window', 'patientService', 'dataService', 'workflowService', function($scope, $routeParams, $location, $window, patientService, dataService, workflowService) {

  var episodeId = $routeParams.id;
  if (patientService.getEpisodes().length == 0) {
    $location.path('/');
  } else {
    $scope.episode = patientService.getEpisodeById(episodeId);
    $scope.prevEpisode = patientService.getPreviousEpisode(episodeId);
    $scope.stageList = workflowService.processWorkflow($scope.episode);
  }

  $scope.exit = function() {
    $scope.episode.workflow = rawWorkflow.workflow;
    $scope.episode.workflowData = workflowService.refreshWorkflowData(rawWorkflow.workflow, $scope.episode.workflowData);
    patientService.setEpisodeById($scope.episode.id, $scope.episode);
    $location.path('episode/' + $scope.episode.id);
  }

}]);

