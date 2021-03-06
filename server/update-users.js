var request       = require('request');
var User          = require('./models/users');
var slackUserList = 'https://slack.com/api/users.list?token='+process.env.SLACK_API_TOKEN;

function updateUsers (req, res, next) {
  request(slackUserList, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var users = JSON.parse(body).members;

      users.map(function (user) {
        User.findOne({ slackId: user.id }, function (err, existingUser) {
          var now = Date.now();

          if (!existingUser) {
            var newUser = new User({
              createdAt : now,
              updatedAt : now,
              slackId   : user.id,
              sUserName : user.name,
              realName  : user.real_name,
              email     : user.profile.email,
              image : {
                24 : user.profile.image_24,
                32 : user.profile.image_32,
                48 : user.profile.image_48,
                72 : user.profile.image_72,
                192: user.profile.image_192
              },
              idea_count : 0
            });

            newUser.save(function (err) {
              if (err) console.log(err);
              console.log('New user "' + user.name + '" saved');
            });

          } else {

            existingUser.updatedAt  = now;
            existingUser.slackId    = user.id;
            existingUser.sUserName  = user.name;
            existingUser.realName   = user.real_name;
            existingUser.email      = user.profile.email;
            existingUser.image[24]  = user.profile.image_24;
            existingUser.image[32]  = user.profile.image_32;
            existingUser.image[48]  = user.profile.image_48;
            existingUser.image[72]  = user.profile.image_72;
            existingUser.image[192] = user.profile.image_192;
            console.log('User "' + user.name + '" info updated');
          }
        });
      });
    }
  });

  return next();
}

module.exports = updateUsers;
