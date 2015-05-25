var request = require('request');

function postSlack (reply) {
  request({
    method : 'POST',
    uri    : process.env.SLACK_WEBHOOK,
    body   : JSON.stringify(reply)
    },

    function (error, response, body) {
      if (error) console.log(error);
    }
  );
}

module.exports = { postSlack: postSlack };
