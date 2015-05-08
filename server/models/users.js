var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = new Schema({
  accessToken : String,
  createdAt   : Date,
  email       : String,
  ideaCount   : Number,
  image       : {
    24  : String,
    32  : String,
    48  : String,
    72  : String,
    192 : String
  },
  realName    : String,
  slack       : String,
  slackId     : String,
  slackName   : String,
  updatedAt   : Date
});

module.exports = mongoose.model('User', User);
