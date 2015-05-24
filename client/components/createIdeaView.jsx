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
      title   : this.refs.newIdeaTitle.getDOMNode().value,
      body    : this.refs.newIdeaBody.getDOMNode().value,
      tags    : tagsArray
    };

    // alert if no title or body
    var self = this;
    var redir = function(){self.transitionTo('Home');} ;
    ideaActions.createIdea(newIdea,redir);
    this.refs.newIdeaTitle.getDOMNode().value = '';
    this.refs.newIdeaBody.getDOMNode().value = '';
    this.refs.newIdeaTags.getDOMNode().value = '';
    // this.goBack()

  },

  render : function(){
    return(
      <div>
        <NavBar />

        <div className="page-header container">
          <div className="row">

            <div className="col-md-5">
              <div className="kinda-huge text-right text-muted">
                FROM A VISION
              </div>
              <div className="kinda-huge text-right text-muted">
                TO A REALITY
              </div>
            </div>

            <div className="col-md-6">
              <blockquote className="x1-huge text-white">
                &nbsp;
                <b className="text-primary">IDEA</b>
                &nbsp;
                <b>CREATION.</b>
              </blockquote>
            </div>

            <div className="col-md-1"></div>

          </div>
        </div>

        <br />

        <div className="input-group container">

          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8">
              <input className="form-control input-lg" type='text' ref='newIdeaTitle' placeholder='Name your idea.'></input>
            </div>
            <div className="col-lg-2"></div>
          </div>

          <br />

          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8">
              <input className="form-control input-lg" type='text' ref='newIdeaTags' placeholder='Add some descriptive tags. (split by space)'></input>
            </div>
            <div className="col-lg-2"></div>
          </div>

          <br />

          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8">
              <textarea className="form-control input-lg" type='text' ref='newIdeaBody' placeholder='Tell us more about it.' rows="8"></textarea>
            </div>
            <div className="col-lg-2"></div>
          </div>

        </div>

          <br />
          <div className="text-center">
            <button className="btn btn-red btn-wide center" onClick={this.handleSubmit}>
              Submit
            </button>
          </div>
      </div>
    );
  }
});

module.exports = CreateIdeaView;
