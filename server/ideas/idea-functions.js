var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var Vote = require('../models/votes');
var slackPost = require('./slackPost');
var request = require('request');


function getIdeas (req, res) {
  req.headers.query = req.headers.query || "";
  var ideas;

  var selectFields = 'createdAt updatedAt shortId userId slackId sUserName title body tags active voters upvotes downvotes rating';

  switch (req.headers.query) {
    case 'dateFirst':
      ideas = Idea.find()
                .select(selectFields)
                .sort('-updatedAt')
                .limit(10);
      break;
    case 'dateLast':
      ideas = Idea.find()
                .select(selectFields)
                .sort('updatedAt')
                .limit(10);
      break;
    case 'votes':
      ideas = Idea.find()
                .select(selectFields)
                .sort('-rating')
                .limit(10);
      break;
    case 'tags':
    //add username to tags array for easy find of people also.
      ideas = Idea.find({ tags: { $in:req.headers.tags } })
                .select(selectFields)
                .limit(10);
      break;
    case 'userId':
      ideas = Idea.find({ userId:req.headers.userId })
                .select(selectFields);
      break;
    default:
    //custom query (to do when need arises)
      console.log('cant cant cant');
  }

  var results = [];

  ideas.exec(function (data) {
    results.push(data);
  });

  res.end(JSON.stringify(results));
} // end getIdeas

function createIdea (req, res) {
  var now = Date.now();

  var idea = new Idea({
    createdAt    : now,
    updatedAt    : now,
    shortId      : req.body.shortId,
    userId       : req.body.userId,
    slackId      : req.body.slackId,
    sUserName    : req.body.user_name,
    sTeamId      : req.body.team_id || null,
    sChannelId   : req.body.channel_id || null,
    sChannelName : req.body.channel_name || null,
    sTeamDomain  : req.body.team_domain || null,
    sCommand     : req.body.command || null,
    title        : req.body.title,
    body         : req.body.body,
    tags         : req.body.tags || [],
    active       : true
  });

  idea.save(function (err) {
    if (err) {
      console.log(err);
    }
    var reply = { 'text': 'Idea Posted! Idea_id: `' + idea.shortId + '` | Idea: ' + idea.body + ' | tags: ' + idea.tags || '' };
    slackPost.postSlack(reply);
    console.log('New idea', idea.title, 'saved');
  });

  res.end();
} // end createIdea

// helper functions for mongodb search with async callbacks
function setUserId (un,  callback){ 
  User.findOne({ sUserName: un }, function (err, user) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, user._id);
    }
  });
}
function findId (pI, callback){
  Idea.findOne({ _id: pI }, function (err, idea) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, idea);
    }
  });
}

//TODO:
/*INCOMING POST REQ NEED THE FOLLOWING:*/
  // each incoming post req needs a parentId and a rootId associated
  // each incoming post also needs parentType = 'comment'
  
// creating and inserting comments into db
function createComment (req, res) {
  var now = Date.now();

  // Saves query data in async callback for userId
  setUserId(req.body.user_name, function(err, uId){
    
    if (err) { console.log(err); }
    req.body.userId = uId;    

    // if a comment is commenting directly on an idea
    if (req.body.parentType === 'idea') {

      findId(req.body.parentId, function (err, idea){
        if (err) { console.log(err); }

        var newComment = new Comment({
          createdAt : now,
          updatedAt : now,
          parentId  : req.body.parentId,
          rootId    : req.body.parentId,
          userId    : req.body.userId,
          slackId   : req.body.slackId,
          body      : req.body.body,
          rating    : 0
        });

        idea.comments.push(newComment);
        idea.save(function(err){ 
          if (err) { 
            console.log(err); 
          } 
          var reply = 'Comment added to idea: ' + idea.shortId;
          res.send(reply);
        });

      }); // end of findId

    } //if comment if commenting on a comment, traverse idea/comment tree
      else if (req.body.parentType === 'comment') {

        findId(req.body.rootId, function (err, idea){
          if (err) { console.log(err); }

          insertComment(idea);

          function insertComment (node) {
            node.comments.map(function (comment) {
              if (comment._id === req.body.parentId) {
                comment.comments.push(newComment);
                res.end();
                return;
              } else {
                insertComment(comment);
              }
            });
          }
        }); // end of findId
    }
  }); // end of setUserId
  
  res.end();
}; // end of createComment
  

function downvote (req, res) {
  var now = Date.now();

  var newDownvote = new Vote({
    createdAt : now,
    voter     : req.body.user_name // Slack username
  });

  if (req.body.type === 'idea') {
    Idea.find({ shortId: req.body.shortId }, function (err, idea) {
      idea.voters.map(function (voter) {
        if (voter === req.body.slackId) {
          res.status(403).send('Voting only allowed once');
        }
      });

      idea.voters.push(req.body.slackId);
      idea.downvotes.push(newDownvote);
      idea.rating = idea.upvotes.length - idea.downvotes.length;
    });
  }

  if (req.body.type === 'comment') {
    Comment.find({ shortId: req.body.shortId }, function (err, comment) {
      comment.voters.map(function (voter) {
        if (voter === req.body.slackId) {
          res.status(403).send('Voting only allowed once');
        }
      });

      comment.voters.push(req.body.slackId);
      comment.downvotes.push(downvote);
      comment.rating = comment.upvotes.length - comment.downvotes.length;
    });
  }

  res.end();
} // end downvote
  
function upvote (req, res) {
  var now = Date.now();
  
  var newUpvote = new Vote({
    createdAt : now,
    voter     : req.body.user_name // Slack username
  });

  if (req.body.type === 'idea') {
    Idea.find({ shortId: req.body.shortId }, function (err, idea) {
      idea.voters.map(function (voter) {
        if (voter === req.body.slackId) {
          res.status(403).send('Voting only allowed once');
        }
      });

      idea.voters.push(req.body.slackId);
      idea.upvotes.push(newUpvote);
      idea.rating = idea.upvotes.length - idea.downvotes.length;
    });
  }

  if (req.body.type === 'comment') {
    Comment.find({ shortId: req.body.shortId }, function (err, comment) {
      comment.voters.map(function (voter) {
        if (voter === req.body.slackId) {
          res.status(403).send('Voting only allowed once');
        }
      });

      comment.voters.push(req.body.slackId);
      comment.upvotes.push(upvote);
      comment.rating = comment.upvotes.length - comment.downvotes.length;
    });
  }

  res.end();
} // end upvote

// expose functions
module.exports = {
  getIdeas: getIdeas,
  createIdea: createIdea,
  createComment: createComment,
  downvote: downvote,
  upvote: upvote
};
