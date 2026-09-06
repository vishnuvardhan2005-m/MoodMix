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
      className={`group relative p-2.5 sm:p-3 border-b border-[#D8D3C8] transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
        isCurrent ? 'bg-[#151515] text-[#FAF8F2]' : 'bg-[#FAF8F2] hover:bg-white text-[#111111]'
      }`}
    >
      {/* Index & Artwork & Track Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className={`text-[11px] font-mono w-5 text-right shrink-0 ${isCurrent ? 'text-amber-400' : 'text-[#6B6B65]'}`}>
          {trackNum}
        </span>

        {/* Small square artwork sleeve */}
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 bg-neutral-800 shrink-0 border border-[#D8D3C8] overflow-hidden">
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
            <h3 className={`font-bold text-sm truncate font-serif ${isCurrent ? 'text-white' : 'text-[#111111]'}`}>
              {song.title}
            </h3>
            {isCurrent && isPlaying && (
              <span className="text-[9px] font-mono tracking-wider text-amber-400 uppercase animate-pulse">
                — PLAYING
              </span>
            )}
          </div>
          <p className={`text-[11px] font-medium truncate ${isCurrent ? 'text-[#A0A09C]' : 'text-[#6B6B65]'}`}>
            {song.artist}
          </p>
        </div>
      </div>

      {/* Language & Energy */}
      <div className="hidden sm:flex items-center gap-2 shrink-0 text-[10px] font-mono">
        <span className={`px-1.5 py-0.5 border ${isCurrent ? 'border-neutral-700 text-neutral-300' : 'border-[#D8D3C8] text-[#6B6B65]'}`}>
          {song.language}
        </span>
        <span className={`px-1.5 py-0.5 border ${isCurrent ? 'border-neutral-700 text-neutral-300' : 'border-[#D8D3C8] text-[#6B6B65]'}`}>
          LVL {song.energy}
        </span>
      </div>

      {/* Play Action Button */}
      <button
        type="button"
        onClick={handlePlayClick}
        aria-label={isCurrent && isPlaying ? 'Pause song' : 'Play song'}
        className={`w-7 h-7 sm:w-8 sm:h-8 border flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer ${
          isCurrent
            ? 'bg-amber-400 text-[#111111] border-amber-400'
            : 'bg-[#111111] text-[#F4F0E7] border-[#111111] hover:bg-black'
        }`}
      >
        {isCurrent && isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </button>
    </div>
  );
};

export default SongCard;
