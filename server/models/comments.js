var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Vote = require('./votes');

// Comment schema implemented thusly to enable nested comments
var Comment = new Schema();
Comment.add({
  createdAt : Date,
  updatedAt : Date,
  parentId  : ObjectId,
  userId    : ObjectId,
  slackId   : String,
  body      : String,
  voters    : [ObjectId],
  upvotes   : [Vote],
  downvotes : [Vote],
  rating    : Number,
  comments  : [Comment],
});

module.exports = mongoose.model('Comment', Comment);
