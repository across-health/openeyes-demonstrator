'use strict';

function Stage(props) {
  this.id = props.id;
  this.name = props.name;
  this.description = props.description;
  this.status = ''
  this.date = ''
  this.events = [];
}

Stage.prototype.isStart = function() {
  if (this.name.toLowerCase() === 'start') {
    return true;
  }
  return false;
}

Stage.prototype.isEnd = function() {
  if (this.name.toLowerCase() === 'end') {
    return true;
  }
  return false;
}

Stage.prototype.isMain = function() {
  if (this.name.toLowerCase() !== 'end' && this.name.toLowerCase() !== 'start') {
    return true;
  }
  return false;
}

Stage.prototype.isComplete = function() {
  if (this.status === 'complete') {
    return true;
  }
  return false;
}

Stage.prototype.getFollowingConnectorClass = function() {
  if (this.status == 'complete' || this.status == 'in-progress') {
    return 'short';
  }
  return 'not-started';
}
