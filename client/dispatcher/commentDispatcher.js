var Dispatcher     = require('flux').Dispatcher;
var mainDispatcher = new Dispatcher();

commentDispatcher.handleAction=function(action){
  this.dispatch({
    source:'Comments',
    action:action
  })
}
