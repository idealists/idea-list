var React       = require('react');
var NavBar      = require('./navBar.jsx');
var CommentList = require('./commentList.jsx');
var ideaActions = require('../actions/ideaActions');
var ideaStore   = require('../stores/ideaStore');
var commentStore   = require('../stores/commentStore');

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
          <textarea className="form-control" type='text' ref='parentComment' placeholder='some_commas' rows="4"></textarea>
        </div>

        <br />

        <div className="text-center">
          <button className="btn btn-red btn-wide center">
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
