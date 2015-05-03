var React = require('react');

var Hello = React.createClass({
  render: function() {
    return(
      <h1>Hello World!</h1>
    )
  }
});

React.render(
  <Hello />,
  document.getElementById('main')
);
