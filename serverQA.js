/**
* March 2016, CS5003, St Andrews MSc
* serverQA.js
* Authors: Oliver and Donal, based-off Edwin's example ToDo server code.
*
**/

var http = require('http');
var express = require('express');
var json = require('express-json');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var sanitizer = require('sanitizer');

// You will also need to replace the server name with the details given by
// couchdb. Will need to include password and user name if this is setup in couchdb
// "http://user:password@addressToCouchdb"
var nano = require('nano')('http://ddm4:4hrH9Pmb@pc3-037-l.cs.st-andrews.ac.uk:20049');


var qa_db = nano.db.use('questions'); // Reference to the database storing the tasks and tags
var user_db = nano.db.use('usernames'); //Reference to the database storing usernames and passwords


/**
*   Translate cookie into username. Very silly function. Presumes all cookie come in form:
*   '<usernameValue>Cookie' that is present in session cookie in client browser.
*/
function readCookie(req) {
    var cookie = req.cookies.session;
    return cookie.slice(0,-6);
}

/**
*   If parameter ?tag=<value> matches a tag in the database, returns a lit of matching questions,
*   and status code 200.
*   If tag specified in parameter does not match any tags in database, returns an error merror, and
*   status code 404.
*   Otherwise, if query is not formatted correctly or is not present at all, returns a list of 
*   uniq tags. 
*/
function listTags (req, res) {
    var tag = req.query.tag;

    if (tag === undefined) {
        //no tag parameter supplied, thus return an array of all the tags 
        //call tag doc
        qa_db.get('tag_info', { revs_info : true }, function (err, tags) {
            var tagArr;
            tagArr = Object.keys(tags["tagKeys"]);
            res.status(200).send(tagArr);
        });
    }

    else {
        //find tag in db and return matching questions, not just the q_id!
        qa_db.get('tag_info', { revs_info : true }, function (err, tags) {

            if (tags.tagKeys[tag] === undefined) {
                //tag supplied does not match anything in tagKeys, return error
                res.status(404).send('Tag value supplied as parameter does not match any tag in DB');
            }
            else {
                //array of questions ids that match the supplied tag parameter value
                var q_idArray = tags.tagKeys[tag];

                //call questions_info document
                qa_db.get('question_info', { revs_info : true }, function (err, questions) {
                    //for every qieston in question_data, if key equals a value in q_idArray 
                    //we want to include this question object in the respond object 
                    var resultObj = {};
                    for (var question in questions["question_data"]) {
                        
                        if(q_idArray.indexOf(question) !== -1) {
                            resultObj[question] = questions["question_data"][question];
                            //resultArr.push();
                        }
                    }
                    res.status(200).send(resultObj);
                });
            }

        });

    }

}

/** 
*   Lists all replies to question identified by q_id 
*   in parameter of GET request. 
*/
function listReplies(req, res) {
    //Helpful code to use: req.originalUrl or req.query.q_id;
    var q_id = req.query.q_id;
    
    if (req.originalUrl.match(/reply\?q_id=\d+/) === null) {
        res.status(400).send("Error. To get a list of replies for a question, use the following" +  
            "GET request path: /reply?q_id=<integer> where <integer> is replaced by the" + 
            "an integer corresponding to the question ID replies are being sought for.");  
    }
    else {
        //call db for questions doc, then find replies. 
        qa_db.get('question_info', { revs_info : true }, function (err, dbDoc) {
            if (dbDoc["question_data"][q_id] === undefined) {
                res.status(404).send('That q_id does not match any question in the db! Try another integer?');
            }
            else if (dbDoc["question_data"][q_id]["replies"] === undefined) {
                //we have said q_id, but no replies as of yet. Return empty array.
                res.status(200).send([]);
            }
            else {
                var replies = dbDoc["question_data"][q_id]["replies"];
                res.status(200).json(replies);
            }
        });
    }
}

// List all the questions information as JSON, test for valid session. 
function listQuestions(req, res) {
    if (validateSession(req.cookies.session) === true) {
        qa_db.get('question_info', { revs_info : true }, function (err, questions) {
            res.json(questions["question_data"]);
        });
    }
    else {
        res.send('No valid session cookie presented. User not logged in.');
    }
}

