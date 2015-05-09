var React  = require('react');
var Router = require('react-router');
var Link   = Router.Link;

var NavBar = React.createClass({
  render : function(){
    return(
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <ul className="nav navbar-nav">
            <li className="">
              <Link to="app">Home</Link>
            </li>
            <li className="">
              <Link to="ideas" params={{test:"works"}}>Create</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
});

module.exports = NavBar;
