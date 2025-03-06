/**
 * @Author: John Isaacs <john>
 * @Date:   01-Mar-19
 * @Filename: server.js
 * @Last modified by:   john
 * @Last modified time: 03-Mar-2024
 */

// Code to link to Mongo module
const MongoClient = require('mongodb-legacy').MongoClient; // npm install mongodb-legacy
const url = 'mongodb://127.0.0.1:27017'; // The URL of our database
const client = new MongoClient(url); // Create the Mongo client
const dbname = 'profiles'; // The database we want to access

const express = require('express'); // npm install express
const session = require('express-session'); // npm install express-session
const bodyParser = require('body-parser'); // npm install body-parser

const app = express();

// This tells express we are using sessions.
app.use(session({ secret: 'example', resave: false, saveUninitialized: true }));

// Define the public "static" folder
app.use(express.static('public'));

// Tell express we want to read POSTED forms
app.use(bodyParser.urlencoded({
  extended: true
}));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Variable to hold our Database
var db;

// Run the connect method.
connectDB();

// This is our connection to MongoDB, it sets the variable db as our database
async function connectDB() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);
    // Everything is good, let's start
    app.listen(8080);
    console.log('Listening for connections on port 8080');
}

//********** GET ROUTES - Deal with displaying pages ***************************

// Root route
app.get('/', async function(req, res) {
  // If the user is not logged in, redirect them to the login page
  if (!req.session.loggedin) { res.redirect('/login'); return; }

  try {
    // Fetch all users from the "people" collection
    let users = await db.collection('people').find().toArray();

    // Fetch the currently logged-in user's details using session username
    let loggedInUser = await db.collection('people').findOne({ "login.username": req.session.username });

    // Render the users page with both user lists and logged-in user details
    res.render('pages/users', {
      users: users,
      loggedInUser: loggedInUser
    });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

// Login route - renders the login.ejs page
app.get('/login', function(req, res) {
  res.render('pages/login');
});

// Profile route - displays a user's profile
app.get('/profile', function(req, res) {
  if (!req.session.loggedin) { res.redirect('/login'); return; }

  var uname = req.query.username;

  db.collection('people').findOne({ "login.username": uname }, function(err, result) {
    if (err) throw err;

    res.render('pages/profile', {
      user: result
    });
  });
});

// Add User page
app.get('/adduser', function(req, res) {
  if (!req.session.loggedin) { res.redirect('/login'); return; }
  res.render('pages/adduser');
});

// Remove User page
app.get('/remuser', function(req, res) {
  if (!req.session.loggedin) { res.redirect('/login'); return; }
  res.render('pages/remuser');
});

// Logout route - destroys session and redirects to login
app.get('/logout', function(req, res) {
  req.session.loggedin = false;
  req.session.username = null;
  req.session.destroy();
  res.redirect('/');
});

//********** POST ROUTES - Deal with processing data from forms ***************************

// Login form handler
app.post('/dologin', function(req, res) {
  console.log(JSON.stringify(req.body));
  var uname = req.body.username;
  var pword = req.body.password;

  db.collection('people').findOne({ "login.username": uname }, function(err, result) {
    if (err) throw err;

    if (!result) { res.redirect('/login'); return; }

    if (result.login.password == pword) {
      req.session.loggedin = true;
      req.session.username = uname; // Store username in session
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });
});

// Delete user based on username
app.post('/delete', function(req, res) {
  if (!req.session.loggedin) { res.redirect('/login'); return; }

  var uname = req.body.username;

  db.collection('people').deleteOne({ "login.username": uname }, function(err, result) {
    if (err) throw err;
    res.redirect('/');
  });
});

// Add a new user
app.post('/adduser', function(req, res) {
  if (!req.session.loggedin) { res.redirect('/login'); return; }

  var datatostore = {
    "gender": req.body.gender,
    "name": { "title": req.body.title, "first": req.body.first, "last": req.body.last },
    "location": { "street": req.body.street, "city": req.body.city, "state": req.body.state, "postcode": req.body.postcode },
    "email": req.body.email,
    "login": { "username": req.body.username, "password": req.body.password },
    "dob": req.body.dob,
    "registered": Date(),
    "picture": { "large": req.body.large, "medium": req.body.medium, "thumbnail": req.body.thumbnail },
    "nat": req.body.nat
  };

  db.collection('people').insertOne(datatostore, function(err, result) {
    if (err) throw err;
    console.log('Saved to database');
    res.redirect('/');
  });
});
