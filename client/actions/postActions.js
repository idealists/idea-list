var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../constants/constants')

var postsActions={
  getitmes:function(entries){
    Dispatcher.handleAction({
      actionType:Constants,
      data: entries
    })
  }
}


Dispatcher.regester(function (payload){
  var action= payload.action;
  console.log(action)
  switch(action.actionType){
  }
})