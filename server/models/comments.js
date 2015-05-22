var mongoose = require('mongoose');
var StatusConstants = require('../ideas/StatusConstants');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Vote = new Schema({
  createdAt : Date,
  voter     : ObjectId,
  value     : Number,
  url       : String
});

var CommentSchema = new Schema();
CommentSchema.add({
  createdAt  : Date,
  updatedAt  : Date,
  parentId   : ObjectId,
  parentType : String,
  commShortId: String,
  ideaId     : ObjectId,
  userId     : ObjectId,
  slackId    : String,
  sUserName  : String,
  img        : String,
  body       : String,
  voters     : [Vote],
  status     : String,
  rating     : Number,
  comments   : [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

var Comment = mongoose.model('Comment', CommentSchema);

Comment.fromRequest = function (req) {
  var now = Date.now();

  return new Comment({
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
    status     : StatusConstants.OPEN
  });
}

module.exports = Comment;
