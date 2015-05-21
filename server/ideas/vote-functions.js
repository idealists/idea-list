var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var Vote = require('../models/votes');
var slackPost = require('./slackPost');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteOptions = function(req,res){
  var voteInfo = req.body || req;

  console.log('\n Request:', voteInfo);

  // calculate the voting rate
  // (function rating(){
  //   if(voteInfo.voteRating > 0){
  //     voteInfo.rate = 1;
  //   } else if (voteInfo.voteRating < 0){
  //     voteInfo.rate = -1;
  //   } else {
  //     voteInfo.rate = 0;
  //   }
  // })();

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

  voteInfo.rate = Number(voteInfo.rate);

  console.log('INSIDE ADDIDEAVOTE, voteInfo: ', voteInfo);

  Idea.findById(voteInfo.parentId, function(err, idea){
    if (err) console.log('\nError in addIdeaVote:', err);

    console.log("INSIDE IDEA FINDBYID, idea:", idea );

    var total = 0;
    var alreadyVoted = false;
    var unvoted = false;

    // if the voter has voted before, then adjust their vote accordingly
    idea.voters.map(function(vote, index){
    console.log('INSIDE same voter: typeof vote.voter and voteInfo.voterId:', typeof(vote.voter), typeof(voterId));
      if (String(vote.voter) === String(voteInfo.voterId)) {
        alreadyVoted = true;

        if (vote.value !== voteInfo.rate) { 
          vote.value = voteInfo.rate;
        } else {
          unvoted = true;
          vote.value = 0;
        }
      }

      total += vote.value;
    });

    // if the user has not voted before, then create the vote object
    if (!alreadyVoted) {
      var now = Date.now();
      var newVote = new Vote({
          createdAt : now,
          voter     : voteInfo.voterId,
          value     : voteInfo.rate,
          imgUrl    : voteInfo.userImage
      });

      idea.voters.push(newVote);
      total += voteInfo.rate;
      console.log('\n total: ', total); 
    }
    
    idea.rating = total;

    idea.save(function(err, ideaObj ){
      if (err) console.log('In idea save: ', err);
      var voteObj = { 
          voteArray : ideaObj.voters, 
          rating    : ideaObj.rating
      };
      // if req is from the app client, res.end();
      // if req is from Slack, send response to Slack channel
      if(voteInfo.slackReq){
        var reply;
        if (!unvoted){
          if ( voteInfo.slackCommand === '/upvote' ) {
            reply = { 'text': 'Upvote recorded for idea: ' + voteInfo.parentTitle + ' | Id: ' + voteInfo.shortId };
          } else if ( voteInfo.slackCommand === '/downvote' ) {
            reply = { 'text': 'Downvote recorded for idea: ' + voteInfo.parentTitle + ' | Id: ' + voteInfo.shortId };
          }
        } else {
          if ( voteInfo.slackCommand === '/upvote' ) {
            reply = { 'text': 'VOTE CHANGED to zero. \n You previously upvoted for idea: ' + voteInfo.parentTitle + ' | Id: ' + voteInfo.shortId };
          } else if ( voteInfo.slackCommand === '/downvote' ) {
            reply = { 'text': 'VOTE CHANGED to zero. \n You previously downvoted for idea: ' + voteInfo.parentTitle + ' | Id: ' + voteInfo.shortId };
          }
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
     if (err) console.log('\nError in addIdeaVote:', err);

    var total = 0;
    var alreadyVoted = false;

    // if the voter has voted before, then adjust their vote accordingly
    comment.voters.map(function(vote, index){
      if (String(vote.voter) === voteInfo.voterId) {
        alreadyVoted = true;
        voteInfo.rate = Number(voteInfo.rate);

        if (vote.value !== voteInfo.rate) { 
          vote.value = voteInfo.rate;
        } else {
          vote.value = 0;
        }
      }

      total += vote.value;
    });

    // if the user has not voted before, then create the vote object
    if (!alreadyVoted) {
      var now = Date.now();
      var newVote = new Vote({
          createdAt : now,
          voter     : voteInfo.voterId,
          value     : voteInfo.rate,
          imgUrl    : voteInfo.userImage
      });

      comment.voters.push(newVote);
      total += voteInfo.rate;
    }
    
    comment.rating = total;
      
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

module.exports = {
  voteOptions: voteOptions,
  addIdeaVote: addIdeaVote
};
