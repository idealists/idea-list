var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var session = require('express-session');
var app = express();

app.use('/', express.static('client'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'ideatool',
  resave: true,
  saveUninitialized: true
}));

require('./auth.js')(app, express);
require('./middleware.js')(app, express);

var server = app.listen(process.env.PORT || 5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Serving at port %s', port);
});
