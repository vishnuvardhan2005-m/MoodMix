import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

const SongCard = ({ song, index = 0, queue = [] }) => {
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  const isCurrent = currentSong?._id === song._id;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, queue);
    }
  };

  const handleRowClick = () => {
    navigate(`/player?id=${song._id}`);
  };

  const trackNum = (index + 1).toString().padStart(2, '0');

  return (
    <div
      onClick={handleRowClick}
      className={`group relative p-4 border-b border-[#D8D3C8] transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
        isCurrent ? 'bg-[#151515] text-[#FAF8F2]' : 'bg-[#FAF8F2] hover:bg-white text-[#111111]'
      }`}
    >
      {/* Index & Artwork & Track Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <span className={`text-xs font-mono w-6 text-right shrink-0 ${isCurrent ? 'text-amber-400' : 'text-[#6B6B65]'}`}>
          {trackNum}
        </span>

        {/* Small square artwork sleeve */}
        <div className="relative w-12 h-12 bg-neutral-800 shrink-0 border border-[#D8D3C8] overflow-hidden">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Title & Artist */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className={`font-bold text-base truncate font-serif ${isCurrent ? 'text-white' : 'text-[#111111]'}`}>
              {song.title}
            </h3>
            {isCurrent && isPlaying && (
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase animate-pulse">
                — NOW PLAYING
              </span>
            )}
          </div>
          <p className={`text-xs font-medium truncate ${isCurrent ? 'text-[#A0A09C]' : 'text-[#6B6B65]'}`}>
            {song.artist}
          </p>
        </div>
      </div>

      {/* Language, Genre & Energy */}
      <div className="hidden sm:flex items-center gap-3 shrink-0 text-xs font-mono">
        <span className={`px-2 py-0.5 border ${isCurrent ? 'border-neutral-700 text-neutral-300' : 'border-[#D8D3C8] text-[#6B6B65]'}`}>
          {song.language}
        </span>
        <span className={`px-2 py-0.5 border ${isCurrent ? 'border-neutral-700 text-neutral-300' : 'border-[#D8D3C8] text-[#6B6B65]'}`}>
          LVL {song.energy}
        </span>
      </div>

      {/* Play Action Button */}
      <button
        type="button"
        onClick={handlePlayClick}
        aria-label={isCurrent && isPlaying ? 'Pause song' : 'Play song'}
        className={`w-9 h-9 border flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer ${
          isCurrent
            ? 'bg-amber-400 text-[#111111] border-amber-400'
            : 'bg-[#111111] text-[#F4F0E7] border-[#111111] hover:bg-black'
        }`}
      >
        {isCurrent && isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>
    </div>
  );
};

export default SongCard;
