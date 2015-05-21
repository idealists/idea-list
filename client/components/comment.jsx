var React       = require('react');

var Comment = React.createClass({
  render: function(){

    return (
      <div>
        <div className="text-primary"> {comment.body} </div>
        <div>
          <img src={comment.img} />
          <span className="text-white">
            {comment.sUserName}
          </span>
        </div>
      </div>
    )
  }
});

module.exports = Comment;
