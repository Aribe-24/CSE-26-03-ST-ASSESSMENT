const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');

/* -------------------------
   Multer configuration
   handles video + thumbnail uploads
-------------------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // decide where to store file based on field name
    const dir =
      file.fieldname === 'videoFile'
        ? 'uploads/videos'
        : 'uploads/thumbnails';

    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    // create unique file name to avoid duplicates
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// only allow video for videoFile and images for thumbnail
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'videoFile') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  } else if (file.fieldname === 'thumbnail') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  } else {
    cb(null, false);
  }
};

// multer setup (limit set to 500MB for videos)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }
}).fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

/* -------------------------
   Helper functions
-------------------------- */

// convert date to "time ago" format
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 }
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.secs);
    if (count >= 1) {
      return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

// format views into k / M
function formatViews(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return Math.floor(n / 1000) + 'k';
  return n.toString();
}

/* -------------------------
   Routes
-------------------------- */

// show all videos (home page)
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .lean();

    // add extra display fields
    const formatted = videos.map(v => {
      return {
        ...v,
        timeAgo: timeAgo(new Date(v.createdAt)),
        viewsFormatted: formatViews(v.views)
      };
    });

    res.render('videos/index', { videos: formatted });
  } catch (err) {
    console.log('Error loading videos:', err);
    res.render('videos/index', { videos: [] });
  }
});

// upload page
router.get('/upload', (req, res) => {
  res.render('videos/upload', {
    errors: [],
    formData: {},
    success: false
  });
});

// handle video upload
router.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    let errors = [];

    // multer error
    if (err) {
      errors.push({ msg: err.message });
      return res.render('videos/upload', {
        errors,
        formData: req.body,
        success: false
      });
    }

    const { title, quality, publishDate } = req.body;

    // basic validation
    if (!title || !title.trim()) errors.push({ msg: 'Title is required' });
    if (!quality) errors.push({ msg: 'Quality is required' });
    if (!publishDate) errors.push({ msg: 'Publish date is required' });

    if (!req.files || !req.files.videoFile) {
      errors.push({ msg: 'Video file is required' });
    }

    // if errors exist, delete uploaded temp files
    if (errors.length > 0) {
      if (req.files) {
        Object.values(req.files)
          .flat()
          .forEach(file => fs.unlink(file.path, () => {}));
      }

      return res.render('videos/upload', {
        errors,
        formData: req.body,
        success: false
      });
    }

    try {
      const video = new Video({
        title: title.trim(),
        description: req.body.description || '',
        quality,
        publishDate: new Date(publishDate),
        videoFile: req.files.videoFile[0].path.replace(/\\/g, '/'),
        thumbnail: req.files.thumbnail
          ? req.files.thumbnail[0].path.replace(/\\/g, '/')
          : null
      });

      await video.save();

      res.render('videos/upload', {
        errors: [],
        formData: {},
        success: true
      });
    } catch (error) {
      console.log('Save error:', error);

      res.render('videos/upload', {
        errors: [{ msg: 'Could not save video' }],
        formData: req.body,
        success: false
      });
    }
  });
});

// watch single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!video) return res.redirect('/videos');

    res.render('videos/watch', { video });
  } catch (err) {
    console.log(err);
    res.redirect('/videos');
  }
});

module.exports = router;