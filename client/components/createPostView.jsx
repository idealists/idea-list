var React = require('react');

var CreatePosts = React.createClass({
  getPosts:function(query) {
    query= query||''
    $.get( //ReferenceError: $ is not defined
      '/posts', function(result){
        console.log(result);
      }
    )
  },

  render: function() {
    return(
      <div>
        <h3>Create Post: </h3>
        <input placeholder='search'></input>
        <button onClick={this.getPosts}> Post </button>
      </div>
    )
  }
});

module.exports = CreatePosts;
