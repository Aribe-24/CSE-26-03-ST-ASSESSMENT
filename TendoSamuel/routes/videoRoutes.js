const express = require("express");
const router = express.Router();

const videoController = require("../controllers/videoController");
const upload = require("../middleware/upload");

// Home
router.get("/", videoController.getHome);

// Upload page
router.get("/upload", videoController.getUploadPage);

// Save video
router.post("/upload", upload, videoController.uploadVideo);

// List videos
router.get("/videos", videoController.getVideos);

// Watch video
router.get("/watch/:id", videoController.watchVideo);

module.exports = router;