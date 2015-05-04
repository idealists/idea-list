var React = require('react');
var Home = require('./components/homeView.jsx');
var NavBar = require('./components/navBar.jsx');

var App = React.createClass({
  render: function() {
    return(
      <div>
        Hello
        <NavBar />
        <Home />
      </div>
    )
  }
});

React.render(
  <App />,
  document.getElementById('main')
);
