const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title:       { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: 200 
},
  description: { 
    type: String, 
    trim: true, 
    default: '' 
},
  quality:     { 
    type: String, 
    required: true, 
    enum: ['360', '480', '720', '1080', '4K'] 
},
  publishDate: { 
    type: Date, 
    required: true 
},
  videoFile:   { 
    type: String, 
    required: true 
},
  thumbnail:   { 
    type: String, 
    default: null 
},
  views:       { 
    type: Number, 
    default: 0 
},
  createdAt:   { 
    type: Date, 
    default: Date.now 
}
});

VideoSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Video', VideoSchema);