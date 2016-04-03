// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
//	First, begin with some global data vars.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
var response = [];
var sorted = {};
var req, data, user;
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
//	Next, begin with some global HTML vars.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
var container, question, reply, inner_q, panel_q, header_q, inner_panel, 
rep_q, rep_text, rep_submit, rep_reply, rep_time, rep_val, rep_area, test,
 q_title, q_meta, q_id, date, userName, password, tag_value, search_value;


/*
*	Attach event handler to capture search term from search input area.
* 	Triggers an algorithm to search through questions and find matches.
*/
function addSearchHandler() {
	$(".search_submit").click(function(event) {
		alert('trigger search');
		search_value = $('#search').val().trim().toString();
		console.log(search_value);

		Object.keys(sorted).reverse().forEach(function(j) {
			
			if(sorted[j].question === search_value) {
				console.log('found question');
			} else {
				console.log('not found any matches');
			}
		});


	});
}
/*
*	Attach event handler to all reply submit buttons to capture reply 
*	to a question. Call function after replies have been added to HTML DOM.
*/
function addReplyHandlers() {
	// Event handler for a replying to a question.
	$(".rep_submit").click(function(event) {
		// Finally, we can grab the value of the 
		// textbox. We store the value inside the 
		// value 'rep_val'. 
		// Here we, get value and trim white spaces.
		q_id = $(this).closest('li').find('#q_id').html().trim();

		rep_val = $(this).closest("li").find(".rep_textbox").val().trim().toString();

		console.log('repl_val: '+ rep_val);
		// Conditionals to make sure users cannot submit empty replies.
		if (rep_val === " " || rep_val === "") {     
			$('.rep_textbox').css('border', '1px solid red');
			$('.reply-title').html('Please enter a reply.');
			return false;
		}
		else {
			// Call the sendReply method if user has entered content into textbox.
			sendReply();
		}
		// Clear textbox upon submit to clear values.
		$('.rep_textbox').val('');
	});
}
/*
*	Attach event handler to add / remove tags submitted for each question. 
*	Call function after 'Edit tags' input has been added to HTML DOM.
*/
function addTagHandlers() {
	// Event handler for adding / removing tags to a question
	// via clicking the 'edit_tag' span. 
	$('.edit_tag').click(function(event) {
		// We display a dropdown animation for showing
		// our input box and appedning to HTML inside the parent container.
		$(this).parent().find('.show_tags').slideToggle();
		// Create a variable for our tag HTML area.
		var tag_area = document.getElementsByClassName("show_tags");
		// We then append HTML to our tag HTML area.
		$(tag_area).html('<input type="text" class="tag_entry form-control" placeholder="Choose a topic">' + 
		'<button type="button" class="add_tag btn btn-default">Add Topic</button>');

			$('.add_tag').click(function(event) {
				// Additionally, we have to collect the question id.
				q_id = $(this).closest('li').find('#q_id').html().trim();
				// Capture the value of the tag input area.
				tag_value = $(this).closest("li").find(".tag_entry").val().trim().toString();
				// Conditionals to make sure users cannot submit empty replies.
				if (tag_value === " " || tag_value === "") {     
					$('.tag_entry').css('border', '1px solid red');
					$('.tag_entry').attr('placeholder', 'Missing Topic!');
					return false;
				}
				else {
					console.log('Entered Tag value: ' + tag_value);
					// Call the sendTag method if user has entered content into input area.
					sendTag();
					//sendTag(tag_value);
					// Clear values.
					$('.tag_entry').html('');
				}
			});
	});
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Function to request POST method for question tags.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// SENDTAG() METHOD TO GO HERE
// WILL DO THIS ONCE ServerQA.js has been edited accordingly.
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
      			// Make timestamp collected from DB readable for humans.
      			timestamp = objects[k].submitTime;
      			// A simple replace method to remove and add spacing.
      			// Additional slice is applied to remove excessive GMT labels and miliseconds.
      			subTime = timestamp.toString().replace('T', ' @ ').slice(0,18);
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
			  	'<div class="question_meta"><span class="q_info"><b>Username:</b> ' +
			  	objects[k].user +
			  	'</span> <span class="q_info"><b>ID:</b> <span id="q_id">'+
			  	k +
			  	'</span></span> <span class="q_info"><b>Submitted:</b> '+
			  	subTime +
			  	'</span></div>';
			  	// Begin Question Tags HTML area.
			  	if (objects[k].user !== undefined) {
					// Add tags to HTML below.
					question.innerHTML += '<input class="btn btn-default btn-tag" type="button" value="' + objects[k].user + '">';
					// Begin 'edit tags' HTML area.
					question.innerHTML +=
					'<div class="tags_container form-inline">' +
					'<div class="show_tags col-xs-4 "></div>' +
					'</div>' +
					'<div class="clearfix"></div>' +
					'<span class="edit_tag badge">Edit Topics ' + 
					'<span class="glyphicon glyphicon-edit" aria-hidden="false"></span>' +
					'</span>';
				} else {
					question.innerHTML +=
					'<div class="clearfix"></div>' +
					'<span class="edit_tag badge">Add Topic ' + 
					'<span class="glyphicon glyphicon-edit" aria-hidden="false"></span>' +
					'</span>' +
					'<div class="show_tags"></div>';
				}
				// Begin Replies HTML area.
			  	question.innerHTML += '<b class="rep_title">Replies:</b>';
			  	if (objects[k].replies !== undefined) {
			  		for (var e = 0; e < objects[k].replies.length; e++) {
			  			var repTime = objects[k].replies[e].submitTime;
			  			if(repTime !== undefined) {
			  			var repTimeFormatted = repTime.toString().replace('T', ' @ ').slice(0,18);
			  			}
			  			question.innerHTML += '<p class="q_reply">' + objects[k].replies[e].text + '</p>' + 
			  			'<div class="q_rep_meta bg-primary"><span class="q_rep_info"><b>User:</b> '  + objects[k].replies[e].userName + '</span>' + 
			  			'<span class="q_rep_info"> <b>Submitted:</b> ' + repTimeFormatted + '</span>' +
			  			'</div>';
			  		}
			  	}
			  	else {
			  		question.innerHTML += '<p class="q_no_rep">No replies have yet been submitted for this question.</p>';
			  	}

			  	// Finish our HTML structure.
			  	question.innerHTML += 
			  	'</div>' + 
			  	'</div>' + 
			  	'</div>' + 
			  	// Begin our Reply Textarea and Button HTML.
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
 Object.keys(objects).sort(function(a, b) {
  	 	return a - b;
 }).forEach(function(v, i) {
       // Push our objects into the 
       // associative array: sorted.
       //console.log('NOT : ' + v +  ' : ');
 	   //console.log(objects[v]);
       sorted = objects;
   	});
 	
   	// Call display all method for appending questions
   	// on assosciative array. Data used will be latest
   	// data from request.
   	displayAll(sorted);
   	// Next, we can now call our event handler methods.
   	// These have to be called here because the DOM
   	// elements manipulated inside the methods are not
   	// appened until displayAll() is called.
   	addReplyHandlers();
   	addTagHandlers();
   	addSearchHandler();

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
// Add a tag by making POST request to node server.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function sendTag(){
    req = new XMLHttpRequest();
    req.open("POST", "tag");
    req.setRequestHeader("Content-Type", "text/plain");
    req.send('{"q_id":"'+q_id+'","tag":"'+tag_value+'"}');
    req.onreadystatechange = function() {
 	  	if (req.readyState == 4) {
    		//refresh the question panel.
    		getResponse();
    	}
    }
}

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
    		//refresh the question panel.
    		getResponse();
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
	// Attach event handler to logout users by deleting cookie.
	$("#logout").click(function(event) {
		document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
		window.location.assign('/');
	});
	// Display all questions on page load.
	// Clear empty.
    $('.questions').html('');
	getResponse();
	
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
}
$(init);