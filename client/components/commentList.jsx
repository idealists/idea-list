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
            <div > 
              <VoteView  object = {comdata}/>            
              <Comment element = {comdata} root= {parentId} level={level} ptype={ptype}/>
                {childcomments(comdata.comments,parentId,level+1)}
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

  render: function(){
    if (this.props.level>0){
      return (
            <div className="comment text-primary">

              <h3> + {this.props.element.body} </h3>

              <div>
                <img src={this.props.element.img}/>
                {this.props.element.sUserName}
              </div>
            </div>
          )
    }else{
      return (
        <div className="comment text-primary">

          <h3> + {this.props.element.body} </h3>

          <div>
            <img src={this.props.element.img}/>
            {this.props.element.sUserName}
          </div>
          <form className="form-inline" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input className="form-control" type='text' ref='nestedComment' placeholder='add comment'> </input>
              <input className="btn btn-red btn-xs" type="submit" value="Post"> </input>
            </div>
          </form>
        </div>
      )  
    }
  }
});

// 
module.exports = CommentList;

