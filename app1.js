var express = require('express')
var cors = require('cors')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});*/

//app.use(cors())

//app.use(express.static('public'))

app.listen(3001, () => console.log('app listening on port 3001! --- 3'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/socketjs', function (req, res) {
  res.sendFile(__dirname + '/public/js/socket/socket.io.js');
});

//io.set('transports', ['websocket'])

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
    socket.leave(roomid);
    io.to(roomid).emit('closed');
  });

});
