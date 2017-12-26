var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3005);

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection',  (socket) => {
  console.log("connected...")

  let roomid;

  //----------------------------------------- web join -------------------------
  socket.on('webjoin',  (data) => {
    roomid = Math.random().toString(36).substr(2, 5);
    socket.join(roomid);
    socket.emit('roomcreated', {roomid : roomid})
  });

  //----------------------------------------- mobile join ----------------------
  socket.on('mobilejoin',  (data) => {
    console.log("mob join: " + data.roomid );
    roomid = data.roomid;
    socket.join(data.roomid);
    io.to(data.roomid).emit('mobilejoined');
    socket.emit('mobilejoined', { "roomid" : data.roomid})
  });

  //----------------------------------------- closed ---------------------------
  socket.on('close',  (data) => {
    console.log("close");
    io.to(data.roomid).emit('close');
    socket.leave(data.roomid);
  });

  //----------------------------------------- txt ------------------------------
  socket.on('txt',  (data) => {
    //console.log(data);
    io.to(data.roomid).emit('txt', data.msg);
  });

  //----------------------------------------- disconnect -----------------------
  socket.on('disconnect', () => {
    console.log("..x..")
    io.to(roomid).emit('close');
    socket.leave(roomid);
  });

});
