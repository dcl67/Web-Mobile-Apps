var fs=require('fs');
var http=require('http');
var EventEmitter=require('events').EventEmitter;
var utils=require('util');

//get the api key from the keyfile in the parent directory
var key=fs.readFileSync(unescape('key.txt','utf8'));

function Weather(){
	EventEmitter.call(this);
}

utils.inherits(Weather,EventEmitter);

//returns html string for displaying weather prompt on the main page's content area
Weather.prototype.render=function(){
	var html=`
		<form>
			<h2 style="margin-top: 0">Weather Underground Hourly Forecast</h2>
			<p>This page will display an hourly forecast for your retrieved zipcode using the API provided by Weather Underground at <a href="http://api.wunderground.com/api">api.wunderground.com/api</a>. To run successfully, you will need a valid API key from wunderground stored in a file called 'key.txt and place it a directory level up from where these application files are stored.</p>
			<p>Click the button below to display an hourly forecast.</p>
			<input type="button" onclick="getWeather()" value="Get Weather" style="display: block; float: left;">
			<br>
		</form>
		<!-- Output weather in div below -->
		<div id="out_weather"></div>`;
	return html;
}

//Gets user zipcode from Weather Underground
Weather.prototype.getZip=function(){
		var options={
		host: 'api.wunderground.com',
		path: '/api/' + key + '/geolookup/q/autoip.json'
	};
	var self=this;
	//send http request to wunderground
	http.request(options, function(response){
		var str='';
		var html='';
		response.on('data', function(chunk){
			str+=chunk;
		});
		response.on('end', function(){
			var zip=JSON.parse(str).location.zip;
			console.log("Retrieved zipcode: " + zip);
			self.emit('zipEvent',zip);

		});
	}).end();
}

//Gets and displays weather data for the zip from Weather Underground
Weather.prototype.getWeather=function(zip){
	var options={
		host: 'api.wunderground.com',
		path: '/api/' + key + '/hourly/q/' + zip + '.json'
	};
	var self=this;
	console.log("Requesting hourly forecast from " + options.host);
	//send http request to wunderground
	http.request(options, function(response){
		var str='';
		var html='<h2>Hourly Forecast for ZIP code ' + zip + ':</h2>';
		response.on('data', function(chunk){
			str+=chunk;
		});
		response.on('end', function(){
			var data=JSON.parse(str).hourly_forecast;
			//Construct html from parsed json
			for(i=0;i<data.length;i++){
				html+='<b>' + data[i].FCTTIME.pretty + ':</b><br/>' + '<img src="' + data[i].icon_url + '">'
					+ data[i].condition + '<br/>Temperature: ' + data[i].temp.english + '&#8457;<br/>Humidity: '
					+ data[i].humidity + '&#37;<br/><br/>';
			}
			console.log('Got hourly forecast. Check your browser.');
			self.emit('forecastEvent',html);
		});
	}).end();
}

module.exports=Weather;
