var Dispatcher   = require('../dispatcher/dispatcher');
var Constants    = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var ObjectAssign = require('react/lib/Object.assign');

var CHANGE_EVENT = 'change';
var _userinfo={};

var populateStore = function (userdata) {
  _userinfo = userdata;
};

var userStore = ObjectAssign({},EventEmitter.prototype,{
  getUserInfo=:function () {
      return _userinfo;
  },
  addChangeListener : function (cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener : function (cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }
});

userStore.dispatcherToken = Dispatcher.register(function  (action) {
switch (action.action.actionType) {
    case Constants.RELOAD_USER:
      populateStore(action.action.data);
      userStore.emit(CHANGE_EVENT);
      break;

    default:
      return false;
  } 

});

module.exports = userStore;ire
