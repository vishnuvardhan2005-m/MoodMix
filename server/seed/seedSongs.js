const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Song = require('../models/Song');

dotenv.config();

const sampleSongs = [
  {
    title: 'YouTube Track 1',
    artist: 'Unknown',
    youtubeVideoId: 'HZ_Q20ir-gg',
    youtubeUrl: 'https://www.youtube.com/watch?v=HZ_Q20ir-gg&list=RDMMHZ_Q20ir-gg&start_radio=1',
    audioUrl: 'https://www.youtube.com/watch?v=HZ_Q20ir-gg&list=RDMMHZ_Q20ir-gg&start_radio=1',
    coverUrl: 'https://img.youtube.com/vi/HZ_Q20ir-gg/hqdefault.jpg',
    moods: ['romantic', 'calm', 'happy'],
    energy: 4,
    genre: 'YouTube Track',
    language: 'Telugu'
  },
  {
    title: 'YouTube Track 2',
    artist: 'Unknown',
    youtubeVideoId: 'JqFzhcWo3EU',
    youtubeUrl: 'https://www.youtube.com/watch?v=JqFzhcWo3EU',
    audioUrl: 'https://www.youtube.com/watch?v=JqFzhcWo3EU',
    coverUrl: 'https://img.youtube.com/vi/JqFzhcWo3EU/hqdefault.jpg',
    moods: ['happy', 'energetic'],
    energy: 7,
    genre: 'YouTube Track',
    language: 'Telugu'
  },
  {
    title: 'YouTube Track 3',
    artist: 'Unknown',
    youtubeVideoId: 'GF8HgqemgHk',
    youtubeUrl: 'https://www.youtube.com/watch?v=GF8HgqemgHk&list=RDGF8HgqemgHk&start_radio=1',
    audioUrl: 'https://www.youtube.com/watch?v=GF8HgqemgHk&list=RDGF8HgqemgHk&start_radio=1',
    coverUrl: 'https://img.youtube.com/vi/GF8HgqemgHk/hqdefault.jpg',
    moods: ['sad', 'calm', 'romantic'],
    energy: 2,
    genre: 'YouTube Track',
    language: 'Telugu'
  },
  {
    title: 'YouTube Track 4',
    artist: 'Unknown',
    youtubeVideoId: 'SVH7z6y8Pq0',
    youtubeUrl: 'https://www.youtube.com/watch?v=SVH7z6y8Pq0',
    audioUrl: 'https://www.youtube.com/watch?v=SVH7z6y8Pq0',
    coverUrl: 'https://img.youtube.com/vi/SVH7z6y8Pq0/hqdefault.jpg',
    moods: ['energetic', 'focus'],
    energy: 9,
    genre: 'YouTube Track',
    language: 'Telugu'
  },
  {
    title: 'YouTube Track 5',
    artist: 'Unknown',
    youtubeVideoId: 'taoXDPLo0nA',
    youtubeUrl: 'https://www.youtube.com/watch?v=taoXDPLo0nA',
    audioUrl: 'https://www.youtube.com/watch?v=taoXDPLo0nA',
    coverUrl: 'https://img.youtube.com/vi/taoXDPLo0nA/hqdefault.jpg',
    moods: ['calm', 'focus', 'happy'],
    energy: 5,
    genre: 'YouTube Track',
    language: 'English'
  },
  {
    title: 'YouTube Track 6',
    artist: 'Unknown',
    youtubeVideoId: 'oR2ANZeD37w',
    youtubeUrl: 'https://www.youtube.com/watch?v=oR2ANZeD37w',
    audioUrl: 'https://www.youtube.com/watch?v=oR2ANZeD37w',
    coverUrl: 'https://img.youtube.com/vi/oR2ANZeD37w/hqdefault.jpg',
    moods: ['romantic', 'happy'],
    energy: 6,
    genre: 'YouTube Track',
    language: 'English'
  },
  {
    title: 'YouTube Track 7',
    artist: 'Unknown',
    youtubeVideoId: 'tlRlavbg3sY',
    youtubeUrl: 'https://www.youtube.com/watch?v=tlRlavbg3sY&list=RDtlRlavbg3sY&start_radio=1',
    audioUrl: 'https://www.youtube.com/watch?v=tlRlavbg3sY&list=RDtlRlavbg3sY&start_radio=1',
    coverUrl: 'https://img.youtube.com/vi/tlRlavbg3sY/hqdefault.jpg',
    moods: ['calm', 'sad'],
    energy: 3,
    genre: 'YouTube Track',
    language: 'English'
  },
  {
    title: 'YouTube Track 8',
    artist: 'Unknown',
    youtubeVideoId: '4oMO8IYwOos',
    youtubeUrl: 'https://www.youtube.com/watch?v=4oMO8IYwOos&list=PLjPPOf7d9WMPJkC8gDuif4A5OJBU91Zth&pp=8AUB',
    audioUrl: 'https://www.youtube.com/watch?v=4oMO8IYwOos&list=PLjPPOf7d9WMPJkC8gDuif4A5OJBU91Zth&pp=8AUB',
    coverUrl: 'https://img.youtube.com/vi/4oMO8IYwOos/hqdefault.jpg',
    moods: ['energetic', 'happy', 'focus'],
    energy: 8,
    genre: 'YouTube Track',
    language: 'English'
  },
  {
    title: 'YouTube Track 9',
    artist: 'Unknown',
    youtubeVideoId: '6DfaBq2rVoE',
    youtubeUrl: 'https://www.youtube.com/watch?v=6DfaBq2rVoE',
    audioUrl: 'https://www.youtube.com/watch?v=6DfaBq2rVoE',
    coverUrl: 'https://img.youtube.com/vi/6DfaBq2rVoE/hqdefault.jpg',
    moods: ['happy', 'romantic', 'energetic'],
    energy: 6,
    genre: 'YouTube Track',
    language: 'Telugu'
  },
  {
    title: 'YouTube Track 10',
    artist: 'Unknown',
    youtubeVideoId: 'aozErj9NqeE',
    youtubeUrl: 'https://www.youtube.com/watch?v=aozErj9NqeE',
    audioUrl: 'https://www.youtube.com/watch?v=aozErj9NqeE',
    coverUrl: 'https://img.youtube.com/vi/aozErj9NqeE/hqdefault.jpg',
    moods: ['calm', 'romantic'],
    energy: 4,
    genre: 'YouTube Track',
    language: 'Telugu'
  },
  {
    title: 'YouTube Track 11',
    artist: 'Unknown',
    youtubeVideoId: 'GYfdWiAnshE',
    youtubeUrl: 'https://www.youtube.com/watch?v=GYfdWiAnshE',
    audioUrl: 'https://www.youtube.com/watch?v=GYfdWiAnshE',
    coverUrl: 'https://img.youtube.com/vi/GYfdWiAnshE/hqdefault.jpg',
    moods: ['energetic', 'focus', 'happy'],
    energy: 8,
    genre: 'YouTube Track',
    language: 'Telugu'
  },
  {
    title: 'YouTube Track 12',
    artist: 'Unknown',
    youtubeVideoId: 'W0DM5lcj6mw',
    youtubeUrl: 'https://www.youtube.com/watch?v=W0DM5lcj6mw',
    audioUrl: 'https://www.youtube.com/watch?v=W0DM5lcj6mw',
    coverUrl: 'https://img.youtube.com/vi/W0DM5lcj6mw/hqdefault.jpg',
    moods: ['happy', 'romantic', 'calm'],
    energy: 5,
    genre: 'YouTube Track',
    language: 'English'
  },
  {
    title: 'YouTube Track 13',
    artist: 'Unknown',
    youtubeVideoId: 'kPhpHvnnn0Q',
    youtubeUrl: 'https://www.youtube.com/watch?v=kPhpHvnnn0Q',
    audioUrl: 'https://www.youtube.com/watch?v=kPhpHvnnn0Q',
    coverUrl: 'https://img.youtube.com/vi/kPhpHvnnn0Q/hqdefault.jpg',
    moods: ['energetic', 'happy'],
    energy: 7,
    genre: 'YouTube Track',
    language: 'English'
  },
  {
    title: 'YouTube Track 14',
    artist: 'Unknown',
    youtubeVideoId: 'SezFNtFCeQY',
    youtubeUrl: 'https://www.youtube.com/watch?v=SezFNtFCeQY',
    audioUrl: 'https://www.youtube.com/watch?v=SezFNtFCeQY',
    coverUrl: 'https://img.youtube.com/vi/SezFNtFCeQY/hqdefault.jpg',
    moods: ['sad', 'calm', 'reflective'],
    energy: 3,
    genre: 'YouTube Track',
    language: 'English'
  },
  {
    title: 'YouTube Track 15',
    artist: 'Unknown',
    youtubeVideoId: 'pQbvrDl3kcY',
    youtubeUrl: 'https://www.youtube.com/watch?v=pQbvrDl3kcY',
    audioUrl: 'https://www.youtube.com/watch?v=pQbvrDl3kcY',
    coverUrl: 'https://img.youtube.com/vi/pQbvrDl3kcY/hqdefault.jpg',
    moods: ['focus', 'calm', 'happy'],
    energy: 5,
    genre: 'YouTube Track',
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

    console.log('Inserting 15 YouTube tracks...');
    const createdSongs = await Song.insertMany(sampleSongs);

    console.log(`Successfully seeded ${createdSongs.length} YouTube tracks into MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
