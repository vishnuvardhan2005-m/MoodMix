const mongoose = require('mongoose');
const Song = require('../models/Song');
const sampleSongs = require('../data/sampleSongs');

const isDbConnected = () => mongoose.connection.readyState === 1;

const getAllSongs = async (req, res) => {
  try {
    if (isDbConnected()) {
      const songs = await Song.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: songs.length,
        data: songs
      });
    }
  } catch (error) {
    console.warn('[SongController] Database query failed, falling back to in-memory songs:', error.message);
  }

  // Fallback to sample songs when DB is disconnected or query fails
  return res.status(200).json({
    success: true,
    count: sampleSongs.length,
    data: sampleSongs,
    source: 'in-memory-fallback'
  });
};

const getSongById = async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const song = await Song.findById(id);
      if (song) {
        return res.status(200).json({
          success: true,
          data: song
        });
      }
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid song ID format'
      });
    }
    console.warn('[SongController] Database lookup failed, falling back to in-memory search:', error.message);
  }

  // Fallback to in-memory search
  const fallbackSong = sampleSongs.find(s => s._id === id || String(s._id) === id);
  if (!fallbackSong) {
    return res.status(404).json({
      success: false,
      message: 'Song not found'
    });
  }

  return res.status(200).json({
    success: true,
    data: fallbackSong,
    source: 'in-memory-fallback'
  });
};

const getSongsByMood = async (req, res) => {
  const { mood } = req.params;

  try {
    if (isDbConnected()) {
      const songs = await Song.find({
        moods: { $elemMatch: { $regex: new RegExp(`^${mood}$`, 'i') } }
      });
      return res.status(200).json({
        success: true,
        mood: mood.toLowerCase(),
        count: songs.length,
        data: songs
      });
    }
  } catch (error) {
    console.warn('[SongController] Mood search DB query failed, using in-memory fallback:', error.message);
  }

  // Fallback in-memory search
  const moodRegex = new RegExp(`^${mood}$`, 'i');
  const filtered = sampleSongs.filter(s => s.moods.some(m => moodRegex.test(m)));

  return res.status(200).json({
    success: true,
    mood: mood.toLowerCase(),
    count: filtered.length,
    data: filtered,
    source: 'in-memory-fallback'
  });
};

const recommendSongs = async (req, res) => {
  const mood = (req.body.mood || req.query.mood || '').toLowerCase().trim();
  const rawIntensity = Number(req.body.intensity ?? req.query.intensity ?? 50);
  const intensity = Math.max(0, Math.min(100, isNaN(rawIntensity) ? 50 : rawIntensity));
  const language = (req.body.language || req.query.language || 'all').trim();

  // Map 0-100 intensity to 1-10 energy scale
  const targetEnergy = Math.max(1, Math.min(10, Math.round((intensity / 100) * 9) + 1));

  if (!mood) {
    return res.status(400).json({
      success: false,
      message: 'Mood parameter is required'
    });
  }

  try {
    if (isDbConnected()) {
      const query = {
        moods: { $elemMatch: { $regex: new RegExp(`^${mood}$`, 'i') } }
      };

      if (language && language.toLowerCase() !== 'all') {
        query.language = { $regex: new RegExp(`^${language}$`, 'i') };
      }

      let songs = await Song.find(query);

      // Fallback if no exact mood & language match exists
      if (songs.length === 0) {
        const fallbackQuery = {
          energy: { $gte: Math.max(1, targetEnergy - 2), $lte: Math.min(10, targetEnergy + 2) }
        };
        if (language && language.toLowerCase() !== 'all') {
          fallbackQuery.language = { $regex: new RegExp(`^${language}$`, 'i') };
        }
        songs = await Song.find(fallbackQuery);
      }

      songs.sort((a, b) => {
        const distA = Math.abs(a.energy - targetEnergy);
        const distB = Math.abs(b.energy - targetEnergy);
        return distA - distB;
      });

      return res.status(200).json({
        success: true,
        mood,
        intensity,
        language,
        targetEnergy,
        count: songs.length,
        data: songs
      });
    }
  } catch (error) {
    console.warn('[SongController] DB recommendation failed, falling back to in-memory sample songs:', error.message);
  }

  // In-memory fallback recommendation
  const moodRegex = new RegExp(`^${mood}$`, 'i');
  let songs = sampleSongs.filter(s => {
    const matchesMood = s.moods.some(m => moodRegex.test(m));
    const matchesLang = (!language || language.toLowerCase() === 'all') ? true : s.language.toLowerCase() === language.toLowerCase();
    return matchesMood && matchesLang;
  });

  if (songs.length === 0) {
    songs = sampleSongs.filter(s => {
      const matchesEnergy = s.energy >= Math.max(1, targetEnergy - 2) && s.energy <= Math.min(10, targetEnergy + 2);
      const matchesLang = (!language || language.toLowerCase() === 'all') ? true : s.language.toLowerCase() === language.toLowerCase();
      return matchesEnergy && matchesLang;
    });
  }

  const sortedSongs = [...songs].sort((a, b) => {
    const distA = Math.abs(a.energy - targetEnergy);
    const distB = Math.abs(b.energy - targetEnergy);
    return distA - distB;
  });

  return res.status(200).json({
    success: true,
    mood,
    intensity,
    language,
    targetEnergy,
    count: sortedSongs.length,
    data: sortedSongs,
    source: 'in-memory-fallback'
  });
};

module.exports = {
  getAllSongs,
  getSongById,
  getSongsByMood,
  recommendSongs
};
