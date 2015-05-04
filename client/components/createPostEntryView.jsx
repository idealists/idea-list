var React = require('react');

var CreatePostEntryView = React.createClass({

  handleSubmit: function() {
    var tags = function() {
      var input = this.refs.newPostTags.getDOMNode().value;
      var tagsArray = input.split(' ',',');
      return tagsArray;
    }

    var newPost = {
      userid: 1,
      heading: this.refs.newPostHead.getDOMNode().value,
      text: this.refs.newPostBody.getDOMNode().value,
      tags: tags()
    }

    this.props.add(newPost);
  },

  render: function() {
    return(
      <div>
        <h3>Create Post: </h3>
        <input type='text' ref="newPostHead" ></input>
        <input type='text' ref="newPostBody" ></input>
        <input type='text' ref="newPostTags" ></input>
        <button onClick={this.handleSubmit}> Submit </button>
      </div>
    )
  }
});

module.exports = CreatePostEntryView;
