// var Slack = require('./slackInt'); 
// var IFuncs = require('./idea-functions');
var request = require('request');

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
module.exports = { postSlack: postSlack };