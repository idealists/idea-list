var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var SlackStrategy = require('passport-slack').Strategy;
var User = require('./models/users.js');
var TEAM_ID = 'T04M0RM4V';

passport.use(new SlackStrategy({
    clientID: process.env.SLACK_OAUTH_ID,
    clientSecret: process.env.SLACK_OAUTH_SECRET,
    callbackURL: '/auth/slack/callback',
    scope: 'read,post',
    state: 'xyz',
    team: TEAM_ID
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('profile', profile,'\n done', done);

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

passport.serializeUser(function (user, done){
  done(null, user._id);
});

passport.deserializeUser(function (id, done){
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

var app = express();

app.use('/', express.static('client'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'ideatool',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

require('./middleware.js')(app,express);

var server = app.listen(process.env.PORT || 5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Serving at port %s', port);
});

app.get('/auth/slack',
  passport.authenticate('slack')
);

app.get('/auth/slack/callback',
  passport.authenticate('slack', { failureRedirect: '/login' }),
  function (request, response) {
    response.redirect('/api/user'); // temporarily - for development only
  }
);

app.get('/api/user', function (request, response) {
  response.status(200).json({
    isAuth: request.isAuthenticated(),
    user: request.session
  });
});

