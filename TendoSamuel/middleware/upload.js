const multer = require("multer");
const path = require("path");
const fs = require("fs");

const videoDir = path.join(__dirname, "../uploads/videos");
const thumbnailDir = path.join(__dirname, "../uploads/thumbnails");

// ensure folders exist
fs.mkdirSync(videoDir, { recursive: true });
fs.mkdirSync(thumbnailDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        if (file.fieldname === "video") {
            cb(null, videoDir);
        } 
        else if (file.fieldname === "thumbnail") {
            cb(null, thumbnailDir);
        }

    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {

    if (file.fieldname === "video") {
        const allowedVideos = ["video/mp4", "video/webm", "video/mkv"];

        if (allowedVideos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only video files are allowed"), false);
        }
    }

    if (file.fieldname === "thumbnail") {
        const allowedImages = ["image/jpeg", "image/jpg", "image/png"];

        if (allowedImages.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
}).fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]);

module.exports = upload;