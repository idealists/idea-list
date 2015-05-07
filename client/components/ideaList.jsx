var React = require('react');
var Router = require('react-router')
var ideaView = require("./ideaView.jsx")

var Link = Router.Link;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;


var IdeaList = React.createClass({
  render : function(){
    var list = this.props.ideas.map(function(idea, index, collection){
      return (
        <li key={index} >
          <h3> <Link to="ideaView">Title: {idea.title}</Link> </h3>
          <h5> Body:  {idea.body}  </h5>
        </li>
      );

    })
    return (
      <ul> {list} </ul>
    );
  }
});
var routes = (
  <Route name='idealist' path="/" handler={IdeaList}>
    <Route name='ideaView' path=":index" handler={ideaView}/>
  </Route>
);

module.exports = IdeaList;
