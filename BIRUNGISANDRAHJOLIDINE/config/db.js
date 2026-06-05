const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      process.env.DATABASE ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/birungisandra";

    const conn = await mongoose.connect(uri);

    console.log("Mongoose connected:", conn.connection.host);
  } catch (error) {
    console.log(`Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;