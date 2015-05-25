var $ = require('jquery');

var VoteActions = {
  sendVote : function (vote, cb) {
    $.ajax({
      url      : 'ideas/votes',
      dataType : 'json',
      method   : 'POST',
      data     : vote
    }).success(function (data) {
      cb(data);
    });
  }
};

module.exports = VoteActions;
