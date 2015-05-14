var React    = require('react');
var Router   = require('react-router');
var Comment = require('./comment.jsx');

var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;
var Link  = Router.Link;

var CommentList = React.createClass({
  render: function(){
    var list = this.props.comments.map(function(comment, index){
      return (
        <div key={index}>
          <div className="text-primary"> - {comment.body} </div>
        </div>
      );
    });

    return (
      <div>
        <ul> {list} </ul>
      </div>
    );
  }
});

module.exports = CommentList;

// {this.props.comments.map(function(comment){
//   return <Comment key={comment._id} comment={comment} />
// })}
