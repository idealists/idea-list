var React    = require('react');
var Router   = require('react-router');
var ideaView = require('./ideaView.jsx');

var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;
var Link  = Router.Link;

var IdeaList = React.createClass({
  render: function(){
    var list = this.props.ideas.map(function(idea, index){
      return (
        <div key={index}>
          <h2><Link to="ideaView"> + {idea.title} </Link></h2>
        </div>
      );

    })
    return (
      <ul> {list} </ul>
    );
  }
});



module.exports = IdeaList;
