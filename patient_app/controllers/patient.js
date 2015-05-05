'use strict';

angular.module('patientApp.patient', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/patient_app/views/patient/patient.html',
      controller: 'PatientCtrl'
    })
    //.when('/episodes', {
    //  templateUrl: '/patient_app/views/patient/episodeList.html',
    //  controller: 'EpisodeListCtrl'
    //})
    .when('/episode/:id', {
      templateUrl: '/patient_app/views/patient/episode.html',
      controller: 'EpisodeCtrl'
    });
}])

.controller('PatientCtrl', ['$scope', '$http', '$location', 'patientService', function($scope, $http, $location, patientService) {
    var patientId = $location.absUrl().match('[0-9]+#')[0].replace('#', '');
    console.log(patientId);
    //TODO: Abstract this out to a service / factory
    $http.get('/api/patient/'+patientId+'/episodes')
      .success(function(data) {
        $scope.episodeList = data.episodes;
        patientService.storeEpisodes(data.episodes);
        console.log(patientService.getEpisodes());
      })
      .error(function(data) {
      });
    $http.get('/api/patient/'+patientId)
      .success(function(data) {
        $scope.patient = data;
        patientService.storePatient(data);
        console.log(patientService.getPatient());
      })
      .error(function(data) {
      });
}])

//.controller('EpisodeListCtrl', ['$scope', '$http', '$location', 'patientService', function($scope, $http, $location, patientService) {
//  var patientId = $location.absUrl().match('[0-9]+#')[0].replace('#', '');
//  console.log(patientId);
//  //TODO: Abstract this out to a service / factory
//  $http.get('/api/patient/'+patientId+'/episodes')
//    .success(function(data) {
//      $scope.episodeList = data.episodes;
//      patientService.storeEpisodes(data.episodes);
//      console.log(patientService.getEpisodes());
//    })
//    .error(function(data) {
//    });
//}])

.controller('EpisodeCtrl', ['$scope', '$routeParams', '$http', '$location', 'patientService', function($scope, $routeParams, $http, $location, patientService) {

  if (patientService.getEpisodes().length == 0) {
    var patientId = $location.absUrl().match('[0-9]+#')[0].replace('#', '');
    //TODO: Abstract this out to a service / factory
    $http.get('/api/patient/'+patientId+'/episodes')
      .success(function(data) {
        patientService.storeEpisodes(data.episodes);
        console.log(patientService.getEpisodes());
        $scope.episode = patientService.getEpisodeById($routeParams.id);
      })
      .error(function(data) {
      });
  } else {
    $scope.episode = patientService.getEpisodeById($routeParams.id);
  }
  $scope.event = patientService.getEvent();
  console.log($scope.event);
  if ($scope.event == undefined) {
    console.log('get event');
    $http.get('/api/patient/' + patientId + '/episode/' + $routeParams.id + '/event/1')
      .success(function (data) {
        patientService.storeEvent(data);
        $scope.event = data;
      })
      .error(function (data) {
      });
  } else {
    console.log('dont get event');
    $scope.event = patientService.getEvent();
  }

  $scope.removeLeftEntry = function(entryId) {
    console.log('remove entry + '+entryId);
    var event = patientService.getEvent();
    event.visualAcuity.left.splice(entryId, 1);
    patientService.storeEvent(event);
  }

  $scope.removeRightEntry = function(entryId) {
    console.log('remove entry + '+entryId);
    var event = patientService.getEvent();
    event.visualAcuity.right.splice(entryId, 1);
    patientService.storeEvent(event);
  }

  $scope.addLeftEntry = function() {
    var event = patientService.getEvent();
    var newId = event.visualAcuity.left.length;
    event.visualAcuity.left.push({"id": newId, "value": "", "method": ""});
    patientService.storeEvent(event);
  }

    $scope.addRightEntry = function() {
      var event = patientService.getEvent();
      var newId = event.visualAcuity.right.length;
      event.visualAcuity.right.push({"id": newId, "value": "", "method": ""});
      patientService.storeEvent(event);
    }

}]);
