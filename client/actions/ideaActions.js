var Dispatcher = require('../dispatcher/dispatcher');
var Constants  = require('../constants/constants');
var $          = require('jquery');

var ideaActions = {
  getIdeas : function(query, data){
    query = query || 'votes';
    data  = data  || null;

    $.ajax({
      url       : "/ideas",
      dataType  : "json",
      method    : "GET",
      headers   : { 'query' : query,
                    'data'  : data
                  }
    }).done(function(ideaList){
      Dispatcher.handleAction({
        actionType : Constants.RELOAD_IDEALIST,
        data       : ideaList
      });
    });
  },

  createIdea : function(newIdea){
    var ideaActions = this;

    $.ajax({
      url      : "/ideas/create",
      dataType : "json",
      method   : "POST",
      data     : newIdea
    }).done(function(ideaList){
      ideaActions.getIdeas('votes');
    });
  },

  changevote: function (voteobj, userId) {
    data ={sorce:voteobj, userinfo:userId};
  }
};

module.exports= ideaActions;
