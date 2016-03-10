// Set up some MVC for appending our data to the HTML.


// First we must identify our objects. 
// Objects (for loop) that has to be traversed through.
// For latest object- append to area in HTML. (HTML may need an area which is called 'latest').
// Remaining objects can go into an HTML area called 'remaining'


// For loop for 'questions'.
// Abstracted version.
for (var k = 0, length = questions.length; k < length; k++) {
	alert(questions[k]);

	// Append q_title
	// var q_title = $("<li id=\"" + i + "\">" + i + ": " + questions[i].question + "</li>").click(
 //                 function(event) {
 //                     // deleteTask(event.target.id);
 //                     alert('clicked');
 //                 }
 //            ); 

    //$("#tasklist").append(newli);
}


