var React = require('react');

var Login = React.createClass({
  render : function() {
    return(
      <a href="/auth/slack"><button>Login with Slack</button></a>
    )
  }
});

module.exports = Login;
