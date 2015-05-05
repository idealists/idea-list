var ideaFunctions = require('./idea-functions.js');

module.exports = function(app){
  app.get('/', ideaFunctions.getIdeas);
  app.post('/create', ideaFunctions.createIdea);
  app.post('/comment', ideaFunctions.createComment);
  // body...
};
