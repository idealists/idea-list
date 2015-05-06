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
    }).done(function(ideaList){
      Dispatcher.handleAction({
        actionType : Constants.RELOAD_IDEALIST,
        data       : ideaList
      })
    });
  },

  createIdea : function(newIdea){
    var commentActions = this;

    $.ajax({
      url      : "/comments/create",
      dataType : "json",
      method   : "POST",
      data     : newIdea
    }).done(function(ideaList){
      commentActions.getIdeas('votes');
    });
  }
}

module.exports= commentActions;
//need to build a server routes