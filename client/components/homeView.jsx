var React = require('react');
var Search = require('./search.jsx');
var Filter = require('./filter.jsx');
var PostList = require('./postList.jsx');
var CreatePostEntryView = require('./createPostEntryView.jsx');
var postActions = require('../actions/postActions');
var postStore = require('../stores/postStores');

var Home = React.createClass({

  getInitialState: function() {
    postActions.getPostEntries('vote');

    return {
      list: postStore.pullposts()
    }
  },

  componentDidMount: function() {
    postStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    postStore.removeChangeListener(this._onChange);
  },

  handleAddPost: function(newPostEntry) {
    postActions.createPostEntry(newPostEntry);
  },

  // handleRemovePost: function() {
  // },

  _onChange: function() {
    this.setState({
      list: postStore.pullposts()
    })
  },

  render: function() {
    return(
      <div>
        <h1> Create Post </h1>
        <CreatePostEntryView add={this.handleAddPost}/>
        <h1> Idea Tool </h1>
        <Search />
        <Filter />
        <PostList items={this.state.list}/>
      </div>
    )
  }
});

module.exports = Home;
