var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var Vote = require('../models/votes');
var IFuncs = require('./idea-functions');
var VoteFuncs = require('./vote-functions');
//var slackPost = require('./slackPost');
//var request = require('request');

function slackInt (req, res){

  // Parsing incoming request data
  // For ideas    : req.body.text = [ title | text | tags ];
  // For comments : req.body.text = [ shortId | text ];
  // For votes    : req.body.text = [ shortId ];
  var parsed = req.body.text.split("|").map(function(y){ return y.trim(); });
  
  // helper functions for querying data with async callbacks for userId and parentId
  function setUserId (un, callback){ 
    User.findOne({ sUserName: un }, function (err, user) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, user);
      }
    });
  }
  function setParentId (pi, callback) {
    Idea.find({ shortId: pi }, function(err, idea){
      if(err) {
        callback(err, null);
      } else {
        callback(null, idea);
      }
    });
  }

  // Set slackId to the user_id
  req.body.slackId = req.body.user_id;

  // Parsing data and directing idea / comment / vote to db insert functions
  switch(req.body.command){
    case '/idea':
      // TODO: create hyperlink for unique id
      req.body.shortId = parsed[0].split(" ").join("_")+"_"+req.body.user_name;
      req.body.title = parsed[0];
      req.body.body = parsed[1];
      if (parsed.length === 3) {
        req.body.tags = parsed[2].split(' ');
      }
      setUserId(req.body.user_name, function(err, uId) {
        if (err) console.log(err);
        req.body.userId = uId._id;    
        IFuncs.createIdea(req, res);
      });
      break;
    case '/comment':
      // TODO: create hyperlink for comment id 
      // *shortId* for comments will be different than shortIds for ideas

      req.body.shortId = parsed[0];
      req.body.body = parsed[1];
      req.body.parentType = 'idea';
      req.body.sUserName = req.body.user_name;

      // search in the db for the shortId, if it does not exist, send error msg back to user
      setParentId (req.body.shortId, function(err, pId) {
        console.log('INSIDE /comment: req.body : ', req.body, ' - pId: ', pId);
        if (pId[0] === undefined) { 
          console.log('ShortId is not found.');
          reply = 'Idea not found. See a list of active ideas with /ideaList'; 
          res.end(reply);
        } else {
          req.body.parentId = pId[0]._id;
          IFuncs.createComment(req, res);
        }
      });
      break;
    case '/upvote':

      req.body.shortId = parsed[0];

      // if comment is on an idea, search for the correct parentId, etc. in the Idea collection
      // otherwise search in the Comment collection for the correct parentId, etc.
      //if( req.body.shortId === 'idea' ){
      req.body.voteType = "idea";
      setParentId (req.body.shortId, function(err, pId) {
        if (pId[0] === undefined) { 
          console.log('ShortId is not found.');
          reply = 'Id not found. See a list of active ideas with /ideaList'; 
          res.end(reply);
        } else {
          req.body.parentId = pId[0]._id;
          req.body.parentTitle = pId[0].title;
          setUserId(req.body.user_name, function(err, uId) {

            var voteInfo = {
              voterId    : uId._id,
              parentId   : req.body.parentId,
              parentTitle: req.body.parentTitle,
              shortId    : req.body.shortId,
              user_name  : req.body.user_name,
              voteType   : req.body.voteType,
              voteRating : 1,
              userImage  : uId.image['24'],
              slackReq   : true
            };

            console.log('voteInfo:', voteInfo);
            VoteFuncs(voteInfo);
          });
        }
      });
      break;
    case '/downvote':

      req.body.shortId = parsed[0];

      // if comment is on an idea, search for the correct parentId, etc. in the Idea collection
      // otherwise search in the Comment collection for the correct parentId, etc.
      //if( req.body.shortId === 'idea' ){
      req.body.voteType = "idea";
      setParentId (req.body.shortId, function(err, pId) {
         console.log('INSIDE /downvote: req.body : ', req.body, ' - pId: ', pId);
        if (pId[0] === undefined) { 
          console.log('ShortId is not found.');
          reply = 'Id not found. See a list of active ideas with /ideaList'; 
          res.end(reply);

        } else {
          req.body.parentId = pId[0]._id;
          req.body.parentTitle = pId[0].title;
          setUserId(req.body.user_name, function(err, uId) {

            var voteInfo = {
              voterId    : uId._id,
              parentId   : req.body.parentId,
              parentTitle: req.body.parentTitle,
              shortId    : req.body.shortId,
              user_name  : req.body.user_name,
              voteType   : req.body.voteType,
              voteRating : -1,
              userImage  : uId.image['24'],
              slackReq   : true
            };

            console.log('voteInfo:', voteInfo);
            VoteFuncs(voteInfo);
          });
        }
      });
      break;
    case '/allideas':
      var selectFields = 'createdAt updatedAt shortId userId slackId sUserName title body tags active voters upvotes downvotes rating';
      
      var rawIdeas = Idea.find()
                      .select(selectFields)
                      .where({ active: true })
                      .sort('-updatedAt')
                      .limit(10);
      rawIdeas.exec().then(function(value){
        console.log('value: ', value);
        var ideas = [];
        for (var i = 0; i < value.length; i++){
          var con = String(new Date(value[i].createdAt));
          var date = con.split(" ").slice(1,-3).join(" ");
          ideas.push('ID: ' + value[i].shortId + ' | TITLE: ' + value[i].title + ' | CREATED: ' + date + '\n');
        }
        res.send(ideas.join("\n"));
        res.end();
      });
      break;
    default:
      res.end();
  }
} // end slackInt


// expose functions
module.exports = { slackInt: slackInt };
