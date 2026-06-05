const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/videx';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Yaay🎉🎉MongoDB connected'))
  .catch(err => console.error('Oops😞MongoDB error:', err));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', require('./routes/indexRoutes'));
app.use('/videos', require('./routes/videoRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Yaay 🎉Videx is running on http://localhost:${PORT}`));