// Import required modules
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Your application routes and middleware go here

// Specify the path to your SSL certificate and private key
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
// const ca = fs.readFileSync('path/to/ca.pem', 'utf8'); // optional: only if you have a certificate authority

const credentials = {
    key: privateKey,
    cert: certificate,
    // ca: ca, // optional
};

// Create an HTTPS server with your express app
const httpsServer = https.createServer(credentials, app);

// Define the port for your HTTPS server
const PORT = 4000;

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"))
});
// Start the server
httpsServer.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
});
