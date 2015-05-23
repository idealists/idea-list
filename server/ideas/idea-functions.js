var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var slackPost = require('./slackPost');
var Status = require('./statusConstants');
var ObjectId = require('mongoose').Types.ObjectId;
var voteFunctions = require('./vote-functions.js');


function getIdeas (req, res) {
  req.headers.query = req.headers.query || "";
  var ideas;

  var selectFields = 'createdAt updatedAt shortId userId slackId sUserName title body tags active voters upvotes downvotes rating img commentCount voteCount';

  switch (req.headers.query) {
    case 'dateFirst':
      ideas = Idea.find()
                .select(selectFields)
                .where({status: Status.OPEN})
                .sort('-updatedAt');
      break;
    case 'dateLast':
      ideas = Idea.find()
                .select(selectFields)
                .where({status: Status.OPEN})
                .sort('updatedAt');
      break;
    case 'votes':
      ideas = Idea.find()
                .select(selectFields)
                .where({status: Status.OPEN})
                .sort('-rating');
      break;
    case 'voteCount':
      ideas = Idea.find()
                .select(selectFields)
                .where({status: Status.OPEN})
                .sort('-voteCount');
      break;
    case 'tags':
    //add username to tags array for easy find of people also.
      ideas = Idea.find({ tags: { $in:req.headers.tags } })
                .select(selectFields)
                .where({status: Status.OPEN});
      break;
    case 'userId':
      ideas = Idea.find({ userId:req.headers.userId })
                .select(selectFields);
      break;
    case 'id':
      console.log('req.headers',req.headers.data);
      ideas = Idea.find({ _id:ObjectId(req.headers.data) });
      break;
    case 'searchbar':
      var text = req.headers.lookup.replace(/\s+/g,' ').trim();
      text = text.split(' ');
      var result={};
      ideas = Idea.find({$or:[{ tags: { $in:text}}, {sUserName:{ $in:text} }]})
                .select(selectFields).limit(40);
      users= [];
      result.users = users;
        ideas.exec(function(err,val){
          if(err) console.log('searchbar err:',err);
        }).then(function (idealist) {
          idealist = idealist || [];
          result.ideas= idealist;
        }).then(function () {
          res.end(JSON.stringify(result));
        });
    break;
    default:
    res.end('query is not valid');
    //custom query (to do when need arises)
  }

  ideas.exec().then(
    function(value){
      res.end(JSON.stringify(value));
    }
  );
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
    img          : req.body.img,
    sTeamId      : req.body.team_id || null,
    sChannelId   : req.body.channel_id || null,
    sChannelName : req.body.channel_name || null,
    sTeamDomain  : req.body.team_domain || null,
    sCommand     : req.body.command || null,
    title        : req.body.title,
    body         : req.body.body,
    tags         : req.body.tags || null,
    rating       : 0,
    voteCount    : 0,
    commentCount : 0,
    status       : Status.OPEN
  });

  idea.save(function (err) {
    if (err) {
      return err;
    }
    var tags = idea.tags ? ' | tags: ' + idea.tags : '';
    var reply = { 'text': 'Idea Posted! \n Id: `' + idea.shortId + '` | Idea: ' + idea.body + tags };
    slackPost.postSlack(reply);
    console.log('New idea:', idea.title, 'SAVED');
  })
  .then(function () {
    // automagically vote for your own idea
    var voteOptions = {
      voterId    : req.body.userId,
      parentId   : idea._id,
      user_name  : req.body.user_name,
      voteType   : 'idea',
      rate       : 1,
      userImage  : req.body.img,
      slackReq   : req.body.slackReq||null
    };

    voteFunctions.addIdeaVote(voteOptions, res);
  });


  // res.end();
} // end createIdea

function updateIdea (req, res) {
  var now = Date.now();
  var ideaId = req.body.ideaId;
  var incoming = req.body;

  Idea.findByIdAndUpdate(ideaId,
    {
      $set: {
        updatedAt: now,
        body: incoming.body,
        title: incoming.title,
        status: incoming.status
      }
    },
    function (err, idea) {
      if (err) console.log(err);
      res.status(201).send(idea);
    }
  );
}

// helper functions for mongodb search with async callbacks
function getUserId (username){
  return User.findOne({ sUserName: username });
}

function findIdea (ideaId){
  return Idea.findOne({ _id: ideaId });
}

function findComment (commentId) {
  return Comment.findOne({ _id: commentId });
}

function getComments (req, res) {
  var ideaId = JSON.parse(req.headers.data);

  Idea.findById(ideaId).lean()
    .populate('comments').exec(function (err, idea) {
      if(err){console.log(err);}
      var opts = {
          path: 'comments.comments'
      };
      Comment.populate(idea, opts, function(err, docs) {
            res.end(JSON.stringify( docs.comments));
      });
  });
} // end getComments

function generateCommentShortId(parent) {
  var count = parent.comments.length+1;
  return (parent.shortId.split("_").slice(0,-1).join("_") + '_comm' + count).toLowerCase();
}

// creating and inserting comments into db
function createComment (req, res) {
  if (!~['idea', 'comment'].indexOf(req.body.parentType)) {
    throw new Error("parentType must be 'idea' or 'comment'. It was `" + req.body.parentType + "`.");
  }

  function sendResponse(result) {
    res.end(req.body.slackReq ? undefined : JSON.stringify(result));
  }

  // Saves query data in async callback for userId
  getUserId(req.body.sUserName).then(function(userId) {
    req.body.userId = userId;
    return Comment.fromRequest(req);
  }).then(function (comment) {
    function addCommentToIdea(idea) {
      comment.commShortId = generateCommentShortId(idea);

      idea.comments.push(comment);

      comment.save();

      idea.save(function(err){
        var reply = { 'text': 'Comment added to idea: `' + idea.shortId + '` ! \n New comment: "' + comment.body + '"\n *To comment on this comment, use commentId: `' + comment.commShortId + '`'};
        slackPost.postSlack(reply);
      });
    }

    function addCommentToComment(parent) {
      comment.parentId = parent.parentId;

      parent.comments.push(comment);

      parent.save(function (err) {
        var reply = { 'text': 'Comment added to comment: `' + parent.commShortId + '` ! \n New comment: "' + comment.body+'"'};
        slackPost.postSlack(reply);
      });
    }

    req.body.parentType == 'idea'
      ? findIdea(comment.parentId).then(addCommentToIdea)
      : findComment(comment.parentId).then(addCommentToComment);

    comment.save().then(sendResponse);
  });

} // end of createComment

function updateComment (req, res) {
  var now = Date.now();
  var commentId = JSON.parse(req.headers);
  var incoming = JSON.parse(req.body);

  Comment.findByIdAndUpdate(commentId,
    {
      $set: {
        updatedAt: now,
        body: incoming.body,
        status: incoming.status
      }
    },
    function (err, comment) {
      if (err) console.log(err);
      res.status(201).send(comment);
    }
  );
}

// expose functions
module.exports = {
  getIdeas: getIdeas,
  createIdea: createIdea,
  updateIdea: updateIdea,
  getComments: getComments,
  createComment: createComment,
  updateComment: updateComment
};
