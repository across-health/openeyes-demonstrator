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
  if (this.name.toLowerCase() === 'start' || this.name.toLowerCase() === 'end') {
    return '';
  }
  var classes = [];
  numOfEvents = Object.keys(this.events).length;
  if (numOfEvents > 0) {
    classes.push('xx-short');
  }
  if (this.status == 'not-started') {
    classes.push('not-started');
  }
  return classes.join(' ');
}

WorkflowStage.prototype.hasEvents = function() {
  if (this.events.length > 0) {
    return true;
  }
  return false;
}
