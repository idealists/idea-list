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
      if(!idea.email){
        idea.type = 'idea';
        return (
          <div className="idea" key={index}>

            <Link to="ideaView" params={{id: idea._id, index: index}}>
              <div className="x-large text-white"> - {idea.title} </div>
            </Link>

              <div className="text-primary">
                <img src={idea.img}/>
                &nbsp;&nbsp; created by: {idea.sUserName}
              </div>

            <VoteView object={idea} />
          </div>
        );
      } else {
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
      <div className="container">
        <div className="row">

          <div className="col-md-1"></div>

          <div className="col-md-10">
            <ul>{list}</ul>
          </div>

          <div className="col-md-1"></div>

        </div>
      </div>
    );
  }
});



module.exports = IdeaList;
