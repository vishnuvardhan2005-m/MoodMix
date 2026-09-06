import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { Play, Pause, SkipBack, SkipForward, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MiniPlayer = () => {
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    audioError,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    setPlayerVolume,
    toggleMute
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-slate-800/80 px-4 py-2.5 shadow-2xl backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Song Info & Cover */}
          <div
            onClick={() => navigate(`/player?id=${currentSong._id}`)}
            className="flex items-center gap-3 w-full md:w-1/4 cursor-pointer group min-w-0"
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60 shrink-0">
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-slate-100 text-sm truncate group-hover:text-purple-300 transition-colors">
                {currentSong.title}
              </h4>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-400 truncate">{currentSong.artist}</p>
                {currentSong.language && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50 font-medium">
                    {currentSong.language}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Controls & Scrubber */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={playPrev}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-900/50 transition-transform active:scale-95 cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={playNext}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seekTo}
            />

            {audioError && (
              <div className="flex items-center gap-1 text-[11px] text-red-400">
                <AlertTriangle className="w-3 h-3" />
                <span>{audioError}</span>
              </div>
            )}
          </div>

          {/* Volume Control */}
          <div className="hidden md:flex items-center justify-end w-1/4">
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={setPlayerVolume}
              onToggleMute={toggleMute}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniPlayer;
