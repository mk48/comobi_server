var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

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
    roomid = data.roomid;
    socket.join(data.roomid);
    io.to(data.roomid).emit('mobilejoined');
    socket.emit('mobilejoined', {roomid : data.roomid})
  });

  //----------------------------------------- txt ------------------------------
  socket.on('txt',  (data) => {
    io.to(data.roomid).emit(data.msg);
  });

  //----------------------------------------- disconnect -----------------------
  socket.on('disconnect', () => {
    console.log("..x..")
    socket.leave(roomid);
    io.to(roomid).emit('closed');
  });

});
