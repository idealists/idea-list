var mongo = require('mongodb').MongoClient;
var DB

mongo.connect('mongodb://localhost:27017/ideatool', function(err, db) {
  if (err) throw err;
  // when the connection occurs, we store the connection 'object' (or whatever it is) in a global variable so we can use it elsewhere.
  DB = db;

})
var postConstruct= function(req){
  var post = {
    userid:req.body.data.userid,
    state: req.body.data.state,
    slackid: req.body.data.slackid,
    vote:0,
    heading: req.body.data.heading,
    text:req.body.data.text,
    comments:[],
    tag:[]
  };
  return post;  
}


module.exports ={ 
  getPosts: function(req,res){
    var findby
    switch(req.body.data.query){
      case 'datefirst':
        findby= {sort:{datetime:1},limit:10};
        break
      case 'datelast':
        findby = {sort:{datetime:-1},limit:10};
        break
      case 'voteup':
        findby = {sort:{vote:1},limit:10};
        break
      case 'votedown':
        findby = {sort:{vote:-1},limit:10};
        break
      case 'tag':
      //needs to have tags in array.['hotdogs','food','bbq']
        findby = {tag:{$in:req.body.data.tag},limit:10};
        break
      case 'userid':
      // start here or aboves
        findby={tags:{userid:req.body.data.userid},limit:10}
        break
      default:
      //custom query
      console.log('not done yet')
    }

    DB.collection('postsDb').find(findby)
    res.end(posted)
  }, 
  createPost:function(req,res){
    var post = postConstruct(req);
    DB.collection('postsDb').insert(post)
    res.end('posted')
  },
  createComment:function(req,res){
    var commnet = postConstruct(req);
    var commentid
    DB.collection('postsDb').insert(comment,function(err,id){
      if(err){console.log(err)}
      commentid = id._id;
    })
    DB.collection('postsDb').update({_id:ObjectId(commentid)},{$push:{comments:commentid}})
    res.end('posted comment')
  }
}





/*schema

*/