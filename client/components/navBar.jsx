var React  = require('react');
var Router = require('react-router');
var Link   = Router.Link;

var NavBar = React.createClass({
  render : function(){
    return(
      <div>
        <div className="homeButton">
          <Link to="app">Home</Link>
        </div>
        <div className="createIdea">
          <Link to="ideas">Create Idea</Link>
        </div>
      </div>
    );
  }
});

module.exports = NavBar;
