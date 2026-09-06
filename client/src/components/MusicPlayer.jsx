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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Main Digital Vinyl Player Deck */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-7 bg-[#151515] text-[#FAF8F2] p-6 sm:p-10 border border-[#262626] shadow-2xl space-y-8"
      >
        {/* Deck Header Masthead */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs font-mono tracking-widest text-[#A0A09C]">
          <span>VINYL DECK — MODEL 33 RPM</span>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'}`} />
            <span className="uppercase">{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
          </div>
        </div>

        {/* Visualizer Toggle & Mode Controls */}
        <div className="flex items-center justify-between bg-neutral-900/80 p-3 border border-neutral-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setVisualizerEnabled(!visualizerEnabled)}
            className={`px-3 py-1 border transition-colors cursor-pointer flex items-center gap-2 ${
              visualizerEnabled
                ? 'bg-amber-400 text-black border-amber-400 font-bold'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
          >
            {visualizerEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            VISUALIZER {visualizerEnabled ? 'ON' : 'OFF'}
          </button>

          {visualizerEnabled && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVisualizerMode('circular')}
                className={`p-1.5 border transition-colors cursor-pointer ${
                  visualizerMode === 'circular' ? 'bg-white text-black border-white' : 'text-neutral-400 hover:text-white border-neutral-800'
                }`}
                title="Circular Mode"
              >
                <Activity className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setVisualizerMode('bars')}
                className={`p-1.5 border transition-colors cursor-pointer ${
                  visualizerMode === 'bars' ? 'bg-white text-black border-white' : 'text-neutral-400 hover:text-white border-neutral-800'
                }`}
                title="Bars Mode"
              >
                <BarChart2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setVisualizerMode('wave')}
                className={`p-1.5 border transition-colors cursor-pointer ${
                  visualizerMode === 'wave' ? 'bg-white text-black border-white' : 'text-neutral-400 hover:text-white border-neutral-800'
                }`}
                title="Wave Mode"
              >
                <Waves className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Display: Visualizer or Spinning Vinyl Disc Deck */}
        {visualizerEnabled ? (
          <div className="relative">
            <AudioVisualizer
              mode={visualizerMode}
              mood={currentMood}
              enabled={visualizerEnabled}
              height={320}
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-black/80 p-2 border border-neutral-800">
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-10 h-10 object-cover"
              />
              <div className="font-mono text-xs">
                <p className="font-bold text-white leading-none">{currentSong.title}</p>
                <p className="text-neutral-400 text-[11px]">{currentSong.artist}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center py-6 overflow-hidden">
            {/* Album Sleeve + Sliding Vinyl Disc */}
            <div className="relative flex items-center justify-center max-w-md w-full">
              {/* Vinyl Record Disc behind artwork */}
              <div
                className={`w-64 h-64 sm:w-80 sm:h-80 rounded-full vinyl-grooves border-4 border-neutral-900 shadow-2xl flex items-center justify-center transition-all duration-700 ${
                  isPlaying ? 'animate-vinyl-spin' : 'animate-vinyl-spin animate-vinyl-spin-paused'
                }`}
              >
                {/* Center Record Label */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-amber-400 text-black border-4 border-neutral-950 flex flex-col items-center justify-center text-center p-2 shadow-inner">
                  <Disc className="w-5 h-5 text-black" />
                  <span className="font-serif text-[10px] font-bold tracking-tight uppercase leading-none mt-1">
                    MOODMIX
                  </span>
                  <span className="text-[8px] font-mono tracking-widest text-neutral-800 mt-0.5">
                    33 RPM
                  </span>
                </div>
              </div>

              {/* Album Cover Sleeve Overlapping */}
              <div className="absolute left-0 w-48 h-48 sm:w-60 sm:h-60 bg-neutral-900 border-2 border-neutral-700 shadow-2xl overflow-hidden z-10">
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Track Title & Metadata */}
        <div className="text-center space-y-2 border-t border-neutral-800 pt-6">
          <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">{currentSong.title}</h1>
          <p className="text-sm font-sans font-medium text-neutral-400">{currentSong.artist}</p>

          <div className="flex items-center justify-center gap-3 pt-2 text-xs font-mono text-neutral-400">
            <span className="px-2.5 py-0.5 border border-neutral-800">
              {currentSong.language || 'English'}
            </span>
            <span className="px-2.5 py-0.5 border border-neutral-800">
              GENRE: {currentSong.genre}
            </span>
            <span className="px-2.5 py-0.5 border border-neutral-800 text-amber-400">
              ENERGY LVL {currentSong.energy}/10
            </span>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seekTo}
          className="pt-2"
        />

        {/* Controls Bar */}
        <div className="flex items-center justify-between border-t border-neutral-800 pt-6">
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={setPlayerVolume}
            onToggleMute={toggleMute}
          />

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={playPrev}
              aria-label="Previous track"
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-2"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause track' : 'Play track'}
              className="w-14 h-14 bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={playNext}
              aria-label="Next track"
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-2"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Up Next Queue Sidebar */}
      <div className="lg:col-span-5 space-y-4">
        <div className="border-b border-[#D8D3C8] pb-2 flex items-baseline justify-between">
          <h3 className="font-serif text-2xl text-[#111111] uppercase">UP NEXT IN QUEUE</h3>
          <span className="text-xs font-mono text-[#6B6B65]">[{queue.length} TRACKS]</span>
        </div>

        <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
          {queue.map((song, idx) => {
            const isSelected = currentSong._id === song._id;
            return (
              <div
                key={song._id}
                onClick={() => playSong(song, queue)}
                className={`p-3 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected ? 'bg-[#151515] text-[#FAF8F2] border-[#151515]' : 'bg-[#FAF8F2] hover:bg-white text-[#111111] border-[#D8D3C8]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs font-mono w-5 text-right shrink-0 ${isSelected ? 'text-amber-400' : 'text-[#6B6B65]'}`}>
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-10 h-10 object-cover shrink-0 border border-[#D8D3C8]"
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif text-sm font-bold truncate">{song.title}</h4>
                    <p className={`text-xs truncate ${isSelected ? 'text-neutral-400' : 'text-[#6B6B65]'}`}>{song.artist}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 border shrink-0 ${isSelected ? 'border-neutral-700 text-neutral-300' : 'border-[#D8D3C8] text-[#6B6B65]'}`}>
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
