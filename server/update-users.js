var request = require('request');
var slackUserList = 'https://slack.com/api/users.list?token='+process.env.SLACK_API_TOKEN;
var User = require('./models/users')

function updateUsers () {
  request(slackUserList, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var users = JSON.parse(body).members;

      users.map(function(user){
        User.findOne({ slackId: user.id }, function (err, existingUser) {
          if (!existingUser) {
            var newUser = new User({
              slackId: user.id,
              slackName: user.name,
              realName: user.real_name,
              email: user.profile.email,
              image: {
                '24': user.profile.image_24,
                '32': user.profile.image_32,
                '48': user.profile.image_48,
                '72': user.profile.image_72,
                '192': user.profile.image_192
              }
            });

            newUser.save(function (err) {
              if (err) console.log(err);
              console.log('New user saved');
            });
          } else {
            existingUser.slackId = user.id;
            existingUser.slackName = user.name;
            existingUser.realName = user.real_name;
            existingUser.email = user.profile.email;
            existingUser.image = {
              '24': user.profile.image_24,
              '32': user.profile.image_32,
              '48': user.profile.image_48,
              '72': user.profile.image_72,
              '192': user.profile.image_192
            };
            console.log('User info updated');
          }
        });
      });
    }
  });
}

module.exports = updateUsers();
