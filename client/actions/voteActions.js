var $ = require('jquery');

// send vote data to the server
var VoteActions = {
  sendVote : function(vote, cb){
    console.log('vote',vote)
    $.ajax({
      url      : "ideas/vote",
      dataType : "json",
      method   : "POST",
      data     : vote
    }).success(function(data){
      console.log(data);
      cb(data);
    })
  }
}
module.exports = VoteActions;