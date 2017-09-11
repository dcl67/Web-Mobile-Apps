function displayCalc(){
	//Create URL to calculation page
	var URL="http://localhost:8080/calc";	
	
	//Construct AJAX request to localhost
	$.ajax({
		type: "GET",
		url: URL,
		data: "{}",
		dataType: "html",
		success: function(msg){
			$("#content").html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert("Error contacting server!");
		}
	});
}

//Gets and displays factorial or summation result to calculation page
function getCalc(){
	//Get n and calculation method specified by client
	var n=$("#n_input").get(0).value;
	var dropdown=$("#calcul").get(0);
	var opt=dropdown.options[dropdown.selectedIndex].value;
	//n will be sent to server in json
	var jsonObj={
		"n":n
	};
	//Create URL based on option chosen
	var URL="http://localhost:8080/";	
	if(opt=="fact"){
		URL+="fact";
	}
	else{
		URL+="sum";
	}
	
	//Construct AJAX request to localhost
	$.ajax({
		type: "GET",
		url: URL,
		data: jsonObj,
		dataType: "html",
		success: function(msg){
			$("#out_calc").html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert("Error contacting server!");
		}
	});
}

//Gets and displays weather prompt on main page
function displayWeather(){
	//Create URL to weather page
	var URL="http://localhost:8080/weather";	
	
	//Construct AJAX request to localhost
	$.ajax({
		type: "GET",
		url: URL,
		data: "{}",
		dataType: "html",
		success: function(msg){
			$("#content").html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert("Error contacting server!");
		}
	});
}

//Gets and displays weather data on the weather page
function getWeather(){
	//Create URL to getWeather page
	var URL="http://localhost:8080/getWeather";	
	
	//Construct AJAX request to localhost
	$.ajax({
		type: "GET",
		url: URL,
		data: "",
		dataType: "html",
		success: function(msg){
			$("#out_weather").html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert("Error contacting server!");
		}
	});
}
