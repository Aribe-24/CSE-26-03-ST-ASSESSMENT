const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'videoFile' ? 'uploads/videos' : 'uploads/thumbnails';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'videoFile') {
    file.mimetype.startsWith('video/') ? cb(null, true) : cb(new Error('Only video files allowed'), false);
  } else if (file.fieldname === 'thumbnail') {
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only image files allowed for thumbnail'), false);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 500 * 1024 * 1024 } })
  .fields([{ name: 'videoFile', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]);

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    { label: 'year', secs: 31536000 }, { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },   { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },     { label: 'minute', secs: 60 }
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.secs);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

function formatViews(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return Math.floor(n / 1000) + 'k';
  return n.toString();
}

// GET /videos - list all videos newest first
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }).lean();
    const formatted = videos.map(v => ({
      ...v,
      timeAgo: timeAgo(new Date(v.createdAt)),
      viewsFormatted: formatViews(v.views)
    }));
    res.render('videos/index', { videos: formatted });
  } catch (err) {
    console.error(err);
    res.render('videos/index', { videos: [] });
  }
});

// GET /videos/upload
router.get('/upload', (req, res) => {
  res.render('videos/upload', { errors: [], formData: {}, success: false });
});

// POST /videos/upload
router.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    const errors = [];
    if (err) {
      errors.push({ msg: err.message });
      return res.render('videos/upload', { errors, formData: req.body || {}, success: false });
    }

    const { title, quality, publishDate } = req.body;
    if (!title || !title.trim())               errors.push({ field: 'title',       msg: 'Required field' });
    if (!quality)                              errors.push({ field: 'quality',     msg: 'Required field' });
    if (!publishDate)                          errors.push({ field: 'publishDate', msg: 'Required field' });
    if (!req.files || !req.files['videoFile']) errors.push({ field: 'videoFile',  msg: 'Required field' });

    if (errors.length > 0) {
      if (req.files) Object.values(req.files).flat().forEach(f => fs.unlink(f.path, () => {}));
      return res.render('videos/upload', { errors, formData: req.body, success: false });
    }

    try {
      const video = new Video({
        title: title.trim(),
        description: req.body.description ? req.body.description.trim() : '',
        quality,
        publishDate: new Date(publishDate),
        videoFile: req.files['videoFile'][0].path.replace(/\\/g, '/'),
        thumbnail: req.files['thumbnail'] ? req.files['thumbnail'][0].path.replace(/\\/g, '/') : null,
      });
      await video.save();
      res.render('videos/upload', { errors: [], formData: {}, success: true });
    } catch (saveErr) {
      console.error(saveErr);
      res.render('videos/upload', { errors: [{ msg: 'Failed to save video. Try again.' }], formData: req.body, success: false });
    }
  });
});

// GET /videos/:id
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).lean();
    if (!video) return res.redirect('/videos');
    res.render('videos/watch', { video });
  } catch (err) {
    res.redirect('/videos');
  }
});

module.exports = router;