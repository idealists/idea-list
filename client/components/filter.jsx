var React = require('react');

var Filter = React.createClass({
  render: function() {
    return(
      <div>
        Filter By:
        <div> Tags </div>
        <div> Dates </div>
        <div> Votes </div>
      </div>
    )
  }
});

module.exports = Filter;
