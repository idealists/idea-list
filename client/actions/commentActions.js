var Dispatcher = require('../dispatcher/dispatcher');
var Constants  = require('../constants/constants');
var $          = require('jquery');

var commentActions = {
  getComments : function(query, data){
    query = query || null;
    data  = data  || null;

    $.ajax({
      url       : "/ideas/comment",
      dataType  : "json",
      method    : "GET",
      headers   : {
        'query' : query,
        'data'  : JSON.stringify(data)
      }
    })
    .done(function (commentList) {
      Dispatcher.handleAction({
        actionType : Constants.RELOAD_COMMENTLIST,
        data       : commentList
      });
    });
  },

  createComment : function(newComment){
    var commentActions = this;
    $.ajax({
      url      : "/api/user",
      dataType : "json",
      method   : "GET"
    }).done(function(userinfo){
      console.log('userinfo', userinfo);
      userinfo             = userinfo.session.user;
      newComment.userId    = userinfo._id;
      newComment.slackId   = userinfo.slackId;
      newComment.sUserName = userinfo.sUserName;
      $.ajax({
        url      : "/ideas/comment",
        dataType : "json",
        method   : "POST",
        data     : newComment
      }).done(function(commentList){
        commentActions.getComments('votes', newComment.parentId);
      });
    });
  }
};

module.exports= commentActions;
