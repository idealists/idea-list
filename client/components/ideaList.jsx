var React    = require('react');
var Router   = require('react-router');
var ideaView = require('./ideaView.jsx');
var VoteView = require('./voteView.jsx');
var moment   = require('moment');

var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;
var Link  = Router.Link;

var IdeaList = React.createClass({
  getInitialState: function (){
    return {
      format: 'MMMM Do YYYY, h:mm:ss a'
    }
  },

  render: function(){
    var list = this.props.ideas.map(function(idea, index){
      if(!idea.email){
        idea.type = 'idea';

        var time = idea.createdAt
        console.log(time);
        var timestamp = moment(time).format(this.state.format);

        return (
          <div className="idea row" key={index}>

            <div className="col-md-1">
              <VoteView object={idea} />
            </div>

            <div className="col-md-11">

              <Link to="ideaView" params={{id: idea._id, index: index}}>
                <div className="xx-large text-white">
                  {idea.title}
                </div>
              </Link>
              <div className="text-primary">
                tags:
                &nbsp;
                {idea.tags.join(', ')}
              </div>
              <div className="text-primary">
                created by:
                &nbsp;
                <img src={idea.img}/>
                &nbsp;
                {idea.sUserName}
                &nbsp;
                @p
                &nbsp;
                {timestamp}
              </div>
            </div>

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
