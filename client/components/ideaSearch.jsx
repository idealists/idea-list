var React = require('react');

var IdeaSearch = React.createClass({
  render : function(){
    return(
      <div>
        <input type='text' placeholder='search'></input>
      </div>
    );
  }
});

module.exports = IdeaSearch;
