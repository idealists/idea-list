// var dispatcher = require('../dispatcher/dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('react/lib/Object.assign');

var _postsList =[];
var PostsStore =  assign({}, EventEmitter.prototype,{
  populatestore:function(postlist){
     _postsList=posts;
  },
  pullposts:function(){
    return _postsList
  }
})

module.exports = PostsStore;
