const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    quality: {
        type: String,
        enum: ['360p', '720p', '1080p'],
        required: true
    },

    publishDate: {
        type: Date,
        required: Date.now
    },

    videoPath: {
        type: String,
        required: true
    },

    thumbnailPath: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);