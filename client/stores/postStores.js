// var dispatcher = require('../dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var _posts =[];
var PostsStore =  assign({}, EventEmitter.prototype,{
  populatestore:function(postlist){
     _posts=posts;
  },
  pullposts:function(){
    return _posts
  }
})

module.exports = PostsStore;