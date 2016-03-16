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
var entryID = { "next_entry" : 10 };
var init_questions = { "question_data" :
                    {"1": {"user": "edwin", "question": "Is Turkey good for business?"},
                     "2": {"user": "edwin", "question": "Is it wrong to pay a bribe?"},
                     "3": {"user": "edwin", "question": "How do I account for a bribe in my ledger?"},
                     "4": {"user": "edwin", "question": "Is Erdogan more powerful than Putin?"},
                     "5": {"user": "edwin", "question": "Random Kurdish rebels asking for a couch-surfing request - how to say no."},
                     "6": {"user": "edwin", "question": "I don't want to join the PKK but I think I might need some help."},
                     "7": {"user": "edwin", "question": "How many mushroom can fill a lamp?"},
                     "8": {"user": "edwin", "question": "Computer interviewing questions and answers."},
                     "9": {"user": "edwin", "question": "Does a PhD destroy your soul? 32 other reasons to say No!"},
                 } };

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

