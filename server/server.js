var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var SlackStrategy = require('passport-slack');

var app = express();

app.use('/', express.static('client'));
app.use(bodyParser.json());
app.get('/',function(req,res){
  res.sendFile('index.html',{root:__dir.name+'/../client'});
});
require('./middleware.js')(app,express);

var server = app.listen(process.env.PORT || 5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Serving at port %s', port);
});

passport.use(new SlackStrategy({
  clientID: process.env.SLACK_OAUTH_ID,
  clientSecret: process.env.SLACK_OAUTH_SECRET
},
function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ SlackId: profile.id }, function (err, user) {
    return done(err, user);
  });
}
));

app.get('/auth/slack',
  passport.authorize('slack')
);

app.get('/auth/slack/callback',
  passport.authorize('slack', { failureRedirect: '/login' }),
  function (request, response) {
    response.redirect('/posts');
  }
);
