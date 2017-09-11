//initialize nodejs server using express
var express=require('express');
var page=express();
var bodyparser=require('body-parser');
page.use(bodyparser.urlencoded({extended:false}));
page.use(bodyparser.json());
page.use(express.static('.'));
//MySQL connection
var mysql=require('mysql');
var con=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'lab5'
});
con.connect(function(err){
	if(err){
		console.log('server.js: Cannot connect to database');
		console.log(err);
	}
	else{
		console.log('Connected to database');
	}
});
//HTML for table display
page.get('/tables',function(req,res){
	var html=`<h2 style='margin-top: 0'>Display a Table from Database</h2>
		<p>Query the database to show Courses, Grades, or Students.</p>
		<p>Select the name of the table you wish to display from the drop-down, then click 'Show Table'</p>
		<select id='opts'>
			<option value='course'>Courses</option>
			<option value='grades'>Grades</option>
			<option value='student'>Students</option>
		</select>
		<input type='button' onclick='getTable()' value='Show Table'>
		<br/>
		<p><div id='out'></div></p>
		<br/>`;
	res.send(html);
});
//query database and send html table back
page.get('/gettable',function(req,res){
	var tbl=req.query.t;
	con.query('SELECT * FROM lab5.'+tbl,function(err,rows,fields){
		if(err){
			console.log('server.js: Error processing query');
			console.log(err);
			res.send('server.js: Error processing query');
		}
		else{
			//html to send back
			var html='<table border="1"><tr>';
			//column headers
			var headers=[];
			for(i=0;i<fields.length;i++){
				headers.push(fields[i].name);
				html+='<th>'+fields[i].name+'</th>';
			}
			html+='</tr>';
			//process row values
			for(i=0;i<rows.length;i++){
				html+='<tr>';
				for(j=0; j<headers.length;j++){
					html+='<td>'+rows[i][headers[j]]+'</td>';
				}
				html+='</tr>';
			}
			html+='</table>'
			console.log('Sending '+tbl);
			res.send(html);
		}
	});
});
//send html for transcripts display page
page.get('/transcripts',function(req,res){
	//query db for student info
	con.query('SELECT STUDENT_ID, NAME_FIRST, NAME_LAST FROM student ORDER BY NAME_LAST;',function(err,rows,fields){
		if(err){
			console.log(err);
			res.send('server.js: Error processing student query');
		}
		else{
			//html to be sent back
			var html=`<h2 style='margin-top: 0'>Display a student transcript</h2>
				<p>To display a student's transcript, select the student and a term to display, then click 'Show Transcript'</p>
				<select id="s_opts">`;
			//populate drop-down with student info
			for(i=0;i<rows.length;i++){
				html+='<option value="'+rows[i].STUDENT_ID+'">'+rows[i].NAME_LAST+', '+rows[i].NAME_FIRST+'</option>';
			}
			html+='</select>';
			//Populate list of terms for dropdown
			con.query('SELECT DISTINCT(TERM) FROM grades;',function(err,rows,fields){
				if(err){
					console.log('server.js: Error processing term query');
					console.log(err);
					res.send('server.js: Error processing term query');
				}
				else{
					//populate term/years for dropdown
					html+='<select id="t_opts"><option value="all">All</option>';
					for(i=0;i<rows.length;i++){
						html+='<option value="'+rows[i].TERM+'">'+rows[i].TERM+'</option>';
					}
					html+=`</select>
						<input type='button' onclick='getTranscript()' value='Display Transcript'>
						<br/>
						<p><div id='out'></div></p>
						<br/>`;
					console.log('Rendering transcript display page');
					res.send(html);
				}
			});
		}
	});
});
//get student/term transcript from database and send html table back to client
page.get('/gettrans',function(req,res){
	//get student id and term from json in url data
	var stu=req.query.s;
	var term=req.query.t;
	console.log('Processing transcript request for student ID='+stu);
	if(term=="all"){
		//show all terms per student
		var q_str='SELECT student.STUDENT_ID AS "Student ID", NAME_FIRST AS "First Name", NAME_LAST AS "Last Name", TERM AS "Term/Year", course.COURSE_ID AS "Course ID", COURSE_DESC AS "Description", GRADE AS "Grade" FROM course, grades, student WHERE student.STUDENT_ID=grades.STUDENT_ID AND course.COURSE_ID=grades.COURSE_ID AND student.STUDENT_ID='+stu+';';
	}
	else{
		//show specific term for student
		var q_str='SELECT student.STUDENT_ID AS "Student ID", NAME_FIRST AS "First Name", NAME_LAST AS "Last Name", TERM AS "Term/Year", course.COURSE_ID AS "Course ID", COURSE_DESC AS "Description", GRADE AS "Grade" FROM course, grades, student WHERE student.STUDENT_ID=grades.STUDENT_ID AND course.COURSE_ID=grades.COURSE_ID AND student.STUDENT_ID='+stu+' AND TERM="'+term+'";';
	}
	con.query(q_str, function(err,rows,fields){
		if(err){
			console.log('server.js: Error processing transcript query');
			console.log(err);
			res.send('server.js: Error processing transcript query');
		}
		else{
			//html table to be sent back
			var html='<table border="1"><tr>';
			//headers
			var headers=[];
			for(i=0;i<fields.length;i++){
				headers.push(fields[i].name);
				html+='<th>'+fields[i].name+'</th>';
			}
			html+='</tr>';
			//process row values
			for(i=0;i<rows.length;i++){
				html+='<tr>';
				for(j=0;j<headers.length;j++){
					html+='<td>'+rows[i][headers[j]]+'</td>';
				}
				html+='</tr>';
			}
			html+='</table>'
			res.send(html);
		}
	});
});
//get html for new student to send back 
page.get('/student', function (req,res){
	var html=`<h2 style='margin-top: 0'>Add Student to Database</h2>
		<p>To add a new student to the database, type the student's first and last name into the fields below, enter their year/month/day of birth, major from the respective drop-downs, then click "Add Student."</p>
		<form id='studentForm' action='javascript:addStudent()'>
			<fieldset style='display:inline'>
				<legend>Student Information:</legend>
				First Name:<br/>
				<input type='text' name='firstname' id='firstname' required><br/><br/>
				Last Name:<br/>
				<input type='text' name='lastname' id='lastname' required><br/><br/>
				Date of Birth:<br/>
				<input type='date' name='dob' id='dob' required><br/><br/>
				Major:<br/>
				<select name='major' id='major' required>
					<option value=''></option>
					<option value='CE'>CE</option>
					<option value='CS'>CS</option>
					<option value='IS'>IS</option>
					<option value='IT'>IT</option>
				</select>
				<br/><br/>
				<input type="submit" value="Add Student">
			</fieldset>
		</form>
		<br/>
		<p><div id='out'></div></p>
		<br/>`;
	res.send(html);
});
//add new student into db based on supplied info from new student form
page.post('/addstudent', function (req,res){
	console.log('server.js: Processing Add Student request');
	//get form data from posted html body and escape to prevent SQL injections
	var first=con.escape(req.body.firstname);
	var last=con.escape(req.body.lastname);
	var dob=con.escape(req.body.dob);
	var major=con.escape(req.body.major);
	console.log('First: '+first+' Last: '+last+' DoB: '+dob+' Major: '+major);
	//sql string to check if student already exists, based on name and DoB
	var q_find_str="SELECT NAME_FIRST, NAME_LAST, BIRTH_DATE, MAJOR FROM student WHERE NAME_FIRST="+first+" AND NAME_LAST="+last+" AND BIRTH_DATE="+dob+";";
	con.query(q_find_str,function(err,rows,fields){
		if(err){
			console.log('server.js: Error during find student query processing');
			console.log(err);
			res.send('Error during find student query processing');
		}
		else if(rows.length>0){ //if student already exists, do not add again
			console.log('server.js: Error: attempt to add existing student to DB');
			res.send('Error: student already exists!');
		}
		else{ //add new student
			//sql string to insert new student into db
			var q_add_str="INSERT INTO student(NAME_FIRST, NAME_LAST, BIRTH_DATE, MAJOR)VALUES("+first+","+last+","+dob+","+major+");";
			con.query(q_add_str, function(err,rows,fields){
				if(err){
					console.log('server.js: Error during add student query processing');
					console.log(err);
					res.send('Error during add student query processing');
				}
				else{
					console.log('server.js: Added new student to database');
					res.send('Student Added!');
				}
			});
		}
	});
});
//homepage redirection
page.get('*',function (req, res) {
	res.redirect('./index.html');
});
//listen to port 8080
page.listen(8080,function(){
	console.log('Running server');
});
