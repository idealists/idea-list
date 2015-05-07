var React  = require('react');
var Router = require('react-router');

var CommentList = React.createClass({
  render : function(){
    var list = this.props.comments.map(function(comment, index){
      return (
        <li key={index} >
          <h5> {comment.body} </h5>
        </li>
      );
    })

    return (
      <ul> {list} </ul>
    );
  }
});

module.exports = CommentList;
