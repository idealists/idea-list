var passport = require('passport');
var SlackStrategy = require('passport-slack').Strategy;
var User = require('./models/users.js');

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

      if (!user) {
        // User list populates on server start, so don't allow user to authenticate if not in DB
        return done(err);
      } else {
        // Otherwise update user
        user.accessToken = accessToken;
        user.slack = JSON.stringify(profile._json);
        return done(err, user);
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
