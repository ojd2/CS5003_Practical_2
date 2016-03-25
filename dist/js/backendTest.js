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
	console.log('Hey, into testing backend.js')
}

$(runTest);