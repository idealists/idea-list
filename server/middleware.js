var bodyParser  = require('body-parser');
 // var morgan = require('morgan');

module.exports=function(app,express){
  var posts = express.Router();
 // app.use(morgan('dev'));

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use('/posts', posts);


  require('./posts/posts-routes.js')(posts);

}