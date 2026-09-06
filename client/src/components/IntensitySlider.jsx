import React from 'react';
import { Zap } from 'lucide-react';

const getIntensityLabel = (value) => {
  if (value < 30) return { label: 'Mellow & Subtle', color: 'text-teal-400' };
  if (value < 70) return { label: 'Balanced Flow', color: 'text-purple-400' };
  return { label: 'Peak Energy', color: 'text-amber-400' };
};

const IntensitySlider = ({ intensity, onChangeIntensity }) => {
  const { label, color } = getIntensityLabel(intensity);

  return (
    <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          2. Set Mood Intensity (0 – 100)
        </label>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 ${color}`}>
            {label}
          </span>
          <span className="text-sm font-mono font-bold text-white px-2 py-0.5 rounded-md bg-purple-950/70 border border-purple-800/60">
            {intensity}%
          </span>
        </div>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          min="0"
          max="100"
          value={intensity}
          onChange={(e) => onChangeIntensity(Number(e.target.value))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
        />
      </div>

      <div className="flex justify-between text-[11px] font-medium text-slate-400 px-1">
        <span>0% (Low Energy)</span>
        <span>50% (Balanced)</span>
        <span>100% (High Energy)</span>
      </div>
    </div>
  );
};

export default IntensitySlider;
