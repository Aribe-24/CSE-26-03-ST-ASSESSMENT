// handling the logic

const express = require("express");
const router = express.Router();
const multer = require("multer");

const Video = require("../models/videx")

// multer configuration
// multer is used to upload files from a users device and store them in server folders
const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        if(file.fieldname === "video"){
            cb(null,"public/uploads/videos");
        }else 
            cb(null,"public/uploads/thumbnails");    
    }
},

filename: ( req,file,cb)=> {
    cb(null,
        Date.now()+ "" + file.originalname
    );
});

const upload = multer({storage});

// get welcome page
router.get("/",(req,res)=>{
    res.render("index")
});

// get video list from DB
router.get("/videos",async (req,res)=>{
    const videos = await Video.find()
    // ensures that new videos appear first
    .sort({createdAt: -1});

    res.render("videos",{videos});
});

// add video upload page
router.get("/videos/add",(req,res)=>{
    res.render("addVideo");
});

// save video
router.post("videos/add", upload.fields([
    {name: "video"},
    {name: "thumbnail"}
]),
 async(req,res)=>{
    await Video.create({
        title: req.body.title,
        description: req.body.description,
        quality: req.body.quality,
        video: req.files.video[0].filename,
        thumbnail: req.files.video[0].filename
    });

    res.redirect("/videos")
});

module.exports = router