/*
* Get the task with the given id req.id.
*/
function getTask(req, res) {
    qa_db.get('question_info', { revs_info : true }, function (err, tasks) {
        res.json(tasks["task_data"][req.params.id]);
    });
}

/*
* Delete the task with the given id req.id.
*/
function deleteTask(req, res) {
    qa_db.get('question_info', { revs_info : true }, function (err, tasks) {
        delete tasks["task_data"][req.params.id];

        // Note that 'tasks' already contains the _rev field we need to 
        // update the data

        qa_db.insert(tasks, 'question_info', function (err, t) {
            res.json(tasks["task_data"]);
        });
    });
}


/*
*   Add updated tags information to Couchdb.
*/
function updateTagInfo(tags) {
    qa_db.insert(tags, 'tag_info', function(err_t, t) { 
        console.log("Updated tag_info in CouchDB");
        //console.log(err_e);
        console.log(err_t);
    });
}

/*
*   Once reply or a tag has been added to the question data, update question_info 
*   Function very much like updateqa_db 
*   Note, does not update tag_info. See updateTaskInfo for that. 
*/
function updateQuestionInfo(questions) {
    qa_db.insert(questions, 'question_info', function(err_t, t) { 
        console.log("Added reply or a tag to a question to CouchDB");
        //console.log(err_e);
        console.log(err_t);
    });
}

/*
* Add updated question information to CouchDB
*/
function updateqa_db(entryID, questions) {
    qa_db.insert(entryID, 'entryID', function(err_e, e) {
        qa_db.insert(questions, 'question_info', function(err_t, t) { 
            console.log("Added question to CouchDB");
            console.log(err_e);
            console.log(err_t);
        });
    });
}

/*
*   Grabs Tag list doc from DB, adds tag to list if it doesn't exist. Else
*   if tag already exists, adds q_id to it's entry
*/
function checkTagList(q_id, newTag){
    //just to make sure newTag is lowercase.
    var newTag = newTag.toLowerCase();
    qa_db.get('tag_info', { revs_info : true }, function (err, tags) {
        if (!err) {
            //should be an array of replies, or undefined;
            var tagKeys = tags["tagKeys"];
            //check if tag already exists, if it doesn't then add to tagKeys
            if (Object.keys(tagKeys).indexOf(newTag) === -1) {
                tagKeys[newTag] = [];
            }
            //add q_id to the tag array
            tagKeys[newTag].push(q_id);
            //call couchDB to insert new version of document.
            updateTagInfo(tags);

        }
    });
}



/* 
*   Add a tag to a question identified by q_id body of request.
*   Tags is an array within the question's object in the question db.
*   At each index of tags array there is a uniq tag. A tag is just a string.
*/
function addTag(req, res) {   
    //supply post request in body a JSON object with a q_id and a tag
    req.body = JSON.parse(req.body);
    var q_id = req.body.q_id;
    var tag = req.body.tag.toLowerCase();

    console.log('incoming tag is:' + tag);
    console.log('incoming q_id is:' + q_id);

    //sanitise reply input here
    tag = sanitizer.escape(tag);
    tag = sanitizer.sanitize(tag); 

    qa_db.get('question_info', { revs_info : true }, function (err, questions) {
        if (!err) {
            //should be an array of replies, or undefined;
            var tags = questions["question_data"][q_id]["tags"];
            if (tags === undefined) {
                questions["question_data"][q_id]["tags"] = [];
                tags = questions["question_data"][q_id]["tags"];

            }
            if (tags.indexOf(tag) === -1) {
                //if the tag does not already exist then add to DB and return creation status code
                tags.push(tag);
                //add new data to questionDB doc
                updateQuestionInfo(questions);
                //call function have tag included in tag list
                checkTagList(q_id, tag);
                console.log("question: " + q_id + " had a tag added: " + tag);
                res.status(201).send('Tag added to question');
            }
            else {
                //tag exists in that question already, so inform client that tag exists
                res.status(301).send('Tag already exists for this question');
            }
        }
    });
}


