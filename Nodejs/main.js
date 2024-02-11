const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const fs = require('fs');
const https = require('https');
const { Server } = require('socket.io');
// const { v4: uuidv4 } = require("uuid");

app.set('views',path.join(__dirname,'views'))
app.set("view engine", "ejs");

const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate};
const httpsServer = https.createServer(credentials, app);
const io = new Server(httpsServer);

let save_name = ''
let all_users = []
let user_done = 0
let already_in = 0

//Set nulter for store file
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        save_name = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, save_name);
    }
});
const upload = multer({ storage: storage });

//Set peerjs for webRTC
const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
}
app.use("/peerjs", ExpressPeerServer(httpsServer, opinions));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,'Processed_image')));

//get URL
app.get('/show/:input_name', (req,res)=>{
    const get_name = req.params.input_name 
    const showImage = [{name:"Input Image of "+get_name ,image: '../'+get_name+'step1.png'},
    {name:"Generated Protrait Drawing of "+get_name,image: '../'+get_name+'step2.png'},
    {name:"Line Extraction for Drawing of "+get_name,image: '../'+get_name+"step4.png"}]
    res.render('check', {showImage:showImage, link:"/get_drawing"+"/"+get_name})
})

app.get("/", (req,res)=>{
    res.render('home');
});

app.get("/get_drawing/:input_name", (req,res)=>{
    const get_name = req.params.input_name 
    console.log("append_drawing",get_name)
    all_users.push(get_name) //Add new user to array
    res.redirect('/status')
});

app.get('/upload', (req, res) => {
    res.render('upload')
});

app.get('/status', (req, res) => {
    res.render('status', {all_users:all_users, user_done:user_done});
    if (all_users.length > user_done & already_in == 0){
        already_in = 1
        console.log("Run UR of user: ", all_users[user_done])
        var spawn = require("child_process").spawn;
        var process = spawn('python', ["./run_ur.py", all_users[user_done]]);
        process.stdout.on('data',function(data){
            console.log(data.toString())
        })
        process.on('exit', function(code) {
            console.log('Run_ur process exited with code ' + code);
            user_done += 1
            already_in = 0
        });
    }
});

var user_count = 0
app.get("/stream_all", (req, res) => {
    console.log("render== ", user_count)
    res.render("steam", { roomId: req.params.room, count: user_count});
  });

// Handle file uploads
app.post('/upload_process', upload.single('file'), (req, res) => {
    const input_name = req.body['Your Nickname'];
    console.log("enter name is: ", input_name)
    console.log("save_name: ", save_name)
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    else{
        console.log('Uploaded file:', req.file);        
        var spawn = require("child_process").spawn;
        var process = spawn('python', ["./image_processing.py", input_name, save_name]);
        process.stdout.on('data',function(data){
            console.log(parseInt(data), data.toString())
        })
        process.on('exit', function(code) {
            console.log('Image process exited with code ' + code)
            if (code == 0){
                res.redirect('/show'+'/'+input_name)}
            else{
                res.status(400).send('Sorry, Cannot Detect human face please go back and re-upload again');
            }
        });
    }
});

//IO connection
io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, count) => {
      console.log("Count", count , roomId)
      console.log("User Id", userId)
      socket.join(roomId);
      setTimeout(()=>{
        socket.to(roomId).emit("user-connected", userId);
      }, 1000)
      user_count = 1
    });
  });

const port = 3000;
httpsServer.listen(port, () => {
    console.log(`Server listening at https://localhost:${port}`);
    console.log(`Client listening at https://100.83.248.76:${port}`)
});