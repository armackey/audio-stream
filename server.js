// require('dotenv').config();

const fs = require('fs');
const path = require('path');
const http = require('http');
const join = path.join;
const express = require('express');
// const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const ss = require('socket.io-stream');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);


app.get('/', function(req, res) {
    console.log(__dirname);
    res.sendFile(path.join(__dirname+'/client/index.html'));
});

io.on('connection', client => {
  const stream = ss.createStream();
  console.log('connected');

  client.on('track', () => {
    const filePath = path.resolve(__dirname, './audio.mp3');
    // get file info
    const stat = fs.statSync(filePath);
    const readStream = fs.createReadStream(filePath);
    // pipe stream with response stream
    readStream.pipe(stream);
    
    ss(client).emit('track-stream', stream, { stat });
    console.log('track should be streaming');
  });
});

server.listen(port);
console.log('Express app started on port ' + port);

