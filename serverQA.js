/**
* serverQA.js
* Author: oliver and donal, borrowed from edwin
*
**/

var http = require('http');
var express = require('express');
var json = require('express-json');
var bodyParser = require('body-parser');

// TODO: Replace 'username' and 'password' with the username and password
// given by couchdb-setup
//
// You will also need to replace the server name with the details given by
// couchdb-setup
//
// NOTE: *NOT* your school/university username and password!
var nano = require('nano')('http://127.0.0.1:5984');

var taskdb = nano.db.use('questions'); // Reference to the database storing the tasks

// List all the questions information as JSON 
function listQuestions(req, res) {
    console.log('Node is to send a response to with a list of questions');
    // taskdb.get('task_info', { revs_info : true }, function (err, tasks) {
    //     res.json(tasks["task_data"]);
    // });
}

/*
* Get the task with the given id req.id.
*/
function getTask(req, res) {
    taskdb.get('task_info', { revs_info : true }, function (err, tasks) {
        res.json(tasks["task_data"][req.params.id]);
    });
}

/*
* Delete the task with the given id req.id.
*/
function deleteTask(req, res) {
    taskdb.get('task_info', { revs_info : true }, function (err, tasks) {
        delete tasks["task_data"][req.params.id];

        // Note that 'tasks' already contains the _rev field we need to 
        // update the data

        taskdb.insert(tasks, 'task_info', function (err, t) {
            res.json(tasks["task_data"]);
        });
    });
}

/*
* Add updated task information to CouchDB
*/
function updateTaskDB(entryID, tasks) {
    taskdb.insert(entryID, 'entryID', function(err_e, e) {
        taskdb.insert(tasks, 'task_info', function(err_t, t) { 
            console.log("Added task to CouchDB");
            console.log(err_e);
            console.log(err_t);
        });
    });
}

/* 
* Add a new question with the next task id (entryID)
*/
function addQuestion(req, res) {
    console.log('Node recieved this request:' + req);
    // taskdb.get('entryID', { revs_info : true }, function (err, entryID) {
    //     if (!err) {
    //         var next_entry = entryID["next_entry"];
    //         taskdb.get('task_info', { revs_info : true }, function (err, tasks) {
    //             if (!err) {
    //                 tasks["task_data"][next_entry] = { user: "edwin", task: req.body };
    //                 entryID["next_entry"] = next_entry + 1;

    //                 // Add the new data to CouchDB (separate function since
    //                 // otherwise the callbacks get very deeply nested!)
    //                 updateTaskDB(entryID, tasks);

    //                 res.writeHead(201, {'Location' : next_entry});
    //                 res.end();
    //             }
    //         });
    //     }
    // });
}

// main()
var app = express()

app.use(json());
app.use(express.query());
app.use(bodyParser.text()); // For parsing POST requests 


app.get('/questions', listQuestions);
//app.get('/tasks/:id', getTask);
//app.get('/delete/:id', deleteTask);
app.post('/questions', addQuestion);

//we cannot get the node modules to load in the client browser
//may have to look at the folder structure
//we have been able to create and initalis the DB
//once node modules can be loaded by the clients browser, we expect that 
//our server will be able to hear new questions and replys from the client
//should see this as console.log of question or reply in the node terminal
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static('dist'));
app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');
