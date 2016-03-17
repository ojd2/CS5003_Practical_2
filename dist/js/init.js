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
var container, question, inner_q, panel_q, header_q, inner_panel, rep_q,
rep_text, rep_submit, rep_reply, q_title, q_meta;

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
	req = new XMLHttpRequest();
    req.open("GET", "questions");
    req.setRequestHeader("Content-Type", "text/plain");
    req.onreadystatechange = function() {

        // Call our loopArray method below.
        loopArray(objects);

		// Loop through.
      	function loopArray() {
      		for(var i in objects) {	
      			// Store our question inside the JSON into data.
				// Create our <li> '.question_container' to append to <ul> 'questions'
				container = document.getElementsByClassName('questions');
				question = document.createElement( "li" );
			  	question.className = 'question_container';
			  	question.innerHTML = '<div class="question_panel">' + 
			  	'<div class="question_heading">' + 
			  	'<h3 class="question-title"><a href="">' +
			  	objects[i].question +
			  	'</a></h3>' + 
			  	'<div class="question_meta"><b>Username:</b> ' +
			  	objects[i].user +
			  	' <b>ID:</b> ' +
				objects[i].question + 
			  	'</div>' +
			  	'<div class="question_summary"><b>Reply:</b> ' + objects[i].question + 
			  	'</div>' + 
			  	'</div>' + 
			  	'<div>';

			  	// Set up a 'submit reply' button.
			  	rep_q = document.createElement( "button" );
			  	rep_q.id = 'rep_submit';
			  	rep_q.className = 'btn btn-primary';
			  	rep_q.innerHTML = 'Submit Reply';

			  	// Set up a 'textbox' for reply.
			  	rep_text = document.createElement( "textarea" );
			  	rep_text.id = 'rep_textbox';
			  	rep_text.className = 'form-control';
			  	rep_text.setAttribute('rows', '3');
			  	
			  	// Append our HTML to container.
				$(question).appendTo(container);
				$(rep_text).appendTo(question);
				$(rep_q).appendTo(question);	

			}
      	}      	
    }
    req.send(null);
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Retrieve ALL data then apply sort algorithm.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function orderKeys(objects) {
var sorted = [];
 Object.keys(objects)
    .sort(function(a, b) {
  			return a - b;
	}).reverse()
	
    .forEach(function(v, i) {
          console.log(objects[v]);
          sorted.push(objects[v]);         
   	});
   	// Call to our display method.
   	displayAll(sorted);
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
    	orderKeys(JSON.parse(req.responseText));
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
  		// Call displayQuestion whilst parsing our objects.
        displayQuestion(JSON.parse(req.responseText));
    }
    req.send(null);
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Add a reply by making POST request to node server. Not finished.
// Uses dummy values for the mean-time.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function sendReply(){
    req = new XMLHttpRequest();
    req.open("POST", "reply");
    req.setRequestHeader("Content-Type", "text/plain");
    req.send('{"q_id":"2","reply":"We have successfull sent a reply to quesiton 2"}');
    req.onreadystatechange = function() {
        console.log(req.responseText);
     	//getQuestions();   	
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
     	getQuestion();
    }
    req.send(question);


}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Initilise function to start application onload.
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
function init() {
	// Display all questions on page load.
	getResponse();

	// Event handler for new question submission.
	$("#q_submit").click(function(event) {
			// Get data form question input element. 
			var entry = $("#q_id").val();
			// Send a post request to the server to add question to db
			sendQuestion(entry);
	});
	
	// Event handler for a replying to a question.
	$("#rep_submit").click(function(event) {
			var li_tag = $(event.target).parent();
			// Almost the unique ID for the question 
			var unique_id = $(li_tag).find("#unique_id").html();
			// Need to get the text of the reply
			// Get data form question input element. 
			// event.parent
			// var question_id = $("#unique_id").val();
			// console.log('question id is:' + question_id);
		
	});
}

$(init);