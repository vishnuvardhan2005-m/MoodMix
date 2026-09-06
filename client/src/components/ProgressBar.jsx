import React from 'react';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const ProgressBar = ({ currentTime, duration, onSeek, className = '' }) => {
  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`w-full flex items-center gap-3 text-xs font-mono text-slate-400 ${className}`}>
      <span className="w-10 text-right select-none">{formatTime(currentTime)}</span>

      <div className="relative flex-1 flex items-center group cursor-pointer">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime || 0}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        />
        {/* Custom progress visual bar */}
        <div className="absolute left-0 right-0 h-1.5 bg-slate-800 rounded-lg overflow-hidden pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-100"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <span className="w-10 text-left select-none">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressBar;
