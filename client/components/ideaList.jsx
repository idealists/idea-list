var React    = require('react');
var Router   = require('react-router');
var ideaView = require('./ideaView.jsx');
var VoteView = require('./voteView.jsx');

var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;
var Link  = Router.Link;

var IdeaList = React.createClass({
  render: function(){
    var list = this.props.ideas.map(function(idea, index){
      // ideas do not have email addresses, but users do
      // this renders the idea or the user profile with image
      if(!idea.email){
        idea.type = 'idea';
        return (
          <div key={index}>
            <Link to="ideaView" params={{id: idea._id, index: index}}>
              <h3> + {idea.title} </h3>
              <div>
                <img src={idea.img}/>
                {idea.sUserName}
              </div>
             </Link>
            <VoteView object={idea} />
          </div>
        );
      }else{
        return(
          <div key={index}>
            <Link to="ideaView" params={{id: idea._id, index: index}}>
              <img src={idea.image['24']}/>
              {idea.sUserName}
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
