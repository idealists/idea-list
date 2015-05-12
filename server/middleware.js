var bodyParser = require('body-parser');

module.exports = function(app, express){
  var ideas = express.Router();
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use('/ideas', ideas);
  require('./ideas/idea-routes.js')(ideas);
};
