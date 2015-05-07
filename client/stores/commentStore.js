var Dispatcher   = require('../dispatcher/dispatcher');
var Constants    = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var ObjectAssign = require('react/lib/Object.assign');

var CHANGE_EVENT = 'change';
var _commentList    = [];

var populateStore = function(commentList){
  _commentList = commentList;
};

var CommentStore = ObjectAssign({}, EventEmitter.prototype, {
  fetchComments : function(){
    return _commentList;
  },

  addChangeListener : function(cb){
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener : function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  }
});

commentStore.dispatchToken = Dispatcher.register(function(action){
  switch(action.action.actionType){
    case Constants.RELOAD_COMMENTLIST:
      populateStore(action.action.data);
      commentStore.emit(CHANGE_EVENT);
      break;

    case Constants.FETCH_COMMENTLIST:
      fetchComments();
      break;

    default:
      return false;
  }
});

module.exports = CommentStore;
