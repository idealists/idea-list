var Dispatcher   = require('../dispatcher/dispatcher');
var Constants    = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var ObjectAssign = require('react/lib/Object.assign');

var CHANGE_EVENT = 'viewChange';
var _idea    = {};
var editmode = false;
var populateStore = function (idea) {
  _idea = idea;
  editmode = false;
  console.log('populateStore', idea);
};
var ideaViewStore = ObjectAssign({}, EventEmitter.prototype, {
  fetchIdeas : function () {
    return _idea;
  },
 ideaEditState : function(){
  return editmode;
},
 ideaEditToggle : function(){
  editmode = !editmode;
  this.emit(CHANGE_EVENT);
},
addChangeListener : function (cb) {
    this.on(CHANGE_EVENT, cb);
    this.setMaxListeners(100);
  },
  removeChangeListener : function (cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }
});


ideaViewStore.dispatchToken = Dispatcher.register(function (action) {
  switch (action.action.actionType) {
    case Constants.RELOAD_IDEAVIEW:
      populateStore(action.action.data);
      ideaViewStore.emit(CHANGE_EVENT);
      break;

      case Constants.FETCH_IDEAVIEW:
      fetchIdeas();
      break;

    default:
      return false;
  }
});

module.exports = ideaViewStore;
