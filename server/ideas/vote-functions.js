var Comment   = require('../models/comments');
var Idea      = require('../models/ideas');
var User      = require('../models/users');
var Vote      = require('../models/votes');
var slackPost = require('./slackPost');
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var voteOptions = function (req, res) {
  var voteInfo = req.body || req;

  if (voteInfo.voteType === 'idea') {
    addIdeaVote(req, res);
  } else if (voteInfo.voteType === 'comment') {
    addCommVote(req, res);
  }
};

function addIdeaVote (req, res) {
  var voteInfo = req.body || req;

  voteInfo.rate = Number(voteInfo.rate);

  Idea.findById(voteInfo.parentId, function (err, idea) {
    if (err) console.log('\nError in addIdeaVote:', err);

    var total        = 0;
    var unvoted      = false;
    var alreadyVoted = false;

    idea.voters.map(function (vote, index) {
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
    }

    idea.rating = total;

    idea.voteCount = idea.voters.filter(function (vote) {
      if (vote.value !== 0){ return vote; } }).length;

    idea.save(function (err, ideaObj) {
      if (err) console.log('In idea save: ', err);
      var voteObj = {
          voteArray : ideaObj.voters,
          rating    : ideaObj.rating
      };

    if (voteInfo.slackReq) {
        var reply;
        var title = voteInfo.parentTitle || idea.title;

        if (!unvoted) {
          if ( voteInfo.slackCommand === '/upvote' ) {
            reply = 'Upvote recorded for idea: "' + title + '" | Id: ' + voteInfo.shortId;
          } else if ( voteInfo.slackCommand === '/downvote' ) {
            reply = 'Downvote recorded for idea: "' + title + '" | Id: ' + voteInfo.shortId;
          }
        } else {
          if (voteInfo.slackCommand === '/upvote') {
            reply = 'VOTE CHANGED to zero. \n You previously upvoted for idea: "' + title + '" | Id: ' + voteInfo.shortId;
          } else if (voteInfo.slackCommand === '/downvote') {
            reply = 'VOTE CHANGED to zero. \n You previously downvoted for idea: "' + title + '" | Id: ' + voteInfo.shortId;
          }
        }
        res.end(reply);
      } else {
        res.end(JSON.stringify(voteObj));
      }
    });

  });
}

function addCommVote (req, res) {
  var voteInfo = req.body || req;

  voteInfo.rate = Number(voteInfo.rate);

  Comment.findOne({ _id: voteInfo.parentId }, function (err, comment) {
    if (err) console.log('\nError in addCommentVote:', err);

    var total        = 0;
    var unvoted      = false;
    var alreadyVoted = false;

    comment.voters.map(function (vote, index) {
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

    comment.save(function (err, commObj) {
      if (err) console.log('In comment save: ', err);

      var voteObj = {
          voteArray : commObj.voters,
          rating    : commObj.rating
      };

      if (voteInfo.slackReq) {
        var reply;

        if (!unvoted) {
          if (voteInfo.slackCommand === '/upvote') {
            reply = 'Upvote recorded! On comment Id: ' + voteInfo.shortId;
          } else if (voteInfo.slackCommand === '/downvote') {
            reply = 'Downvote recorded! On comment Id: ' + voteInfo.shortId;
          }
        } else {
          if (voteInfo.slackCommand === '/upvote') {
            reply = 'VOTE CHANGED to zero. \n You have reversed your upvote for comment Id: ' + voteInfo.shortId;
          } else if (voteInfo.slackCommand === '/downvote') {
            reply = 'VOTE CHANGED to zero. \n You have reversed your downvote for comment Id: ' + voteInfo.shortId;
          }
        }
        res.end(reply);
      } else {
        res.end(JSON.stringify(voteObj));
      }
    });
  });
}

module.exports = {
  voteOptions: voteOptions,
  addIdeaVote: addIdeaVote
};
