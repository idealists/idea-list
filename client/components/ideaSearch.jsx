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
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="input-group col-lg-8">
            <span className="input-group-addon"><span className="glyphicon glyphicon-search"></span></span>
            <input type='text' ref='search' className="form-control" placeholder='search users and tags'></input>
          </div>
          <div className="col-lg-2"></div>
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
