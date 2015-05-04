var React = require('react');
var Search = require('./search.jsx');
var Filter = require('./filter.jsx');
var Posts = require('./posts.jsx');

var Home = React.createClass({
  render: function() {
    return(
      <div>
        <h1> Idea Tool </h1>
        <Search />
        <Filter />
        <Posts />
      </div>
    )
  }
});

module.exports = Home;
