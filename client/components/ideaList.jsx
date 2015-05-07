var React = require('react');
var Router = require('react-router')


var IdeaList = React.createClass({
  render : function(){
    var list = this.props.ideas.map(function(idea, index){
      return (
        <li key={index} >
          <h5> Body:  {idea.body}  </h5>
        </li>
      );

    })
    return (
      <ul> {list} </ul>
    );
  }
});



module.exports = IdeaList;
