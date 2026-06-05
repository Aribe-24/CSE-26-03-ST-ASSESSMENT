// 1. Dependencies
const express = require("express");
const expressSession = require("express-session");
const flash = require('connect-flash');
const path = require("path");
const mongoose = require('mongoose');
// const passport = require('passport');
const MongoStore = require('connect-mongo').default;
require('dotenv').config();


// Import DB and Models
const connectDb = require('./config/db');

// 2. Configurations & DB(instantiations)
const app = express();
const port = 7000;
connectDb(); 

// set templating engine to pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 3. Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// SINGLE SESSION CONFIGURATION
const sessionMiddleware = expressSession({
  secret: process.env.SESSION_SECRET || "My secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE,
    cookieSession: 1000*60*60*1
  })
});

app.use(sessionMiddleware);
app.use(flash());


//global variable to make the logged in user available to all pug templates
app.use((req,res,next)=>{
  res.locals.user = req.user || null
  next();
});

// global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});



// 4. Routes
app.use("/", require("./routes/videxRoutes"));


app.use((req, res) => {
  res.status(404).send('error');
});

// 6. Bootstrapping server
app.listen(port, () => console.log(`Server & Sockets live on port ${port}`));