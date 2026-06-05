module.exports = (req, res, next) => {
  const { title, quality } = req.body;

  // ---- TEXT VALIDATION ----
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  if (!quality) {
    return res.status(400).json({ error: "Quality is required" });
  }

  const allowedQuality = ["360p", "720p", "1080p"];
  if (!allowedQuality.includes(quality)) {
    return res.status(400).json({ error: "Invalid quality selected" });
  }

  // ---- FILE VALIDATION ----
  if (!req.files || !req.files.video) {
    return res.status(400).json({ error: "Video file is required" });
  }

  if (!req.files || !req.files.thumbnail) {
    return res.status(400).json({ error: "Thumbnail is required" });
  }

  const video = req.files.video[0];
  const thumbnail = req.files.thumbnail[0];

  // ---- VIDEO TYPE CHECK ----
  const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
  if (!allowedVideoTypes.includes(video.mimetype)) {
    return res.status(400).json({ error: "Invalid video format" });
  }

  // ---- THUMBNAIL TYPE CHECK ----
  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedImageTypes.includes(thumbnail.mimetype)) {
    return res.status(400).json({ error: "Invalid thumbnail format" });
  }

  // ---- FILE SIZE CHECK (optional but important) ----
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5MB

  if (video.size > MAX_VIDEO_SIZE) {
    return res.status(400).json({ error: "Video too large (max 50MB)" });
  }

  if (thumbnail.size > MAX_IMAGE_SIZE) {
    return res.status(400).json({ error: "Thumbnail too large (max 5MB)" });
  }

  next();
};