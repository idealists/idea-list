var Dispatcher = require('../dispatcher/commentDispatcher');
var Constants  = require('../constants/constants');
var $          = require('jquery');

var commentActions = {
  getComments : function(query, data){
    query = query || null;
    data  = data  || null;

    $.ajax({
      url       : "/comments",
      dataType  : "json",
      method    : "GET",
      headers   : { 'query' : query,
                    'data'  : data
                  }
    }).done(function(commentList){
      Dispatcher.handleAction({
        actionType : Constants.RELOAD_COMMENTLIST,
        data       : commentList
      });
    });
  },

  createComment : function(userId,newComment){
    var commentActions = this;
    var data = {userId:userId, comment:newComment};
    $.ajax({
      url      : "/comments/create",
      dataType : "json",
      method   : "POST",
      data     : data
    }).done(function(commentList){
      commentActions.getComments('votes');
    });
  }
};

module.exports= commentActions;
//need to build a server routes
