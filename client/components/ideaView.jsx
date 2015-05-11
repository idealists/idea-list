var React       = require('react');
var NavBar      = require('./navBar.jsx');
var CommentList = require('./commentList.jsx');
var ideaActions = require('../actions/ideaActions');
var ideaStore   = require('../stores/ideaStore');

var IdeaView = React.createClass({


  getInitialState: function () {
    return {
      idea: ideaStore.fetchIdeas()[this.props.params.index]
    }
  },

  componentDidMount : function(){
    ideaStore.addChangeListener(this._onChange);
  },

  componentWillUnmount : function(){
    ideaStore.removeChangeListener(this._onChange);
  },

  _onChange : function(){

    this.setState({
      idea : ideaStore.fetchIdeas()[this.props.params.index]
    });
  },

  render: function(){

    console.log('state:', this.state.idea)
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
          <CommentList />
        </div>

      </div>
    );
  }
})

module.exports = IdeaView;
