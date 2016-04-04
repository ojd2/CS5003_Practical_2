# CS5003_Practical_2

The following project was built for a online web application assignment for the University of St.Andrews School of Comupter Science. The project was submitted on 04/04/2016.

# Glasgow Echo

Glasgow Echo is a small node js application which was built with express.js and CouchDB. The application is a simple
question and answer application which subsequently retrieves server side data and appends to the DOM in real time.

# Credits

The application was built in collaboration with Donal Mee. 

# How to run the web app

1. Clone the repo (as the NPM modules are included in the repo, you will not have to install the modules this way. It's a little quicker as we do not have a package.json file for NPM to quickly get the dependencies).

2. Initialize an instance of couch-db on your machine of choice. 

3. For your node instance to find couch-db, you must edit the following two files in the top level directory: serverQA.js and startDB.js 

In serverQA.js, edit line 18 to reflect the details of your couchDB instance
```javascript
var nano = require('nano')('http://userName:password@host:port');
```
Line 12 in startDB.js should also be edited as above.

4. To start the web server, navigate the terminal to the local clone. Checkout branch joined. Run commands 'node startDB.js'. Then 'node serverQA.js'. The web application should now be availabe at <http://localhost:8080>.

5. There are three hardcoded users. No user registration is currently avaiable. Thus, when you navigate to <http://localhost:8080>, you can use one of the three following username and password combinations:

| Username      | Password      | 
| ------------- |:-------------:|
| edwin         |  notActually  |
| ollie         | camelCase     |
| donal         | justAnother   |





