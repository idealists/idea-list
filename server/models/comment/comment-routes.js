var commentFunctions = require('./comment-functions.js');
var isAuth = require('../auth.js').isAuthenticated;

module.exports = function(app){
  app.get('/get', isAuth, commentFunctions.getcomments);
  app.post('/create', isAuth, commentFunctions.createcomment);
  app.post('/vote', isAuth, ideaFunctions.createComment);
  // body...
};
