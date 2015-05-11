var React  = require('react');
var Comment = require('./comment.jsx');

var CommentList = React.createClass({
  render: function(){
    return(
      <div className="text-primary">
        hello world // commentList
      </div>
    )
  }
});

module.exports = CommentList;

// {this.props.comments.map(function(comment){
//   return <Comment key={comment._id} comment={comment} />
// })}
