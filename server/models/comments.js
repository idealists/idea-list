var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Vote = new Schema({
  createdAt : Date,
  voter     : ObjectId,
  value     : Number,
  url       : String
});

var Comment = new Schema();
Comment.add({
  createdAt  : Date,
  updatedAt  : Date,
  parentId   : ObjectId,
  parentType : String,
  commShortId: String,
  //ideaId   : ObjectId, <-- same as parentId?
  userId     : ObjectId,
  slackId    : String,
  sUserName  : String,
  img        : String,
  body       : String,
  voters     : [Vote],
  status     : String,
  rating     : Number,
  comments   : [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('Comment', Comment);
