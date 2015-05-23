var passport = require('passport');
var SlackStrategy = require('passport-slack').Strategy;
var User = require('./models/users.js');
var updateUsers = require('./update-users');

passport.use(new SlackStrategy({
    clientID: process.env.SLACK_OAUTH_ID,
    clientSecret: process.env.SLACK_OAUTH_SECRET,
    callbackURL: '/auth/slack/callback',
    scope: 'read',
    state: 'xyz'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ slackId: profile.id }, function (err, user) {
      if (err) return done(err);

      if (user) {
        return done(null, user);
      } else {
        // User list populates before login, so user should be in DB
        return done(null, false);
      }
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  User.findById(user._id, function (err, user) {
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
    updateUsers,
    passport.authenticate('slack')
  );
  app.get('/auth/slack/callback',
    passport.authenticate('slack', { failureRedirect: '/#/login' }),
    function (request, response) {
      response.redirect('/#/home');
    }
  );

  app.get('/api/user',function (request, response) {
    response.status(200).json({
      loggedIn: request.isAuthenticated(),
      session: request.session.passport
    });
  });

  app.get('/logout', function (request, response) {
    request.logout();
    response.redirect('/#/login');
  });
};

module.exports.isAuthenticated = isAuthenticated;
