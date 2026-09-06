const express = require('express');
const router = express.Router();
const {
  getAllSongs,
  getSongById,
  getSongsByMood,
  recommendSongs
} = require('../controllers/songController');

router.get('/', getAllSongs);
router.post('/recommend', recommendSongs);
router.get('/recommend', recommendSongs);
router.get('/mood/:mood', getSongsByMood);
router.get('/:id', getSongById);

module.exports = router;
