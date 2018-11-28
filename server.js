//Global
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//Global channel name
const channel = 'TestChannel';

//Set static folder and root html file
app.use('/static', express.static('public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

//Load connection new user
io.on('connection', function(socket){
  console.log('a user connected');
  //Get desconnection user
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  //Get data input into channel
  socket.on(channel, function(data){
    console.log('data: ', data);
    io.emit(channel, data);
  });
});

//Active http server port 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});