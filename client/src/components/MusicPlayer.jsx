import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import AudioVisualizer from './AudioVisualizer';
import { Play, Pause, SkipBack, SkipForward, Zap, Music, ListMusic, Eye, EyeOff, Activity, BarChart2, Waves } from 'lucide-react';
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

  const [visualizerEnabled, setVisualizerEnabled] = useState(true);
  const [visualizerMode, setVisualizerMode] = useState('circular');

  if (!currentSong) return null;

  const currentMood = currentSong.moods?.[0] || 'calm';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Main Expanded Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl space-y-6 glow-purple border-purple-500/30 shadow-2xl"
      >
        {/* Visualizer Controls Top Bar */}
        <div className="flex items-center justify-between glass-card p-2.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVisualizerEnabled(!visualizerEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                visualizerEnabled
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {visualizerEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              Visualizer {visualizerEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Mode Selector */}
          {visualizerEnabled && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVisualizerMode('circular')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  visualizerMode === 'circular'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Circular Mode"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Circular</span>
              </button>

              <button
                type="button"
                onClick={() => setVisualizerMode('bars')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  visualizerMode === 'bars'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Frequency Bars Mode"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bars</span>
              </button>

              <button
                type="button"
                onClick={() => setVisualizerMode('wave')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  visualizerMode === 'wave'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Wave & Particles Mode"
              >
                <Waves className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Wave</span>
              </button>
            </div>
          )}
        </div>

        {/* Audio Visualizer or Album Artwork Display */}
        {visualizerEnabled ? (
          <div className="relative">
            <AudioVisualizer
              mode={visualizerMode}
              mood={currentMood}
              enabled={visualizerEnabled}
              height={320}
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-10 h-10 rounded-lg object-cover border border-slate-700 shadow-md"
              />
              <div>
                <p className="text-xs font-bold text-white leading-none">{currentSong.title}</p>
                <p className="text-[11px] text-slate-400">{currentSong.artist}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl group border border-slate-700/60 bg-slate-900">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-50" />
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-slate-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              Lvl {currentSong.energy}/10
            </div>
          </div>
        )}

        {/* Track Title & Meta */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{currentSong.title}</h1>
          <p className="text-lg font-medium text-slate-300 flex items-center justify-center gap-2">
            <Music className="w-4 h-4 text-purple-400" />
            {currentSong.artist}
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {currentSong.genre}
            </span>
            {currentSong.language && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-700/60">
                {currentSong.language}
              </span>
            )}
          </div>
        </div>

        {/* Mood badges */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {currentSong.moods?.map((m, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold px-3 py-0.5 rounded-full bg-purple-950/70 text-purple-200 border border-purple-800/40 capitalize"
            >
              #{m}
            </span>
          ))}
        </div>

        {/* Progress Bar Scrubber */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seekTo}
          className="pt-2"
        />

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
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
              className="text-slate-400 hover:text-white transition-colors p-2 cursor-pointer"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-purple-900/50 transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={playNext}
              className="text-slate-400 hover:text-white transition-colors p-2 cursor-pointer"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Up Next Queue */}
      <div className="lg:col-span-5 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-purple-400" />
          Queue ({queue.length})
        </h3>

        <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
          {queue.map((song) => {
            const isSelected = currentSong._id === song._id;
            return (
              <div
                key={song._id}
                onClick={() => playSong(song, queue)}
                className={`p-3 rounded-2xl glass-card transition-all cursor-pointer flex items-center justify-between ${
                  isSelected ? 'ring-2 ring-purple-500 bg-purple-950/40' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-100 text-sm truncate">{song.title}</h4>
                    <p className="text-xs text-slate-400 truncate">{song.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {song.language && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {song.language}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
