var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../constants/constants')
var EventEmitter = require('events').EventEmitter;
var objectAssign = require('react/lib/Object.assign');

var CHANGE_EVENT= 'Change'
var _postList =[];

var populatestore:function(postlist){
     _postList=postlist;
     Dispatcher.handleAction({
        actionType: Constants.STORE_UPDATED,
        data: _postList
      });
  }

var postStore = objectAssign({}, EventEmitter.prototype,{
  pullposts:function(){
    return _postList
  },
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  }
})


postStore.dispatchToken= Dispatcher.register(function(action) {

  switch(action.type) {
    case Constants.RELOAD_POSTLIST:
      populatestore(action.data)
      todoStore.emit(CHANGE_EVENT)
      break
    case Constants.PULL_POSTLIST:
        pullposts();

      break
    default:
      return false
  })
module.exports = postStore;