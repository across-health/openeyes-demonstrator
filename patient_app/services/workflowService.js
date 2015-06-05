'use strict';

angular.module('patientApp.workflowService', [])

.service('workflowService', function() {

  return {

    rawWorkflow: {},

    processWorkflow: function(episode) {
      console.log('processWorkflow');
      this.rawWorkflow.workflow = episode.workflow;
      var processedStageList = [];
      var stages = episode.workflow.stage_list;
      var transitions = episode.workflow.transition_list;
      var workflowData = episode.workflowData;
      for (var i=0; i<transitions.length; i++) {
        if (i === 0) {
          var stage = new WorkflowStage(this.findStage(stages, transitions[i].sourceStageId));
          processedStageList.push(stage);
        }
        var stage = new WorkflowStage(this.findStage(stages, transitions[i].targetStageId));
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
    },

    refreshWorkflowData: function(workflow, workflowData) {
      var newWorkflowData = {};
      newWorkflowData.selectedStageId = workflowData.selectedStageId;
      newWorkflowData.selectedEventId = workflowData.selectedEventId;
      var newStage = { "status": "not-started", "date": "" };
      for (var i=0; i<workflow.stage_list.length; i++) {
        var stage = workflow.stage_list[i];
        if (stage.name.toLowerCase() !== 'start' && stage.name.toLowerCase !== 'end') {
          if (workflowData[stage.id] == undefined) {
            newWorkflowData[stage.id] = newStage;
          } else {
            newWorkflowData[stage.id] = workflowData[stage.id];
          }
        }
      }
      return newWorkflowData;
    }
    
  };

});
