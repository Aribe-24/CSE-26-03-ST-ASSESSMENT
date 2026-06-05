const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  quality: String,
  publishDate: String,
  videoUrl: String,
  thumbnailUrl: String,
  uploadedBy: String,
  views: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);