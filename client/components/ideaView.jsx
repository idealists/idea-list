var React       = require('react');
var NavBar      = require('./navBar.jsx');
var CommentList = require('./commentList.jsx');
var ideaActions = require('../actions/ideaActions');
var ideaStore   = require('../stores/ideaStore');
var commentStore   = require('../stores/commentStore');
var commentActions = require('../actions/commentActions');

var IdeaView = React.createClass({


  getInitialState: function () {
    return {
      idea     : ideaStore.fetchIdeas()[this.props.params.index],
      comments : commentStore.fetchComments()
    }
  },

  componentDidMount : function(){
    ideaStore.addChangeListener(this._onChange);
    commentStore.addChangeListener(this._onChange);
  },

  componentWillUnmount : function(){
    ideaStore.removeChangeListener(this._onChange);
    commentStore.removeChangeListener(this._onChange);
  },

  _onChange : function(){
    this.setState({
      idea     : ideaStore.fetchIdeas()[this.props.params.index],
      comments : commentStore.fetchComments()
    });
  },

  handleSubmit : function(){
    var commentBody = this.refs.parentComment.getDOMNode().value;
    var ideaId      = this.state.idea._id

    var newComment = {
      body       : commentBody,
      parentId   : ideaId,
      parentType : 'idea'
    };

    commentActions.createComment(newComment);

    this.refs.parentComment.getDOMNode().value = '';
  },

  render: function(){

    return(
      <div>
        <NavBar />

        <div className="page-header container">
          <div className="x-huge text-primary"> {this.state.idea.title} </div>
        </div>

        <div className="container">
          <br />
          <div className="large text-primary"> {this.state.idea.body} </div>
          <br />
          <br />
          <br />
        </div>

        <div className="input-group container">
          <textarea className="form-control" type='text' ref='parentComment' placeholder='add comment' rows="4"></textarea>
        </div>

        <br />

        <div className="text-center">
          <button className="btn btn-red btn-wide center" onClick={this.handleSubmit}>
            Add Comment
          </button>
        </div>

        <br />

        <div className="container">
          <CommentList comments={this.state.comments} />
        </div>

      </div>
    );
  }
})

module.exports = IdeaView;
