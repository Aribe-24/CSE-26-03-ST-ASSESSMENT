const express = require('express');
const Upload = require('../models/Upload');

const router = express.Router();

function getTimeAgo(date) {
  if (!date) return 'Unknown time';

  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

// Landing page
router.get('/', (req, res) => {
  res.render('index');
});

// Video listing page
router.get('/home', async (req, res) => {
  try {
    // Sort latest videos first
    const videos = await Upload.find().sort({ createdAt: -1 });
    const videosWithAge = videos.map((video) => {
      const videoObject = video.toObject();
      videoObject.timeAgo = getTimeAgo(video.createdAt || video.publishingDate);
      return videoObject;
    });

    res.render('home', {
      videos: videosWithAge
    });
  } catch (error) {
    console.log(error);
    res.send('Failed to load videos');
  }
});

// Watch single video
router.get('/video/:id', async (req, res) => {
  try {
    const video = await Upload.findById(req.params.id);

    if (!video) {
      return res.send('Video not found');
    }

    // Increase views when someone opens the video
    video.views += 1;
    await video.save();

    res.render('watchVideo', {
      video: video
    });
  } catch (error) {
    console.log(error);
    res.send('Failed to open video');
  }
});

module.exports = router;