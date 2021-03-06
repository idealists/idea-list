var Comment   = require('../models/comments');
var Idea      = require('../models/ideas');
var User      = require('../models/users');
var Vote      = require('../models/votes');
var IFuncs    = require('./idea-functions');
var VoteFuncs = require('./vote-functions');
var Status    = require('./statusConstants');
var slackPost = require('./slackPost');

function findUser (un, callback) {
  User.findOne({ sUserName: un }, function (err, user) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, user);
    }
  });
}

function getIdeaId (pi, callback) {
  Idea.find({ shortId: pi }, function(err, idea){
    if (err) {
      callback(err, null);
    } else {
      callback(null, idea);
    }
  });
}

function getCommId (pi, callback) {
  Comment.find({ commShortId: pi }, function (err, comment) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, comment);
    }
  });
}

function slackInt (req, res){

  /* Error handling for incorrect format: */
  var error     = false;
  var text      = req.body.text;
  var textSplit = req.body.text.split("|")[1];
  var reply;

  if (req.body.command === '/idea' || req.body.command === '/comment'){
    if (text.indexOf('|') === -1){
      error = true;

/* jshint ignore:start */
      reply =
'Please use the correct format for your request: \n\n \
For ideas: /idea [ title | text | tags ] \n\n \
For comments: /comment [ Id | text ] \n\n \
For voting: /upvote OR /downvote [ Id ] \n\n \
*To see a list of all open ideas, use the command:  /allideas';
/* jshint ignore:end */

      res.end(reply);
    } else if (textSplit.trim() === ''){
      error = true;
      reply = 'Please enter text for your idea or comment.';
      res.end(reply);
    }
  } else if (req.body.command === '/upvote' || req.body.command === '/downvote'){
    if (text === ''){
      error = true;

/* jshint ignore:start */
reply =
'Please use the correct format for your request: \n\n \
For ideas: /idea [ title | text | tags ] \n\n \
For comments: /comment [ Id | text ] \n\n \
For voting: /upvote OR /downvote [ Id ] \n\n \
*To see a list of all open ideas, use the command:  /allideas';
/* jshint ignore:end */

    res.end(reply);
    }
  }

  // Parsing incoming request data
  // For ideas    : req.body.text = [ title | text | tags ];
  // For comments : req.body.text = [ shortId | text ];
  // For votes    : req.body.text = [ shortId ];
  var parsed = req.body.text.split("|").map(function(y){ return y.trim(); });

  // Set slackId to the user_id
  req.body.slackId = req.body.user_id;

  if (!error) {
    switch (req.body.command) {
      case '/idea':
        req.body.shortId = String(parsed[0].split(" ").slice(0,3).join("_")+"_"+req.body.user_name).toLowerCase();
        req.body.title   = parsed[0];
        req.body.body    = parsed[1];
        if (parsed.length === 3) {
          req.body.tags = parsed[2].split(' ');
        }
        req.body.slackReq = true;
        findUser(req.body.user_name, function(err, uId) {
          if (err) console.log(err);
          req.body.userId = uId._id;
          req.body.img    = uId.image['24'];
          getIdeaId(req.body.shortId, function(err, pId) {
            if (err) console.log('In /idea, err: ', err);
            if (pId.length === 0) {
              IFuncs.createIdea(req, res);
            } else {
              var reply = 'Please select a different title for your idea request. This one has already been used: ' + '\n\n shortId: '+ req.body.shortId + '\n title: ' + req.body.title + '\n body: ' + req.body.body + '\n tags: ' + req.body.tags;
              res.end(reply);
            }
          });
        });
        break;
      case '/comment':
        // TODO: create hyperlink for comment id
        req.body.shortId    = parsed[0].toLowerCase();
        req.body.body       = parsed[1];
        req.body.sUserName  = req.body.user_name;

        var ideaOrComm      = req.body.shortId.split("_");
        ideaOrComm          = ideaOrComm[ideaOrComm.length-1].slice(0,4);

        findUser(req.body.sUserName, function(err, uId){
          req.body.img      = uId.image['24'];
          req.body.slackReq = true;

          if (ideaOrComm === "comm") {
            req.body.parentType = "comment";

            // search in the db for the shortId, if it does not exist, send error msg back to user
            getCommId (req.body.shortId, function(err, pId) {
              if (err || pId[0] === undefined) {
                console.log('ShortId is not found.');
                reply = 'Comment: ' + req.body.shortId + ' not found.';
                res.end(reply);
              } else {
                // creating a unique comment id based on the length of the comments array
                req.body.parentId = pId[0]._id;
                req.body.ideaId = pId[0].parentId;
                IFuncs.createComment(req, res);
              }
            });
          } else {
            req.body.parentType = 'idea';

            // search in the db for the shortId, if it does not exist, send error msg back to user
            getIdeaId (req.body.shortId, function(err, pId) {
              if (err || pId[0] === undefined) {
                console.log('ShortId is not found.');
                reply = 'Idea not found. To see a list of active ideas, use /allideas ';
                res.end(reply);
              } else {
                //debugging
                console.log('req.body.commShortId: ', req.body.commShortId);

                req.body.parentId = pId[0]._id;
                IFuncs.createComment(req, res);
              }
            });
          }
        });
        break;
      case '/upvote':

        req.body.shortId = parsed[0].toLowerCase();

        // determine whether the vote is for a comment or an idea via the shortId
        var ideaOrCom   = req.body.shortId.split("_");
        if (ideaOrCom[ideaOrCom.length-1].slice(0,4) === "comm") {
          req.body.voteType = "comment";
        } else {
          req.body.voteType = "idea";
        }

        // if comment is on an idea, search for the correct parentId, etc. in the Idea collection
        // otherwise search in the Comment collection for the correct parentId, etc.
        if (req.body.voteType === "idea") {
          getIdeaId (req.body.shortId, function(err, pId) {
            if (err || pId[0] === undefined) {
              console.log('ShortId is not found. Error: ' + err);
              reply = 'ID: ' + req.body.shortId + ' not found. To see a list of active ideas, use  /allideas ';
              res.end(reply);
            } else {
              req.body.parentId = pId[0]._id;
              req.body.parentTitle = pId[0].title;
              findUser(req.body.user_name, function(err, uId) {

                var voteInfo = {
                  voterId    : uId._id,
                  parentId   : req.body.parentId,
                  parentTitle: req.body.parentTitle,
                  shortId    : req.body.shortId,
                  user_name  : req.body.user_name,
                  voteType   : req.body.voteType,
                  rate       : 1,
                  userImage  : uId.image['24'],
                  slackReq   : true,
                  slackCommand  : '/upvote'
                };

                console.log('voteInfo:', voteInfo);
                VoteFuncs.voteOptions(voteInfo, res);
              });
            }
          });
        } else if (req.body.voteType === "comment") {
          getCommId (req.body.shortId, function(err, pId) {
            if (err || pId[0] === undefined) {
              console.log('ShortId is not found.');
              reply = 'ID: ' + req.body.shortId + ' not found. To see a list of active ideas, use  /allideas ';
              res.end(reply);
            } else {
              req.body.parentId = pId[0]._id;
              req.body.parentTitle = pId[0].title;
              findUser(req.body.user_name, function(err, uId) {

                var voteInfo = {
                  voterId       : uId._id,
                  parentId      : req.body.parentId,
                  parentTitle   : req.body.parentTitle,
                  shortId       : req.body.shortId,
                  user_name     : req.body.user_name,
                  voteType      : req.body.voteType,
                  rate          : 1,
                  userImage     : uId.image['24'],
                  slackReq      : true,
                  slackCommand  : '/upvote'
                };

                console.log('voteInfo:', voteInfo);
                VoteFuncs.voteOptions(voteInfo, res);
              });
            }
          });
        }
        break;
      case '/downvote':

        req.body.shortId = parsed[0].toLowerCase();

        // determine whether the vote is for a comment or an idea via the shortId
        var ideaOrCo   = req.body.shortId.split("_");
        if (ideaOrCo[ideaOrCo.length-1].slice(0,4) === "comm") {
          req.body.voteType = "comment";
        } else {
          req.body.voteType = "idea";
        }

        // if comment is on an idea, search for the correct parentId, etc. in the Idea collection
        // otherwise search in the Comment collection for the correct parentId, etc.
        if (req.body.voteType === "idea") {
          getIdeaId (req.body.shortId, function(err, pId) {
            if (pId[0] === undefined) {
              console.log('ShortId is not found.');
              reply = 'ID: ' + req.body.shortId + ' not found. To see a list of active ideas, use  /allideas ';
              res.end(reply);
            } else {
              req.body.parentId = pId[0]._id;
              req.body.parentTitle = pId[0].title;
              findUser(req.body.user_name, function(err, uId) {

                var voteInfo = {
                  voterId       : uId._id,
                  parentId      : req.body.parentId,
                  parentTitle   : req.body.parentTitle,
                  shortId       : req.body.shortId,
                  user_name     : req.body.user_name,
                  voteType      : req.body.voteType,
                  rate          : -1,
                  userImage     : uId.image['24'],
                  slackReq      : true,
                  slackCommand  : '/downvote'
                };

                console.log('voteInfo:', voteInfo);
                VoteFuncs.voteOptions(voteInfo, res);
              });
            }
          });
        } else if (req.body.voteType === "comment") {
          getCommId (req.body.shortId, function(err, pId) {
            if (pId[0] === undefined) {
              console.log('ShortId is not found.');
              reply = 'ID: ' + req.body.shortId + ' not found. To see a list of active ideas, use  /allideas ';
              res.end(reply);
            } else {
              req.body.parentId = pId[0]._id;
              req.body.parentTitle = pId[0].title;
              findUser(req.body.user_name, function(err, uId) {

                var voteInfo = {
                  voterId       : uId._id,
                  parentId      : req.body.parentId,
                  parentTitle   : req.body.parentTitle,
                  shortId       : req.body.shortId,
                  user_name     : req.body.user_name,
                  voteType      : req.body.voteType,
                  rate          : -1,
                  userImage     : uId.image['24'],
                  slackReq      : true,
                  slackCommand  : '/downvote'
                };

                console.log('voteInfo:', voteInfo);
                VoteFuncs.voteOptions(voteInfo, res);
              });
            }
          });
        }
        break;
      case '/allideas':
        var selectFields = 'createdAt updatedAt shortId userId slackId sUserName title body tags active voters upvotes downvotes rating';

        var rawIdeas = Idea.find()
                        .select(selectFields)
                        .where({ status: Status.OPEN })
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
  }
} // end slackInt


// expose functions
module.exports = { slackInt: slackInt };
