var React = require('react');

var IdeaFilter = React.createClass({
  render : function(){
    return(
      <div className="container">
        <ul className="nav nav-tabs nav-justified">
          <li role="presentation"><a href="#">Votes</a></li>
          <li role="presentation"><a href="#">Date</a></li>
          <li role="presentation"><a href="#">Tags</a></li>
        </ul>
      </div>
    );
  }
});

module.exports = IdeaFilter;
