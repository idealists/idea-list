var React = require('react');
var ideaActions    = require('../actions/ideaActions');


var IdeaFilter = React.createClass({
  bydate:{
    first:false,
    filter: function(e){
      e.preventDefault();
      if(this.bydate.first){
        this.bydate.first = false;
        ideaActions.getIdeas('dateFirst');
      }else{
        this.bydate.first = true;
        ideaActions.getIdeas('dateLast');
      }
    },
  },
  byvote:function(e){
    e.preventDefault();
    ideaActions.getIdeas('votes');
  },

  bytags:function(){
    console.log('test');
  },

  render : function(){
    return(
      <div className="container">
        <ul className="nav nav-tabs nav-justified">
          <li role="presentation" onClick={this.byvote}><a href="#">Votes</a></li>
          <li role="presentation" onClick={(this.bydate.filter).bind(this)}><a href="#">Date</a></li>
          <li role="presentation" ><a href="#">Tags</a></li>
        </ul>
      </div>
    );
  }
});

module.exports = IdeaFilter;
