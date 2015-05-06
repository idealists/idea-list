var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ideatool');

var userSchema  = new Schema({
  accessToken: String,
  slack: String,
  slackId: String,
  slackName: String,
  realName: String,
  email: String,
  image: {
    '24': String,
    '32': String,
    '48': String,
    '72': String,
    '192': String
  }
});

module.exports = mongoose.model('User', userSchema);
