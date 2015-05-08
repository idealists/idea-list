var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var Vote = require('../models/votes');

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

  // Might have to call idea.exec()
  var counts;
  ideas.count(function (err, total) {
    counts = total;
  });

  var results = [];
  ideas.on('data', function (data) {
    results.push(data);
    if (results.length === counts) {
      res.end(JSON.stringify(results));
    }
  });
} // end getIdeas

function createIdea (req, res) {
  var now = Date.now();
  var count;

  User.findOne({ slackName: req.body.user_name }, function (err, user) {
    console.log(user.slackName);

    // Increment user's idea count and capture it in variable
    count = ++user.ideaCount;

    if (!req.body.userId) {
      req.body.userId = user._id;
    }
  });

  // If from Slack, assign text to body
  if (!req.body.body) {
    req.body.body = req.body.text;
  }

  // create title joined with underscores for shortId
  var ti_tle = req.body.title.split(' ').join('_')

  var idea = new Idea({
    createdAt    : now,
    updatedAt    : now,
    shortId      : req.body.user_name + '_' + ti_tle,
    userId       : req.body.userId,
    slackId      : req.body.slackId,
    sUserName    : req.body.user_name || null,
    sTeamId      : req.body.team_id || null,
    sChannelId   : req.body.channel_id || null,
    sChannelName : req.body.channel_name || null,
    sTeamDomain  : req.body.team_domain || null,
    sCommand     : req.body.command || null,
    title        : req.body.title || null,
    body         : req.body.body,
    tags         : req.body.tags,
    active       : true
  });

  idea.save(function (err) {
    if (err) console.log(err);
    console.log('New idea', idea.title, 'saved');
  });

  res.end();
} // end createIdea

function createComment (req, res) {
  var now = Date.now();

  User.findOne({ slackName: req.body.user_name }, function (err, user) {
    console.log('User:', user.slackName);

    if (!req.body.userId) {
      req.body.userId = user._id;
    }
  });

  // If from Slack, assign text to body
  if (!req.body.body) {
    req.body.body = req.body.text;
  }

  // If from Slack, set req.body.parentId to mongo _id (looked up from shortId)

  var newComment = new Comment({
    createdAt : now,
    updatedAt : now,
    parentId  : req.body.parentId,
    userId    : req.body.userId,
    slackId   : req.body.slackId,
    body      : req.body.body
  });

  // Assumes comment request comes with a parentType
  if (req.body.parentType === 'idea') {
    Idea.findOne({ _id: req.body.parentId }, function (err, idea) {
      console.log('Idea shortId:', idea.shortId);

      idea.comments.push(newComment);
    });
  }

  if (req.body.parentType === 'comment') {
    Idea.findOne({ _id: req.body.rootId }, function (err, idea) {
      console.log('Root idea shortId:', idea.shortId);

      insertComment(idea);

      // Traverse comment tree to find parent of comment
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
    });
  }
  //   console.log('New comment "' + comment.body.substr(0, 10) + '"saved')
  
  res.end();
} // end createComment

function downvote (req, res) {
  var now = Date.now();

  var downvote = new Vote({
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
      idea.downvotes.push(downvote);
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
  
  var upvote = new Vote({
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
      idea.upvotes.push(upvote);
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
