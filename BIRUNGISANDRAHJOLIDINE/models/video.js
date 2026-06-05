const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
	title: { 
        type: String,
         required: true, 
         trim: true },
	description: {
         type: String,
          default: '' },
	filename: {
         type: String,
          required: true },
	thumbnail: { 
        type: String,
         default: '' },
	quality: {
         type: String, 
         enum: ['1080p', '720p', '480p', '360p'], default: '720p' },

	uploadedBy: {
         type: mongoose.Schema.Types.ObjectId, ref: 'Signup' },
	views: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);