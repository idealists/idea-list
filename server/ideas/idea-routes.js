var ideaFunctions = require('./idea-functions.js');
var isAuth = require('../auth.js').isAuthenticated;

module.exports = function(app){
  app.get('/', isAuth, ideaFunctions.getIdeas);
  app.post('/api/idea', isAuth, ideaFunctions.createIdea);
  app.post('/comment', isAuth, ideaFunctions.createComment);
};
