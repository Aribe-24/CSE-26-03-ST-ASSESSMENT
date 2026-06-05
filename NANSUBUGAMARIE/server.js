const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// creating app
const app = express();

// connecting DB
mongoose.connect("mongodb://localhost:27017/");

// setting pug as a template engine
app.set("view engine","pug")
 
// serving static files
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

// connecting routes
const videxRoutes = require("./routes/videxRoutes")
app.use("/",videxRoutes);


// last line of code
app.listen(3010,()=>{console.log("Server running at port 3010")});
