var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var slackPost = require('./slackPost');
var Status = require('./statusConstants');
var ObjectId = require('mongoose').Types.ObjectId; 
var voteFunctions = require('./vote-functions.js');
//var request = require('request');

function getIdeas (req, res) {
  req.headers.query = req.headers.query || "";
  var ideas;

  var selectFields = 'createdAt updatedAt shortId userId slackId sUserName title body tags active voters upvotes downvotes rating img';

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
    status       : Status.OPEN
  });

  console.log("INSIDE IDEA FUNCS: ", idea);
  
  idea.save(function (err) {
    if (err) {
      return err;
    }
    var reply = { 'text': 'Idea Posted! Idea_id: `' + idea.shortId + '` | Idea: ' + idea.body + ' | tags: ' + idea.tags || '' };
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
      userImage  : req.body.img
    };

    voteFunctions.addIdeaVote(voteOptions, res);
  });


  // res.end();
} // end createIdea

function updateIdea (req, res) {
  var now = Date.now();
  var ideaId = JSON.parse(req.headers);
  var incoming = JSON.parse(req.body);

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
function findIdComment (pI, callback){
  Comment.findOne({ _id: pI },function (err, comment){
    if (err){
      callback(err, null);
    } else {
      callback(null, comment);
    }
  });
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


// creating and inserting comments into db
function createComment (req, res) {
  var now = Date.now();

  // Saves query data in async callback for userId
  setUserId(req.body.sUserName, function(err, uId) {

    if (err) console.log(err);
    req.body.userId = uId;

    var newComment = new Comment({
      createdAt  : now,
      updatedAt  : now,
      parentId   : req.body.parentId,
      parentType : req.body.parentType,
      commShortId: req.body.commShortId || null,
      userId     : req.body.userId,
      slackId    : req.body.slackId,
      sUserName  : req.body.sUserName,
      img        : req.body.img,
      body       : req.body.body,
      voters     : [],
      rating     : 0,
      comments   : [],
      status     : Status.OPEN
    });

    // if a comment is commenting on an idea ...
    if (req.body.parentType === 'idea') {
      findId(req.body.parentId, function (err, idea) {
        if (err) console.log(err);
        if ( !newComment.commShortId ) {
          var count = idea.comments.length+1;
          newComment.commShortId = String(idea.shortId.split("_").slice(0,-1).join("_") + '_comm' + count).toLowerCase();
        }
        console.log('INSIDE CREATECOMMENT/ newComment: ', newComment, ' / req: ', req);

        idea.comments.push(newComment);

        idea.save(function(err){
          if (err) console.log('idea save error:', err);

          var reply = { 'text': 'Comment added to idea: ' + idea.shortId + ' / Text: ' + idea.body + ' / To comment on this comment, use commentId: `' + newComment.commShortId + '`'};
          slackPost.postSlack(reply);
        });

        saveNewComment();

      }); // end of findId
    } else if (req.body.parentType === 'comment') { // if a comment is commenting on a comment ... 
      findIdComment(req.body.parentId, function (err, comment) {
        if (err) { console.log('adding comment to comment ERROR:', err); }

        if ( !newComment.commShortId ) {
          var count1 = comment.comments.length+1;
          newComment.commShortId = comment.commShortId + count1;
        }

        comment.comments.push(newComment);

        comment.save(function (err) {
          if (err) { console.log('comment save ERROR:', err); }
          var reply = { 'text': 'Comment added to comment: ' + comment.commShortId + ' / Text: ' + comment.body + ' / To comment on this comment, use commentId: `' + newComment.commShortId + '`'};
          slackPost.postSlack(reply);
        });

        saveNewComment();

      });
    }

    function saveNewComment(){
      newComment.save(function(err, val){
        if (err) console.log('comment save error:', err);
      }).then(function(result){
        console.log('SERVER CREATECOMMENT:', result);
        if(!req.body.slackReq){
          res.end(JSON.stringify(result));
        } else { res.end(); }
      });
    }

  }); // end of setUserId
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
