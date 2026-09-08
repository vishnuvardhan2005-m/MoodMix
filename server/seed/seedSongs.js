const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Song = require('../models/Song');
const sampleSongs = require('../data/sampleSongs');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moodmix';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing songs...');
    await Song.deleteMany();

    console.log('Inserting sample YouTube tracks...');
    // Strip fixed _id before seeding into MongoDB so MongoDB generates ObjectIds
    const songsToInsert = sampleSongs.map(({ _id, ...song }) => song);
    const createdSongs = await Song.insertMany(songsToInsert);

    console.log(`Successfully seeded ${createdSongs.length} YouTube tracks into MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();

