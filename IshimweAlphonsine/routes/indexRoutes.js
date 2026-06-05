const express = require('express');
const path = require('path');
const multer = require('multer');
const Upload = require('../models/Upload');

const router = express.Router();

// This controls where uploaded files will be saved
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'videoFile') {
      cb(null, 'public/uploads/videos');
    }

    if (file.fieldname === 'thumbnailFile') {
      cb(null, 'public/uploads/thumbnails');
    }
  },

  filename: function (req, file, cb) {
    // Date.now makes the filename unique
    const uniqueFileName = Date.now() + '-' + file.originalname;
    cb(null, uniqueFileName);
  }
});

// This makes sure the user uploads the correct file type
const fileFilter = function (req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  if (file.fieldname === 'videoFile') {
    const isVideoMime = file.mimetype && file.mimetype.startsWith('video/');
    const isVideoExt = videoExtensions.includes(extension);

    if (isVideoMime || isVideoExt) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
    return;
  }

  if (file.fieldname === 'thumbnailFile') {
    const isImageMime = file.mimetype && file.mimetype.startsWith('image/');
    const isImageExt = imageExtensions.includes(extension);

    if (isImageMime || isImageExt) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
    return;
  }

  cb(null, false);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Show upload form
router.get('/upload', (req, res) => {
  res.render('uploadForm', {
    success: false,
    errors: {},
    oldData: {}
  });
});

// Receive uploaded video
router.post(
  '/upload',
  upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, description, quality, publishingDate } = req.body;

      const errors = {};

      // Validation
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

      // If there are errors, show the form again
      if (Object.keys(errors).length > 0) {
        return res.render('uploadForm', {
          success: false,
          errors: errors,
          oldData: req.body
        });
      }

      // Save video details in MongoDB
      const newVideo = new Upload({
        title: title,
        description: description,
        quality: quality,
        publishingDate: publishingDate,
        videoPath: '/uploads/videos/' + req.files.videoFile[0].filename,
        thumbnailPath: '/uploads/thumbnails/' + req.files.thumbnailFile[0].filename
      });

      await newVideo.save();

      // Reset form after successful upload
      res.render('uploadForm', {
        success: true,
        errors: {},
        oldData: {}
      });
    } catch (error) {
      console.log(error);
      res.send('Failed to upload video');
    }
  }
);

module.exports = router;