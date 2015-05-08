var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Vote = new Schema({
  createdAt : Date,
  voter     : String,
});

module.exports = mongoose.model('Vote', Vote);
