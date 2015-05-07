var React = require('react');

var CreateIdeaView = React.createClass({
  handleSubmit : function(){
    var tagsInput = this.refs.newIdeaTags.getDOMNode().value;
    var tagsArray = tagsInput.split(' ');

    var newIdea = {
      userId  : 1,
      title   : this.refs.newIdeaTitle.getDOMNode().value,
      body    : this.refs.newIdeaBody.getDOMNode().value,
      tags    : tagsArray
    };

    // alert if no title or body
        ideaActions.createIdea(newIdea);

    this.refs.newIdeaTitle.getDOMNode().value = '';
    this.refs.newIdeaBody.getDOMNode().value = '';
    this.refs.newIdeaTags.getDOMNode().value = '';

  },

  render : function(){
    return(
      <div>
        <h1>Create Post: </h1>
        <input type='text' ref='newIdeaTitle' placeholder='title'></input>
        <input type='text' ref='newIdeaBody' placeholder='body'></input>
        <input type='text' ref='newIdeaTags' placeholder='tags (split by space)'></input>
        <a onClick={this.handleSubmit} > Submit </a>
      </div>
    );
  }
});

module.exports = CreateIdeaView;
