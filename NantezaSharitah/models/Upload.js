const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    title: {    
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model('Upload', uploadSchema);