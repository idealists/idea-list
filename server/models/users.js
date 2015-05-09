var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = new Schema({
  accessToken : String,
  createdAt   : Date,
  updatedAt   : Date,
  slack       : String,
  slackId     : String,
  slackName   : String,
  realName    : String,
  email       : String,
  image       : {
    24  : String,
    32  : String,
    48  : String,
    72  : String,
    192 : String
  },
  ideaCount   : Number
});

module.exports = mongoose.model('User', User);
