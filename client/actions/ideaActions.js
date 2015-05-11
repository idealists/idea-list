var Dispatcher = require('../dispatcher/dispatcher');
var Constants  = require('../constants/constants');
var $          = require('jquery');

var ideaActions = {
  getIdeas : function(query, data){
    query = query || 'dateFirst';
    data  = data  || null;

    $.ajax({
      url       : "/ideas",
      dataType  : "json",
      method    : "GET",
      headers   : { 'query' : query,
                    'data'  : data
                  }
    }).done(function(ideaList){
      console.log('getidea',ideaList)
      Dispatcher.handleAction({
        actionType : Constants.RELOAD_IDEALIST,
        data       : ideaList
      });
    });
  },

  createIdea : function(newIdea){
    var ideaActions = this;
    $.ajax({
      url:"/api/user",
      dataType:'json',
      methord:"GET"
    }).done(function(userinfo){
      var userinfo = userinfo.session
      newIdea['user_name']= userinfo['sUserName']
      newIdea['shortId'] = newIdea['title']+newIdea['user_name']
      newIdea['slackId'] = userinfo['slackId']
      newIdea['userId']= userinfo['_id']
      $.ajax({
        url      : "/ideas/create",
        dataType : "json",
        method   : "POST",
        data     : newIdea
      }).done(function(ideaList){
        ideaActions.getIdeas('votes');
      });

    })
  },

  changevote: function (voteobj, userId) {
    data ={sorce:voteobj, userinfo:userId};
  }
};

module.exports= ideaActions;
