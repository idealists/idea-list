var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var Vote = require('../models/votes');
var IFuncs = require('./idea-functions');
var VoteFunctions = require('./vote-functions');
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
        callback(null, user._id);
      }
    });
  }
  function setParentId (pi, callback) {
    Idea.find({ shortId: pi }, function(err, idea){
      if(err) {
        callback(err, null);
      } else {
        callback(null, idea[0]._id);
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
        if (err) { 
          console.log(err);
          reply = 'Idea not found. See a list of active ideas with /ideaList'; 
          res.end(reply);
        } else {
          req.body.parentId = pId;
          IFuncs.createComment(req, res);
        }
      });
      break;
    case '/upvote':

      req.body.shortId = parsed[0];

      // if comment is on an idea, search for the correct parentId, etc. in the Idea collection
      // otherwise search in the Comment collection for the correct parentId, etc.
      //if( req.body.shortId === 'idea' ){
      setParentId (req.body.shortId, function(err, pId) {
        if (err) console.log(err);
        req.body.parentId = pId;

        setUserId(req.body.user_name, function(err, uId) {
        console.log('INSIDE UPVOTE, req.body: ', req.body);

          console.log('uId:', uId);

          var voteInfo = {
            voterId    : '',
            parentId   : req.body.shortId,
            user_name  : req.body.user_name,
            voteType   : '',
            voteRating : 1,
            userImage  : ''
          }

          // VoteFunctions.voteOptions(voteInfo);
        });
      });

      // } else if ( req.body.shortId === 'comment' ) {

      // }
      /*
        Needed to save votes: 
            -parentId of idea or comment
            -vote
            var voteInfo = { 
                voterId    : this.state.userInfo.userId, -- search user col by user_name
                parentId   : votedata._id, -- find in db from shortId
                user_name  : req.body.user_name, *
                voteType   : votedata.type, -- get from the shortId
                voteRating : rating, -- 1
                userImage  : this.state.userInfo.image['24'] -- search user col by user_name
            }
      */
      break;
    case '/downvote':
      // call downvote function
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
      res.send("Invalid slash command entered: " + req.body.command);
  }
} // end slackInt


// expose functions
module.exports = { slackInt: slackInt };
