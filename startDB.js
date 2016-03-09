/// Run this first, to initialise the data in CouchDB

// WARNING: It will delete any existing database called 'tasks'!

// TODO: Replace 'username' and 'password' with the username and password
// given by couchdb-setup
//
// You will also need to replace the server name with the details given by
// couchdb-setup
//
// NOTE: *NOT* your school/university username and password!
var nano = require('nano')('http://127.0.0.1:5984');

// our application's model, populated with one entry
var entryID = { "next_entry" : 3 };
var init_questions = { "question_data" :
                    {"1": {"user": "edwin", "question": "How do I ?"},
                     "2": {"user": "edwin", "question": "Is there a ?"}} };

nano.db.destroy('questions', function (err, body) {
   console.log(err);
});

nano.db.create('questions', function (err, body) {
    taskdb = nano.db.use('questions');
    if (!err) {
        
        // Database didn't exist, so populate it with some initial data
        taskdb.insert(init_questions, 'question_info', function(err, body) {
            if (!err) {
                console.log("Initialised question info:");
                console.log(body);
            } else {
                console.log("Error when initialising question info");
                console.log(err);
            }
        });

        taskdb.insert(entryID, 'entryID', function(err, body) {
            if (!err) {
                console.log("Initialised Entry ID:");
                console.log(body);
            } else {
                console.log("Error when initialising entry ID");
                console.log(err);
            }
        })
    }
});

