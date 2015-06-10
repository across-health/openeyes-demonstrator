'use strict';

angular.module('patientApp.workflowService', [])

.service('workflowService', function() {

  return {

    rawWorkflow: {},

    processWorkflow: function(episode) {
      this.rawWorkflow.workflow = episode.workflow;
      var processedStageList = [];
      var stages = episode.workflow.stage_list;
      var transitions = episode.workflow.transition_list;
      var workflowData = episode.workflowData;

      var stage = this.findStage(stages, 'name', 'Start');
      processedStageList.push(new WorkflowStage(stage));
      var transition = this.findTransition(transitions, 'sourceStageId', stage.id);

      while (transition !== undefined) {
        stage = new WorkflowStage(this.findStage(stages, 'id', transition.targetStageId));
        if (workflowData[stage.id] != undefined) {
          stage.status = workflowData[stage.id].status;
          stage.date = workflowData[stage.id].date;
          stage.events = workflowData[stage.id].events;
        }
        processedStageList.push(stage);
        transition = this.findTransition(transitions, 'sourceStageId', transition.targetStageId);
      }
      return processedStageList;
    },

    findStage: function(stageList, attribute, value) {
      for (var i=0; i<stageList.length; i++) {
        if (stageList[i][attribute] === value) {
          return stageList[i];
        }
      }
    },

    findTransition: function(transitionList, attribute, value) {
      for (var i=0; i<transitionList.length; i++) {
        if (transitionList[i][attribute] === value) {
          return transitionList[i];
        }
      }
    },

    refreshWorkflowData: function(workflow, workflowData) {
      var newWorkflowData = {};
      newWorkflowData.selectedStageId = workflowData.selectedStageId;
      newWorkflowData.selectedEventId = workflowData.selectedEventId;
      var newStage = { "status": "not-started", "date": "", "events": {} };
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
