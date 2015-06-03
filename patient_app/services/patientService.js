'use strict';

angular.module('patientApp.patientService', [])

.service('patientService', function() {

  return {
    patient: {},

    episodes: [],

    events: {},

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
      this.events[event.id] = event;
      console.log('patientService.storeEvent: ' + event.id);
      console.log(this.events);
    },

    getEvent: function(eventId) {
      console.log('patientService.getEvent: ' +  eventId);
      console.log(this.events);
      return this.events[eventId];
    }
  };

});
