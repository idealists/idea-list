var React = require('react');
var ideaActions= require('../actions/ideaActions')

//need to build
var commentList
var userProfile
var ideaHeader//gets votes  button needs request
///////////////// 
var IdeaView= React.createClass({
  setInitialState:function (argument) {
    var index = this.context.router.getCurrentParams().index
    var Idea = this.props.params.ideas[index]
    ideaActions.getIdeas('vote',Idea.id)
    return Idea
  }
  getInitialState:function(){
    commentActions.getComments('vote');
  },
  componentDidMount :function (argument) {
    commentActions.addChangeListener(this._onChange)
  },
  render:function(){
    var ideaInfo = this.props.ideaInfo

    return(
      <div>
        <h3 className="ideaTitle">
          <ideaHeader ideainfo = {ideaInfo} />
        </h3>
        <h5 className='ideaBody'>
          {ideaInfo.body}
        </h5>
        <userProfile userId={ideaInfo.userId} />
        <commentList comments={ideaInfo.comments} />
      </div>  
    );
  }
})

module.exports = IdeaView;