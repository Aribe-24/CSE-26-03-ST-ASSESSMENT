const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    quality: {
        type: String,
        default: ""
    },
    dateOfPublishing: {
        type: Date
    },
    videoUrl:{
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: false
    },
    views: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Video", videoSchema);