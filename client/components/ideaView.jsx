var React       = require('react');
var ideaActions = require('../actions/ideaActions');
var CommentList = require('./commentList.jsx');
// need to build
var commentList
var userProfile
var ideaHeader
// gets votes button needs request

var IdeaView = React.createClass({

  render : function(){
    console.log(this.props)
    return(
      <div>
        <h3 className='ideaTitle'>
          {this.props.params}
        </h3>
        <h5 className='ideaBody'>
        </h5>

        <CommentList />
      </div>
    );
  }
})

module.exports = IdeaView;
