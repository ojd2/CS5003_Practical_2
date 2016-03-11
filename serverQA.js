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

// main()
var app = express()

app.use(json());
app.use(express.query());
app.use(bodyParser.text()); // For parsing POST requests 

//serve static files
app.use(express.static('node_modules'));
app.use(express.static('dist'));

//should first serve login screen, if authorised, serve question page
//question page is currently 'page.html'
//no login functionality yet
app.get('/', function(req, res){

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

});

app.get('/questions', listQuestions);
//app.get('/tasks/:id', getTask);
//app.get('/delete/:id', deleteTask);
app.post('/questions', addQuestion);

app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');
