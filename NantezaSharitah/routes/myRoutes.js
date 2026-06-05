const express = require("express");
const router = express.Router();
const User = require("../models/Upload");

//Join

router.get("/join", (req, res) => {
  res.render("index");
});
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/login",
//   }),
//   (req, res) => {
//     res.redirect("/dashboard");
//   },
// );

// The Dashboard
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

//Image upload
router.get("/upload", (req, res) => {
  res.render("image");
});
router.post("/upload", async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const newUpload = new User({
      title,
      description,
      image,
    });

    await newUpload.save();

    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("image");
  }
});
// router.post("/addblog", isAuthenticated, async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     const newBlog = new Blog({
//       title,
//       description,
//       author: req.user._id,
//     });

//     console.log(newBlog);

//     await newBlog.save();

//     res.redirect("/dashboard");
//   } catch (error) {
//     console.error(error);
//     res.render("editor");
//   }
// });

// // Registration form
// router.get("/register", (req, res) => {
//   res.render("registration");
// });
// //
module.exports = router;
