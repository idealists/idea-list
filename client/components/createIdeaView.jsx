var React = require('react');
var ideaActions    = require('../actions/ideaActions');
var Router = require('react-router');
var NavBar = require('./navBar.jsx');
var Navigation = Router.Navigation;

var CreateIdeaView = React.createClass({
   mixins: [Navigation],
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
    this.goBack()

  },

  render : function(){
    console.log(this.props,this.params)
    return(
      <div>
        <NavBar />
        <div className="page-header container">
          <h1>Create+Idea= </h1>
        </div>
        <div className="input-group container">
          <input className="form-control" type='text' ref='newIdeaTitle' placeholder='title'></input>
          <br />
          <textarea className="form-control" type='text' ref='newIdeaBody' placeholder='body' rows="10"></textarea>
          <br />
          <input className="form-control" type='text' ref='newIdeaTags' placeholder='tags (split by space)'></input>
          <br />
          <button className="btn btn-default btn-lg pull-right" onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
});

module.exports = CreateIdeaView;
