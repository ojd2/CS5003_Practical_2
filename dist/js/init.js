/*
* Function to retrieve response and appended questions to HTML question area.
*/
function displayQuestions(objects) {
	for(var i in objects) {	
		// Store our question inside the JSON into data.
		var data = objects[i].question;
	}
	// Set up foor loop to only capture the first question in data.
	// For some reason though it looks as though 'displayQuestions' is being called four times?
	// Is this to do with onstatechange? 
	for (var k = 0, length = data.length; k < 1; k++) {
		// Set up simple jQuery HTML append for our question from data.	
		var q_title = $('<h3 class="question-title"><a href="">' + data + '</a></h3>');
		$(".test_title").append(q_title);
	}
	// Simple debugging message.
	console.log("Done");
}
/*
** Retrieve the question list by making an AJAX request
*/
function getQuestions() {
    var req = new XMLHttpRequest();
    req.open("GET", "questions");
    req.setRequestHeader("Content-Type", "text/plain");
    req.onreadystatechange = function() {
        //should call function display questions
        //console.log = JSON.parse("" + req.responseText + "");
       
        var obj = JSON.parse(req.responseText.toString());
		console.log(obj);

		displayQuestions(obj);


    }
    req.send(null);
}

/*
* Add a new question by making POST request to node server. Not finished.
* Uses dumbie values for the mean-time.
**/
function sendReply(){
    var req = new XMLHttpRequest();
    req.open("POST", "reply");
    req.setRequestHeader("Content-Type", "text/plain");
    req.send('{"q_id":"2","reply":"We have successfull sent a reply to quesiton 2"}');
    req.onreadystatechange = function() {
        console.log(req.responseText);
     	//getQuestions();   	
    }
}

/*
* Add a new question by making POST request to node server
* question = a new question from user.
**/
function sendQuestion(question){
    var req = new XMLHttpRequest();
    req.open("POST", "questions");
    req.setRequestHeader("Content-Type", "text/plain");
    req.onreadystatechange = function() {
        //console.log(req.responseText);
     	getQuestions();
        	
    }
    req.send(question);


}
/*
* Initilise function to start application onload.
**/
function init() {
	// Event handler for new question submission
	$("#q_submit").click(function(event) {

			// Get data form question input element. 
			var entry = $("#q_id").val();
			//Send a post request to the server to add question to db
			sendQuestion(entry);
	});
	// Event handler for a reply to a question
	$("#rep_submit").click(function(event) {

			var li_tag = $(event.target).parent();

			//almost the unique ID for the question 
			var unique_id = $(li_tag).find("#unique_id").html();
		
			//need to get the text of the reply
		
			// Get data form question input element. 
				//event.parent
			// var question_id = $("#unique_id").val();
			// console.log('question id is:' + question_id);
		
	});
}

$(init);