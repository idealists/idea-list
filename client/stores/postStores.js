var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../constants/constants')
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var _postsList =[];

var populatestore:function(postlist){
     _postsList=posts;
     Dispatcher.handleAction({
        actionType: Constants.STORE_UPDATED,
        data: _postsList
      });
  }

var postsStore =  assign({}, EventEmitter.prototype,{
  pullposts:function(){
    return _postsList
  }
})


postsStore.dispatchToken= Dispatcher.register(function(action) {

  switch(action.type) {
    case Constants.RELOAD_POSTLIST:
      populatestore(action.data)
      break
    case Constants.PULL_POSTLIST:
      pullposts();
      break
    default:
      return false
  })
module.exports = postsStore;