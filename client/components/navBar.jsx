var React  = require('react');
var Router = require('react-router');
var Link   = Router.Link;
var $      = require('jquery');
var cookie = require('react-cookie');
var authenticated = require('../stores/authStore');
var ideaActions    = require('../actions/ideaActions')

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
  changestore:function(){
    ideaActions.getIdeas();
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
              <Link to="app" onClick = {this.changestore}>
                IDEA LIST &nbsp;
                <span className="glyphicon glyphicon-home"></span>
              </Link>
            </li>
            <li>
              <Link to="ideas">
                CREATE &nbsp;
                <span className="glyphicon glyphicon-pencil"></span>
              </Link>
            </li>
            <li>
              <Link to="logout" onClick={this.handleLogout}>
                LOGOUT &nbsp;
                <span className="glyphicon glyphicon-log-out"></span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
});

module.exports = NavBar;

// <li>
//   <Link to="app" onClick = {this.changestore}>
//     ARCHIVES &nbsp;
//     <span className="glyphicon glyphicon-time"></span>
//   </Link>
// </li>
