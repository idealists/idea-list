var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ideatool');

var userSchema  = new Schema({
  accessToken: String,
  slack: String,
  slackId: String,
  slackName: String
});

module.exports = mongoose.model('User', userSchema);
