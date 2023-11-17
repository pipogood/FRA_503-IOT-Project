const express = require('express')
const router = express.Router()
const path = require('path')

router.get("/", (req,res)=>{
    res.status(200)
    res.type('text/html')
    res.sendFile(path.join(__dirname,"../html/home.html"))
})

router.get("/upload", (req,res)=>{
    res.sendFile(path.join(__dirname,"../html/upload.html"))
})

router.get("/status", (req,res)=>{
    res.sendFile(path.join(__dirname,"../html/status.html"))
})

module.exports = router