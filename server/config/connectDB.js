const mongoose = require("mongoose");

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 5000;

async function connectDB() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log("MongoDB Connected:", conn.connection.host);
      return;
    } catch (error) {
      console.log(`MongoDB attempt ${attempt}/${MAX_RETRIES} failed:`, error.message);
      if (attempt === MAX_RETRIES) {
        console.error("Could not connect to MongoDB. Exiting.");
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

module.exports = { connectDB };
