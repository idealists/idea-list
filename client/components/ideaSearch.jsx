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
        <br />
        <br />

        <div className="row">
          <div className="col-md-1"></div>

          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-addon" id="search"><span className="glyphicon glyphicon-search"></span></span>
              <input type='text' ref='search' className="form-control input-lg" id="searchBar" placeholder='looking for specific users or tags?'></input>
            </div>
          </div>

          <div className="col-md-6">
            <div className="btn btn-xwide btn-red" onClick={this.handleSubmit}>
              Search
            </div>
          </div>

        </div>

        <br />
      </div>
    );
  }
});

module.exports = IdeaSearch;


