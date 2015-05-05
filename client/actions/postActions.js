var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../constants/constants');
var ajax = require('ajax');

var postActions = {
  getPostEntries: function(query) {
    query = query || 'vote';
    ajax.get('/posts', query, function(postList) {
      console.log(postList);

      Dispatcher.handleAction({
        actionType: Constants.RELOAD_POSTLIST,
        data: postList
      });
    })
  },

  createPostEntry: function(newPostEntry) {
    ajax.post('/posts/create', newPostEntry, function(value) {
      console.log('posted',value);
      this.getPostEntries('vote');
    }.bind(this))
  }
}


module.exports= postActions;
