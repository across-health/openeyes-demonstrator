'use strict';

function WorkflowStage(props) {
  this.id = props.id;
  this.name = props.name;
  this.description = props.description;
  this.status = ''
  this.date = ''
  this.events = undefined;
}

WorkflowStage.prototype.isStart = function() {
  if (this.name.toLowerCase() === 'start') {
    return true;
  }
  return false;
}

WorkflowStage.prototype.isEnd = function() {
  if (this.name.toLowerCase() === 'end') {
    return true;
  }
  return false;
}

WorkflowStage.prototype.isMain = function() {
  if (this.name.toLowerCase() !== 'end' && this.name.toLowerCase() !== 'start') {
    return true;
  }
  return false;
}

WorkflowStage.prototype.isComplete = function() {
  if (this.status === 'complete') {
    return true;
  }
  return false;
}

WorkflowStage.prototype.getFollowingConnectorClass = function() {
  if (this.events != undefined) {
    return 'xx-short';
  }
  if (this.status == 'complete' || this.status == 'in-progress') {
    return 'short';
  }
  return 'not-started';
}

WorkflowStage.prototype.hasEvents = function() {
  if (this.events.length > 0) {
    return true;
  }
  return false;
}
