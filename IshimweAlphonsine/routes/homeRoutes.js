const express = require('express');
const router = express.Router();

// home page routes
router.get('/home', (req, res) => {
  res.render('home');
});
router.post('/home', (req, res) => {
  req.body
});


// uploadform routes
router.get('/upload', (req, res) => {
  res.render('uploadForm');
});
router.post('/upload', (req, res) => {
  req.body
});



module.exports = router;