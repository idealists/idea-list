var React  = require('react');
var Router = require('react-router');
var Link   = Router.Link;
var $      = require('jquery');
var cookie = require('react-cookie');
var authenticated = require('../stores/authStore');

var NavBar = React.createClass({

  handleLogout: function() {
    $.ajax({
      url       : "/logout",
      method    : "GET"
    }).done(function(){
      authenticated.switchStatus();
      cookie.remove('userInfo');
    });
  },

  render : function(){
    return(
      <nav className="navbar navbar-inverse transparent navbar-fixed-top">
        <div className="container-fluid">

          <a href="#">
            <img alt="Brand" src="umbel-ui/assets/nav.png"/>
          </a>

          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="app">IDEA-LIST</Link>
            </li>
            <li>
              <Link to="ideas">CREATE</Link>
            </li>
            <li>
              <Link to="logout" onClick={this.handleLogout}>LOGOUT</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
});

module.exports = NavBar;
