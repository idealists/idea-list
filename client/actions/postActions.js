var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../constants/constants')
var ajax = require('ajax')
var postActions={
  getEntries:function(query){
    ajax.get('/posts', query, function(postsList){
      console.log(postsList);
      Dispatcher.handleAction({
        actionType:Constants.RELOAD_POSTSLIST,
        data: postsList
      });
    })
  },
  newPostEntry:function(newpostentry) {
    ajax.post('/post/create',newpostentry,function(value){
      console.log(value)
    })
  },
  deletePostEntry

}


module.exports= postActions