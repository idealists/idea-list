var React = require('react');
var Router = require('react-router')
var ideaView= require('./ideaView.jsx')

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var IdeaList = React.createClass({
  render : function(){
    var list = this.props.ideas.map(function(idea, index){
      var title = idea.title|| 'Untitled'
      return (
        <div  key ={index}>
          <h4><Link to="ideaView" params={{data: idea._id}}>{title}</Link></h4>
        </div>
      );

    })
    return (
      <ul> {list} </ul>
    );
  }
});



module.exports = IdeaList;
