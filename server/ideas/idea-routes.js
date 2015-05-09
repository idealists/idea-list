var ideaFunctions = require('./idea-functions');
var isAuth = require('../auth').isAuthenticated;

module.exports = function(ideas){
  ideas.get('/', isAuth, ideaFunctions.getIdeas);
  ideas.post('/create', isAuth, ideaFunctions.createIdea);
  ideas.post('/comment', isAuth, ideaFunctions.createComment);
  ideas.post('/api/idea', ideaFunctions.slackInt);
  ideas.post('/api/comment', ideaFunctions.slackInt);
  ideas.post('/api/downvote', ideaFunctions.slackInt);
  ideas.post('/api/upvote', ideaFunctions.slackInt);
};
