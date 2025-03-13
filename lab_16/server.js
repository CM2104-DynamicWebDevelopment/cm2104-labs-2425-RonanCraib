const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Define the public "static" folder
app.use(express.static('public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('chat message', function (msg) { 
    console.log('message: ' + msg); 
  });
});