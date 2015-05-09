var Comment = require('../models/comments');
var Idea = require('../models/ideas');
var User = require('../models/users');
var Vote = require('../models/votes');
var ideaFunctions = require('../ideas/idea-functions');
var request = require('request');

function slackInt (req, res){
  // TODO: slash command to return a list of all active ideas with their info

  // Parsing request:
  // For ideas: parsed = [ title | text | tags ];
  // For comments: parsed = [ shortId | text ];
  var parsed = req.body.text.split("|").map(function(y){ return y.trim(); });

  User.findOne({ sUserName: req.body.user_name }, function (err, user) {
    if (err) console.log(err);
    req.body.userId = user._id;
  });

  req.body.slackId = req.body.user_id;

  // Directing idea / comment / vote into db
  var reply;
  switch(req.body.command){
    case '/idea':
      //TODO: create hyperlink for unique id
      req.body.shortId = parsed[0].split(" ").join("_")+"_"+req.body.user_name;
      req.body.title = parsed[0];
      req.body.body = parsed[1];
      if (parsed.length === 3) {
        req.body.tags = parsed[2].split(' ');
      }
      reply = { 'text': 'Idea Posted! Idea_id: `' + req.body.shortId + '` | Idea: ' + req.body.body + ' | tags: ' + req.body.tags || '' };
      postSlack(reply);
      ideaFunctions.createIdea(req, res);
      break;
    case '/comment':
      //TODO: create hyperlink for idea id 
      req.body.shortId = parsed[0];
      req.body.body = parsed[1];
      req.body.parentType = 'idea';

      // search in the db for the shortId, if it does not exist, send error msg back to user
      Idea.find({ shortId: req.body.shortId }, function(err, idea){
        if(err) {
          console.log(err);
          reply = 'Idea_id not found. See a list of active ideas with /ideaList .'; 
          res.end(reply);
        }
        req.body.parentId = idea._id;
      });

      ideaFunctions.createComment(req, res);
      reply = 'Comment added to idea: ' + req.body.shortId;
      postSlack(reply);
      break;
    case '/upvote':

      break;
    case '/downvote':

      break;
    default:
      console.log("No dice.");
  }
} // end slackInt

// Post request back to Slack
function postSlack (reply){
  request({ method: 'POST', 
    uri: process.env.SLACK_WEBHOOK, 
    body: JSON.stringify(reply) 
    },
    function (error, response, body) {
      if(error) console.log(error);
    }
  );
} // end postSlack

// expose functions
module.exports = {
  slackInt: slackInt,
  postSlack: postSlack
};