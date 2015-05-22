var Dispatcher = require('../dispatcher/dispatcher');
var Constants  = require('../constants/constants');
var cookie     = require('react-cookie');
var $          = require('jquery');

var ideaViewActions = {
  getIdea :function(query, data){
    query = query || 'id';
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
    .done(function (idea) {
      console.log('got this idea',idea);
      Dispatcher.handleAction({
        actionType : Constants.RELOAD_IDEAVIEW,
        data       : idea[0]
      });
    });
  },

  editIdea:function(query,data){
    query = query || 'id';
    data  = data  || null;
     $.ajax({
        url : '/ideas',
        method : 'PUT',
        dataType  : "json",
        data : data
     }).done(function(newidea){
      Dispatcher.handleAction({
        actionType : Constants.RELOAD_IDEAVIEW,
        data       : idea
      });
    });
  }
};

module.exports = ideaViewActions;
