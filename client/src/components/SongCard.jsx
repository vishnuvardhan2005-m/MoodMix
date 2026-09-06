import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Zap, Music2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

const SongCard = ({ song, queue = [] }) => {
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

  const handleCardClick = () => {
    navigate(`/player?id=${song._id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className={`group relative rounded-2xl glass-card p-4 transition-all duration-300 cursor-pointer overflow-hidden ${
        isCurrent ? 'ring-2 ring-purple-500/70 bg-purple-950/20' : ''
      }`}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-800">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Energy badge top right */}
        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-amber-400 flex items-center gap-1">
          <Zap className="w-3 h-3 fill-amber-400" />
          <span>Lvl {song.energy}</span>
        </div>

        {/* Hover Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/40 backdrop-blur-[2px]">
          <button
            type="button"
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-900/50 transform group-hover:scale-110 transition-transform duration-200 cursor-pointer"
            title={isCurrent && isPlaying ? 'Pause' : 'Play Song'}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Song Info */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-slate-100 truncate text-base group-hover:text-purple-300 transition-colors">
            {song.title}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
            {song.genre}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-400 font-medium">
          <p className="truncate flex items-center gap-1.5">
            <Music2 className="w-3.5 h-3.5 text-slate-500" />
            {song.artist}
          </p>
          {song.language && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50">
              {song.language}
            </span>
          )}
        </div>

        {/* Mood Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {song.moods?.map((mood, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40 capitalize"
            >
              {mood}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SongCard;
