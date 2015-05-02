var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
<<<<<<< HEAD
var SlackStrategy = require('passport-slack').Strategy;
var User = require('./models/users.js');
var TEAM_ID = 'T04M0RM4V';
=======
var SlackStrategy = require('passport-slack');
>>>>>>> More progress on OAUTH

var app = express();

app.use('/', express.static('client'));
app.use(bodyParser.json());

require('./middleware.js')(app,express);

var server = app.listen(process.env.PORT || 5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Serving at port %s', port);
});

passport.use(new SlackStrategy({
    clientID: process.env.SLACK_OAUTH_ID,
    clientSecret: process.env.SLACK_OAUTH_SECRET,
    callbackURL: '/auth/slack/callback',
    scope: 'read,post',
    state: 'xyz',
    team: TEAM_ID
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);

    User.findOne({ slackId: profile.id }, function (err, user) {
      if (err) return done(err);

      if (!user) {
        var user = new User({
          accessToken: accessToken,
          slackId: profile.id,
          slackName: profile.displayName,
          slack: JSON.stringify(profile._json)
        });

        user.save(function (err) {
          if (err) console.log(err);
          return done(null, user);
        });
      } else {
        return done(err, user);
      }
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
