var ObjectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var authenticatedTF = false;

var authenticateStore = ObjectAssign({}, EventEmitter.prototype, {
  loginStatus : function () {
    return authenticatedTF;
  },

  switchStatus : function () {
    authenticatedTF = !authenticatedTF;
  }
});

module.exports = authenticateStore;
