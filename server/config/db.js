const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moodmix', {
      serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds instead of default 30s
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB Atlas cluster: ${error.message}`);
    console.warn(`[Database Warning] Running in in-memory fallback mode for sample songs.`);
    console.warn(`[Database Hint] To use live MongoDB, add your current IP address to MongoDB Atlas Network Access whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/`);
  }
};

module.exports = connectDB;

