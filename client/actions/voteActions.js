var $ = require('jquery');
//require back end vote file

// send vote data to the server
var sendVote = function(vote, cb){
  $.ajax({
    url      : "idea/votes",
    dataType : "json",
    method   : "POST",
    data     : vote
  }).success(function(data){
    console.log(data);
    
  })
}

module.exports = sendVote;