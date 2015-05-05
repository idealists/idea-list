var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var SlackStrategy = require('passport-slack').Strategy;
var User = require('./models/users.js');

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
    team: 'T04M0RM4V'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(arguments);
    
    User.findOne({ slackId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

// SlackStrategy.prototype.userProfile = function (accessToken, done) {
//   this.get(this.profileUrl, accessToken, function (err, body, res) {
//     if (err) {
//       return done(err);
//     } else {
//       try {
//         var json = JSON.parse(body);

//         if (json.ok) {
//           var profile = {
//             provider: 'Slack'
//           };
//           profile.id = json.user.id;
//           profile.slackUserName = json.user.name;
//           profile.realName = json.user.profile.real_name;
//           profile.email = json.user.profile.email;
//           profile.image24 = json.user.profile.image_24;
//           profile.image32 = json.user.profile.image_32;
//           profile.image48 = json.user.profile.image_48;
//           profile.image72 = json.user.profile.image_72;
//           profile.image192 = json.user.profile.image_192;

//           profile._raw = body;
//           profile._json = json;

//           done(null, profile);
//         } else {
//           done(json.error ? json.error : body);
//         }
//       } catch(e) {
//         done(e);
//       }
//     }
//   });
// };

app.get('/auth/slack',
  passport.authorize('slack')
);

app.get('/auth/slack/callback',
  passport.authorize('slack', { failureRedirect: '/login' }),
  function (request, response) {
    response.redirect('/posts');
  }
);
