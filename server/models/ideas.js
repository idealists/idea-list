var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

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
  title        : String,
  body         : String,
  tags         : [ObjectId],
  active       : Boolean,
  voters       : [ObjectId],
  upvotes      : [ObjectId],
  downvotes    : [ObjectId],
  comments     : [ObjectId],
  rating       : Number,
});

module.exports = mongoose.model('Idea', Idea);
