const express = require("express");
const fs = require('fs');
const app = express();
const https = require('https');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");

const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate};
const httpsServer = https.createServer(credentials, app);
const io = new Server(httpsServer);

const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
}
const Getid = `/${uuidv4()}`

app.use("/peerjs", ExpressPeerServer(httpsServer, opinions)); //** */
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(Getid);
  console.log("GetID: ", Getid)
});

var user_count = 0

app.get("/:room", (req, res) => {
  console.log("render== ", user_count)
  res.render("index", { roomId: req.params.room, count: user_count});
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName, count) => {
    console.log("User Id", userId)
    console.log("Room Id", roomId)
    console.log("Count", count)
    socket.join(roomId);
    setTimeout(()=>{
      socket.to(roomId).emit("user-connected", userId);
    }, 1000)
    user_count = 1
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

port = 3000
httpsServer.listen(port, () => {
  console.log(`Server listening at https://localhost:${port}`);
});