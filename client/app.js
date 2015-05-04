var React = require('react');
var NavBar = require('./components/navBar.jsx');
var Home = require('./components/homeView.jsx');

var App = React.createClass({
  render: function() {
    return(
      <div>
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
