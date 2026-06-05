// 1. Dependencies
const express = require("express");
const expressSession = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();
// connecting to mongodb
const connectDB = require("./config/db");
const app = express();
const port = process.env.PORT || 3000;

// 3. Database connection
connectDB();



// 2. Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(express.static(path.join(__dirname, 'public'))); 

// 3. View Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 4. Routes
app.use("/", require("./routes/uploadRoutes"));

// 7. 404 handler
app.use((req, res) => {
  res.status(404).send("Oops! Route not found.");
});

// 8. Start server
app.listen(port, () => console.log(`Listening on port ${port}`));