/* 
*   Add a new reply to a question identified by q_id body of request.
*   Replies is an array within the question's object in the question db.
*   At each index of reply array is a reply. A reply is an object literal.
*   Structured like: {"text": <reply>, "userName":<userName>, "submitTime":<dateJSON>};
*/
function addReply(req, res) {   
    //supply post request in body a JSON object with a q_id and a reply text
    req.body = JSON.parse(req.body);
    var q_id = req.body.q_id;
    var reply = req.body.reply;
    var replyDate = new Date();
    replyDate = replyDate.toJSON();
    var replyObj;
    var userName = readCookie(req);

    //sanitise reply input here
    reply = sanitizer.escape(reply);
    reply = sanitizer.sanitize(reply); 

    qa_db.get('question_info', { revs_info : true }, function (err, questions) {
    if (!err) {
        //should be an array of replies, or undefined;
        var replies = questions["question_data"][q_id]["replies"];
        if (replies === undefined) {
            questions["question_data"][q_id]["replies"] = [];
            replies = questions["question_data"][q_id]["replies"];

        }
        replyObj = {"text": reply, "userName":userName, "submitTime":replyDate};
        replies.push(replyObj);
        console.log("question: " + q_id + " had a reply added: " + replyObj);
                
        // Add the new data to CouchDB (separate function since
        // otherwise the callbacks get very deeply nested!)
        updateQuestionInfo(questions);

        res.status(201).send(null);
        }
    });
}

/* 
* Add a new question with the next question id (entryID).
*    Needs to do: 
*    Adds a new question to the DB. Looks into body of 
*    post, and adds this as the question.  
*/
function addQuestion(req, res) {
    var question = req.body;
    var userName = readCookie(req);
    //santise question here

    qa_db.get('entryID', { revs_info : true }, function (err, entryID) {
        if (!err) {
            var next_entry = entryID["next_entry"];
            qa_db.get('question_info', { revs_info : true }, function (err, questions) {
                if (!err) {
                    var now = new Date();
                    var jsonDate = now.toJSON();
                    questions["question_data"][next_entry] = { user: userName, question: question, submitTime:jsonDate};
                    entryID["next_entry"] = next_entry + 1;
                    console.log(userName + " submitted question: " + question);
                    // Add the new data to CouchDB (separate function since
                    // otherwise the callbacks get very deeply nested!)
                    updateqa_db(entryID, questions);

                    res.writeHead(201, {'Location' : next_entry});
                    res.end();
                }
            });
        }
    });
}


/**
*   Validates a session id by querying sessionDb doc. Returns true or 
*   false indicating liveness of session. 
*   ISSUE:
*   Callback of user_db.get correctly finds if the session cookie matches
*   a userName. But, because it is asynchronous callback, it will not 
*   return true in the if statement of frontPage function!
*/
function validateSession(string) {
    //query DB doc to see if cookie is present in DB

    //------Currently this is not working because of the callback issues.----------
    // user_db.get('user_info', { revs_info : true }, function (err, user_info) {
    //     var userArray = Object.keys(user_info["userNames"]);
    //     var result = false;
    //     for (var i = 0; i<userArray.length; i++) {
    //         if (user_info["userNames"][userArray[i]]["sessionCookie"] === string) {
    //             result = true;
    //         }
    //     }
    //     return result;
    // });
    //-------END of broken code, stub used instead ---------//
    if (string === "edwinCookie" || string === "donalCookie" || string === "ollieCookie") {
        return true;
    }
    else {
        return false;
    }
}
      
/**
*   If a valid userName and password is present in post body, 
*   returns a session cookie for that user. Session cookie
*   must be presented in subsequent requests to other routes.
*   Otherwise, returns an error message. Cookies maintain state.
*   Possible upgrades:
*      -- Convert from hard-coded values for sessionCookie to dynamic
*       -- would be good to hash the passwords
*/
function login(req, res) { 
    req.body = JSON.parse(req.body);
    var userName = req.body.userName;
    var password = req.body.password;

    // -- Check if userName and password match db of users ------------------------------------
    user_db.get('user_info', { revs_info : true }, function (err, user_info) {

        if (user_info["userNames"][userName] &&
                user_info["userNames"][userName]["password"] === password) {
        // -- Response Logic -------------------------------------------             
            res.cookie("session", user_info["userNames"][userName]["sessionCookie"]);
            res.status(200).send(null);
        }
        else {
            res.status(404).send("Error: invalid login credentials. Try posting to /login with this as the body {\"userName\":\"edwin\", \"password\":\"notActually\"}")
        }
        // -- End of response logic ------------------------------------       
    });
    // ------- END of userName and password db function ---------------------------------------
}


