var Dispatcher = require('flux').Dispatcher
var mainDispatcher = new Dispatcher()

mainDispatcher.handleAction = function(action){
   this.dispatch({
    source: 'ACTION',
    action: action
  });
}

 module.exports = mainDispatcher