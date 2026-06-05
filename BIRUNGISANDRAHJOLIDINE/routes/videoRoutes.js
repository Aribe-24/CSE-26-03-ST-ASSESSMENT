const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/video');
const fs = require("fs"); 
 
// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// multer upload
const upload = multer({ storage });

router.get('/', (req, res) => res.render('landingpage'));

router.get('/upload', (req, res) => {
  res.render('form');
});

router.post('/upload', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  const { title, description, quality, publishDate } = req.body;
  const videoFile = req.files?.video?.[0];
  const thumbnailFile = req.files?.thumbnail?.[0];

  if (!title || !videoFile) {
    return res.status(400).send('Title and video file are required.');
  }

  try {
    const newVideo = new Video({
      title,
      description,
      filename: `uploads/${videoFile.filename}`,
      thumbnail: thumbnailFile ? `uploads/${thumbnailFile.filename}` : '',
      quality,
      createdAt: publishDate ? new Date(publishDate) : Date.now()
    });

    await newVideo.save();
    return res.redirect('/videos');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to save video at this time.');
  }
});
// getting all videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.render('videolisting', { videos });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
// watching uploaded videos
router.get("/video/:filename", (req, res) => {
  const videoPath = path.join(__dirname, "../videos", req.params.filename);

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    // If no range header, send full video
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath).pipe(res);
    return;
  }

  // Example: "bytes=12345-"
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  const chunkSize = end - start + 1;
  const file = fs.createReadStream(videoPath, { start, end });

  const head = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, head);
  file.pipe(res);
});
module.exports = router;