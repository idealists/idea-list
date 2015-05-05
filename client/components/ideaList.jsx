var React = require('react');

var IdeaList = React.createClass({
  render : function(){
    var list = this.props.ideas.map(function(idea, index){
      console.log('IDEA', idea);
      return (
        <li key={index}>
          <h3> Title: {idea.title} </h3>
          <h5> Body:  {idea.body}  </h5>
        </li>
      );
    }.bind(this));

    return (
      <ul> {list} </ul>
    );
  }
});

module.exports = IdeaList;
