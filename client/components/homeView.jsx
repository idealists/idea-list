var React       = require('react');
var IdeaList    = require('./ideaList.jsx');
var IdeaFilter  = require('./ideaFilter.jsx');
var IdeaSearch  = require('./ideaSearch.jsx');
var ideaActions = require('../actions/ideaActions');
var ideaStore   = require('../stores/ideaStore');
var NavBar      = require('./navBar.jsx')

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
            <div className="row">

              <div className="col-md-6">
                <div className="x-huge text-right text-white">
                  <b className="text-primary">FEATURE</b> <b>REQUESTS.</b>
                </div>
                <div className="x-huge text-right text-white">
                  <b className="text-primary">IDEA</b> <b>DISCUSSION.</b>
                </div>
              </div>

              <div className="col-md-6">
                <blockquote className="text-muted"> A PLATFORM TO FACILITATE <br />
                  CONCEPT PROPOSAL & DEVELOPMENT
                </blockquote>
              </div>

            </div>
          </div>

          <IdeaSearch />

          <br />

          <IdeaFilter />

          <IdeaList ideas={this.state.list}/>
        </div>
      </div>
    );
  }
});

module.exports = Home;
