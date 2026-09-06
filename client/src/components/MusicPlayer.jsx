import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import AudioVisualizer from './AudioVisualizer';
import { Play, Pause, SkipBack, SkipForward, Disc, Eye, EyeOff, Activity, BarChart2, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    queue,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    setPlayerVolume,
    toggleMute
  } = usePlayer();

  const [visualizerEnabled, setVisualizerEnabled] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState('circular');

  if (!currentSong) return null;

  const currentMood = currentSong.moods?.[0] || 'calm';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full items-stretch overflow-hidden">
      {/* Main Digital Vinyl Player Deck */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-7 bg-[#151515] text-[#FAF8F2] p-4 sm:p-6 border border-[#262626] shadow-xl flex flex-col justify-between h-full min-h-0 space-y-3"
      >
        {/* Deck Header Masthead */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-[10px] font-mono tracking-widest text-[#A0A09C] shrink-0">
          <span>VINYL DECK — MODEL 33 RPM</span>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'}`} />
            <span className="uppercase">{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
          </div>
        </div>

        {/* Visualizer Toggle & Mode Controls */}
        <div className="flex items-center justify-between bg-neutral-900/80 p-2 border border-neutral-800 text-[10px] font-mono shrink-0">
          <button
            type="button"
            onClick={() => setVisualizerEnabled(!visualizerEnabled)}
            className={`px-2.5 py-1 border transition-colors cursor-pointer flex items-center gap-1.5 ${
              visualizerEnabled
                ? 'bg-amber-400 text-black border-amber-400 font-bold'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
          >
            {visualizerEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            VISUALIZER {visualizerEnabled ? 'ON' : 'OFF'}
          </button>

          {visualizerEnabled && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVisualizerMode('circular')}
                className={`p-1 border transition-colors cursor-pointer ${
                  visualizerMode === 'circular' ? 'bg-white text-black border-white' : 'text-neutral-400 hover:text-white border-neutral-800'
                }`}
                title="Circular Mode"
              >
                <Activity className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setVisualizerMode('bars')}
                className={`p-1 border transition-colors cursor-pointer ${
                  visualizerMode === 'bars' ? 'bg-white text-black border-white' : 'text-neutral-400 hover:text-white border-neutral-800'
                }`}
                title="Bars Mode"
              >
                <BarChart2 className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setVisualizerMode('wave')}
                className={`p-1 border transition-colors cursor-pointer ${
                  visualizerMode === 'wave' ? 'bg-white text-black border-white' : 'text-neutral-400 hover:text-white border-neutral-800'
                }`}
                title="Wave Mode"
              >
                <Waves className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Display: Visualizer or Spinning Vinyl Disc Deck */}
        <div className="flex-1 flex items-center justify-center min-h-0 relative overflow-hidden py-2">
          {visualizerEnabled ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <AudioVisualizer
                mode={visualizerMode}
                mood={currentMood}
                enabled={visualizerEnabled}
                height={220}
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/80 p-1.5 border border-neutral-800">
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-8 h-8 object-cover"
                />
                <div className="font-mono text-[10px]">
                  <p className="font-bold text-white leading-none">{currentSong.title}</p>
                  <p className="text-neutral-400 text-[9px]">{currentSong.artist}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-center max-w-sm w-full">
              {/* Vinyl Record Disc behind artwork */}
              <div
                className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full vinyl-grooves border-4 border-neutral-900 shadow-2xl flex items-center justify-center transition-all duration-700 ${
                  isPlaying ? 'animate-vinyl-spin' : 'animate-vinyl-spin animate-vinyl-spin-paused'
                }`}
              >
                {/* Center Record Label */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 text-black border-2 border-neutral-950 flex flex-col items-center justify-center text-center p-1 shadow-inner">
                  <Disc className="w-4 h-4 text-black" />
                  <span className="font-serif text-[9px] font-bold tracking-tight uppercase leading-none mt-0.5">
                    MOODMIX
                  </span>
                  <span className="text-[7px] font-mono tracking-widest text-neutral-800">
                    33 RPM
                  </span>
                </div>
              </div>

              {/* Album Cover Sleeve Overlapping */}
              <div className="absolute left-0 w-36 h-36 sm:w-44 sm:h-44 bg-neutral-900 border-2 border-neutral-700 shadow-2xl overflow-hidden z-10">
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Track Title & Metadata */}
        <div className="text-center space-y-1 border-t border-neutral-800 pt-2 shrink-0">
          <h1 className="font-serif text-xl sm:text-2xl text-white tracking-tight leading-tight">{currentSong.title}</h1>
          <p className="text-xs font-sans font-medium text-neutral-400">{currentSong.artist}</p>

          <div className="flex items-center justify-center gap-2 pt-1 text-[10px] font-mono text-neutral-400">
            <span className="px-2 py-0.5 border border-neutral-800">
              {currentSong.language || 'English'}
            </span>
            <span className="px-2 py-0.5 border border-neutral-800 text-amber-400">
              ENERGY LVL {currentSong.energy}/10
            </span>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="shrink-0">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
          />
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between border-t border-neutral-800 pt-2 shrink-0">
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={setPlayerVolume}
            onToggleMute={toggleMute}
          />

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={playPrev}
              aria-label="Previous track"
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause track' : 'Play track'}
              className="w-10 h-10 bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={playNext}
              aria-label="Next track"
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Up Next Queue Sidebar */}
      <div className="lg:col-span-5 flex flex-col h-full min-h-0 overflow-hidden border border-[#D8D3C8] bg-[#FAF8F2] p-3.5">
        <div className="border-b border-[#D8D3C8] pb-2 flex items-baseline justify-between shrink-0">
          <h3 className="font-serif text-xl text-[#111111] uppercase">UP NEXT IN QUEUE</h3>
          <span className="text-[10px] font-mono text-[#6B6B65]">[{queue.length} TRACKS]</span>
        </div>

        <div className="space-y-1.5 flex-1 overflow-y-auto min-h-0 pt-2 pr-1 divide-y divide-[#D8D3C8]">
          {queue.map((song, idx) => {
            const isSelected = currentSong._id === song._id;
            return (
              <div
                key={song._id}
                onClick={() => playSong(song, queue)}
                className={`p-2.5 border transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
                  isSelected ? 'bg-[#151515] text-[#FAF8F2] border-[#151515]' : 'bg-[#FAF8F2] hover:bg-white text-[#111111] border-[#D8D3C8]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`text-[10px] font-mono w-4 text-right shrink-0 ${isSelected ? 'text-amber-400' : 'text-[#6B6B65]'}`}>
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-8 h-8 object-cover shrink-0 border border-[#D8D3C8]"
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif text-xs font-bold truncate">{song.title}</h4>
                    <p className={`text-[10px] truncate ${isSelected ? 'text-neutral-400' : 'text-[#6B6B65]'}`}>{song.artist}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 border shrink-0 ${isSelected ? 'border-neutral-700 text-neutral-300' : 'border-[#D8D3C8] text-[#6B6B65]'}`}>
                  {song.language}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
