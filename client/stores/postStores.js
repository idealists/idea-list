var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../constants/constants')
var EventEmitter = require('events').EventEmitter;
var objectAssign = require('react/lib/Object.assign');

var CHANGE_EVENT= 'Change'
var _postsList =[];

var populatestore:function(postlist){
     _postsList=posts;
     Dispatcher.handleAction({
        actionType: Constants.STORE_UPDATED,
        data: _postsList
      });
  }

var postsStore = objectAssign({}, EventEmitter.prototype,{
  pullposts:function(){
    return _postsList
  },
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  }
})


postsStore.dispatchToken= Dispatcher.register(function(action) {

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
module.exports = postsStore;