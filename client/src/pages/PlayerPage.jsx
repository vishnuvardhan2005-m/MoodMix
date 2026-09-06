import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getSongById, getSongs } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import MusicPlayer from '../components/MusicPlayer';
import { ArrowLeft, Disc } from 'lucide-react';

const PlayerPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const songId = searchParams.get('id');

  const { currentSong, playSong } = usePlayer();

  useEffect(() => {
    const syncTrack = async () => {
      try {
        if (songId && (!currentSong || currentSong._id !== songId)) {
          const res = await getSongById(songId);
          if (res.data) {
            const allSongsRes = await getSongs();
            playSong(res.data, allSongsRes.data || [res.data]);
          }
        } else if (!currentSong) {
          const allSongsRes = await getSongs();
          if (allSongsRes.data && allSongsRes.data.length > 0) {
            playSong(allSongsRes.data[0], allSongsRes.data);
          }
        }
      } catch (err) {
        console.error('Error syncing track on player page:', err);
      }
    };

    syncTrack();
  }, [songId]);

  if (!currentSong) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-card rounded-2xl text-center space-y-4">
        <Disc className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-100">No Track Loaded</h2>
        <p className="text-sm text-slate-400">Return to home to select a track.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-500 transition-colors cursor-pointer"
        >
          Browse Library
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-36 space-y-8">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors glass-card px-3.5 py-1.5 rounded-xl cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </button>

      <MusicPlayer />
    </div>
  );
};

export default PlayerPage;
