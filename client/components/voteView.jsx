var React = require('react');
var VoteActions = require('../actions/voteActions');
var cookie = require('react-cookie');

var VoteView = React.createClass({
  getInitialState: function(){
    return { 
      userInfo: cookie.load('userInfo'); 
    }
  },
  modifyprops: function(voteData){
    //{votes:[{}],rating}
    if (voteData.rating > 0) {
      //highlight the up arrow
    } else if (rating.value < 0) {
      //highlight the down arrow
    } else {
      //no highlighting
    }
  },

  sendVote: function(rating){
    var votedata = this.props.object;
    var here = this;
    var voteInfo = { 
        voterId    : userInfo.userId,
        parentId   : votedata.userId,
        user_name  : userInfo.sUserName,
        voteType   : votedata.type,
        voteRating : rating,
        userImage  : userInfo.img['24']
    }

    VoteActions.sendVote(voteInfo, here.modifyprops);
  },
  render: function(){
    return(
      <div>
        <div>
          <button className="" type="text" ref="upVote" onClick={sendVote(1)}>
          </button>
        </div>
        <div>
          <button className="" type="text" ref="rating" onClick={}>
            {.value}
          </button>
        </div>
        <div>
          <button className="" type="text" ref="downVote" onClick={sendVote(-1)}>
          </button>
        </div>
      </div>
    )
  }
});

module.exports = VoteView;