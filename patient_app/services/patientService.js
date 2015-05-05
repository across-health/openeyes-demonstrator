'use strict';

angular.module('patientApp.patientService', [])

.service('patientService', function() {

  return {
    patient: {},

    episodes: [],

    event: undefined,

    storePatient: function(patient) {
      this.patient = patient;
    },

    getPatient: function() {
      return this.patient;
    },

    storeEpisodes: function(episodes) {
      this.episodes = episodes;
    },

    getEpisodes: function() {
      return this.episodes;
    },

    getEpisodeById: function(id) {
      for(var i=0; i<this.episodes.length; i++) {
        if (this.episodes[i].id == id) {
          return this.episodes[i];
        }
      }
    },

    storeEvent: function(event) {
      this.event = event;
    },

    getEvent: function() {
      return this.event;
    }
  };

});
