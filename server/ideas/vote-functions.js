var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var Vote = require('../models/votes');
var slackPost = require('./slackPost');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteOptions = function(req,res){
  var voteInfo = req.body;
  
  // calculate the voting rate
  var rate;
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
  if (voteInfo.voteType === "idea") {
    Idea.findOne({ _id: voteInfo.parentId }, function(err, idea){
        var counter = 0;
        var exists = false;

        // see if the voter has voted before
        idea.voters.map(function(vote, index){
          if(vote.voter === voteInfo.user_id){
            exists = true;
            console.log('your vote ',rate, 'old vote',vote.value, ' counter ', counter)
            if(vote.value===rate){vote.value=0}
            else{vote.value = rate;}
            counter = counter + vote.value;
          }else{

            counter = counter + vote.value;
          }
        });

        console.log('counter after change: ', counter)

        // if the user has not voted before, then create the vote object
        if(!exists){
          var now = Date.now();
          var newVote = new Vote({
              createdAt : now,
              voter     : voteInfo.user_id,
              value     : rate
          });
          idea.voters.push(newVote);
          counter = counter + rate;
        }
        idea.rating = counter;
        console.log('idea.rating: ', idea.rating)
        idea.save()
      
    }).exec(function( ideaObj ){
      var voteObj = { 
          voteArray : ideaObj[0].voters, 
          rating    : ideaObj[0].rating
      };
      console.log('vote data',voteObj,voteInfo)
      res.end(JSON.stringify(voteObj));
    });
  

  } else if (voteInfo.voteType === "comment") {
    Comment.findOne({ _id: voteInfo.parentId }, function(err, comment){
        var counter = 0;
        var exists = false;

        // see if the voter has voted before
        comment.voters.map(function(vote, index){
          if(vote.voter === voteInfo.user_id){
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
              voter     : voteInfo.user_id,
              value     : rate
          });
          comment.voters.push(newVote);
          counter = counter + rate;
        }
        comment.rating = counter;
        comment.save();
      
    }).exec(function(err, commentObj){
      var voteObj = { 
          voteArray : commentObj[0].voters, 
          rating    : commentObj[0].rating
      };
      res.end(JSON.stringify(voteObj));
    });
  }
};
module.exports = voteOptions;