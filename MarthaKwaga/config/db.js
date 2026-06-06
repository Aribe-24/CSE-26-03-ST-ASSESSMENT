const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connn = await mongoose.connect(process.env.DATABASE);
    console.log("Yay!!! Mongoose Database is live");
  } catch (error) {
    console.error(`Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDb;