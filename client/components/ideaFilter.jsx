var React = require('react');
var ideaActions    = require('../actions/ideaActions');

var IdeaFilter = React.createClass({
  bydate: {
    first: false,
    filter: function (e) {
      e.preventDefault();

      if(this.bydate.first) {
        this.bydate.first = false;
        ideaActions.getIdeas('dateFirst');
      } else {
        this.bydate.first = true;
        ideaActions.getIdeas('dateLast');
      }
    }
  },

  byvote: {
    first: false,
    filter: function (e) {
      e.preventDefault();

      if (this.byvote.first) {
        this.byvote.first = false;
        ideaActions.getIdeas();
      } else {
        this.byvote.first = true;
        ideaActions.getIdeas('votesAsc');
      }
    }
  },

  render : function(){
    return(
      <div>

          <div>
            <ul className="nav nav-tabs nav-justified">
              <li role="presentation" onClick={(this.byvote.filter).bind(this)}>
                <a href="#" className="filter">
                  Votes
                  &nbsp;
                  <span className="glyphicon glyphicon-sort"></span>
                </a>
              </li>
              <li role="presentation" onClick={(this.bydate.filter).bind(this)}>
                <a href="#" className="filter">
                  Date
                  &nbsp;
                  <span className="glyphicon glyphicon-sort"></span>
                </a>
              </li>
            </ul>
          </div>

      </div>
    );
  }
});

module.exports = IdeaFilter;
