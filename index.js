var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

mongoose.connect('mongodb://votek:votek123@ds149373.mlab.com:49373/visualizer');
var db = mongoose.connection;

var JSONSchema = new mongoose.Schema({
    name:String,
    data: Object
});

var JSONdata = mongoose.model('JSONdata', JSONSchema);

app.set('port', (process.env.PORT || 8000));

app.use(express.static(__dirname + '/dist'));
app.set('views', __dirname + '/dist');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/', function(req,res){
  res.render('/dist/index')
});

// views is directory for all template files
//app.set('app', __dirname + '/app');
//app.set('app engine', 'ejs');
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.post('/api/data', function(request, response) {
  JSONdata.findOne({}, function(err,obj){
  	if (err){
  		console.log(err)
	 	  return;
  	} 
  	new JSONdata({
        name: request.body.name,
		  	data:request.body.data
	 	}).save();
	  response.json(true);
  	return;
  })
});

app.get('/api/data', function(req,res) {
  JSONdata.find({}, function(err,data) {
    res.json(data);
  });
});
app.post('/api/remove', function(req,res) {
  JSONdata.remove({ _id: req.body.id }, function(err) {
    if (!err) {
      res.send(true);
    }
  });
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


