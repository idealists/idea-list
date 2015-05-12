var React = require('react');
var ideaActions    = require('../actions/ideaActions');
var IdeaSearch = React.createClass({
  handleSubmit : function () {
    var data = {
      lookup: this.refs.search.getDOMNode().value
    };
    ideaActions.searchBy(data);
    this.refs.search.getDOMNode().value = '';
    // fill in the action
  },

  render : function () {
    return(
      <div className="container">
        <div className="input-group">
          <span className="input-group-addon"><span className="glyphicon glyphicon-search"></span></span>
          <input type='text' ref='search' className="form-control" placeholder='not working yet...'></input>
        </div>
        <br />
        <div className="text-center">
          <button className="btn btn-red btn-wide center" onClick={this.handleSubmit}>
            Search
          </button>
        </div>
      </div>
    );
  }
});

module.exports = IdeaSearch;
