var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var DB;

mongo.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ideatool', function(err, db) {
  if (err) throw err;
  // when the connection occurs, we store the connection 'object' (or whatever it is) in a global variable so we can use it elsewhere.
  DB = db;

});
var postConstruct= function(req){
  console.log(req.body);
  var post = {
    //need format like int or str for user id slackid
    userid:req.body.userid||null,
    state: req.body.state||null,
    slackid: req.body.slackid||null,
    vote:0,
    heading: req.body.heading||null,
    text:req.body.text||null,
    comments:[],
    tag:[]
  };
  return post;  
};
var commentConstruct =function (req) {
  var comment ={
    headid:req.body.postid||null,
    userid:req.body.userid||null,
    text:req.body.text||null,
    slackid: req.body.slackid||null,
    vote:0,
    comments:[]
  };
  return comment;
};


module.exports ={
  getPosts: function(req,res){
      var posts  =DB.collection('postsDb');
    req.headers.query = req.headers.query|| "";
    switch(req.headers.query){
      case 'datefirst':
        posts = posts.find().sort({'datetime':1}).limit(10);
        break;
      case 'datelast':
        posts = posts.find().sort({'datetime':-1}).limit(10);
        break;
      case 'vote':
        posts = posts.find().sort({vote:1}).limit(10);
        break;
      case 'tag':
      //add username to tags array for easy find of people also.
        posts = posts.find({tag:{$in:req.headers.tag}}).limit(10);
        break;
      case 'userid':
        posts = posts.find({userid:req.headers.userid});
        break;
      default:
      //custom query (to do when need arises)
        console.log('cant cant cant');
    }
<<<<<<< HEAD
  
    var counts;
    posts.count(function(err,total){
      counts = total;
    });
    var result = [];
    posts.on('data',function(data){
      result.push(data);
      if(result.length===counts){
        res.end(JSON.stringify(result));
      }
    });
  }, 
=======
    // var posts = DB.collection('postsDb').find(findby)
    // var counts
    // posts.count(function(err,total){
    //   counts = total
    // });
    // var result = []
    // posts.on('data',function(data){
    //   result.push(data)
    //   if(result.length===counts){
    //     res.end(JSON.stringify(result))
    //   }
    // })
  },
>>>>>>> Progress integrating with MongoDB to store Slack ID
  createPost:function(req,res){
    var post = postConstruct(req);
    DB.collection('postsDb').insert(post,function(err,done){
      console.log(done._id);
    });
  },
  createComment:function(req,res){
    var commnet = commentConstruct(req);
    var commentid;
    DB.collection('postsDb').insert(comment,function(err,id){
      if(err){console.log(err);}
      commentid = id._id;
    });
    DB.collection('postsDb').update({_id:ObjectId(commentid)},{$push:{comments:commentid}});
    res.end('posted comment');
  }
};





/*schema
<<<<<<< HEAD

*/
=======
5544fbac2d735bd22226abe5
*/
>>>>>>> Progress integrating with MongoDB to store Slack ID
