var mongo    = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var DB;

mongo.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ideatool', function(err, db){
  if (err) throw err;
  // when the connection occurs, we store the connection 'object' (or whatever it is) in a global variable so we can use it elsewhere.
  DB = db;
});

var ideaConstruct = function(req){
  var idea = {
    // need format like int or str for user id slackId
    userId   : req.body.userId || null,
    slackId  : req.body.slackId || null,
    title    : req.body.title || null,
    body     : req.body.body || null,
    tags     : req.body.tags || null,
    active   : true,
    votes    : 1,
    comments : []
  };
  return idea;
};

var commentConstruct = function(req){
  var comment = {
    parentId : req.body.parentId || null,
    userId   : req.body.userId || null,
    slackId  : req.body.slackId || null,
    body     : req.body.body || null,
    votes    : 0,
    comments : []
  };
  return comment;
};

module.exports = {
  getIdeas : function(req,res){
    console.log('getting')
    var ideas  = DB.collection('ideasDB');
    req.headers.query = req.headers.query || "";

    switch(req.headers.query){
      case 'dateFirst':
        ideas = ideas.find().sort({'datetime':1}).limit(10);
        break;
      case 'dateLast':
        ideas = ideas.find().sort({'datetime':-1}).limit(10);
        break;
      case 'votes':
        ideas = ideas.find().sort({votes:1}).limit(10);
        break;
      case 'tags':
      //add username to tags array for easy find of people also.
        ideas = ideas.find({tags:{$in:req.headers.tags}}).limit(10);
        break;
      case 'userId':
        ideas = ideas.find({userId:req.headers.userId });
        break;
      default:
      //custom query (to do when need arises)
        console.log('cant cant cant');
    }

    var counts;
    ideas.count(function(err, total){
      counts = total;
    });

    var results = [];
    ideas.on('data', function(data){
      results.push(data);
      if(results.length === counts){
        res.end(JSON.stringify(results));
      }
    });
  },

  createIdea : function(req,res){
    var idea = ideaConstruct(req);
    console.log('newidea')
    DB.collection('ideasDB').insert(idea, function(err, done){
      console.log('DB insert done');
      res.end(JSON.stringify(done));
    });
  },

  createComment : function(req,res){
    var comment = commentConstruct(req);
    var commentId;

    DB.collection('ideasDB').insert(comment, function(err, id){
      if (err) {console.log(err);}
      commentId = id._id;
    });

    DB.collection('ideasDB').update({_id:ObjectId(commentid)},{$push:{comments:commentid}});
    res.end('posted comment');
  }
};

/*schema

*/
