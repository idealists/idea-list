var React = require('react');
var VoteActions = require('../actions/voteActions');
var cookie = require('react-cookie');
var ideaActions    = require('../actions/ideaActions');

var VoteView = React.createClass({
  getInitialState: function(){
    return {
      userInfo: cookie.load('userInfo'),
      object  : this.props.object
    }
  },
  modifyProps: function(newData){
    var newstate = this.state.object;
    newstate.rating = newData.rating;
    newstate.voters = newData.voteArray;
    this.setState({ object: newstate });

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
    };

    VoteActions.sendVote(voteInfo, here.modifyProps);
  },
  voteup:function(props){
    var value = (<div className={"text-primary"}>
          <span className="glyphicon glyphicon-chevron-up" ref="upVote" onClick={(this.voteTypes.up).bind(this)}></span>
        </div>);
    props.forEach(function(singlevote){
      
      if(this.state.userInfo._id===singlevote.voter&&singlevote.value>0){
        value = (<div className="text-red">
          <span className="glyphicon glyphicon-chevron-up" ref="upVote" onClick={(this.voteTypes.up).bind(this)}></span>
        </div>);
      }
    }.bind(this));
    return value;
  },
  votedown:function(props){
    var value = ( <div className="text-primary">
          <span className="glyphicon glyphicon-chevron-down" ref="downVote" onClick={(this.voteTypes.down).bind(this)}></span>
        </div>);
    props.forEach(function(singlevote){
      
      if(this.state.userInfo._id===singlevote.voter&&singlevote.value<0){
        value = ( <div className="text-red">
          <span className="glyphicon glyphicon-chevron-down" ref="downVote" onClick={(this.voteTypes.down).bind(this)}></span>
        </div>);
      }
    }.bind(this));
    return value;
  },
  voteTypes: {
    up: function(){this.sendVote(1);} ,
    down: function(){this.sendVote(-1);}
  },
  render: function(){
    var here = this
    return(
      <div className="votePosition">
        {here.voteup(here.state.object.voters)}

        <div className="text-primary" ref="rating">
          &nbsp;
          {here.state.object.rating}
        </div>
        {here.votedown(here.state.object.voters)}
       
      </div>
    )
  }
});

module.exports = VoteView;