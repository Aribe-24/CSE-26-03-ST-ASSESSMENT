const mongoose = require('mongoose');

// Structure of each video in the database
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    quality: {
      type: String,
      required: true,
      enum: ['360p', '720p', '1080p']
    },

    publishingDate: {
      type: Date,
      required: true
    },

    videoPath: {
      type: String,
      required: true
    },

    thumbnailPath: {
      type: String,
      required: true
    },

    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Video', videoSchema);