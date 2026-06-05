const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../model/Video');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = 'uploads';
        if (file.fieldname === 'videoFile') dest = path.join('uploads', 'videos');
        else if (file.fieldname === 'thumbFile') dest = path.join('uploads', 'thumbnails');

        // Ensure destination directory exists
        try {
            fs.mkdirSync(dest, { recursive: true });
        } catch (e) {
            return cb(e);
        }

        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'videoFile') {
        if (file.mimetype === 'video/mp4' || file.mimetype === 'video/mpeg' || file.mimetype === 'video/quicktime') {
            cb(null, true);
        } else {
            cb(new Error('Only MP4, MPEG, and MOV formats are allowed'), false);
        }
    } else if (file.fieldname === 'thumbFile') {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and GIF images are allowed'), false);
        }
    } else {
        cb(null, true);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
    fileFilter: fileFilter
});

const videos = [
    { title: "Arsenal wins the premier league after 22 years.", views: "999k views", uploaded: "2 weeks ago", color: "#ff0000" },
    { title: "Manchester City lost its 2nd Consecutive premier league title", views: "999k views", uploaded: "2 weeks ago", color: "#a0c4df" },
    { title: "Manchester United fun faints after Arsenal was declared winners of ...", views: "999k views", uploaded: "2 weeks ago", color: "#b80000" },
    { title: "UCL 2026 Finals referee to be investigated over bribery alegati...", views: "999k views", uploaded: "6 days ago", color: "#062261" }
];

router.get('/dashboard', async (req, res) => {
    try {
        const dbVideos = await Video.find().sort({ createdAt: -1 });
        
        const formattedVideos = dbVideos.map(video => ({
            _id: video._id,
            title: video.title,
            views: video.views + ' views',
            uploaded: formatDate(video.createdAt),
            color: video.color,
            file: '/' + video.filePath.replace(/\\/g, '/'),
            thumbnail: video.thumbnailPath ? '/' + video.thumbnailPath.replace(/\\/g, '/') : null
        }));
        
        const allVideos = formattedVideos.length > 0 ? formattedVideos : videos;
        
        res.render('dashboard', { title: 'Videx - Home', videos: allVideos });
    } catch (err) {
        console.error('Dashboard fetch error:', err);
        res.render('dashboard', { title: 'Videx - Home', videos: videos });
    }
});

router.get('/add-video', (req, res) => {
    res.render('add-video', { title: 'Upload Video' });
});

router.post('/add-video', (req, res, next) => {
    upload.fields([
        { name: 'videoFile', maxCount: 1 },
        { name: 'thumbFile', maxCount: 1 }
    ])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).send('File too large. Maximum size is 500MB.');
            }
            return res.status(400).send('Upload error: ' + err.message);
        } else if (err) {
            return res.status(400).send('Error: ' + err.message);
        }
        next();
    });
}, async (req, res) => {
    try {
        const videoFile = req.files['videoFile'] ? req.files['videoFile'][0] : null;
        const thumbFile = req.files['thumbFile'] ? req.files['thumbFile'][0] : null;

        if (!videoFile || !req.body.title || !req.body.quality || !req.body.publishDate) {
            return res.status(400).send('Missing required fields: ' + (!videoFile ? 'video file, ' : '') + (!req.body.title ? 'title, ' : '') + (!req.body.quality ? 'quality, ' : '') + (!req.body.publishDate ? 'date' : ''));
        }

        const videoData = {
            title: req.body.title,
            description: req.body.description || '',
            quality: req.body.quality,
            publishDate: req.body.publishDate,
            color: '#' + Math.floor(Math.random()*16777215).toString(16),
            filePath: videoFile.path,
            thumbnailPath: thumbFile ? thumbFile.path : null,
            views: 0
        };

        const newVideo = new Video(videoData);
        await newVideo.save();

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send("Upload failed: " + err.message);
    }
});

function formatDate(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
    if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
    if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
    if (diff < 2592000) return Math.floor(diff / 604800) + ' weeks ago';
    return Math.floor(diff / 2592000) + ' months ago';
}

module.exports = router;