var React = require('react');

var CreatePostEntryView = React.createClass({

  handleSubmit: function() {
    var tagsInput = this.refs.newPostTags.getDOMNode().value;
    var tagsArray = tagsInput.split(' ');

    console.log('tagsInput:', tagsInput);
    console.log('tagsArray:', tagsArray);

    var newPostEntry = {
      userid: 1,
      heading: this.refs.newPostHead.getDOMNode().value,
      text: this.refs.newPostBody.getDOMNode().value,
      tags: tagsArray
    };

    this.props.add(newPostEntry);

    this.refs.newPostHead.getDOMNode().value = '';
    this.refs.newPostBody.getDOMNode().value = '';
    this.refs.newPostTags.getDOMNode().value = '';
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
    );
  }
});

module.exports = CreatePostEntryView;
