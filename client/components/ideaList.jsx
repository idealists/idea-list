var React = require('react');
var Router = require('react-router')
var Link = Router.Link;
var ideaView = require("./ideaView.jsx")

var IdeaList = React.createClass({
  getInitialState: function(){

  },
  render : function(){
    var list = this.props.params.ideas.map(function(idea, index, collection){
      return (
        <li key={index} >
          <h3> <Link to="ideaView">Title: {idea.title}</Link> </h3>
          <h5> Body:  {idea.body}  </h5>
        </li>
      );
      var routes = (
        <Route handler={App}>
          <Route name='ideaView' path=":index" handler={ideaView}/>
        </Route>
      );
    }.bind(this));

    return (
      <ul> {list} </ul>
    );
  }
});

module.exports = IdeaList;
