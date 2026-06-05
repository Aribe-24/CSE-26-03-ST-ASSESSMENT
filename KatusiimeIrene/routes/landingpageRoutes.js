const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Video = require("../models/Video");

// multer configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.fieldname === "video") {
        cb(null, "public/uploads/videos");
        } else if(file.fieldname === "thumbnail") {
        cb(null, "public/uploads/thumbnails");
        }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// determine if uploaded fileis video or thumbanail
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    if (file.mimetype === "video/mp4" || file.mimetype === "video/webm" || file.mimetype === "video/ogg") {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"), false);
    }
  } else if (file.fieldname === "thumbnail") {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 100 * 1024 * 1024}
});

// landing page route
// router.get("/", (req, res) => {
//   res.render("landingpage"); 
// });

// video page route
router.get("/video", async (req, res) => {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.render("video", { videos });
});

// route for upload videos
router.get("/upload", (req, res) => {
    res.render("uploader");
});

router.post("/upload", upload.fields([{ name: "video", maxCount: 1 }, { name: "thumbnail", maxCount: 1}]), async(req,res) => {
    try {
        const {title, description, quality, dateOfPublishing} = req.body;
        const videoFile = req.files["video"] ? "/uploads/videos/" + req.files["video"][0].filename : null;
        const thumbnailFile = req.files["thumbnail"] ? "/uploads/thumbnails/" + req.files["thumbnail"][0].filename : null;

        const newVideo = new Video({
            title: title,
            description: description,
            quality: quality,
            dateOfPublishing: dateOfPublishing,
            videoUrl: videoFile,
            thumbnailUrl: thumbnailFile,
            views: Math.floor(Math.random() * 10000)
        });
        await newVideo.save();
        res.redirect("/video");
    } catch (error) {
        res.status(500).send("Error uploading video");
    }
});

// watch video route
router.get("/watch/:id", async (req, res) => {
    const video = await Video.findById(req.params.id);
    if(!video){
        return res.status(404). send("Video not found");
    }
    video.views = video.views + 1;
    await video.save();
    res.render("watch", {video});
});

router.get('/youtube', (req, res) => {
    res.render('landingpage');
});

module.exports = router;