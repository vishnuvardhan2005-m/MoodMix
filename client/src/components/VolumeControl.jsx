import React from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

const VolumeControl = ({ volume, isMuted, onVolumeChange, onToggleMute, className = '' }) => {
  const currentVal = isMuted ? 0 : volume;

  const renderVolumeIcon = () => {
    if (isMuted || currentVal === 0) {
      return <VolumeX className="w-5 h-5 text-red-400" />;
    }
    if (currentVal < 0.5) {
      return <Volume1 className="w-5 h-5 text-slate-300" />;
    }
    return <Volume2 className="w-5 h-5 text-slate-300" />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={onToggleMute}
        className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-800/50"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {renderVolumeIcon()}
      </button>

      <div className="relative flex items-center w-24 group cursor-pointer">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={currentVal}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute left-0 right-0 h-1.5 bg-slate-800 rounded-lg overflow-hidden pointer-events-none">
          <div
            className="h-full bg-purple-500"
            style={{ width: `${currentVal * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default VolumeControl;
