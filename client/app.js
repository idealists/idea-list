var React = require('react');
var NavBar = require('./components/navBar.jsx');
var CreatePosts = require('./components/createPostView.jsx');
var Home = require('./components/homeView.jsx');

var App = React.createClass({
  render: function() {
    return(
      <div>
        <NavBar />
        <CreatePosts />
        <Home />
      </div>
    )
  }
});

React.render(
  <App />,
  document.getElementById('main')
);
