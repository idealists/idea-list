var Dispatcher = require('../dispatcher/dispatcher');
var Constants  = require('../constants/constants');
var $          = require('jquery');

var ideaActions = {
  getIdeas: function(query, data){
    query = query || 'votes';
    data  = data  || null;

    $.ajax({
      url       : "/ideas",
      dataType  : "json",
      method    : "GET",
      headers   : {
        'query' : query,
        'data'  : data
      }
    })
    .done(function (ideaList) {
      Dispatcher.handleAction({
        actionType : Constants.RELOAD_IDEALIST,
        data       : ideaList
      });
    });
  },

  searchBy: function (data) {
    console.log(data.lookup);
    $.ajax({
      url       : "/ideas",
      dataType  : "json",
      method    : "GET",
      headers   : {
        'query' : 'searchbar',
        'lookup'  : data.lookup
      }
    })
    .done(function (result) {
      console.log('Searcbar query result:',result);
    });
  },

  createIdea: function(newIdea){
    var ideaActions = this;
    $.ajax({
      url: "/api/user",
      dataType: 'json',
      method: "GET"
    })
    .done(function (userinfo) {
      userinfo          = userinfo.session;
      newIdea.user_name = userinfo.sUserName;
      newIdea.shortId   = newIdea.title + newIdea.user_name;
      newIdea.slackId   = userinfo.slackId;
      newIdea.userId    = userinfo._id;

      $.ajax({
        url      : "/ideas/create",
        dataType : "json",
        method   : "POST",
        data     : newIdea
      })
      .done(function (ideaList) {
        ideaActions.getIdeas('votes');
      });
    });
  },

  changeVote: function (voteObj, userId) {
    data = {
      source   : voteObj,
      userInfo : userId
    };
  }
};

module.exports = ideaActions;

