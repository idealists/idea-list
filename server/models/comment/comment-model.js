var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var ShortId = require('mongoose-shortid');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ideatool');

var commentSchema = new Schema({
  _id: {
        type: ShortId,
        len: 5, 
        base: 64,
        alphabet: undefined,
        retries: 4 
  }
  
})