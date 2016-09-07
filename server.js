var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);



io.on('connection', function (socket) {
    
    //logs the message
    console.log('New client connected');

    //sends a broadcast message to every socket but the one who made it occurr
    socket.broadcast.emit('message', 'New user connected');

    
    //when socket receives a 'message', logs that a new message was received, and broadcasts the message 
    //to all connected sockets except the one who sent it
    socket.on('message', function(message) {
        console.log('Received message:', message);
        socket.broadcast.emit('message',message);
    });

    //watching for the 'typing' socket type, broadcast to all users that someone is typing
    socket.on('typing',function() {
                console.log('Someone is typing:');

        socket.broadcast.emit('message','Someone is typing');
    });

    //when a socket disconnects, logs it and sends a disconnected message to all other sockets
    socket.on('disconnect', function(){
        socket.broadcast.emit('message', 'Client Disonnected');
        console.log('user is disconnected');
    });
  
});
server.listen(process.env.PORT || 8080);