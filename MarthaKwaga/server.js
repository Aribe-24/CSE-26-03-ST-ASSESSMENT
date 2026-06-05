// server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');

require('dotenv').config();

// Import DB Connection & Models
const connectDb = require('./config/db');
const User = require('./models/User');
const Video = require('./models/Video');

const app = express();
const PORT = process.env.PORT || 3000;

// ====================== MIDDLEWARE ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====================== MULTER CONFIG ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'videoFile' ? 'uploads/videos' : 'uploads/thumbnails';
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'videoFile' && !file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed'));
    }
    if (file.fieldname === 'thumbnailFile' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

// ====================== ROUTES ======================

// ------------------- PAGE ROUTES -------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'videx-landing.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'videx-join.html'));
});

app.get('/videos', (req, res) => {
  res.sendFile(path.join(__dirname, 'videx-videos.html'));
});

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'videx-upload.html'));
});

// Video Watch/Player Route
app.get('/watch/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'videx-watch.html'));
});

// ------------------- API ROUTES -------------------
const apiRouter = express.Router();

// Auth Routes
apiRouter.post('/join', async (req, res) => {
  try {
    const { firstName, lastName, username, email, channel } = req.body;

    if (!firstName || !lastName || !username || !email) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      channel: channel || `${username}'s Channel`
    });

    await newUser.save();
    res.status(201).json({
      message: 'Account created successfully',
      user: { id: newUser._id, username: newUser.username, channel: newUser.channel }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Video Routes
apiRouter.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadedAt: -1 });
    res.json({ videos, total: videos.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

apiRouter.get('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

apiRouter.post('/videos', upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, quality, publishDate, uploadedBy } = req.body;

    if (!title || !quality || !publishDate) {
      return res.status(400).json({ error: 'Title, quality, and publish date are required' });
    }

    if (!req.files?.videoFile || !req.files?.thumbnailFile) {
      return res.status(400).json({ error: 'Both video and thumbnail are required' });
    }

    const newVideo = new Video({
      title,
      description: description || '',
      quality,
      publishDate,
      videoUrl: `/uploads/videos/${req.files.videoFile[0].filename}`,
      thumbnailUrl: `/uploads/thumbnails/${req.files.thumbnailFile[0].filename}`,
      uploadedBy: uploadedBy || 'anonymous'
    });

    await newVideo.save();
    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    // Delete files from disk
    const videoPath = path.join(__dirname, video.videoUrl);
    const thumbPath = path.join(__dirname, video.thumbnailUrl);

    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);

    await Video.findByIdAndDelete(req.params.id);

    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mount API routes
app.use('/api', apiRouter);

// ====================== ERROR HANDLING