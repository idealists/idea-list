var React       = require('react');
var NavBar      = require('./navBar.jsx');


var Errorpage = React.createClass({

  render:function () {
    return (
      <div>
        <NavBar/>
        <br/>

       <h1 className="text-white" > ERROR 404</h1><img src="http://th01.deviantart.net/fs71/PRE/f/2011/069/5/7/y_u_no_by_erikjdurwoodii-d3bd3x9.png"/>  
      </div>
      );
  }

});

module.exports = Errorpage;