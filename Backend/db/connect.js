const mongoose = require("mongoose");

const db = "mongodb://127.0.0.1:27017/grocery";

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connection successful");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit on DB connection error
  }
};

module.exports = connectDB;
