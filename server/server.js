var express = require('express');
var bodyParser = require('body-parser');

var app = express();
/*For deployment*/
app.use('/', express.static('client'));
app.use(bodyParser.json());
app.get('/',function(req,res){
  res.sendFile('index.html',{root:"../client"});
});
/*End for deployment*/

/*For local use for Kayden*/
// app.use('/', express.static('../client'));
// app.use(bodyParser.json());
/*End local use for Kayden*/

require('./middleware.js')(app,express);

var server = app.listen(process.env.PORT||5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('i am at http://%s:%s', host, port);

});

app.post('/api/idea', function(req, res){
  var idea = req.body.text,
      token = req.body.token,
      command = req.body.command
   console.log({req.body});
   //res.send(req.body);
})