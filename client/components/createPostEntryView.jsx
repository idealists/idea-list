var React = require('react');

var CreatePostEntryView = React.createClass({

  render: function() {
    return(
      <div>
        <h3>Create Post: </h3>
        <input placeholder='search'></input>
        <button> Post </button>
      </div>
    )
  }
});

module.exports = CreatePostEntryView;
