var React = require('react');
var VoteActions = require('../actions/voteActions');
var cookie = require('react-cookie');

var VoteView = React.createClass({
  getInitialState: function(){
    return { 
             userInfo: cookie.load('userInfo'),
             voterInfo: this.props.object.voters // <-- array 
    }
  },
  modifyprops: function(rating){
    //if (rating > 0)
    //if rating >0 highlight up arrow
    //if rating<0 highlight down array.
    // set this.state.object.voters
  },

  ideaVote: function(rating){
    var votedata = this.props.object;
    
    var voteInfo = { 
        voterId    : userInfo.userId,
        parentId   : votedata.userId,
        user_name  : userInfo.sUserName,
        voteType   : votedata.type,
        voteRating : rating,
        userImage  : userInfo.img['24']
    }

    VoteActions.sendVote(voteInfo, this.modifyprops(rating));
  },
  render: function(){
    return(
      <div>
        <div>
          <button className="" type="text" ref="upVote" onClick={ideaVote(1)}>
          </button>
        </div>
        <div>
          <button className="" type="text" ref="rating" onClick={}>
          </button>
        </div>
        <div>
          <button className="" type="text" ref="downVote" onClick={ideaVote(-1)}>
          </button>
        </div>
      </div>
    )
  }
});

module.exports = VoteView;