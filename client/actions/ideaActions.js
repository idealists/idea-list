var Dispatcher = require('../dispatcher/dispatcher');
var Constants  = require('../constants/constants');
var $          = require('jquery');


var ideaActions = {
  getIdeas : function(query, data){
    query = query || 'userid';
    data  = data  || null;
    $.ajax({
      url       : "/serverideas/get",
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
      console.log('ran')
    });
  },

  createIdea : function(newIdea){
    var ideaActions = this;

    $.ajax({
      url      : "/serverideas/create",
      dataType : "json",
      method   : "POST",
      data     : newIdea
    }).done(function(ideaList){
      ideaActions.getIdeas('votes');
    });
  },

  changevote: function (voteobj, userId) {
    data ={sorce:voteobj, userinfo:userId}
  }
}

module.exports= ideaActions;
