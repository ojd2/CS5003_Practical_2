/*
* Function to retrieve responses for question data and append HTML
* elements. First we begin with the Q_Container() to append 'li' 
* elements into our desired 'div' element to be our wrapper. 
*/
function Q_Container() {
	alert('inside q_container');
	// Create our <li> '.question_container' to append to <ul> 'questions'
	var container = document.getElementsByClassName('questions');
	var question = document.createElement( "li" );
  	question.className = 'question_container';
}
/*
* Next, we build with the Q_Panel() method to append two inner 'div' 
* elements into our desired 'container' element above to contain
* all our preceeding HTML elements. 
*/
function Q_Panel() {
	alert('inside q_panel');
	// Create our '.question_panel' div to append.
    var inner_q = document.getElementsByClassName('question_container');
  	var panel_q = document.createElement( "div" );
  	panel_q.className = 'question_panel';
  	// Create our '.question_header' div to append.
 	var inner_panel = document.getElementsByClassName('question_panel');
  	var header_q = document.createElement( "div" );
 	header_q.className = 'question_heading';
}
/*
* Here, we build with the Q_Replies() method to append some 
* HTML elements to our quesion 'li' elements for the replies.
* We append a 'textbox' and a 'submit button'.
*/
function Q_Replies() {
	// 	Set up a 'submit reply' button.
  	var rep_q = document.createElement( "button" );
  	rep_q.id = 'rep_submit';
  	rep_q.className = 'btn btn-primary';
  	rep_q.innerHTML = 'Submit Reply';

  	// Set up a 'textbox' for reply.
  	var rep_text = document.createElement( "textbox" );
  	rep_text.id = 'rep_textbox';
  	rep_text.className = 'form-control';
  	rep_text.setAttribute('rows', '3');
}
/*
* Finally, we integrate the appending methods for appending
* the correct HTML elements created above to eachother. We 
* also use the global 'data' variable for adding the 
* question data to the HTML dynamically. 
*/
function Q_Append_Data() {
	// Set up simple jQuery HTML append for our question from data.	
	var q_title = $('<h3 class="question-title"><a href="">' + data + '</a></h3>');
	var q_meta = $('<div class="question_meta"><b>Username:</b> ' + user + ' <b>ID:</b> 9878192010-121 </div>');
	var q_summary = $('<div class="question_summary">' + data + '</div>');

	// Append our question to container.
	$(question).appendTo(container);
	// Append our question panel to our question container.
	$(panel_q).appendTo(inner_q);
	// Append our question header to our panel.
	$(header_q).appendTo(inner_panel);
	// Append our question title to header_q.
	$(q_title).appendTo(header_q);
	$(q_meta).appendTo(header_q);
	// Append our question summary to header_q.
	$(q_summary).appendTo(header_q);
	// Append our reply to header_q.
	$(rep_text).appendTo(header_q);
	$(rep_q).appendTo(header_q);
}