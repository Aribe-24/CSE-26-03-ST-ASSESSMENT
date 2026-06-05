// 1. Dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config();
const connectDb = require('./config/db');

// 2. Instantiations
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Configuration
// Set templating engine to pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
connectDb();

// 4. Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// 5. Routes
app.use('/', require('./routes/videoRoutes'));

// Handling non-existent routes
app.use((req, res) => {
  res.status(404).send('Oops! Route not found');
});

// 6. Bootstrap Server
app.listen(PORT, () => console.log(`listening on port ${PORT}`));