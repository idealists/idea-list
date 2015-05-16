var React    = require('react');
var Router   = require('react-router');
// var Comment  = require('./comment.jsx');
var commentActions = require('../actions/commentActions');

var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;
var Link  = Router.Link;


var CommentList = React.createClass({

  render: function(){
    var commentList = this;

    return (
      <div>
        {
          this.props.comments.map(function(comment){
            return (<Comment key={comment._id} element={comment} root={commentList.props.idea}/>)
          })
        }
      </div>
    )
  }
});





var Comment = React.createClass({

  getInitialState: function() {
    return {
      comment : this.props.element,
      idea    : this.props.root
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var commentBody = this.refs.nestedComment.getDOMNode().value;
    var commentId   = this.state.comment._id;
    var ideaId      = this.state.idea._id;

    var newComment = {
      body       : commentBody,
      parentId   : commentId,
      parentType : 'comment',
      ideaId     : ideaId
    };

    commentActions.createComment(newComment);

    this.refs.nestedComment.getDOMNode().value = '';
  },

  render: function(){

    return (
      <div className="text-primary">

        <h3> + {this.state.comment.body} </h3>

        <div>
          <img src={this.state.comment.img}/>
          {this.state.comment.sUserName}
        </div>

        <form className="form-inline">
          <div className="form-group">

            <input className="form-control" type='text' ref='nestedComment' placeholder='add comment'> </input>

            <button className="btn btn-red btn-xs" onClick={this.handleSubmit}>
              Reply
            </button>

          </div>
        </form>

        <div>
          <CommentList comments={this.state.comment.comments} idea={this.state.idea} />
        </div>

      </div>
    )
  }
});

module.exports = CommentList;

