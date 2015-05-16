var $ = require('jquery');

// send vote data to the server
var VoteActions = {
  sendVote : function(vote, cb){
    $.ajax({
      url      : "ideas/vote",
      dataType : "json",
      method   : "POST",
      data     : vote
    }).success(function(data){
      cb(data);
    });
  }
};

module.exports = VoteActions;