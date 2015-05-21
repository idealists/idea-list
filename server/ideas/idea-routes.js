var ideaFunctions = require('./idea-functions');
var isAuth = require('../auth').isAuthenticated;
var Slack = require('./slackInt');
var Vote = require('./vote-functions').voteOptions;

module.exports = function(ideas){
  ideas.get('/', isAuth, ideaFunctions.getIdeas);
  ideas.post('/', isAuth, ideaFunctions.createIdea);
  ideas.put('/', isAuth, ideaFunctions.updateIdea);

  ideas.get('/comments', isAuth, ideaFunctions.getComments);
  ideas.post('/comments', isAuth, ideaFunctions.createComment);
  ideas.put('/comments', isAuth, ideaFunctions.updateComment);

  ideas.post('/votes', isAuth, Vote);
  
  ideas.post('/api/idea', Slack.slackInt);
};
