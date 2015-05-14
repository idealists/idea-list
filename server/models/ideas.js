var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Vote = new Schema({
  createdAt : Date,
  voter     : String,
});

var Comment = new Schema();
Comment.add({
  createdAt : Date,
  updatedAt : Date,
  parentId  : ObjectId,
  rootId    : ObjectId,
  userId    : ObjectId,
  slackId   : String,
  body      : String,
  voters    : [String],
  upvotes   : [Vote],
  downvotes : [Vote],
  rating    : Number,
  comments  : [Comment]
});

var Idea = new Schema({
  createdAt    : Date,
  updatedAt    : Date,
  shortId      : String,
  userId       : ObjectId,
  slackId      : String,
  sUserName    : String,
  sTeamId      : String,
  sChannelId   : String,
  sChannelName : String,
  sTeamDomain  : String,
  sCommand     : String,
  sText        : String,
  title        : String,
  body         : String,
  tags         : [String],
  active       : Boolean,
  voters       : [String],
  upvotes      : [Vote],
  downvotes    : [Vote],
  rating       : Number,
  comments     : [Comment]
});

module.exports = mongoose.model('Idea', Idea);
