var React = require('react');

var IdeaFilter = React.createClass({
  render : function(){
    return(
      <div>
        Filter By:
        <div> Date </div>
        <div> Tags </div>
        <div> User </div>
        <div> Votes </div>
      </div>
    );
  }
});

module.exports = IdeaFilter;
