var Dispatcher   = require('../dispatcher/dispatcher');
var Constants    = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var ObjectAssign = require('react/lib/Object.assign');

var CHANGE_EVENT = 'change';
var _detailList    = [];

var populateStore = function (commentList) {
  _detailList = commentList;
};

var detailStore = ObjectAssign({}, EventEmitter.prototype, {
  fetchComments : function () {
    return _detailList;
  },

  addChangeListener : function (cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener : function (cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }
});

detailStore.dispatchToken = Dispatcher.register(function (action) {
  switch(action.action.actionType){
    case Constants.RELOAD_COMMENTLIST:
      populateStore(action.action.data);
      detailStore.emit(CHANGE_EVENT);
      break;

    case Constants.FETCH_COMMENTLIST:
      fetchComments();
      break;

    default:
      return false;
  }
});

module.exports = detailStore;

