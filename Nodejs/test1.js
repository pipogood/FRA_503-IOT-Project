const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const https = require('https');
const fs = require('fs');

const app = express(); 

const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate};
const httpsServer = https.createServer(credentials, app);
const io = new Server(httpsServer);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('video', (data) => {
        // Broadcast the video data to all connected clients
        io.emit('video', data);
      });

    // socket.on('chat message', (msg) => {
    //     console.log('message: ' + msg);
    //     socket.broadcast.emit('chat message',msg);
    // });
});

const PORT = 4000;

httpsServer.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
});