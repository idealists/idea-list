var React    = require('react');
var Router   = require('react-router');
var Comment  = require('./comment.jsx');

var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;
var Link  = Router.Link;


var CommentList = React.createClass({
  render: function(){
    return (
      <div>
        {
          this.props.comments.map(function(comment){
            return (<Comment key={comment._id} element={comment} />)
          })
        }
      </div>
    )
  }
});

module.exports = CommentList;

// {this.props.comments.map(function(comment){
//   return <Comment key={comment._id} comment={comment} />
// })}
