const mongoose = require("mongoose");

const connectDb = async () => {
  if (!process.env.DATABASE) {
    console.warn('  No DATABASE env var set — running without persistence');
    return;
  }
  
  try {
    const conn = await mongoose.connect(process.env.DATABASE);
    console.log(" Mongoose connection open");
  } catch (error) {
    console.error(`❌Connection error: ${error.message}`);
    console.warn('Running in limited mode without database');
  }
};

module.exports = connectDb;
