var React       = require('react');

var Comment = React.createClass({
  render: function(){
    var comment = this.props.element;
    console.log('comment:', comment);

    return (
      <div className="text-primary">
        <h3> + {comment.body} </h3>
        <div>
          <img src={comment.img}/>
          {comment.sUserName}
        </div>
      </div>
    )
  }
});

module.exports = Comment;
