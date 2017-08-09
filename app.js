/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// Socket.io
var socketIoApp = express();
var socketIoHttp = require('http').Server(socketIoApp);
var io = require('socket.io')(socketIoHttp);
socketIoHttp.listen(appEnv.port, function() {
  console.log('Socket.io listening on: ' + appEnv.port);
});


io.on('connection', function(socket ){
  console.log('client connected');

  socket.on('createRoom', function( room ) {
	socket.join(room);
    console.log('Joined room: ' + room);
  });

  socket.on('requestNotification', function( msg, room ) {
    console.log('message: ' + room );
    if(room) {
		socket.broadcast.to(room).emit('requestNotification', msg);
    }
    else {
		socket.broadcast.emit('requestNotification', msg);
    }
 
  });
  socket.on('disconnect', function() {
    console.log('client disconnected');
  });
});
