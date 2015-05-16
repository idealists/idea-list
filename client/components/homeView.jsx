var React          = require('react');
var IdeaList       = require('./ideaList.jsx');
var IdeaFilter     = require('./ideaFilter.jsx');
var IdeaSearch     = require('./ideaSearch.jsx');
var ideaActions    = require('../actions/ideaActions');
var ideaStore      = require('../stores/ideaStore');
var NavBar         = require('./navBar.jsx')


var Home = React.createClass({
  getInitialState : function(){
    ideaActions.getIdeas();

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
    return(
      <div>
        <NavBar />
        <div className="container">
          <div className="page-header">
            <div className="xx-huge text-center text-primary"> I D E A - L I S T </div>
          </div>
          <IdeaSearch />
          <br />
          <IdeaFilter />
          <br />
          <IdeaList ideas={this.state.list}/>
        </div>
      </div>
    );
  }
});

module.exports = Home;
