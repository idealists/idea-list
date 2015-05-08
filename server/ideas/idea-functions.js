var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var Vote = require('../models/votes');

function getIdeas (req, res) {
  req.headers.query = req.headers.query || "";
  var ideas;

  switch (req.headers.query) {
    case 'dateFirst':
      ideas = Idea.find()
                .sort('-updatedAt')
                .limit(10);
      break;
    case 'dateLast':
      ideas = Idea.find()
                .sort('updatedAt')
                .limit(10);
      break;
    case 'votes':
      ideas = Idea.find()
                .sort('-rating')
                .limit(10);
      break;
    case 'tags':
    //add username to tags array for easy find of people also.
      ideas = Idea.find({ tags: { $in:req.headers.tags } })
                .limit(10);
      break;
    case 'userId':
      ideas = Idea.find({ userId:req.headers.userId });
      break;
    default:
    //custom query (to do when need arises)
      console.log('cant cant cant');
  }

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

  var idea = new Idea({
    createdAt    : now,
    updatedAt    : now,
    shortId      : req.body.user_name + '_' + count,
    userId       : req.body.userId,
    slackId      : req.body.slackId,
    sUserName    : req.body.user_name || null,
    sTeamId      : req.body.team_id || null,
    sChannelId   : req.body.channel_id || null,
    sChannelName : req.body.channel_name || null,
    sTeamDomain  : req.body.team_domain || null,
    sCommand     : req.body.command || null,
    title        : req.body.title || null,
    body         : req.body.body || null,
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
    console.log(user.slackName);

    if (!req.body.userId) {
      req.body.userId = user._id;
    }
  });

  // If from Slack, assign text to body
  if (!req.body.body) {
    req.body.body = req.body.text;
  }

  var comment = new Comment({
    createdAt : now,
    updatedAt : now,
    parentId  : req.body.parentId,
    userId    : req.body.userId,
    slackId   : req.body.slackId,
    body      : req.body.body
  });

  comment.save(function (err) {
    if (err) console.log(err);
    console.log('New comment "' + comment.body.substr(0, 10) + '"saved')
  });

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
