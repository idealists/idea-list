var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var DB

mongo.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ideatool', function(err, db) {
  if (err) throw err;
  // when the connection occurs, we store the connection 'object' (or whatever it is) in a global variable so we can use it elsewhere.
  DB = db;

})
var postConstruct= function(req){
  console.log(req.body)
  var post = {
    //need format like int or str for user id slackid
    userid:req.body.userid,
    state: req.body.state||null,
    slackid: req.body.slackid,
    vote:0,
    heading: req.body.heading||null,
    text:req.body.text,
    comments:[],
    tag:[]
  };
  return post;
}


module.exports ={
  getPosts: function(req,res){
    var findby
    var fakedata= '[{"_id":"5544fbac2d735bd22226abe5","userid":"5516668","state":"active","slackid":"123413","vote":0,"heading":"this is a test post","text":"it is working","comments":[],"tag":[]},{"_id":"554507a3c81a88b06895e244","userid":"5516668","state":"active","slackid":"123413","vote":0,"heading":"this sucks","text":"more data","comments":[],"tag":[]},{"_id":"554507d4c81a88b06895e245","userid":"5516668","state":"active","slackid":"123413","vote":0,"heading":"can can can ","text":"you can can i can can can lets all can can can","comments":[],"tag":[]}]'
    res.end(fakedata)
    req.headers.query = req.headers.query|| ""
    switch(req.headers.query){
      case 'datefirst':
      res.end(fakedata)
        // findby= {sort:{datetime:1},limit:10};
        break
      case 'datelast':
      res.end(fakedata)
        // findby = {sort:{datetime:-1},limit:10};
        break
      case 'voteup':
      res.end(fakedata)
        // findby = {sort:{vote:1},limit:10};
        break
      case 'votedown':
      res.end(fakedata)
        // findby = {sort:{vote:-1},limit:10};
        break
      case 'tag':
      res.end(fakedata)
      //needs to have tags in array.['hotdogs','food','bbq']
        // findby = {tag:{$in:req.headers.tag},limit:10};
        break
      case 'userid':
      res.end(fakedata)
      // start here or aboves
        // findby={tags:{userid:req.headers.userid},limit:10}
        break
      default:
      //custom query
        console.log('cant cant cant')
    }
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
  createPost:function(req,res){
    var post = postConstruct(req);
    console.log(post)
    DB.collection('postsDb').insert(post,function(err,done){
      console.log(done)
    })
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
5544fbac2d735bd22226abe5
*/
