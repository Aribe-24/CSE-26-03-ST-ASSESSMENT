const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config(); // Loads environment variables if you use them later

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/videx')
  .then(() => console.log('🚀 Successfully connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  quality: { type: String, required: true },
  publishDate: { type: Date, required: true },
  videoUrl: { type: String, required: true },      // File path for the video
  thumbnailUrl: { type: String, required: true },  // File path for the thumbnail image
  views: { type: String, default: '0' },
  timeAgo: { type: String, default: 'Just now' }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Parse incoming form text fields
app.use(express.urlencoded({ extended: true }));
// Serve static assets (CSS, and your future uploaded files)
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Files save into public/uploads/
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Appends timestamp to prevent filename conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 }
]);


// GET: Main Landing Page
app.get('/', (req, res) => {
    res.render('index'); 
});

// GET: Render the Upload Video Form Page
app.get('/add', (req, res) => {
  res.render('add');
});

// GET: Render Dashboard Grid View (Fetches live data from DB)
app.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 }); // Newest first
    res.render('videos', { videos });
  } catch (error) {
    res.status(500).send('Error loading videos dashboard.');
  }
});

// POST: Handle form submission, save files and save fields to MongoDB
app.post('/api/upload', upload, async (req, res) => {
  try {
    // Check if files were successfully captured by multer
    if (!req.files || !req.files['videoFile'] || !req.files['thumbnailFile']) {
      return res.status(400).send('Missing files! Please upload both a video and a thumbnail.');
    }

    const { title, description, quality, publishDate } = req.body;

    // Relative web URLs pointing to where your static middleware serves the uploads folder
    const videoUrl = `/uploads/${req.files['videoFile'][0].filename}`;
    const thumbnailUrl = `/uploads/${req.files['thumbnailFile'][0].filename}`;

    const newVideo = new Video({
      title,
      description,
      quality,
      publishDate,
      videoUrl,
      thumbnailUrl,
      views: '0',
      timeAgo: 'Just now'
    });

    await newVideo.save();
    
    // Redirect right over to your videos view template upon success
    res.redirect('/videos');
  } catch (error) {
    console.error('Upload Process failure:', error);
    res.status(500).send('Internal Server Error processing your upload.');
  }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});