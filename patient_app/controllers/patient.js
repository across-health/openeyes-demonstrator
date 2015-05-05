'use strict';

angular.module('patientApp.patient', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/patient_app/views/patient/patient.html',
      controller: 'PatientCtrl'
    })
    .when('/episodes', {
      templateUrl: '/patient_app/views/patient/episodeList.html',
      controller: 'EpisodeListCtrl'
    })
    .when('/episode/:id', {
      templateUrl: '/patient_app/views/patient/episode.html',
      controller: 'EpisodeCtrl'
    });
}])

.controller('PatientCtrl', [function() {
  console.log('patient');
}])

.controller('EpisodeListCtrl', ['$scope', '$http', '$location', 'patientService', function($scope, $http, $location, patientService) {
  var patientId = $location.absUrl().match('[0-9]+#')[0].replace('#', '');
  console.log(patientId);
  //TODO: Abstract this out to a service / factory
  $http.get('/patient/'+patientId+'/episodes')
    .success(function(data) {
      $scope.episodeList = data.episodes;
      patientService.storeEpisodes(data.episodes);
      console.log(patientService.getEpisodes());
    })
    .error(function(data) {
    });
}])

.controller('EpisodeCtrl', ['$scope', '$routeParams', '$http', '$location', 'patientService', function($scope, $routeParams, $http, $location, patientService) {
  if (patientService.getEpisodes().length == 0) {
    var patientId = $location.absUrl().match('[0-9]+#')[0].replace('#', '');
    //TODO: Abstract this out to a service / factory
    $http.get('/patient/'+patientId+'/episodes')
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
}]);
