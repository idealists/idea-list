var ideaFunctions = require('./idea-functions');
var isAuth = require('../auth').isAuthenticated;

module.exports = function(app){
  app.get('/', isAuth, ideaFunctions.getIdeas);
  app.post('/create', isAuth, ideaFunctions.createIdea);
  app.post('/comment', isAuth, ideaFunctions.createComment);
  app.post('/downvote', isAuth, ideaFunctions.downvote);
  app.post('/upvote', isAuth, ideaFunctions.upvote);
  app.post('/api/idea', ideaFunctions.createIdea);
};
