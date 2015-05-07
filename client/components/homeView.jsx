var React          = require('react');
var IdeaList       = require('./ideaList.jsx');
var IdeaFilter     = require('./ideaFilter.jsx');
var IdeaSearch     = require('./ideaSearch.jsx');
var ideaActions    = require('../actions/ideaActions');
var ideaStore      = require('../stores/ideaStore');

var Home = React.createClass({
  getInitialState : function(){
    ideaActions.getIdeas('votes');

    return {
      list: ideaStore.fetchIdeas()
    }
  },

  componentDidMount : function(){
    ideaStore.addChangeListener(this._onChange);
  },

  componentWillUnmount : function(){
    ideaStore.removeChangeListener(this._onChange);
  },





  _onChange : function(){
    this.setState({
      list : ideaStore.fetchIdeas()
    });
  },

  render : function(){
    console.log('home',this.state)
    return(
      <div>
        <h1> Feature Idea Tool </h1>
        <IdeaSearch />
        <IdeaFilter />
        <IdeaList ideas={this.state.list}/>
      </div>
    );
  }
});

module.exports = Home;
