const Song = require('../models/Song');

const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve songs',
      error: error.message
    });
  }
};

const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    res.status(200).json({
      success: true,
      data: song
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid song ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve song',
      error: error.message
    });
  }
};

const getSongsByMood = async (req, res) => {
  try {
    const { mood } = req.params;
    const songs = await Song.find({
      moods: { $elemMatch: { $regex: new RegExp(`^${mood}$`, 'i') } }
    });

    res.status(200).json({
      success: true,
      mood: mood.toLowerCase(),
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to retrieve songs for mood '${req.params.mood}'`,
      error: error.message
    });
  }
};

const recommendSongs = async (req, res) => {
  try {
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

    // Build Mongoose query
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

    // Sort songs by energy proximity to targetEnergy
    songs.sort((a, b) => {
      const distA = Math.abs(a.energy - targetEnergy);
      const distB = Math.abs(b.energy - targetEnergy);
      return distA - distB;
    });

    res.status(200).json({
      success: true,
      mood,
      intensity,
      language,
      targetEnergy,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
};

module.exports = {
  getAllSongs,
  getSongById,
  getSongsByMood,
  recommendSongs
};
