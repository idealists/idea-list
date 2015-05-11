var React = require('react');

var Login = React.createClass({
  render : function() {
    return(
      <div className="text-center vertical-center" id="login">
        <a href="/auth/slack">
          <button className="btn btn-red btn-large center" id="login-btn">
            Login with Slack
          </button>
        </a>
      </div>
    )
  }
});

module.exports = Login;
