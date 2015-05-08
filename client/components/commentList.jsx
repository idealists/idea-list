var React  = require('react');
var Comment = require('./comment.jsx');

var CommentList = React.createClass({
  render: function(){
    return <div>
      {this.props.comments.map(function(comment){
        return <Comment key={comment._id} comment={comment} />
      })
    </div>
  }
});

module.exports = CommentList;
