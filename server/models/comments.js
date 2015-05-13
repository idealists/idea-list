var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Vote = new Schema({
  createdAt : Date,
  voter     : ObjectId,
  value     : Number
});

var Comment = new Schema();
Comment.add({
  createdAt : Date,
  updatedAt : Date,
  parentId  : ObjectId,
  userId    : ObjectId,
  slackId   : String,
  body      : String,
  voters    : [Vote]
  rating    : Number,
  comments  : [Comment],
});

module.exports = mongoose.model('Comment', Comment);