/** 
*   If valid session cookie is in get header, return page.html.
*   Else return login.html.
*/
function frontPage(req, res){
    // --- Code on how accessing cookies in a request work --
    // Cookie: session=tempUser
    // req.cookies.session => "tempUser"
    // --- End of cookie helper code ------------------------

    var fileName;

    // -- Logic of this function -------------------------------------
    // if req.cookies.session is validated by validateSession function
    // then we have a live session and a known user. Response with
    // page.html, else login.html.
    if (validateSession(req.cookies.session) === true) {
        fileName = 'page.html'; 
    }
    else {
        fileName = 'login.html';
    }
    // -- End of logic of this function -------------------------------


    var options = {
    root: __dirname + '/dist/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
        }
    };

    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
        console.log('Sent:', fileName);
        }
    });

}

// --- Standard app setup for express -------------------
var app = express()
app.use(json());
app.use(express.query());
app.use(bodyParser.text()); // For parsing POST requests 
app.use(cookieParser()); //For cookie handling.

app.use(express.static('node_modules'));
app.use(express.static('dist'));
//-------------------------------------------------------


// -- Routing functions using Express as middleware follow ---------


/** If valid session cookie presented in get header, returns
*   page.html file. Else, returns login.html file. Ollie is to 
*   make login.html that will collect a user name and password. 
*   Login.html will send a post with said variables to /login. 
*/
app.get('/', frontPage);

/** If valid userName and password is present in post body,
    responds by setting the session cookie. Maintains state. 
    Otherwise, responds with an error message.  
    For now, post body as JSON: '{"userName":"edwin", "password":"notActually"}'
*/
app.post('/login/', login);


/** Returns a list of questions in JSON format. 
*   Provided valid session cookie is present.
*/
app.get('/questions/', listQuestions);


/** Adds a new question to the DB. Looks into body of 
*   post, and adds this as the question. Still a stub.
*   Only adds questions as user 'edwin'. However,
*   Upgrades to come: 
*   Provided user is logged in, reads session cookie,
*   works out who the user is, and adds appropriately 
*/
app.post('/questions/', addQuestion);


/** 
*   Responds to path /reply. If query ?q_id=<integer> parameter matches a
*   question id, responds with an array of replies for that q_id, and a 
*   status code of 200. If no query supplied (status code 400), or query is 
*   wrongly formatted (status code 400), or no such q_id exists (status code 
*   404), then response is a error message (string).
*/
app.get('/reply\?q_id=\w+|reply/', listReplies);

//add a reply to a question, need to supply question id  
// in the body of the post request as {"q_id":<VALUE>, "reply":<VALUE>}
app.post('/reply/', addReply);

/**
*   Responds to post request to path /tag. Body of post request must be a 
*   suitably formated JSON object in this format: {"q_id":<VALUE>, "tag":<VALUE>}
*   If the tag is added to the question, reponse status code = 201. 
*   If tag already exist in the question, response status code = 301.
*   All tags are converted to lower case.
*/
app.post('/tag/', addTag);

/** If no query parameter ?tag=<value>, returns a list of tags.
*   If query parameter present, returns a list of matching questions. 
*/
app.get('/tags*/', listTags);



app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');    

// ------- Testing section ------------------------

// Also see backendTest.js 

// --- func validateSession ------------
// //should return true
// console.log(validateSession('tempUser'));

// //should return false
// console.log(validateSession(''));

// //should return false
// console.log(validateSession(undefined));

// //should return false
// console.log(validateSession('true'));

// //should return false
// console.log(validateSession('terls'));
// -- end of validateSession ------------