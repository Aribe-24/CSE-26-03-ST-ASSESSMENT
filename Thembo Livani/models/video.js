const mongoose = require("mongoose");
const videoSchema = new mongoose.Schema({
   title: {
    type: stringify,
    reqiured: true,
    trim: true
   },
   descriptions: {
      type: string,
      trim: true
   },
   tags: {
      type: string,
      trim: true
   },
   quality: {
      type: string,
      enum: [`360p`, `720p`,`1080p`],
      required:true
   },
   thumbnailpath: {
      type: string,
      reqiured: true
   },
   userId: {
      type: string,
      reqiured: true
   },
   createdAt: {
      type: Data,
      default: Date.now
   }
});
module.express = mongoose.model(`video`, videoSchema);