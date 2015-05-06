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

.controller('PatientCtrl', ['$scope', '$http', '$location', 'patientService', function($scope, $http, $location, patientService) {
  var patientId = $location.absUrl().match('[0-9]+#')[0].replace('#', '');
  //TODO: Abstract this out to a service / factory
  $http.get('/api/patient/'+patientId+'/episodes')
    .success(function(data) {
      $scope.episodeList = data.episodes;
      patientService.storeEpisodes(data.episodes);
    })
    .error(function(data) {
    });
  $http.get('/api/patient/'+patientId)
    .success(function(data) {
      $scope.patient = data;
      patientService.storePatient(data);
    })
    .error(function(data) {
    });
}])

.controller('EpisodeCtrl', ['$scope', '$routeParams', '$http', '$location', 'patientService', function($scope, $routeParams, $http, $location, patientService) {
  if (patientService.getEpisodes().length == 0) {
    var patientId = $location.absUrl().match('[0-9]+#')[0].replace('#', '');
    //TODO: Abstract this out to a service / factory
    $http.get('/api/patient/'+patientId+'/episodes')
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
    $http.get('/api/patient/' + patientId + '/episode/' + $routeParams.id + '/event/1')
      .success(function (data) {
        patientService.storeEvent(data);
        $scope.event = data;
      })
      .error(function (data) {
      });
  } else {
    $scope.event = patientService.getEvent();
  }

  $scope.removeLeftEntry = function(entryId) {
    var event = patientService.getEvent();
    event.visualAcuity.left.splice(entryId, 1);
    patientService.storeEvent(event);
  };

  $scope.removeRightEntry = function(entryId) {
    var event = patientService.getEvent();
    event.visualAcuity.right.splice(entryId, 1);
    patientService.storeEvent(event);
  };

  $scope.addLeftEntry = function() {
    var event = patientService.getEvent();
    event.visualAcuity.left.push({"value": "", "method": ""});
    patientService.storeEvent(event);
  };

  $scope.addRightEntry = function() {
    var event = patientService.getEvent();
    event.visualAcuity.right.push({"value": "", "method": ""});
    patientService.storeEvent(event);
  };

}]);
