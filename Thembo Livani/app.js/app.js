require(`dotenv`).config();
const express = require (`express`);
const mongoose = require(`mongoose`);
const path = require(`path`);
const cookieParse = require(`cookieParsed`);
const { v4: uuidv4} = require(`uuid`);
const app = express();
const videoRoutes = require(`./routes/videos`);