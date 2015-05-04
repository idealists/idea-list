var React = require('react');
var PostEntry = require('./postEntry.jsx');

var PostList = React.createClass({
  render: function(){
    var listItems = this.props.items.map(function(item){
      return (
        <li>
          <span>
            {item}
          </span>
        </li>
      )
    }.bind(this));

    return (
      <ul>
        {listItems}
      </ul>
    )
  }
});

module.exports = PostList;
