var React    = require('react');
var Router   = require('react-router');
var commentActions = require('../actions/commentActions');

var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var commentStore   = require('../stores/commentStore');
var Route = Router.Route;
var Link  = Router.Link;


var CommentList = React.createClass({
  render: function(){
    console.log('the state',this.state)
    var commentList = this;
    var comments = 
    var list = commentList.props.comments.map(function(){
      
    });
    return (
      <div>
        {list}
      </div>
    )
  }
});





var Comment = React.createClass({

  // getInitialState: function() {
  //   return {
  //     comment : this.props.element,
  //     idea    : this.props.root
  //   }
  // },

  handleSubmit: function(e) {
    e.preventDefault();

    var commentBody = this.refs.nestedComment.getDOMNode().value;
    var commentId   = this.props.element._id;
    var ideaId      = this.props.root._id;

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
      <div className="comment text-primary">

        <h3> + {this.props.element.body} </h3>

        <div>
          <img src={this.props.element.img}/>
          {this.props.element.sUserName}
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

