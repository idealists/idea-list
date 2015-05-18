var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var slackPost = require('./slackPost');
//var request = require('request');

function getIdeas (req, res) {
  req.headers.query = req.headers.query || "";
  var ideas;

  var selectFields = 'createdAt updatedAt shortId userId slackId sUserName title body tags active voters upvotes downvotes rating img';

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
    case 'id':
      ideas = Idea.find({ _id: ObjectId.fromString(req.headers.id)});
      break;
    case 'searchbar':
      var text = req.headers.lookup.replace(/\s+/g,' ').trim();
      text = text.split(' ');
      var result={};
      users = User.find({sUserName:{$in:text} });
      ideas = Idea.find({ tags: { $in:text} })
                .select(selectFields).limit(40);
      users.exec().then(function (users) {
        users=users || [];
        result.users = users;
      }).then(
        ideas.exec().then(function (idealist) {
          idealist = idealist || [];
          result.ideas= idealist;
        }).then(function () {
          res.end(JSON.stringify(result));
        }));

      break;
    default:
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
    active       : true
  });

  idea.save(function (err) {
    if (err) {
      return err;
    }
    var reply = { 'text': 'Idea Posted! Idea_id: `' + idea.shortId + '` | Idea: ' + idea.body + ' | tags: ' + idea.tags || '' };
    slackPost.postSlack(reply);
    console.log('New idea:', idea.title, 'SAVED');
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
function findIdComment (pI, callback){
  Comment.findOne({ _id: pI },callback);
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
      var opts = {
          path: 'comments.comments.comments'
      };
        Comment.populate(idea, opts, function(err, docs) {
          var opts = {
            path: 'comments.comments.comments.comments'
          };
          Comment.populate(idea, opts, function(err, docs) {
            result = 
            res.end(JSON.stringify( docs.comments));
          });

        });
      });
  });
  // Idea.findById(ideaId)
  //   .exec(function(err, idea) {
  //     if (err) console.log('populate ERR', err);
  //     else {         

  //       function commentarray (array){
  //         return  array.map(function(singlecomment){
  //             return fillcomments(singlecomment)
  //         })
  //       }
  //       function fillcomments (fillthis){
  //         if(fillthis.comments[0]){
  //             console.log(fillthis)
  //             fillthis.populate('comments',function(err, result){
  //               result.comments = commentarray(result.comments) 
  //               // console.log('the resutl',result)
  //               return result
  //             })
  //         }else{
  //           return fillthis
  //         };
  //       }
  //   };
  //        var result = fillcomments(idea);
  //        console.log('fianl out',result)
  //        setTimeout(function(){res.end(JSON.stringify(result))},2000)
  //      // res.end(JSON.stringify(idea.comments));
  //   })
    // .then(function(result){
    //   console.log(result)
    //   res.end(JSON.stringify(idea.comments));
    // });
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
      comments   : []
    });

    // if a comment is commenting on an idea ...
    if (req.body.parentType === 'idea') {
      findId(req.body.parentId, function (err, idea) {
        if (err) console.log(err);

        idea.comments.push(newComment);

        idea.save(function(err){
          if (err) console.log('idea save error:', err);

          //debugging
          console.log('newComment: ', newComment);

          var reply = { 'text': 'Comment added to idea: ' + idea.shortId + ' / To comment on this comment, use commentId: ' + newComment.commShortId};
          slackPost.postSlack(reply);
        });
      }); // end of findId
    }

    // if a comment is commenting on a comment ... 
    if (req.body.parentType === 'comment') {
      findIdComment(req.body.parentId, function (err, comment) {
        if (err) { console.log('adding comment to comment ERROR:', err); }

        comment.comments.push(newComment);

        comment.save(function (err) {
          if (err) { console.log('comment save ERROR:', err); }
          var reply = { 'text': 'Comment added to comment: ' + comment.parentId + ' / To comment on this comment, use commentId: ' + newComment.commShortId};
          slackPost.postSlack(reply);
        });
      });
    }

    newComment.save(function(err, val){
      if (err) console.log('comment save error:', err);
    }).then(function(result){
      console.log('SERVER CREATECOMMENT:', result);
      res.end(JSON.stringify(result));
    });

  }); // end of setUserId
} // end of createComment

// expose functions
module.exports = {
  getIdeas: getIdeas,
  getComments: getComments,
  createIdea: createIdea,
  createComment: createComment
};
