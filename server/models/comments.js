var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Comment schema implemented thusly to enable recursive comments
var Comment = new Schema();
Comment.add({
  createdAt : Date,
  updatedAt : Date,
  parentId  : ObjectId,
  userId    : ObjectId,
  slackId   : String,
  title     : String,
  body      : String,
  upvotes   : Number,
  downvotes : Number,
  comments  : [Comment]
});

module.exports = mongoose.model('Comment', Comment);
