var React       = require('react');
var ideaActions = require('../actions/ideaActions');

// need to build
var commentList
var userProfile
var ideaHeader
// gets votes button needs request

var IdeaView = React.createClass({

  getInitialState : function(){
    // syntax error; this must retrieve the specific idea by ideas[index];
    var index = this.context.router.getCurrentParams().index;
    var currentIdea  = this.props.ideas[index];

    commentActions.getComments('votes', currentIdea);

    return {
      list : commentStore.fetchComments()
    };
  },

  componentDidMount : function(){
    commentStore.addChangeListener(this._onChange)
  },

  componentWillUnmount : function(){
    commentStore.removeChangeListener(this._onChange);
  },

  _onChange : function(){
    this.setState({
      list : commentStore.fetchComments()
    });
  },

  // render : function(){
  //   var ideaInfo = this.props.ideaInfo

  //   return(
  //     <div>
  //       <h3 className='ideaTitle'>
  //         <ideaHeader ideainfo = {ideaInfo} />
  //       </h3>
  //       <h5 className='ideaBody'>
  //         {ideaInfo.body}
  //       </h5>
  //     </div>
  //   );
  // }
})

module.exports = IdeaView;