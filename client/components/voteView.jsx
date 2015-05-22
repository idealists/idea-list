var React = require('react/addons');
var VoteActions = require('../actions/voteActions');
var cookie = require('react-cookie');
var ideaActions    = require('../actions/ideaActions');

var VoteView = React.createClass({
  getInitialState: function(){
    return {
      userInfo : cookie.load('userInfo'),
      upVote   : false,
      downVote : false
    }
  },

  componentDidMount: function(){
    var voters = this.props.object.voters;
    var user   = this.state.userInfo._id;

    this.setState({
      upVote   : false,
      downVote : false
    });
    voters.forEach(function (vote) {
      if(vote.voter === user && vote.value === 1) {
        this.setState({
          upVote : true
        });
      }

      if(vote.voter === user && vote.value === -1) {
        this.setState({
          downVote : true
        });
      }
    }.bind(this));
  },

  modifyProps: function(newData){
    var voters = this.props.object.voters;
    var user   = this.state.userInfo._id;
    var newstate = this.props.object;
    newstate.rating = newData.rating;

    this.setState({ voteData: newstate });

    voters.forEach(function (vote) {
      if(vote.voter === user && vote.value === 1) {
        this.setState({
          upVote : true
        });
      }

      if(vote.voter === user && vote.value === -1) {
        this.setState({
          downVote : true
        });
      }
    }.bind(this));
  },

  sendVote: function(rating){

    var votedata = this.props.object;
    var here = this;
    var voteInfo = {
        voterId    : this.state.userInfo._id,
        parentId   : votedata._id,
        user_name  : this.state.userInfo.sUserName,
        voteType   : votedata.type,
        rate       : rating,
        userImage  : this.state.userInfo.image['24']
    }

    VoteActions.sendVote(voteInfo, here.modifyProps);
  },

  voteTypes: {
    up: function(){this.sendVote(1);} ,
    down: function(){this.sendVote(-1);}
  },

  render: function(){
    var cx = React.addons.classSet;
    var upVote = cx({
      'text-primary' : !this.state.upVote,
      'text-red'     : this.state.upVote
    });
    var downVote = cx({
      'text-primary' : !this.state.downVote,
      'text-red'     : this.state.downVote
    });

    return(
      <div className="votePosition">
        <div className={upVote}>
          <span className="glyphicon glyphicon-chevron-up" ref="upVote" onClick={(this.voteTypes.up).bind(this)}></span>
        </div>

        <div className="text-primary" ref="rating">
          &nbsp;
          {this.props.object.rating}
        </div>

        <div className={downVote}>
          <span className="glyphicon glyphicon-chevron-down" ref="downVote" onClick={(this.voteTypes.down).bind(this)}></span>
        </div>
      </div>
    )
  }
});

module.exports = VoteView;
