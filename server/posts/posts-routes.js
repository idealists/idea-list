var postfunctions = require('./postsfunctions.js');

module.exports=function (app) {

  app.get('/',postfunctions.getPosts)
  app.post('/create',postfunctions.createPost)
  app.post('/comment', postfunctions.createComment)
  // body...
}