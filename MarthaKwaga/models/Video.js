const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true, maxlength: 200 },
  description:  { type: String, trim: true, maxlength: 5000, default: '' },
  quality:      { type: String, required: true, enum: ['360p', '480p', '720p HD', '1080p Full HD', '4K Ultra HD'] },
  publishDate:  { type: Date, required: true },
  videoUrl:     { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  uploadedBy:   { type: String, default: 'anonymous' },
  views:        { type: Number, default: 0 },
  uploadedAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', VideoSchema);