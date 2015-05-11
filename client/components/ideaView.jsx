var React       = require('react');
var NavBar      = require('./navBar.jsx');
var CommentList = require('./commentList.jsx');
var ideaActions = require('../actions/ideaActions');

var IdeaView = React.createClass({

  render : function(){
    return(
      <div>
        <NavBar />
        <div className="page-header container">
          <div className="x-huge text-primary"> idea.title </div>
        </div>
        <div className="container">
          <br />
          <div className="large text-primary"> idea.body </div>
          <br />
        </div>
        <div className="input-group container">
          <textarea className="form-control" type='text' ref='parentComment' placeholder='body' rows="5"></textarea>
        </div>
        <br />
        <div className="text-center">
          <button className="btn btn-red btn-wide center">
            Add Comment
          </button>
        </div>
        <br />
        <div className="container">
          <CommentList />
        </div>
      </div>
    );
  }
})

module.exports = IdeaView;
