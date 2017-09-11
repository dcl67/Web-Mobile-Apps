var express=require('express');
var http=require('http');
var page=express();

var calc=require('./calculator');
var c= new calc();

//import weather module
var WeatherController=require('./weather');
var wc= new WeatherController();

//refer to local dir, change if moving this script to another dir
page.use(express.static("."));

//send html for calculation page to client
page.get('/calc', function (req,res){
	var html=c.render();
	res.send(html);
})

//process a factorial request
page.get('/fact', function (req,res){
	var n=req.query.n;
	//check for valid input
	if(n==""){
		res.send("Enter the n first!");
	}
	else if(n<0){
		res.send("Input must be positive integer!");
	}
	else if(n>0){
		//Call the fact function from the module
		var result=c.fact(n);
		console.log("Factorial result is " + result + "\n");
		res.send("The factorial of " + n + " is " + result);
	}
	else{
		res.send("Invalid input. Input must be positive integer");
	}
})

//process a summation request
page.get('/sum', function (req,res){
	var n=req.query.n;
	//check for valid input
	if(n==""){
		res.send("Nothing entered- please enter a positive integer");
	}
	else if(!isInt(n)){
		res.send("Input not an integer!");
	}
	else if(n<0){
		res.send("Input must be positive integer!");
	}
	else{
		//Call the sum function from the module
		var result=c.sum(n);
		console.log("Summation result is " + result + "\n");
		res.send("The summation of " + n + " is " + result);
	}
})

//send html for weather page to client
page.get('/weather', function (req,res){
	var html=wc.render();
	res.send(html);
})

//send weather forecast data as html to client
page.get('/getWeather', function (req,res){
	//first obtain zip from wunderground
	wc.once('zipEvent', function(zip){
		//with zip, request forecast data from wunderground
		wc.once('forecastEvent', function(msg){
			res.send(msg);
		});
		wc.getWeather(zip);
	});
	wc.getZip();
})

//Redirect ny other URL request to the main page
page.get('*',function (req, res) {
	res.redirect('./index.html');
});

//Have the server listen to port 8080
page.listen(8080,function(){
	console.log('Server Running');
});

//returns true if value is an integer
function isInt(value) {
  return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}
