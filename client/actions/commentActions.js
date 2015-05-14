var Dispatcher = require('../dispatcher/dispatcher');
var Constants  = require('../constants/constants');
var $          = require('jquery');

var commentActions = {
  getComments : function(query, data){
    query = query || 'votes';
    data  = data  || null;

    $.ajax({
      url       : "/comment",
      dataType  : "json",
      method    : "GET",
      headers   : {
        'query' : query,
        'data'  : data
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
      userinfo           = userinfo.session;
      newComment.userId  = userinfo._id;
      newComment.slackId = userinfo.slackId;
      $.ajax({
        url      : "/comment",
        dataType : "json",
        method   : "POST",
        data     : newComment
      }).done(function(commentList){
        commentActions.getComments('votes');
      });
    });
  }
};

module.exports= commentActions;
