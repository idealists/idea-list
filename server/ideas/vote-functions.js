var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var slackPost = require('./slackPost');

var Vote = new Schema({
  createdAt : Date,
  voter     : ObjectId,
  value      : Number
});

var voteoptions  = function(req,res){
  var voteinfo = req.body;
  var rate;
  
  var rating = function(){
    if(req.body.vote>0){
      rate = 1;
    }
    else if(req.body.vote<0){
      rate =-1;
    }
    else{
      rate =0;
    }
  } ;
  rating();
  
  var querytype;
  
  var type= function(){
    if(voteinfo.type=== "idea"){
      querytype= Idea;
    }else{
      querytype=Comment;
    }
  }
  type();
  querytype.findOne(
    { _id: ObjectId.fromString(voteinfo.parentId)},
    function(err,object){
      var counter = 0;
      var exists = false;
      object.votes.map(function(value,index)){
        if(value.voter===voteinfo.user_id){
          exists = true;
          value.value = rate; 
        }
        counter = counter+value.value;
      }
      if(!exists){
         var now = Date.now();
        newvote = new Vote({
            createdAt : now,
            voter     : voteinfo.user_id,
            value      : rate
        });
      object.votes.push(newvote);
      counter = counter + rate;
      }
      object.rating = counter;
      object.save();
    
  }).exec(function(err, value){
    var finalobj = {votearray:value.votes, rating : value.rating};
    res.end(JSON.stringify(finalobj));
  });
}
module.exports = voteoptions