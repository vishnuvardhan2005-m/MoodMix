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
      <div className="max-w-md mx-auto my-20 p-8 bg-[#FAF8F2] border border-[#D8D3C8] text-center space-y-4">
        <Disc className="w-10 h-10 text-[#6B6B65] mx-auto" />
        <h2 className="font-serif text-2xl text-[#111111] uppercase">No Track Loaded</h2>
        <p className="text-xs font-mono text-[#6B6B65]">Return to home to select a track to listen to.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#111111] text-[#F4F0E7] text-xs font-mono uppercase tracking-widest cursor-pointer"
        >
          BROWSE CATALOG
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 pb-40 space-y-6">
      {/* Back to library link */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#6B6B65] hover:text-[#111111] transition-colors cursor-pointer py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO CATALOG</span>
      </button>

      <MusicPlayer />
    </div>
  );
};

export default PlayerPage;
