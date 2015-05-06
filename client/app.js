var React  = require('react');
var Router = require('react-router');
var Home   = require('./components/homeView.jsx');
var NavBar = require('./components/navBar.jsx');
var CreateIdeaView = require('./components/createIdeaView.jsx');

var Link = Router.Link;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  render : function(){
    return(
      <div>
        <NavBar />
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="createIdea" handler={CreateIdeaView} />
    <DefaultRoute handler={Home} />
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.getElementById('main'))
});
