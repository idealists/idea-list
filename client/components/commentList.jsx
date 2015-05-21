var React    = require('react');
var Router   = require('react-router');
var commentActions = require('../actions/commentActions');
var VoteView = require('./voteView.jsx');


var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var commentStore   = require('../stores/commentStore');
var Route = Router.Route;
var Link  = Router.Link;

var CommentList = React.createClass({
  render: function(){
    console.log('the commetst to reder',this.props.comments)
    var here = this
    var childcomments = function(com,parentId,level) {
      if(com.length>0){
        var result= com.map(function(comdata,index){
          comdata.type = 'comment'
          var ptype = 'comment'
          if(level===0){ ptype === 'idea'}
            // console.oog
          return (
            <div className="container">
              <div className="row">
                <div className="col-md-1">
                  <VoteView object={comdata}/>
                </div>

                <div className="col-md-11">
                  <Comment element={comdata} root={parentId} level={level} ptype={ptype} />
                  {childcomments(comdata.comments, parentId, level+1)}
                </div>
              </div>
              <br />
            </div>
          )
        });
        return result
      }
    };
    var list = childcomments(this.props.comments,this.props.idea,0)
    return (
      <div>
        {list}
      </div>
    );
  }
});





var Comment = React.createClass({
  getInitialState: function(){
    var uniq = this.props.element._id;

    return {
      uniq: false,
      time: new Date(this.props.element.createdAt).toLocaleString()
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var commentBody = this.refs.nestedComment.getDOMNode().value;
    var commentId   = this.props.element._id;
    var ideaId      = this.props.root._id;
    var ptype       = this.props.ptype
    var newComment = {
      body       : commentBody,
      parentId   : commentId,
      parentType : ptype,
      ideaId     : ideaId
    };

    commentActions.createComment(newComment);

    this.refs.nestedComment.getDOMNode().value = '';
  },

  showTextarea: function(){
    this.setState({
      uniq: !this.state.uniq
    })
  },

  render: function(){
    if (this.props.level > 0) {
      return (
        <div className="comment">
          <div className="xx-large text-primary"> {this.props.element.body} </div>

          <br />

          <div>
            <span className="text-primary"> by: </span>
            &nbsp;
            <img src={this.props.element.img} />
            &nbsp;
            <span className="text-white"> {this.props.element.sUserName} </span>
            &nbsp;
            <span className="text-primary"> @ </span>
            &nbsp;
            <span className="text-white"> {this.state.time} </span>
          </div>
        </div>
      )
    } else {
      return (
        <div className="comment">
          <div className="xx-large text-primary"> {this.props.element.body} </div>

          <br />

          <div>
            <span className="text-primary"> by: </span>
            &nbsp;
            <img src={this.props.element.img} />
            &nbsp;
            <span className="text-white"> {this.props.element.sUserName} </span>
            &nbsp;
            <span className="text-primary"> @ </span>
            &nbsp;
            <span className="text-white"> {this.state.time} </span>
            &nbsp;
            <span className="text-red" onClick={this.showTextarea}> Reply </span>
          </div>

          <br />

          {this.state.uniq ?
            <div className="container">
              <div className="row">

                <div className="col-md-3">
                  <textarea type='text' className="form-control" ref='nestedComment' placeholder="add a comment" rows="1"></textarea>
                </div>

                <div className="col-md-9">
                  <button className="btnNested btn-xs center" onClick={this.handleSubmit}>
                    Add Comment
                  </button>
                </div>

              </div>
            </div>
          : null}

          <br />

        </div>
      )
    }
  }
});

//
module.exports = CommentList;

