const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/Upload");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//Join page
router.get("/join", (req, res) => {
  res.render("index");
});

// The Dashboard
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

//Video upload
router.get("/upload", (req, res) => {
  res.render("video");
});
router.post("/upload", upload.single("video"), (req, res) => {
  const { title, description,quality, } = req.body;
  const videoPath = req.file ? req.file.path : null;

  if (!title || !description || !videoPath) {
    return res.status(400).send("All fields are required.");
  }

  const newUpload = new User({
    title,
    description,
    quality,
    thumbnail, // Placeholder for thumbnail path
    video: videoPath,
  });

  newUpload
    .save()
    .then(() => res.redirect("/dashboard"))
    .catch((err) => res.status(500).send("Error uploading video."));
});
module.exports = router;
