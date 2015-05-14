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
      if(!idea.email){
        return (
          <div key={index}>
            <Link to="ideaView" params={{id: idea._id, index: index}}> <h2>{idea.title}</h2>
              {idea.sUserName}
             </Link>
          </div>
        );
      }else{
        return(
          <div key={index}>
            <Link to="ideaView" params={{id: idea._id, index: index}}> 
              <img src={idea.image['24']}/> {idea.sUserName}
             </Link>
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
