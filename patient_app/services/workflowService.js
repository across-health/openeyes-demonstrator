'use strict';

angular.module('patientApp.workflowService', [])

.service('workflowService', function() {

  return {

    processWorkflow: function(episode) {
      var processedStageList = [];
      var stages = episode.workflow.stage_list;
      var transitions = episode.workflow.transition_list;
      var workflowData = episode.workflowData;
      for (var i=0; i<transitions.length; i++) {
        if (i === 0) {
          var stage = new Stage(this.findStage(stages, transitions[i].sourceStageId));
          processedStageList.push(stage);
        }
        var stage = new Stage(this.findStage(stages, transitions[i].targetStageId));
        if (workflowData[stage.id] != undefined) {
          stage.status = workflowData[stage.id].status;
          stage.date = workflowData[stage.id].date;
          stage.events = workflowData[stage.id].events;
        }
        processedStageList.push(stage);
      }
      return processedStageList;
    },

    findStage: function(stageList, stageId) {
      for (var i=0; i<stageList.length; i++) {
        if (stageList[i].id === stageId) {
          return stageList[i];
        }
      }
    }
    
  };

});
