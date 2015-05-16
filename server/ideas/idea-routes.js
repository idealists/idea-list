var ideaFunctions = require('./idea-functions');
var isAuth = require('../auth').isAuthenticated;
var Slack = require('./slackInt');
var Vote = require('./vote-functions');
module.exports = function(ideas){
  ideas.get('/', isAuth, ideaFunctions.getIdeas);
  ideas.get('/comment', isAuth, ideaFunctions.getComments);
  ideas.post('/comment', isAuth, ideaFunctions.createComment);
  ideas.post('/', isAuth, ideaFunctions.createIdea);
  ideas.post('/api/idea', Slack.slackInt);
  ideas.post('/vote',isAuth,Vote);
};
