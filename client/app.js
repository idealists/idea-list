var React          = require('react');
var Router         = require('react-router');
var cookie         = require('react-cookie');
var authenticated  = require('./stores/authStore');
var $              = require('jquery');
var Login          = require('./components/login.jsx');
var Home           = require('./components/homeView.jsx');
var ideaView       = require('./components/ideaView.jsx')
var Errorpage = require('./components/404page.jsx');
var CreateIdeaView = require('./components/createIdeaView.jsx');
var NotFoundRoute = Router.NotFoundRoute;

var Link         = Router.Link;
var Route        = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  getInitialState : function(){
    return { userInfo: cookie.load('userInfo') };
  },

  render : function(){
    return (
      <div>
        <RouteHandler />
      </div>
    );
  }
});

var routes = (

  <Route name="app"        path="/"             handler={App}>
    <Route name="ideas"    path="/newidea"      handler={CreateIdeaView} />
    <Route name="ideaView" path="/ideaView/:id" handler={ideaView}/>
    <Route name="Home"     path="/home"         handler={Home} />
    <Route name="login"    path="/login"        handler={Login} />
    <Route name="logout"   path="/logout"       handler={Login} />
    <DefaultRoute handler={Home} />
     <NotFoundRoute handler={Errorpage} />
  </Route>
);

Router.run(routes, function (Handler) {
  if(!(authenticated.loginStatus())){

    $.ajax({
      url      : '/api/user',
      dataType : 'json',
      method   : 'GET'
    })
    .done(function (value) {
      if (!value.loggedIn) {
        cookie.remove('userInfo');
        React.render(<Login/>, document.getElementById('main'));
      } else {
        authenticated.switchStatus();
        delete value.session.user.accessToken;
        cookie.save('userInfo', value.session.user);
        React.render(<Handler/>, document.getElementById('main'));
      }
    });
  } else {
      React.render(<Handler/>, document.getElementById('main'));
  }
});
