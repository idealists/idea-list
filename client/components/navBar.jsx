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
      <nav className="navbar navbar-inverse">
        <div className="container">
          <ul className="nav navbar-nav">
            <li>
              <Link to="app">Home</Link>
            </li>
            <li>
              <Link to="ideas">Create</Link>
            </li>
            <li>
              <Link to="logout" onClick={this.handleLogout}>Logout</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
});

module.exports = NavBar;
