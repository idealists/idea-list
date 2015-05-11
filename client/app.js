var React  = require('react');
var Router = require('react-router');
var Home   = require('./components/homeView.jsx');
var ideaView= require('./components/ideaView.jsx')
var Login = require('./components/login.jsx');
var CreateIdeaView = require('./components/createIdeaView.jsx');
var authActions = require('./actions/authActions')
var $          = require('jquery');

var Link = Router.Link;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({

  render : function(){
    return(
      <div>
        <RouteHandler />
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="ideas"  path='/newidea' handler={CreateIdeaView} />
    <Route name="ideaView" path='/ideaView/:idea' handler={ideaView}/>
    <Route name="Home" path='/home' handler={Home} />
    <Route name="login" path='/login' handler={Login} />
    <DefaultRoute handler={Home} />
  </Route>
);

Router.run(routes, function(Handler) {

    $.ajax({
      url:"/api/user",
      dataType:'json',
      methord:"GET"
    }).done(function(value) {
      console.log('got auth')
     if(!value.loggedIn){
        React.render(<Login/>, document.getElementById('main'))
      }else{
        React.render(<Handler/>, document.getElementById('main'))
      }  
    })
});
