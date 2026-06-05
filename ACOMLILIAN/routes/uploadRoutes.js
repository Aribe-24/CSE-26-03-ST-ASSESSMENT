const express = require('express');
const router = express.Router();
const Video = require('../models/Uploads');
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Ensure this folder exists in my project
  },
  filename: (req, file, cb) => {
    // Generates a unique filename: videoFile-123456789.mp4
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Updated Home Route: Fetches videos from the database
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        return res.render('home', { videos });
    } catch (error) {
        console.error("Error fetching videos:", error);
        return res.status(500).send("Error loading dashboard");
    }
});

router.get('/lianvid', (req, res) => {
    res.render('videos');
});

router.get('/upload', (req, res) => {
    return res.render('uploads'); 
});

router.get('/video', (req, res) => {
    return res.render('videos'); 
});

// Route to handle video upload submission
// upload.single('videoFile') to process the file
router.post('/upload', upload.single('videoFile'), async (req, res) => {
  try {
    // Check if file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required' });
    }

    const { title, description, quality, publishDate, thumbnailUrl } = req.body;

    // Validate fields
    if (!title || !quality || !publishDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new video entry
    // videoUrl is now constructed from the file saved by multer
    const newVideo = new Video({
      title,
      description,
      quality,
      publishDate,
      videoUrl: `/uploads/${req.file.filename}`, 
      thumbnailUrl
    });

    await newVideo.save();
    
    return res.status(201).json({ message: 'Video uploaded successfully!', video: newVideo });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: 'Server error during upload' });
  }
});

module.exports = router;