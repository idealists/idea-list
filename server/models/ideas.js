var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Comment = require('./comments');
var Vote = require('./votes');

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
  upvotes      : [Vote],
  downvotes    : [Vote],
  rating       : Number,
  comments     : [Comment]
});

module.exports = mongoose.model('Idea', Idea);
