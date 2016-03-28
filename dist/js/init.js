// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
//	First, begin with some global data vars.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
var response = [];
var req, data, user;
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
//	Next, begin with some global HTML vars.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
var container, question, reply, inner_q, panel_q, header_q, inner_panel, 
rep_q, rep_text, rep_submit, rep_reply, rep_time, rep_val, rep_area, test,
 q_title, q_meta, q_id, date, userName, password;

function displayReplies(objects) {
 // For identifying which question
 // has a reply, we must identify
 // the unique id of each question
 // inserted into the DB. To do this,
 // we make use of the JSON layout
 // couchDB provides. 

 // Each question submitted to the DB,
 // has the following delegated layout:
 
 // "question_data": {
 //       "1": {
 //           "user": "edwin",
 //           "question": "How do you make pancakes?"
 //       },
 //       "2": {
 //           "user": "edwin",
 //           "question": "What are the films every programmer must watch?"
 //       }

 // With this in mind, we can identify
 // each question by using the global
 // object key. In this case it will be 
 // the index number [1,2].

 // To fetch the index key numbers
 // we can do a simple for each loop inside
 // the Object.keys() method. However, unlike
 // the sorted method, we do NOT need to 
 // include .reverse().

	// Here we loop through our
	// objects without being sorted.

	
	alert('inside displayReplies()');
	//console.log(objects);
	var obj = [];
	obj.push(objects);

	console.log(obj);

	

	

	// var obj = JSON.parse(objects);
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Function to retrieve response & appended question to HTML question.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function displayQuestion(objects) {
	// Clear empty.
    $('.questions').html('');
	// Call sort method once again for parsed response.
	orderKeys(objects);
	// Simple debugging message.
	console.log("Done");
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Function to retrieve response & appended all questions to HTML question.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function displayAll(objects) {
		// Clear empty.
    	$('.questions').html('');
        	// Here we use the Object.key Prototype method
        	// which simply iterates through all objects 
        	// passed from the associative array and for 
        	// each object - appends HTML values. It 
        	// passes the parameter of k, which we also use
        	// to be our unique id for each question.
        	// This should correlate with the JSON data 
        	// found in couchDB. For example, question number
        	// 4 should be matching with the question: 
        	// "What are some must watch films by Krzysztof Zanussi?".
        	// we perform a simple sort again
      		Object.keys(objects).reverse().forEach(function(k) {
      			// Store our question inside the JSON into data.
				// Create our <li> '.question_container' to append to <ul> 'questions'
				container = document.getElementsByClassName('questions');
				question = document.createElement( "li" );
			  	question.className = 'question_container';
			  	question.innerHTML = '<div class="question_panel">' + 
			  	'<div class="question_heading">' + 
			  	'<h3 class="question-title"><a href="">' +
			  	objects[k].question +
			  	'</a></h3>' + 
			  	'<div class="question_meta"><b>Username:</b> <span id="q_username"> ' +
			  	objects[k].user +
			  	'</span> <b>ID:</b> <span id="q_id"> '+
			  	k +
			  	'</span> <b>Submitted:</b> <span id="q_time"> '+
			  	objects[k].submitTime +
			  	'</span></div>' +
			  	'<div class="question_summary"><b class="rep_title">Replies:</b> <div class="q_replies">' +
			  	// '<p id="rep_text">' + 
			  	// replies go in here
			  	// '</p>' +
			  	'</div></div>' + 
			  	'</div>' + 
			  	'</div>' + 
			  	'<h3 class="reply-title">Submit a reply:</h3>';

			  	// Set up a 'submit reply' button.
			  	rep_q = document.createElement( "button" );
			  	rep_q.className = 'rep_submit btn';
			  	rep_q.innerHTML = 'Submit Reply';

			  	// Set up a 'textbox' for reply.
			  	rep_text = document.createElement( "textarea" );
			  	//rep_text.id = 'rep_textbox';
			  	rep_text.className = 'form-control rep_textbox';
			  	rep_text.setAttribute('rows', '3');
			  	
			  	// Append our HTML to container.
				$(question).appendTo(container);
				$(rep_text).appendTo(question);
				$(rep_q).appendTo(question);	
				
				// Call get request for replies now.
				//getReply();

				// Hide replies if JSON key is not present.
				// Use some simple HTML DOM manipulation for now.
				//var t = $('.rep_title');
				//$('#rep_text:contains("undefined")').html('<p class="no_rep">No replies have been submitted...</p>');
				

			});

}


// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Retrieve ALL data then apply sort algorithm.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function orderKeys(objects) {
 // To get our objects to display latest
 // question first within the application,
 // we must sort our objects accordingly.
 // We want to grab all objects simply push
 // our sorted objects into an associative array.
 var sorted = {};

 Object.keys(objects).sort(function(a, b) {
  	 	return a - b;
 }).forEach(function(v, i) {
       // Push our objects into the 
       // associative array: sorted.
       //console.log('NOT : ' + v +  ' : ');
 	   //console.log(objects[v]);
       sorted = objects;
   	});
 	
   	// Call to our display method for
   	// the sorted associative array.
   	displayAll(sorted);
   	displayReplies(sorted);
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Retrieve ALL data by making an AJAX request.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function getResponse() {
    req = new XMLHttpRequest();
    req.open("GET", "questions");
    req.setRequestHeader("Content-Type", "text/plain");
    req.onreadystatechange = function() {
        // Call sorting method for our parsed response.
    	if (req.readyState == 4) {
    		orderKeys(JSON.parse(req.responseText));
   		}
    }
    req.send(null);
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Retrieve the question list by making an AJAX request.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function getQuestion() {
    req = new XMLHttpRequest();
    req.open("GET", "questions");
    req.setRequestHeader("Content-Type", "text/plain");    
    req.onreadystatechange = function() {
  		if (req.readyState == 4) {
  			displayQuestion(JSON.parse(req.responseText));
  		}
  		// Call displayQuestion whilst parsing our objects.
    }
    req.send(null);
    
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Retrieve the question list by making an AJAX request.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// function getReply() {
//     req = new XMLHttpRequest();
//     req.open("GET", "questions");
//     req.setRequestHeader("Content-Type", "text/plain");
//     req.onreadystatechange = function() {
//   		// Call displayQuestion whilst parsing our objects.
//   		alert('inside getReply()');
//         displayReplies(JSON.parse(req.responseText));
//     }
//     req.send(null);
// }
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Add a reply by making POST request to node server.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function sendReply(){
    req = new XMLHttpRequest();
    req.open("POST", "reply");
    req.setRequestHeader("Content-Type", "text/plain");
    req.send('{"q_id":"'+q_id+'","reply":"'+rep_val+'"}');
    req.onreadystatechange = function() {
 	  	if (req.readyState == 4) {
    		alert('inside sendReply');
    		getReply();
    	}
    }
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Add a new question by making POST request to node server
// question = a new question from user.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function sendQuestion(question){
    req = new XMLHttpRequest();
    req.open("POST", "questions");
    req.setRequestHeader("Content-Type", "text/plain");
    req.onreadystatechange = function() {
        //console.log(req.responseText);
     	if (req.readyState == 4) {
     		getQuestion();     		
     	}
    }
    req.send(question);


}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
//Open a post request to path /login, with userName and password formatted
//into JSON object. If successful login, reload client browser to path '/'
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

function loginRoute(userName, password) {
    var req = new XMLHttpRequest();
    req.open("POST", "login");
    req.setRequestHeader("Content-Type", "text/plain");
    req.send('{"userName":"' + userName + '","password":"' + password + '"}');
    //to handle the response from the server
    req.onreadystatechange = function() {
     	if(req.readyState == 4) {
        	if (req.status == 200) {
        		//client has now a valid session cookie, login was successful
				window.location.assign("/");
			}
        	else {
        		//login failed, retry with another password/username
        		$('.loginError').css('display', 'block').html('<h1>Error!</h1><br' +
        		' /><h3>Login Credentials were rejected! Please try again or contact' +
        		' the web administrator!</h3>');	
        	} 	
   		}
    }
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Initialise function to start application onload.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function init() {
	// Display all questions on page load.
	// Clear empty.
    $('.questions').html('');
	getResponse();
	//alert('load');
	
	// Event handler for submit login button.
	$("#loginButton").click(function(event) {
		// Get data from userName and password input elements when submit button
		// is clicked by the user on login.html
		userName = $("#userName").val().trim();
		password = $("#userPassword").val().trim();
		
		//Send a post request to '/login/' with the body of request in JSON
		//formatted like this example: '{"userName":"edwin", "password":"notActually"}'
		loginRoute(userName, password);

		//if loginRoute is successful, a cookie will be stored on the client browser and
		//loginRoute will redirect the client browser to path '/' where page.html will 
		//be served.

	});
		

	// Event handler for new question submission.
	$("#q_submit").click(function(event) {
			// Get data form question input element. 
			var entry = $("#userQuestion").val();
			if (entry.length === 0) {
				$('#userQuestion').attr('placeholder', 'You cannot submit a blank question!');
				$('.q_container').addClass('has-error').css('border', '1px solid red');
			}
			else {
				// Send a post request to the server to add question to db
				sendQuestion(entry);
				// Clear textbox, set values back (as-was) before any errors.
				$('#userQuestion').val('');	
				$('#userQuestion').attr('placeholder', 'Write your question here.');
				$('.q_container').removeClass('has-error').css('border', 'none');						
			}

	});
	
	// Event handler for a replying to a question.
	$(".rep_textbox").keypress(function(event) {
			// alert('inside rep_submit click');	
			if ( $('.rep_textbox:focus').length > 0 ) {
			// Identify parent HTML element.
			// This would be our <li> element.
			var $textarea = $('.rep_textbox'),
    		$parent = $textarea.parent();
    		console.log($parent);
			
			// Here we search within the parent for 
			// the unique id number of the proposed
			// question. We store this in a value 
			// called 'q_id'. We also search for the 
			// textarea within the selected parent.
			// This way we can capture multiple changes
			// on the go. We store the reply values in 
			// a value called 'rep_val'.
			q_id = $(this).closest('li').find('#q_id').html().trim();
			}
		});

	$(".rep_submit").click(function(event) {
			// Finally, we can grab the value of the 
			// textbox. We store the value inside the 
			// value 'rep_val'. 
			// Here we, get value and trim white spaces.
			rep_val = $(this).closest("li").find(".rep_textbox").val().trim().toString();
			console.log(q_id+':'+ rep_val);
			 
			
			// Call the sendReply method.       
			sendReply();
			// Call the sendTimeStamp method.
			//sendTimeStamp();
			// Clear textbox
			$('.rep_textbox').val('');
			// Reload after submit.
			// location.reload();
	});
}

$(init);