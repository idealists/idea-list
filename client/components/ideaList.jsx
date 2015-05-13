var React    = require('react');
var Router   = require('react-router');
var ideaView = require('./ideaView.jsx');
var userStore    = require('../stores/userStore')
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;
var Link  = Router.Link;

var IdeaList = React.createClass({
  render: function(){
    var list = this.props.ideas.map(function(idea, index){
      if(!idea.email){
        return (
          <div key={index}>
            <h2><Link to="ideaView" params={{id: idea._id, index: index}}> <p>{idea.title}</p>
              <p> {idea.sUserName} </p>
             </Link></h2>
          </div>
        );
      }else{
        return(
          <div key={index}>
            <h2><Link to="ideaView" params={{id: idea._id, index: index}}> 
              <img src={idea.image['24']}/> {idea.sUserName}
             </Link></h2>
          </div>
        )
      }

    })
    return (
      <ul> {list} </ul>
    );
  }
});



module.exports = IdeaList;
