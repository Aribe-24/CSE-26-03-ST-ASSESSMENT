const express = require('express');
const router = express.Router();
const Video = require('../models/Uploads');

router.get('/upload', (req, res) => {
  res.render('uploads'); 
});
// Route to handle video upload submission
router.post('/upload', async (req, res) => {
  try {
    const { title, description, quality, publishDate, videoUrl, thumbnailUrl } = req.body;

    // Validate fields on the server side
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
    
    res.status(201).json({ message: 'Video uploaded successfully!', video: newVideo });
  } catch (error) {
    res.status(500).json({ error: 'Server error during upload' });
  }
});

module.exports = router;