var ideaFunctions = require('./idea-functions.js');
var isAuth = require('../auth.js').isAuthenticated;

module.exports = function(app){
  app.get('/', isAuth, ideaFunctions.getIdeas);
  app.post('/create', isAuth, ideaFunctions.createIdea);
  app.post('/comment', isAuth, ideaFunctions.createComment);
  // body...
};
