const express = require('express');
const router = express.Router();
const Video = require('../models/Uploads');

// Updated Home Route: Fetches videos from the database
router.get('/', async (req, res) => {
    try {
        // Fetch all videos from MongoDB, sorted by newest first
        const videos = await Video.find().sort({ createdAt: -1 });
        
        // Pass the videos array to your home.pug template
        return res.render('home', { videos });
    } catch (error) {
        console.error("Error fetching videos:", error);
        return res.status(500).send("Error loading dashboard");
    }
});

router.get('/upload', (req, res) => {
    return res.render('uploads'); 
});

// Route to handle video upload submission
router.post('/upload', async (req, res) => {
  try {
    const { title, description, quality, publishDate, videoUrl, thumbnailUrl } = req.body;

    if (!title || !quality || !publishDate || !videoUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newVideo = new Video({
      title,
      description,
      quality,
      publishDate,
      videoUrl,
      thumbnailUrl
    });

    await newVideo.save();
    
    return res.status(201).json({ message: 'Video uploaded successfully!', video: newVideo });
  } catch (error) {
    return res.status(500).json({ error: 'Server error during upload' });
  }
});

module.exports = router;