var React       = require('react');
var CommentList = require('./commentList.jsx');
var ideaActions = require('../actions/ideaActions');

var IdeaView = React.createClass({

  render : function(){
    return(
      <div>
        <CommentList />
      </div>
    );
  }
})

module.exports = IdeaView;
