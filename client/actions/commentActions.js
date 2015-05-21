var Dispatcher = require('../dispatcher/dispatcher');
var Constants  = require('../constants/constants');
var cookie     = require('react-cookie');
var $          = require('jquery');

var commentActions = {
  getComments : function(query, data){
    query = query || null;
    data  = data  || null;

    $.ajax({
      url       : "/ideas/comments",
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
    var userinfo       = cookie.load('userInfo');

    newComment.userId    = userinfo._id;
    newComment.slackId   = userinfo.slackId;
    newComment.sUserName = userinfo.sUserName;
    newComment.img       = userinfo.image['24'];


    $.ajax({
      url      : "/ideas/comments",
      dataType : "json",
      method   : "POST",
      data     : newComment
    }).done(function(commentList){
      commentActions.getComments(null, newComment.ideaId);
    });
  }
};

module.exports = commentActions;
