var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var Vote = require('../models/votes');
var slackPost = require('./slackPost');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteOptions = function(req,res){
  var voteInfo = req.body;
  console.log('INSIDE VOTEOPTIONS, req.body: ', req.body);
  // calculate the voting rate
  (function rating(){
    if(req.body.voteRating > 0){
      req.body.rate = 1;
    } else if (req.body.voteRating < 0){
      req.body.rate = -1;
    } else {
      req.body.rate = 0;
    }
  })();

  // if the vote is for an idea, add the vote to the idea
  // else add the vote to the comment
  if (voteInfo.voteType === "idea") {
    addIdeaVote(req, res); 
  } else if (voteInfo.voteType === "comment") {
    addCommVote();
  }
}; // end of voteOptions

function addIdeaVote(req, res) {
  var voteInfo = req.body;

  Idea.findOne({ _id: voteInfo.parentId }, function(err, idea){
    var counter = 0;
    var exists = false;

    // see if the voter has voted before
    idea.voters.map(function(vote, index){
      if(vote.voter === voteInfo.user_id){
        exists = true;
        if ( vote.value === voteInfo.rate ){ vote.value = 0; }
        else { vote.value = voteInfo.rate; }
        counter = counter + vote.value;
      }else{
        counter = counter + vote.value;
      }
    });

    // if the user has not voted before, then create the vote object
    if(!exists){
      var now = Date.now();
      var newVote = new Vote({
          createdAt : now,
          voter     : voteInfo.user_id,
          value     : voteInfo.rate,
          imgUrl    : voteInfo.userImage
      });
      idea.voters.push(newVote);
      counter = counter + voteInfo.rate;
    }
    idea.rating = counter;

    idea.save(function(err, ideaObj ){
      if (err) console.log(err);
      var voteObj = { 
          voteArray : ideaObj.voters, 
          rating    : ideaObj.rating
      };
      res.end(JSON.stringify(voteObj));
    });

  });
} // end of addIdeaVote

function addCommVote() {
  var voteInfo = req.body;
  
  Comment.findOne({ _id: voteInfo.parentId }, function(err, comment){
    var counter = 0;
    var exists = false;

    // see if the voter has voted before
    comment.voters.map(function(vote, index){
      if(vote.voter === voteInfo.user_id){
        exists = true;
        if ( vote.value === voteInfo.rate ){ vote.value = 0; }
        else { vote.value = voteInfo.rate; }
        counter = counter + vote.value;
      } else {
        counter = counter + vote.value;
      }
    });

    // if the user has not voted before, then create the vote object
    if(!exists){
      var now = Date.now();
      var newVote = new Vote({
          createdAt : now,
          voter     : voteInfo.user_id,
          value     : voteInfo.rate,
          imgUrl    : voteInfo.userImage
      });
      comment.voters.push(newVote);
      counter = counter + voteInfo.rate;
    }
    comment.rating = counter;
      
    comment.save(function(err, commentObj ){
      if (err) console.log(err);
      var voteObj = { 
          voteArray : commentObj.voters, 
          rating    : commentObj.rating
      };
      res.end(JSON.stringify(voteObj));
    });
  });
} // end of addCommVote

module.exports = voteOptions;