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

// You will also need to replace the server name with the details given by
// couchdb. Will need to include password and user name if this is setup in couchdb
// "http://user:password@addressToCouchdb"
var nano = require('nano')('http://127.0.0.1:5984');

var qa_db = nano.db.use('questions'); // Reference to the database storing the tasks

/** 
*  List all the replies to a question identified by q_id in body of request
*  Problem: Server crashes if q_id supplied does not exist in question_data
*  Solution: Return error message if there is no q_id in path
*  if (req.query.match(/reply/){
*       return "Error. No q_id supplied"  
*  }
*/
function listReplies(req, res) {
    //req.originalUrl;
    //req.query.q_id;
    var q_id = req.query.q_id;


    if (req.query.match(/reply/) == "/reply/"){
       res.send("Error. No q_id parameter supplied. Path should be /reply/?q_id=value");  
    }   
    //call db for questions doc, then find replies. 
    qa_db.get('question_info', { revs_info : true }, function (err, dbDoc) {
        var replies = dbDoc["question_data"][q_id]["replies"];
        

        //to catch bad q_id not in database
        if (replies == undefined) {
            res.json(replies);
        }
        else {
            res.send('q_id does not match any question in the db');
        }
    });
}

// List all the questions information as JSON 
function listQuestions(req, res) {
    qa_db.get('question_info', { revs_info : true }, function (err, questions) {
        res.json(questions["question_data"]);
    });
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
* Once reply has been added, updated question doc.
* Function very much like updateqa_db 
*/
function updateTEMP(questions) {
    qa_db.insert(questions, 'question_info', function(err_t, t) { 
        console.log("Added reply to a question to CouchDB");
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
* Add a new reply to a question identified by q_id body of request
*/
function addReply(req, res) {
    //supply post request in body a JSON object with a q_id and a reply text
    req.body = JSON.parse(req.body);
    var q_id = req.body.q_id;
    var reply = req.body.reply;

    qa_db.get('question_info', { revs_info : true }, function (err, questions) {
    if (!err) {
        //should be an array of replies, or undefined;
        var replies = questions["question_data"][q_id]["replies"];
        if (replies == undefined) {
            questions["question_data"][q_id]["replies"] = [];
            replies = questions["question_data"][q_id]["replies"];
            console.log('into if statement');

        }
        replies.push(reply);
        console.log("question: " + q_id + " had a reply added: " + reply);
                
        // Add the new data to CouchDB (separate function since
        // otherwise the callbacks get very deeply nested!)
        updateTEMP(questions);

        res.writeHead(201, {'Location' : 'Not sure this is needed?'});
        res.end();
        }
    });
}

/* 
* Add a new question with the next question id (entryID)
*/
function addQuestion(req, res) {

    qa_db.get('entryID', { revs_info : true }, function (err, entryID) {
        if (!err) {
            var next_entry = entryID["next_entry"];
            qa_db.get('question_info', { revs_info : true }, function (err, questions) {
                if (!err) {
                    questions["question_data"][next_entry] = { user: "edwin", question: req.body };
                    entryID["next_entry"] = next_entry + 1;
                    console.log("user edwin submitted question: " + req.body);
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
*   If valid session cookie is in get header, return page.html.
*   Else return login.html.
*/
function frontPage(req, res){

    var options = {
    root: __dirname + '/dist/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
        }
    };

    var fileName = 'page.html';
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

// --- Standard app setup for express ---------
var app = express()
app.use(json());
app.use(express.query());
app.use(bodyParser.text()); // For parsing POST requests 

app.use(express.static('node_modules'));
app.use(express.static('dist'));
//--------------------------------------------


// -- Routing functions using Express as middleware follow ---------


/** If valid session cookie presented in get header, returns
*   page.html file. Else, returns login.html file. Ollie is to 
*   make login.html that will collect a user name and password. 
*   Login.html will send a post with said variables to /login. 
*/
app.get('/', frontPage);

//Username and password in post body. The function will check
//the user database to match the password/username. If valid,
//returns a session cookie for that user, that must be presented
//on subsequent requests. (Maintains state.) Otherwise, returns
//an error message that no such user exists.
app.post('/login/', login);

//front page, hit up a list of questions like in quora
app.get('/questions/', listQuestions);


app.post('/questions/', addQuestion);


//send question id, return replies
app.get('/reply\?q_id=\w+|reply/', listReplies);

//add a reply to a question, need to supply question id  
app.post('/reply/', addReply);


//app.get('/tasks/:id', getTask);
//app.get('/delete/:id', deleteTask);

app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');
