import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { Play, Pause, SkipBack, SkipForward, Disc, AlertTriangle } from 'lucide-react';
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
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#151515] text-[#FAF8F2] border-t border-neutral-800 px-4 sm:px-8 py-3 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Track Info & Artwork Sleeve */}
          <div
            onClick={() => navigate(`/player?id=${currentSong._id}`)}
            className="flex items-center gap-3.5 w-full md:w-1/4 cursor-pointer group min-w-0"
          >
            <div className="relative w-11 h-11 bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0">
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Disc className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-400 animate-spin' : 'text-neutral-500'}`} />
                <h4 className="font-serif font-bold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
                  {currentSong.title}
                </h4>
              </div>
              <p className="text-xs text-neutral-400 truncate">{currentSong.artist}</p>
            </div>
          </div>

          {/* Controls & Scrubber */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={playPrev}
                aria-label="Previous track"
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause track' : 'Play track'}
                className="w-9 h-9 bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={playNext}
                aria-label="Next track"
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seekTo}
            />

            {audioError && (
              <div className="flex items-center gap-1 text-[11px] font-mono text-red-400">
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
