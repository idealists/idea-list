var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var Vote = require('../models/votes');
var slackPost = require('./slackPost');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteoptions  = function(req,res){
  var voteinfo = req.body;
  
  // calculate the voting rate
  var rate;
  console.log('vote rating', voteinfo.voteRating)
  var rating = function(){
    if(req.body.voteRating>0){
      rate = 1;
    } else if (req.body.voteRating<0){
      rate =-1;
    } else {
      rate =0;
    }
  };
  rating();
  

  // if the vote is for an idea, search the ideas collection and
  // add the vote to the idea, else search the comments
  // collection and add the vote to the comment
  if (voteinfo.voteType === "idea") {
    Idea.findOne({ _id: voteinfo.parentId }, function(err, idea){
        var counter = 0;
        var exists = false;

        // see if the voter has voted before
        idea.voters.map(function(vote, index){
          if(vote.voter === voteinfo.user_id){
            exists = true;
            vote.value = rate; 
          }
          counter = counter + vote.value;
        });

        // if the user has not voted before, then create the vote object
        if(!exists){
          var now = Date.now();
          var newVote = new Vote({
              createdAt : now,
              voter     : voteinfo.user_id,
              value     : rate
          });
          idea.voters.push(newVote);
          counter = counter + rate;
        }
        idea.rating = counter;
        idea.save();
      
    }).exec(function(err, ideaObj){
      var finalobj = { 
          voteArray : ideaObj[0].voters, 
          rating    : ideaObj[0].rating
      };
      res.end(JSON.stringify(finalobj));
    });
  } else if (voteinfo.voteType === "comment") {
    Comment.findOne({ _id: voteinfo.parentId }, function(err, comment){
        var counter = 0;
        var exists = false;

        // see if the voter has voted before
        comment.voters.map(function(vote, index){
          if(vote.voter === voteinfo.user_id){
            exists = true;
            vote.value = rate; 
          }
          counter = counter + vote.value;
        });

        // if the user has not voted before, then create the vote object
        if(!exists){
          var now = Date.now();
          var newVote = new Vote({
              createdAt : now,
              voter     : voteinfo.user_id,
              value     : rate
          });
          comment.voters.push(newVote);
          counter = counter + rate;
        }
        comment.rating = counter;
        comment.save();
      
    }).exec(function(err, commentObj){
      var finalobj = { 
          voteArray : commentObj[0].voters, 
          rating    : commentObj[0].rating
      };
      res.end(JSON.stringify(finalobj));
    });
  }
}
module.exports = voteoptions