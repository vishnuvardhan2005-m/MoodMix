const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Song = require('../models/Song');

dotenv.config();

const sampleSongs = [
  // ==================== TELUGU TRACKS (15) ====================
  {
    title: 'Godavari Odduana',
    artist: 'Srinivas Instrumental Ensemble',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    moods: ['calm', 'romantic'],
    energy: 3,
    genre: 'Folk Flute',
    language: 'Telugu'
  },
  {
    title: 'Malle Puvvu Melody',
    artist: 'Tollywood Strings Quartet',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    moods: ['romantic', 'happy'],
    energy: 5,
    genre: 'Tollywood Romance',
    language: 'Telugu'
  },
  {
    title: 'Dappu Rhythm Energy',
    artist: 'Telangana Beat Project',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    moods: ['energetic', 'happy'],
    energy: 9,
    genre: 'Folk Beats',
    language: 'Telugu'
  },
  {
    title: 'Vennela Varsham',
    artist: 'Sravana Acoustic',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    moods: ['calm', 'sad'],
    energy: 2,
    genre: 'Acoustic Melody',
    language: 'Telugu'
  },
  {
    title: 'Hyderabad Lo-Fi Night',
    artist: 'Deccan Chill Beats',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    moods: ['focus', 'calm'],
    energy: 4,
    genre: 'Lo-Fi Melody',
    language: 'Telugu'
  },
  {
    title: 'Sankranti Sambaralu',
    artist: 'Rayalaseema Folk Collective',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    moods: ['happy', 'energetic'],
    energy: 8,
    genre: 'Celebration Folk',
    language: 'Telugu'
  },
  {
    title: 'Aakasa Veedhilo',
    artist: 'Kaveri Soundscapes',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80',
    moods: ['sad', 'romantic'],
    energy: 3,
    genre: 'Ambient Veena',
    language: 'Telugu'
  },
  {
    title: 'Charminar Synth Drive',
    artist: 'Cyber Tollywood',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80',
    moods: ['energetic', 'focus'],
    energy: 10,
    genre: 'Synth Fusion',
    language: 'Telugu'
  },
  {
    title: 'Prema Geetham',
    artist: 'Kalyani Violin Trio',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=600&auto=format&fit=crop&q=80',
    moods: ['romantic', 'calm'],
    energy: 4,
    genre: 'Romantic Instrumental',
    language: 'Telugu'
  },
  {
    title: 'Ekaki Manasu',
    artist: 'Nirvana Piano',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    moods: ['sad', 'focus'],
    energy: 1,
    genre: 'Solitude Piano',
    language: 'Telugu'
  },
  {
    title: 'Vizag Sea Breeze',
    artist: 'Coastal Chill Trio',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    moods: ['calm', 'happy'],
    energy: 4,
    genre: 'Chillwave',
    language: 'Telugu'
  },
  {
    title: 'Mind Deep Study',
    artist: 'Gautami Brainwave',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    moods: ['focus', 'calm'],
    energy: 3,
    genre: 'Focus Ambient',
    language: 'Telugu'
  },
  {
    title: 'Jaathara Celebration',
    artist: 'Janapada Beats',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    moods: ['energetic', 'happy'],
    energy: 9,
    genre: 'Tollywood Dance',
    language: 'Telugu'
  },
  {
    title: 'Kanti Paapa',
    artist: 'Anurag Lullaby Project',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=600&auto=format&fit=crop&q=80',
    moods: ['sad', 'calm'],
    energy: 2,
    genre: 'Acoustic Lullaby',
    language: 'Telugu'
  },
  {
    title: 'Anandam Every Day',
    artist: 'Chaitanya Group',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    moods: ['happy', 'romantic'],
    energy: 6,
    genre: 'Feel-Good Pop',
    language: 'Telugu'
  },

  // ==================== ENGLISH TRACKS (15) ====================
  {
    title: 'Neon Horizons',
    artist: 'Aether Wave',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    moods: ['calm', 'focus'],
    energy: 3,
    genre: 'Synthwave',
    language: 'English'
  },
  {
    title: 'Midnight Pulse',
    artist: 'Lunar Eclipse',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    moods: ['energetic', 'happy'],
    energy: 9,
    genre: 'Electronic Dance',
    language: 'English'
  },
  {
    title: 'Quiet Reflections',
    artist: 'Solitude Echoes',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    moods: ['sad', 'calm'],
    energy: 2,
    genre: 'Ambient Piano',
    language: 'English'
  },
  {
    title: 'Cyber Drive',
    artist: 'Glitch Horizon',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80',
    moods: ['focus', 'energetic'],
    energy: 8,
    genre: 'Cyberpunk',
    language: 'English'
  },
  {
    title: 'Sunlight Drift',
    artist: 'Breeze Collective',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    moods: ['happy', 'chill', 'calm'],
    energy: 5,
    genre: 'Lo-Fi Pop',
    language: 'English'
  },
  {
    title: 'Velvet Starlight',
    artist: 'Silk & Strings',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    moods: ['romantic', 'calm'],
    energy: 4,
    genre: 'Soul Chill',
    language: 'English'
  },
  {
    title: 'Overdrive Ignite',
    artist: 'Velocity Nitro',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    moods: ['energetic', 'focus'],
    energy: 10,
    genre: 'Synthcore',
    language: 'English'
  },
  {
    title: 'Cosmic Journey',
    artist: 'Starlight Dreamer',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    moods: ['focus', 'calm'],
    energy: 3,
    genre: 'Deep Ambient',
    language: 'English'
  },
  {
    title: 'Tidal Flow',
    artist: 'Oceanic Whispers',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    moods: ['calm', 'romantic'],
    energy: 4,
    genre: 'Chillwave',
    language: 'English'
  },
  {
    title: 'Rainy Alleyway',
    artist: 'Midnight Rain',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80',
    moods: ['sad', 'romantic'],
    energy: 3,
    genre: 'Indie Nocturne',
    language: 'English'
  },
  {
    title: 'Golden Horizon',
    artist: 'Solaris Duo',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    moods: ['happy', 'energetic'],
    energy: 7,
    genre: 'Upbeat Synth',
    language: 'English'
  },
  {
    title: 'Passion Spark',
    artist: 'Blush Quartet',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=600&auto=format&fit=crop&q=80',
    moods: ['romantic', 'happy'],
    energy: 6,
    genre: 'Pop Romance',
    language: 'English'
  },
  {
    title: 'Deep Synapse',
    artist: 'Neural Matrix',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    moods: ['focus', 'calm'],
    energy: 4,
    genre: 'Ambient Focus',
    language: 'English'
  },
  {
    title: 'Melancholy Sunset',
    artist: 'Dusk Echoes',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    moods: ['sad', 'calm'],
    energy: 1,
    genre: 'Acoustic Sad',
    language: 'English'
  },
  {
    title: 'Summer Sunshine',
    artist: 'Vibe Electric',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    moods: ['happy', 'energetic'],
    energy: 8,
    genre: 'Tropical Pop',
    language: 'English'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/moodmix';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing songs...');
    await Song.deleteMany();

    console.log('Inserting 30 verified songs (15 Telugu, 15 English)...');
    const createdSongs = await Song.insertMany(sampleSongs);

    console.log(`Successfully seeded ${createdSongs.length} songs into MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
