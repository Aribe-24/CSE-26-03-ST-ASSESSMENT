const mongoose = require('mongoose');

const UploadsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  quality: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  }, // Stored path or URL
  thumbnailUrl: {
    type: String,
    required: true
  } // Stored path or URL
}, {
  timestamps: true
});

module.exports = mongoose.model('Uploads', UploadsSchema);