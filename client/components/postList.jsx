var React = require('react');
var PostEntry = require('./postEntry.jsx');

var PostList = React.createClass({
  render: function() {
    return(
      <div>
        <h1>Posts List:</h1>
        //This will contain multiple PostEntry components
      </div>
    );
  }
});

module.exports = PostList;
