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

          <div className="col-md-2"></div>

          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-addon"><span className="glyphicon glyphicon-search"></span></span>
              <input type='text' ref='search' className="form-control input-lg input-inverse" placeholder='search users and tags'></input>
            </div>
          </div>

          <div className="col-md-6">
            <div className="btn btn-red btn-wide" onClick={this.handleSubmit}>
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
