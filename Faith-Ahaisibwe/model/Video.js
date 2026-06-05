const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    quality: {
      type: String,
      default: '1080p',
      enum: ['1080p', '720p', '480p'],
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    color: {
      type: String,
      default: '#cccccc',
    },
    filePath: {
      type: String,
      default: null,
    },
    thumbnailPath: {
      type: String,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
