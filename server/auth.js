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
    User.findOne({ slackId: profile.id }, function (err, user) {
      if (err) return done(err);

      // Create a new user if none found
      if (!user) {
        user = new User({
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
        // Otherwise update user
        user.accessToken = accessToken;
        user.slackName = profile.displayName;
        user.slack = JSON.stringify(profile._json);
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

function isAuthenticated (request, response, next) {
  if (request.isAuthenticated()) return next();
  response.redirect('/#/login');
}

module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/slack',
    passport.authenticate('slack')
  );

  app.get('/auth/slack/callback',
    passport.authenticate('slack', { failureRedirect: '/login' }),
    function (request, response) {
      response.redirect('/#/home'); // temporary - for development only
    }
  );

  app.get('/api/user', isAuthenticated, function (request, response) {
    response.status(200).json({
      loggedIn: request.isAuthenticated(),
      user: request.session
    });
  });

  app.get('/logout', function (request, response) {
    request.logout();
    response.redirect('/#/login');
  });
};

module.exports.isAuthenticated = isAuthenticated;
