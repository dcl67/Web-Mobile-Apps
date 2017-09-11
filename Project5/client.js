//gets table to display in HTML content div
function displayTable(){
	//Define tables URL
	var URL = 'http://localhost:8080/tables';	
	//ajax call to retrieve table data response
	$.ajax({
		type: 'GET',
		url: URL,
		data: '{}',
		dataType: 'html',
		success: function(msg){
			$('#content').html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){ //if error
			alert('client.js: Error displaying tables; Check the client.js file!');
		}
	});
}
//gets a database from opts dropdown and defines URL for retrieving specified table
function getTable(){
	var dropdown = $('#opts').get(0);
	var opt = dropdown.options[dropdown.selectedIndex].value;
	var URL = 'http://localhost:8080/gettable';
	//ajax call to request table data
	$.ajax({
		type: 'GET',
		url: URL,
		data: {'t':opt},
		dataType: 'html',
		success: function(msg){
			$('#out').html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){ //if error
			alert('client.js: Error getting table from database; check your database or \nconnection to database in server.js file!');
		}
	});
}
//gets transcript to display in HTML content div
function displayTranscript(){
	//Define transcript URL
	var URL = 'http://localhost:8080/transcripts';
	//Ajax call to retrieve transcript data response
	$.ajax({
		type: 'GET',
		url: URL,
		data: '{}',
		dataType: 'html',
		success: function(msg){
			$('#content').html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){ //if error
			alert('client.js: Error displaying transcript; check your client.js file!');
		}
	});
}
//gets transcript data for table
function getTranscript(){
	//dropdown options for student and term in database, define URL for retrieving database data
	var stud_dropdown = $('#s_opts').get(0);
	var term_dropdown = $('#t_opts').get(0);
	var s_opt = stud_dropdown.options[stud_dropdown.selectedIndex].value;
	var t_opt = term_dropdown.options[term_dropdown.selectedIndex].value;
	var URL = 'http://localhost:8080/gettrans';
	//Ajax call to request specified student and term data
	$.ajax({
		type: 'GET',
		url: URL,
		data: {'s':s_opt, 't':t_opt},
		dataType: 'html',
		success: function(msg){
			$('#out').html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){ //if error
			alert('client.js: Error getting the transcript; check your database or \nserver connection to database in server.js!');
		}
	});
}
//functionality for adding a student to database
function addStudent(){
	var URL = 'http://localhost:8080/addstudent';
	
	//Ajax call to localhost
	$.ajax({
		type: 'POST',
		url: URL,
		data: $('#studentForm').serialize(), //get data from page
		success: function(msg){
			$('#out').html(msg); //display success message
		},
		error: function(xhr, ajaxOptions, thrownError){ //if error
			alert('client.js: Could not add student; Check database or database configuration in server.js!');
		}
	});
}
//display for adding student
function displayStudentPage(){
	//Create URL to adding a student page
	var URL = 'http://localhost:8080/student';
	
	//Ajax call to display add student page
	$.ajax({
		type: 'GET',
		url: URL,
		data: '{}',
		dataType: 'html',
		success: function(msg){
			$('#content').html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){ //if error
			alert('client.js: Error displaying student; Check your database and connection to database in server.js!');
		}
	});
}