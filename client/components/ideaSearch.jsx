var React = require('react');

var IdeaSearch = React.createClass({
  render : function(){
    return(
      <div className="container">
        <div className="row">
          <div className="input-group">
            <span className="input-group-addon glyphicon glyphicon-search" id="sizing-addon1"></span>
            <input type='text' className="form-control col" placeholder='not working yet...' aria-describedby="basic-addon1"></input>
          </div>
            <button className="btn btn-default btn-lg pull-right" onClick={this.handleSubmit}>
              Search
            </button>
        </div>
      </div>
    );
  }
});

module.exports = IdeaSearch;
