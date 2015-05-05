var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../constants/constants');
var $ = require('jquery');

var postActions = {
  getPostEntries: function(query,data) {
    console.log('getting data')
    query = query||null
    data = data||null
    $.ajax({
        url: "/posts",
        dataType: "json",
        method: "GET",
        headers:{'query':query,
                  'data':data},
      }).done(function(postList) {
      console.log(postList);
      Dispatcher.handleAction({
        actionType: Constants.RELOAD_POSTLIST,
        data: postList
      })
    })
  },

  createPostEntry: function(newPostEntry) {
    var action = this
    console.log('sending')
    $.ajax({
        url: "/posts/create",
        dataType:"json",
        method: "POST",
        data:newPostEntry
      }).done(function(postList){
        console.log('posted :',postList);
      action.getPostEntries('vote')
    })
    console.log('sent')
  }
}


module.exports= postActions;
