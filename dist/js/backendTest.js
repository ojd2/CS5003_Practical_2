//create replies using init.js code to a few questions.
//don't call if already in Database. 
	//Actually -- do this to see what error results!
function makeReplies() {
	console.log('makeReplies backend test function called');
    sendReply(1,"this is a reply");
    sendReply(1,"here is another");
    sendReply(2, "don't hit me daddy");
    sendReply(2, "why do I always swear?");	
}
//query GET reply routes that should list replies to question id supplied
function testGetReplies(q_id) {
	console.log('testGetReplies backend test function called');
    var req = new XMLHttpRequest();
    var url = "reply?q_id=" + q_id;
    req.open("GET", url);
    req.setRequestHeader("Content-Type", "text/plain");
    req.onreadystatechange = function() {
        //to understand readState, go to: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
     	//readState == 4 means the response has finished.
     	if(req.readyState == 4) {
        	if (req.status == 200) {
        		//server has found replies and return an array
        		var obj = JSON.parse(req.responseText);
        		console.log(obj);
        	}
        	else {
        		//server otherwise return a string as an error message
        		console.log(req.responseText);	
        	} 	
   		}
  	}
    req.send(null);
}

//look into response to the post request.
function testLoginRoute() {
    var req = new XMLHttpRequest();
    req.open("POST", "login");
    req.setRequestHeader("Content-Type", "text/plain");
    req.send('{"userName":"donal","password":"justAnother"}');
}

//tests frontPage function in backend
//positive result is if page.html is returned whenever
// client accesses '/' route.
function testFrontPageRoute() {
	//create a cookie
	document.cookie = "session=donalUser; path=/";
	//then, reload the page. It will switch from login.html to page.html.    
}

/*
* Initialise testing functions on-load.
**/
function runTest() {
	console.log('Hey, into testing backend.js');
	//makeReplies();
	//testGetReplies(1);
	//testGetReplies(2);
	console.log('End of runTest init function in backend.js');
}

$(runTest);