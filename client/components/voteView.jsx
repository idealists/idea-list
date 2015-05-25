var React       = require('react');
var cookie      = require('react-cookie');
var VoteActions = require('../actions/voteActions');
var ideaActions = require('../actions/ideaActions');

var VoteView = React.createClass({
  getInitialState : function(){
    return {
      userInfo : cookie.load('userInfo'),
      object   : this.props.object
    }
  },

  modifyProps : function (newData) {
    var newstate    = this.props.object;
    newstate.rating = newData.rating;
    newstate.voters = newData.voteArray;
    this.setState({ object: newstate });
  },

  sendVote : function (rating) {
    var here     = this;
    var votedata = this.props.object;

    var voteInfo = {
        parentId  : votedata._id,
        voterId   : this.state.userInfo._id,
        voteType  : votedata.type,
        rate      : rating,
        user_name : this.state.userInfo.sUserName,
        userImage : this.state.userInfo.image['24']
    };

    VoteActions.sendVote(voteInfo, here.modifyProps);
  },
  voteup : function (props) {
    var value = (
      <div className={"text-primary"}>
        <span className="glyphicon glyphicon-chevron-up" ref="upVote" onClick={(this.voteTypes.up).bind(this)}></span>
      </div>
    );

    props.forEach(function (singlevote) {
      if (this.state.userInfo._id === singlevote.voter && singlevote.value > 0) {
        value = (
          <div className="text-red">
            <span className="glyphicon glyphicon-chevron-up" ref="upVote" onClick={(this.voteTypes.up).bind(this)}></span>
          </div>
        );
      }
    }.bind(this));

    return value;
  },

  votedown : function (props) {
    var value = (
      <div className="text-primary">
        <span className="glyphicon glyphicon-chevron-down" ref="downVote" onClick={(this.voteTypes.down).bind(this)}></span>
      </div>
    );

    props.forEach(function (singlevote) {
      if (this.state.userInfo._id === singlevote.voter && singlevote.value < 0) {
        value = (
          <div className="text-red">
            <span className="glyphicon glyphicon-chevron-down" ref="downVote" onClick={(this.voteTypes.down).bind(this)}></span>
          </div>
        );
      }
    }.bind(this));

    return value;
  },

  voteTypes : {
    up   : function(){ this.sendVote(1);  } ,
    down : function(){ this.sendVote(-1); }
  },

  render : function(){
    var here = this;

    return (
      <div className="votePosition">
        {here.voteup(here.props.object.voters)}

        <div className="text-primary" ref="rating">
          &nbsp;
          {here.props.object.rating}
        </div>
        {here.votedown(here.props.object.voters)}

      </div>
    )
  }
});

module.exports = VoteView;
