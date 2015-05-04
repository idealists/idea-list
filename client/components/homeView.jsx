var React = require('react');
var Search = require('./search.jsx');
var Filter = require('./filter.jsx');
var PostList = require('./postList.jsx');
var CreatePostEntryView = require('./createPostEntryView.jsx');

var Home = React.createClass({
  render: function() {
    return(
      <div>
        <h1> Create Post </h1>
        <CreatePostEntryView />
        <h1> Idea Tool </h1>
        <Search />
        <Filter />
        <PostList />
      </div>
    )
  }
});

module.exports = Home;
