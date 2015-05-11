var React       = require('react');
var CommentList = require('./commentList.jsx');

var Comment = React.createClass({
  render: function(){
    var comment = this.props.comment;
    return (
      <div>
        <p>{comment.userid} says {comment.body}</p>
        <Comments comments={comment.comments} />
      </div>
    )
  }
});

module.exports = Comment;
