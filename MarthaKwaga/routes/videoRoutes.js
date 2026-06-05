const express = require('express');
const path = require('path');
const multer = require('multer');
const Video = require('../models/Video');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'videoFile') {
      cb(null, path.join(__dirname, '..', 'public', 'uploads', 'videos'));
      return;
    }

    if (file.fieldname === 'thumbnailFile') {
      cb(null, path.join(__dirname, '..', 'public', 'uploads', 'thumbnails'));
      return;
    }

    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueFileName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueFileName);
  }
});

const fileFilter = function (req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  if (file.fieldname === 'videoFile') {
    const isVideoMime = file.mimetype && file.mimetype.startsWith('video/');
    const isVideoExt = videoExtensions.includes(extension);
    cb(null, isVideoMime || isVideoExt);
    return;
  }

  if (file.fieldname === 'thumbnailFile') {
    const isImageMime = file.mimetype && file.mimetype.startsWith('image/');
    const isImageExt = imageExtensions.includes(extension);
    cb(null, isImageMime || isImageExt);
    return;
  }

  cb(null, false);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/video_listing', async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    res.render('video_listing', { videos });
  } catch (error) {
    res.status(500).send('Error loading videos dashboard.');
  }
});

router.get('/home', (req, res) => {
  res.redirect('/video_listing');
});

router.get('/videos', (req, res) => {
  res.redirect('/video_listing');
});

router.get('/videx-upload', (req, res) => {
  res.render('videx-upload', {
    success: false,
    errors: {},
    oldData: {}
  });
});

router.get('/upload', (req, res) => {
  res.redirect('/videx-upload');
});

router.post(
  ['/videx-upload', '/upload'],
  upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, description, quality, publishingDate } = req.body;
      const errors = {};

      if (!title) {
        errors.title = 'Required field';
      }
      if (!quality) {
        errors.quality = 'Required field';
      }
      if (!publishingDate) {
        errors.publishingDate = 'Required field';
      }
      if (!req.files || !req.files.videoFile) {
        errors.videoFile = 'Required field';
      }
      if (!req.files || !req.files.thumbnailFile) {
        errors.thumbnailFile = 'Required field';
      }

      if (Object.keys(errors).length > 0) {
        return res.render('videx-upload', {
          success: false,
          errors: errors,
          oldData: req.body
        });
      }

      const newVideo = new Video({
        title,
        description,
        quality,
        publishingDate,
        videoPath: '/uploads/videos/' + req.files.videoFile[0].filename,
        thumbnailPath: '/uploads/thumbnails/' + req.files.thumbnailFile[0].filename,
        views: 0
      });

      await newVideo.save();
      res.redirect('/video_listing');
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to upload video');
    }
  }
);

router.get('/watch_video/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).send('Video not found');
    }
    res.render('watch_video', { video });
  } catch (error) {
    res.status(500).send('Error loading video.');
  }
});

router.get('/video/:id', (req, res) => {
  res.redirect(`/watch_video/${req.params.id}`);
});

router.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ error: 'Error loading videos' });
  }
});

module.exports = router;
