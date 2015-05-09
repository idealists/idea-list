var React  = require('react');
var Router = require('react-router');
var Home   = require('./components/homeView.jsx');
var NavBar = require('./components/navBar.jsx');
var ideaView= require('./components/ideaView.jsx')
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
    <Route name="ideas"  path='/newidea/:test'handler={CreateIdeaView} />
    <Route name="ideaView" path='/ideaView/:data'handler={ideaView}/>
    <Route name='Home' path='/home' handler={Home}/>
    <DefaultRoute handler={Home} />
  </Route>
);

Router.run(routes, function(Handler, state) {
  var list = state.list
  React.render(<Handler list={list}/>, document.getElementById('main'))
});
