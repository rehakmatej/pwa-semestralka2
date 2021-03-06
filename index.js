const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// Import our User schema
const User = require('./models/User.js');
const Room = require('./models/Room.js');
const Message = require('./models/Message.js');
const authCheck = require('./middleware/authCheck.js');

const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mongo_uri = process.env.MONGO_URI;
const secret = process.env.SECRET;


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(mongo_uri, { useNewUrlParser: true }, function (err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

app.get('/api/home', function (req, res) {
  res.send('Welcome!');
});

app.get('/api/secret', authCheck, function (req, res) {
  res.send('The password is potato');
});

app.get('/api/getAllUsers', authCheck, function (req, res) {
  User.find({}, { '_id': 0, 'nickName' :1}, function (err, docs) {
    res.status(200).json(docs);
 });
});

app.get('/api/getMyRooms/:nickName', authCheck, function (req, res) {
  var nickName = req.params.nickName;
  Room.find({owner: nickName}, { '_id': 0, '__v': 0}, function (err, docs) {
   res.status(200).json(docs);
  });
});

app.get('/api/getMemberRooms/:nickName', authCheck, function (req, res) {
  var nickName = req.params.nickName;
  Room.find({members: nickName}, { '_id': 0, '__v': 0}, function (err, docs) {
   res.status(200).json(docs);
  });
});

app.get('/api/getMessages/:roomName', authCheck, function (req, res) {
  var roomName = req.params.roomName;
  Message.find({room: roomName}, { '_id': 0, '__v': 0}).sort({time: 'ascending'}).exec(function(err, docs) {
   res.status(200).json(docs);
  });
});

app.get('/checkToken', authCheck, function (req, res) {
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// POST route to register a user
app.post('/api/register', function (req, res) {
  const { nickName, password } = req.body;
  const user = new User({ nickName, password });
  user.save(function (err) {
    if (!err) {
      res.status(200).send();
    } else {
      switch (err.code) {
        case 11000:
          res.status(409)
            .send();
          break;
        default:
          res.status(500)
            .send();
      }
    }
  });
});

app.post('/api/authenticate', function (req, res) {
  const { nickName, password } = req.body;
  User.findOne({ nickName }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
          error: 'Interní chyba'
        });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Špatný nickname nebo heslo'
        });
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Interní chyba'
            });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Špatný nickname nebo heslo'
            });
        } else {
          // Issue token
          const payload = { nickName };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: false })
            .sendStatus(200);
        }
      });
    }
  });
});

app.post('/api/createNewRoom', function (req, res) {
  const { roomName, owner, members } = req.body;
  const room = new Room({ roomName, owner, members });

  room.save(function (err) {
    if (!err) {
      res.status(200).send();
    } else {
      switch (err.code) {
        case 11000:
          res.status(409)
            .send();
          break;
        default:
          res.status(500)
            .send();
      }
    }
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});



io.on('connection', function(socket) {
  console.log('A user connected');

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
     console.log('A user disconnected');
  });

  socket.on('userJoined', function({nickName, roomName}){
    console.log('User '+nickName+' joined to '+roomName);
    socket.join(roomName.toString());
    socket.broadcast.to(roomName).emit('someoneJoined', {nickName: nickName});
  });

  socket.on('userLeft', function({nickName, roomName}){
    console.log('User '+nickName+' left '+roomName);
    socket.leave(roomName.toString());
    socket.broadcast.to(roomName).emit('someoneLeft', {nickName: nickName});
  });

  socket.on('msgSent', function(msg){
    console.log(msg.room);
    io.sockets.in(msg.room).emit('messageDelivered',msg);
    const message = new Message(msg);
    message.save();
  });
});

const port = process.env.PORT || 5000;
http.listen(port);

console.log(`Server listening on ${port}`);