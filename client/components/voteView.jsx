var React = require('react');
var VoteActions = require('../actions/voteActions');
var cookie = require('react-cookie');
var ideaActions    = require('../actions/ideaActions');

var VoteView = React.createClass({
  getInitialState: function(){
    return {
      userInfo: cookie.load('userInfo'),
    }
  },
  componentDidMount: function(){
    console.log(this.props.object)
    var voteStatus = this.props.object.rating;
    if (voteStatus > 0) {
      //highlight the up arrow
      console.log('HI VOTE');
    } else if (voteStatus < 0) {
      //highlight the down arrow
       console.log('low vote');
    } else {
      //no highlighting
    }
  },
  modifyProps: function(newData){
    var newstate = this.props.object;
    newstate.rating = newData.rating;

    this.setState({ voteData: newstate });

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
  voteup:function(value){
    return "text-primary"
  }
  voteTypes: {
    up: function(){this.sendVote(1); this.voteup ='text-red';} ,
    down: function(){this.sendVote(-1); this.votedown = 'text-red';}
  },
  render: function(){
    var user = this.state.userInfo._id
    var voteup =(
             <div className={voteup()}>
          <span className="glyphicon glyphicon-chevron-up" ref="upVote" onClick={(this.voteTypes.up).bind(this)}></span>
        </div>
      );
    var votedown = 
    this.props.object.voters.forEach(function(vote){
      if(vote.voter===user){
        if(vote.value>0){
          this.voteup = (<div className={"text-primary"}>
                    <span className="glyphicon glyphicon-chevron-up" ref="upVote" onClick={(this.voteTypes.up).bind(this)}></span>
                  </div>)
        }
        if(vote.value<0){
          votedown = 'text-red'
        }
      }
    }.bind(this))
    console.log('chnge')
    return(
      <div className="votePosition">
        {voteup}

        <div className="text-primary" ref="rating">
          &nbsp;
          {this.props.object.rating}
        </div>

        <div className={votedown}>
          <span className="glyphicon glyphicon-chevron-down" ref="downVote" onClick={(this.voteTypes.down).bind(this)}></span>
        </div>
      </div>
    )
  }
});

module.exports = VoteView;
