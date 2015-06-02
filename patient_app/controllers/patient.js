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

.controller('EpisodeCtrl', ['$scope', '$routeParams', '$location', 'patientService', 'dataService', function($scope, $routeParams, $location, patientService, dataService) {
  if (patientService.getEpisodes().length == 0) {
    var patientId = $location.absUrl().match('[0-9]+#')[0].replace('#', '');
    dataService.getEpisodes(patientId)
      .success(function(data) {
        patientService.storeEpisodes(data.episodes);
        $scope.episode = patientService.getEpisodeById($routeParams.id);
      })
      .error(function(data) {
      });
  } else {
    $scope.episode = patientService.getEpisodeById($routeParams.id);
  }
  $scope.event = patientService.getEvent();
  if ($scope.event == undefined) {
    dataService.getEvent(patientId, $routeParams.id)
      .success(function (data) {
        patientService.storeEvent(data);
        $scope.event = data;
      })
      .error(function (data) {
      });
  } else {
    $scope.event = patientService.getEvent();
  }

  $scope.removeEntry = function(eye, entryId) {
    var event = patientService.getEvent();
    event.visualAcuity[eye].splice(entryId, 1);
    patientService.storeEvent(event);
  };

  $scope.addEntry = function(eye) {
    var event = patientService.getEvent();
    event.visualAcuity[eye].push({"value": "", "method": ""});
    patientService.storeEvent(event);
  };

}]);
