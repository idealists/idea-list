var Dispatcher   = require('../dispatcher/dispatcher');
var Constants    = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var ObjectAssign = require('react/lib/Object.assign');

var CHANGE_EVENT = 'change';
var _ideaList    = [];

var populateStore = function (ideaList) {
  _ideaList = ideaList;
};

var ideaStore = ObjectAssign({}, EventEmitter.prototype, {
  fetchIdeas : function () {
    return _ideaList;
  },

  addChangeListener : function (cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener : function (cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }
});

ideaStore.dispatchToken = Dispatcher.register(function (action) {
  switch (action.action.actionType) {
    case Constants.RELOAD_IDEALIST:
      populateStore(action.action.data);
      ideaStore.emit(CHANGE_EVENT);
      break;

    case Constants.FETCH_IDEALIST:
      fetchIdeas();
      break;

    default:
      return false;
  }
});

module.exports = ideaStore;

