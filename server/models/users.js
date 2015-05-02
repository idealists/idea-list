var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSchema  = new Schema({
  accessToken: String,
  slack: String,
  slackId: String,
  slackName: String
});

module.exports = mongoose.model('User', userSchema);
