var Dispatcher = require('../dispatcher/dispatcher');
var Constants  = require('../constants/constants');
var cookie     = require('react-cookie');
var $          = require('jquery');

var ideaActions = {
  getIdeas: function(query, data, cb){
    query = query || 'voteCount';
    data  = data  || null;

    console.log('in ideaActions');

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
      console.log("CB: ", cb);
      if(cb){ cb(); }
    });
  },

  searchBy:function(data){
    $.ajax({
      url       : "/ideas",
      dataType  : "json",
      method    : "GET",
      headers   : { 'query' : 'searchbar',
                    'lookup'  : data.lookup
                  }
    }).done(function (result) {
      var uslist = result.users.concat(result.ideas);
      Dispatcher.handleAction({
        actionType : Constants.RELOAD_IDEALIST,
        data       : uslist
      });
    });
  },

  createIdea: function(newIdea, cb){
    var ideaActions   = this;
    var userinfo      = cookie.load('userInfo');
    newIdea.user_name = userinfo.sUserName;
    newIdea.shortId   = String(newIdea.title.split(" ").slice(0,3).join("_")+ "_" + newIdea.user_name).toLowerCase();
    newIdea.slackId   = userinfo.slackId;
    newIdea.userId    = userinfo._id;
    newIdea.img       = userinfo.image['24'];

    $.ajax({
      url      : "/ideas",
      dataType : "json",
      method   : "POST",
      data     : newIdea
    })
    .done(function (ideaList) {
      ideaActions.getIdeas(null, null, cb);
      //cb();
    });
  },

  changeVote: function (voteObj, userId) {
    data = {
      source   : voteObj,
      userInfo : userId
    };
  }
};

module.exports= ideaActions;
