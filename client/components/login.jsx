var React = require('react');
var cookie = require('react-cookie');

var Login = React.createClass({
  componentDidMount: function(){
    cookie.remove('userInfo');
  },
  render : function() {
    return(
      <div className="text-center vertical-center" id="login">
        <img src="umbel-ui/assets/logo.png"></img>
        <div className="x-huge text-center text-primary"> IdeaList </div>
        <br />
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
