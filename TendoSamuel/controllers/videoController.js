const Video = require("../models/Video");

//  
exports.getHome = (req, res) => {
  res.render("home");
};

exports.getVideos = (req, res) => {
  res.render("videos");
};
//  Upload page
exports.getUploadPage = (req, res) => {
  res.render("upload");
};

//  Upload video 
exports.uploadVideo = async (req, res) => {
  try {
    const { title, quality } = req.body;

    if (!title || !quality) {
      return res.status(400).json({ error: "Title and quality are required" });
    }

    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res.status(400).json({ error: "Video and thumbnail are required" });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];

    const newVideo = await Video.create({
      title,
      quality,
      videoUrl: "/videos/" + videoFile.filename,
      thumbnailUrl: "/thumbnails/" + thumbnailFile.filename,
      createdAt: new Date()
    });

    res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while uploading video" });
  }
};

//  Get all videos (latest first)
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while fetching videos" });
  }
};

// Watch video page
exports.watchVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
  console.error(" REAL UPLOAD ERROR:", error);
  res.status(500).json({
    error: error.message,
    stack: error.stack
  });
}
};