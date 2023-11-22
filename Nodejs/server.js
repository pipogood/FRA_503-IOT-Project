const express = require("express");
const fs = require('fs');
const app = express();
const https = require('https');
// const server = require("http").Server(app);
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

// const io = require("socket.io")(server, {
//   cors: {
//     origin: '*'
//   }
// });

const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
}
app.use("/peerjs", ExpressPeerServer(httpsServer, opinions));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("index", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    setTimeout(()=>{
      socket.to(roomId).emit("user-connected", userId);
    }, 1000)
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

httpsServer.listen(process.env.PORT || 3000);