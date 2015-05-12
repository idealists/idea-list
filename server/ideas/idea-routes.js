var ideaFunctions = require('./idea-functions');
var isAuth = require('../auth').isAuthenticated;
var Slack = require('./slackInt');

module.exports = function(ideas){
  ideas.get('/', isAuth, ideaFunctions.getIdeas);
  ideas.post('/create', isAuth, ideaFunctions.createIdea);
  ideas.post('/comment', isAuth, ideaFunctions.createComment);
  ideas.post('/api/idea', Slack.slackInt);
};
