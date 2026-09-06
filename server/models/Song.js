const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Song title is required'],
      trim: true
    },
    artist: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true
    },
    audioUrl: {
      type: String,
      required: [true, 'Audio URL is required'],
      trim: true
    },
    youtubeVideoId: {
      type: String,
      trim: true
    },
    youtubeUrl: {
      type: String,
      trim: true
    },
    coverUrl: {
      type: String,
      required: [true, 'Cover image URL is required'],
      trim: true
    },
    moods: {
      type: [String],
      required: [true, 'At least one mood is required'],
      default: []
    },
    energy: {
      type: Number,
      required: [true, 'Energy level is required'],
      min: 1,
      max: 10
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      enum: ['English', 'Telugu', 'Hindi', 'Instrumental', 'Unknown'],
      default: 'Unknown',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Song', songSchema);
