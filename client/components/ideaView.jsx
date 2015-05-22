var React       = require('react');
var NavBar      = require('./navBar.jsx');
var CommentList = require('./commentList.jsx');
var ideaViewActions = require('../actions/ideaViewActions');
var ideaViewStore   = require('../stores/ideaViewStore');
var cookie         = require('react-cookie');
var commentStore   = require('../stores/commentStore');
var commentActions = require('../actions/commentActions');

var IdeaView = React.createClass({


  getInitialState: function () {
    ideaViewActions.getIdea('id',this.props.params.id);
    commentActions.getComments('votes', this.props.params.id);

    return {
      idea     : ideaViewStore.fetchIdeas(),
      edit     : ideaViewStore.ideaEditState(),
      comments : commentStore.fetchComments(),
    }
  },

  componentDidMount : function(){
    ideaViewActions.getIdea('id',this.props.params.id);
    commentActions.getComments('votes', this.props.params.id);
    commentStore.addChangeListener(this._onChange);
    ideaViewStore.addChangeListener(this._onChange);
  },

  componentWillUnmount : function(){
    commentStore.removeChangeListener(this._onChange);
    ideaViewStore.removeChangeListener(this._onChange);
  },

  _onChange : function(){
    this.setState({
      idea     : ideaViewStore.fetchIdeas(),
      edit     : ideaViewStore.ideaEditState(),
      comments : commentStore.fetchComyayments()
    });
  },

  handleSubmit : function(){
    var commentBody = this.refs.parentComment.getDOMNode().value;
    var ideaId      = this.state.idea._id

    var newComment = {
      body       : commentBody,
      parentId   : ideaId,
      parentType : 'idea',
      ideaId     : ideaId
    };

    commentActions.createComment(newComment);

    this.refs.parentComment.getDOMNode().value = '';
  },

  editIdea: function (e) {
    ideaViewStore.ideaEditToggle();
  },
  submitIdea:function(){
  var ideabodyedit =  this.refs.editedIdea.getDOMNode().value;
    var newIdea ={
      body: ideabodyedit,
      title: this.state.idea.title,
      status: this.state.idea.status,
      ideaId: this.state.idea._id
    }
    ideaViewActions.editIdea(newIdea)
  },
  editmode:function(){
    var userinfo = cookie.load('userInfo');
    if(userinfo._id===this.state.idea.userId){
      if(this.state.edit){
        return(          
          <div className="container">
            <textarea className="form-control" type="text" ref="editedIdea" defaultValue={this.state.idea.body} />
            <div><br /><span className="text-red" onClick={this.submitIdea}>Submit</span></div>
          </div>
          )
      }else{
        return(
          <div className="container">
            <br />
            <div className="huge text-white"> {this.state.idea.body} </div>
            <div><br /><span className="text-red" onClick={this.editIdea}>Edit</span></div>
            <br />
          </div>
          )
      }
    }else{
      return(
          <div className="container">
            <br />
            <div className="huge text-white"> {this.state.idea.body} </div>
            <br />
          </div>
        )
    }
  },
  render: function(){

    if(this.state.idea.tags){
      if(this.state.idea.tags.length>1){
          var tags = this.state.idea.tags.join(", ");
        }else{
          var tags = this.state.idea.tags;
        }
    }
      
    var time = new Date(this.state.idea.createdAt).toLocaleString();
    console.log('this.state.idea', this.state.idea);
    return(
      <div>
        <NavBar />

        <div className="page-header container">
          <div className="xx-huge text-primary"> {this.state.idea.title} </div>

          <br />

          <div className="text-primary">
            created by:
            &nbsp;
            <img src={this.state.idea.img}/>
            &nbsp;
            <span className="text-white">{this.state.idea.sUserName}</span>
            &nbsp;
            @
            &nbsp;
            {time}
          </div>

          <div className="text-primary"> tags:
            <span className="text-white"> {tags} </span>
          </div>

          <div className="text-primary"> ID for Slack use:
            <span className="text-white"> {this.state.idea.shortId} </span>
          </div>
        </div>

        {this.editmode()}

        <br />

        <div className="container">
          <div className="row">
            <div className="col-md-1"></div>

            <div className="col-md-5">
              <textarea type='text' className="form-control" ref='parentComment' placeholder="add a comment" rows="2"></textarea>
            </div>

            <div className="col-md-6">
              <button className="btn btn-red btn-wide center" onClick={this.handleSubmit}>
                Add Comment
              </button>
            </div>

          </div>
        </div>

        <br />

        <div className="container">
          <CommentList comments={this.state.comments} idea={this.state.idea} />
        </div>

      </div>
    );
  }
})

module.exports = IdeaView;
