var express = require('express');
var parser = require('body-parser');
var page = express(); // page is express variable
var out = [];
//express server setup
page.use(express.static(__dirname + '/'));
page.set('views', __dirname + '/');
page.engine('html', require('ejs').renderFile);
page.set('view engine', 'html');
page.use(parser.json());

page.listen(8080); // using port 8080
page.get('/', function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Method', 'GET, POST, TOPTIONS, PUT, PATCH, DELETE'); // so server can get and post back through ajax
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	next();
});
function hello(count,message){
	var out = [];
	for (i=0;i<count;i++){
		out+=message;
	}
	return out;
}
page.get('/part2', function(req, res){
	//res.send(hello(req.query.message));
	var count=req.query.count;
	var message=req.query.message;
	res.send(hello(count,message));
	console.log("Printing " + req.query.message + " " + req.query.count + " times");
});
