var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var Vote = require('../models/votes');
var slackPost = require('./slackPost');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteOptions = function(req,res){
  var voteInfo = req.body || req;

  // calculate the voting rate
  (function rating(){
    if(voteInfo.voteRating > 0){
      voteInfo.rate = 1;
    } else if (voteInfo.voteRating < 0){
      voteInfo.rate = -1;
    } else {
      voteInfo.rate = 0;
    }
  })();

  // if the vote is for an idea, add the vote to the idea
  // else add the vote to the comment
  if (voteInfo.voteType === "idea") {
    addIdeaVote(req, res); 
  } else if (voteInfo.voteType === "comment") {
    addCommVote(req, res);
  }
}; // end of voteOptions

function addIdeaVote(req, res) {
  var voteInfo = req.body || req;

  Idea.findOne({ _id: voteInfo.parentId }, function(err, idea){
    var counter = 0;
    var exists = false;

    // if the voter has voted before, then adjust their vote accordingly
    idea.voters.map(function(vote, index){

      if(String(vote.voter) === voteInfo.voterId){
        exists = true;
        console.log('old voter',vote.value,voteInfo.rate)
        if ( vote.value !== voteInfo.rate ){ 
          vote.value = voteInfo.rate;
          //counter += vote.value; // <-- stuffing happening here 
          console.log('changing vote',vote.value,voteInfo.rate)
        } else {
          vote.value = 0;
          //counter += vote.value;
        }
      } //else {
        counter += vote.value;
     // }
      
      console.log("INSIDE IDEA MAP: counter: " , counter, ' vote.value: ', vote.value)

      // also want to have a voteCount on idea, 
      // filters for non-zero votes and gets length on new array via filter

      // if(vote.voter === voteInfo.voterId){
      //   exists = true;
      //   if ( vote.value === voteInfo.rate && !voteInfo.slackReq ){ 
      //     vote.value = 0; 
      //   } else { vote.value += voteInfo.rate; }
      //   counter = counter + vote.value;
      // } else {
      //   counter = counter + vote.value;
      // }
    });

    // if the user has not voted before, then create the vote object
    if(!exists){

      var now = Date.now();
      var newVote = new Vote({
          createdAt : now,
          voter     : voteInfo.voterId,
          value     : voteInfo.rate,
          imgUrl    : voteInfo.userImage
      });
      idea.voters.push(newVote);
      counter = counter + voteInfo.rate;
    }

    idea.rating = counter;

    console.log("COUNTER: ", counter, ' VOTE.VALUE: ', idea.rating );

    idea.save(function(err, ideaObj ){
      if (err) console.log(err);
      var voteObj = { 
          voteArray : ideaObj.voters, 
          rating    : ideaObj.rating
      };
      // if req is from the app client, res.end();
      // if req is from Slack, send response to Slack channel
      if(voteInfo.slackReq){
        var reply;
        if ( voteInfo.slackCommand === '/upvote' ) {
          reply = { 'text': 'Upvote recorded for idea: ' + voteInfo.parentTitle + ' | Id: ' + voteInfo.shortId };
        } else if ( voteInfo.slackCommand === '/downvote' ) {
          reply = { 'text': 'Downvote recorded for idea: ' + voteInfo.parentTitle + ' | Id: ' + voteInfo.shortId };
        }
        slackPost.postSlack(reply);
        //res.end();
      } else {
        res.end(JSON.stringify(voteObj));
      }
    });

  });
} // end of addIdeaVote

function addCommVote(req, res) {
  var voteInfo = req.body || req;
  
  Comment.findOne({ _id: voteInfo.parentId }, function(err, comment){
    var counter = 0;
    var exists = false;

    // if the voter has voted before, then adjust their vote accordingly
    comment.voters.map(function(vote, index){

      // debugging
      console.log('vote: ', vote, ' voteInfo: ', voteInfo);

      if(vote.voter === voteInfo.voterId){
        exists = true; 
        if ( vote.value === voteInfo.rate && !voteInfo.slackReq ){ 
          vote.value = 0; 
        } else { vote.value = voteInfo.rate; }
        counter = counter + vote.value;
      } else {
        counter = counter + vote.value;
      }
    });

    // if the user has not voted before, then create the vote object
    if(!exists){
      console.log('new vote')
      var now = Date.now();
      var newVote = new Vote({
          createdAt : now,
          voter     : voteInfo.voterId,
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
      // if req is from the app client, res.end();
      // if req is from Slack, send response to Slack channel
      if(voteInfo.slackReq){
        var reply;
        if(voteInfo.voteRating < 0){
          reply = { 'text': 'Downvote recorded for comment ' + voteInfo.parentTitle + ' | Id: ' + voteInfo.shortId };
        } else {
          reply = { 'text': 'Upvote recorded for comment ' + voteInfo.parentTitle + ' | Id: ' + voteInfo.shortId };
        }
        slackPost.postSlack(reply);
        //res.end();
      } else {
        res.end(JSON.stringify(voteObj));
      }
    });
  });
} // end of addCommVote

module.exports = voteOptions;