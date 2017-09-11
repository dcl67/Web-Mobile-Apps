var express = require('express');
var parser = require('body-parser');
var page = express(); // page is express variable
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
//summation series calculation
function sum(n){
	var sum=0;
	for(var i=1;i<=n;i++){
		sum+=i;
	}
	return sum;
}
//n-series factorial calculation
function fact(n){
	var total = 1;
	for (var i=1; i<=n; i++){
		total = total *= i;
	}
	return total;
}
//bind javascript functions to urls for ajax to access
//summation call
page.get('/Summation', function(req, res){
	res.send("Sum of 1 to " + req.query.n + " is " + sum(req.query.n));
	console.log("Requesting summation series of " + req.query.n);
});
//n-factorial call
page.get('/N-factorial', function(req,res){
	res.send("Factorial of " + req.query.n + " is " + fact(req.query.n));
	console.log("Requesting factorial of " + req.query.n);
});
