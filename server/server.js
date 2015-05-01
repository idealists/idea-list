var express = require('express');
var bodyParser = require('body-parser');


var app = express();
app.use('/', express.static('client'));
app.use(bodyParser.json());

var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('i am at http://%s:%s', host, port);

})