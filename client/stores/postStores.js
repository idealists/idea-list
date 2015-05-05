var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../constants/constants')
var EventEmitter = require('events').EventEmitter;
var objectAssign = require('react/lib/Object.assign');

var CHANGE_EVENT= 'Change'
var _postList =[];

var populatestore = function(postlist){
     _postList=postlist;

  }

var postStore = objectAssign({}, EventEmitter.prototype,{
  pullposts:function(){
    return _postList
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  },
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  }
})


postStore.dispatchToken= Dispatcher.register(function(action) {

  switch(action.action.actionType) {
    case Constants.RELOAD_POSTLIST:
      populatestore(action.action.data)
      todoStore.emit(CHANGE_EVENT)
      break
    case Constants.PULL_POSTLIST:
        pullposts();

      break
    default:
      return false
  }
})
module.exports = postStore;