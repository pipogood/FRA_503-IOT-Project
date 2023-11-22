const exp = require('constants');
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,'Processed_image')))

app.get('/ejs', (req,res)=>{
    const showImage = [{name:"Input Image",image:"step1.png"},
    {name:"Generated Protrait Drawing",image:"step2.png"},
    {name:"Line Extraction for Drawing",image:"step4.png"}]
    res.render('check', {showImage:showImage})
})

app.get("/", (req,res)=>{
    res.render('home');
});

app.get('/upload', (req, res) => {
    res.render('upload');
});

app.get('/status', (req, res) => {
    res.render('status');
});

// Handle file uploads
app.post('/upload_process', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    else{
        console.log('Uploaded file:', req.file);        
        var spawn = require("child_process").spawn;
        var process = spawn('python', ["./image_processing.py"]);
        var count = 0
        process.stdout.on('data',function(data){
            count = count + 1
            console.log(count, data.toString())
            if (count === 5){
            res.redirect('/ejs')}
        })
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
