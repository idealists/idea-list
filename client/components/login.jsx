var React = require('react');
var cookie = require('react-cookie');
var authenticated = require('../stores/authStore');

var Login = React.createClass({
  componentDidMount: function(){
    cookie.remove('userInfo');
  },
  render : function() {
    return(
      <div className="text-center vertical-center" id="login">
        <img src="umbel-ui/assets/logo.png"></img>
        <br />
        <br />
        <div className="x2-huge text-center text-white">

          <span className="xxx-huge"> I </span>
            D E A
          <span className="xxx-huge"> L </span>
            I S T

        </div>
        <br />
        <br />
        <a href="https://slack-idealist.herokuapp.com/">
          <button className="btn btn-red btn-large center" id="signup-btn">
            Join IdeaList
          </button>
        </a>
        <br />
        <br />
        <a href="/auth/slack">
          <button className="btn btn-red btn-xlarge center" id="login-btn">
            Login
          </button>
        </a>
      </div>
    )
  }
});

module.exports = Login;
