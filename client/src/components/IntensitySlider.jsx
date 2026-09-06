import React from 'react';

const getIntensityDescriptor = (value) => {
  if (value < 35) return 'LOW / MELLOW';
  if (value < 66) return 'BALANCED FLOW';
  return 'HIGH / INTENSE';
};

const IntensitySlider = ({ intensity, onChangeIntensity }) => {
  const descriptor = getIntensityDescriptor(intensity);

  return (
    <div className="space-y-2 p-3 sm:p-3.5 bg-[#FAF8F2] border border-[#D8D3C8]">
      <div className="flex items-baseline justify-between border-b border-[#D8D3C8] pb-1">
        <span className="text-[10px] font-mono tracking-widest text-[#6B6B65] uppercase">
          02 / SET INTENSITY
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider text-[#111111] uppercase font-bold">
            {descriptor}
          </span>
          <span className="text-xs font-mono font-extrabold text-[#111111] px-1.5 py-0.5 border border-[#111111] bg-white">
            {intensity}%
          </span>
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={(e) => onChangeIntensity(Number(e.target.value))}
            aria-label="Mood Intensity Slider"
            className="w-full h-1 bg-[#D8D3C8] appearance-none cursor-pointer accent-[#111111] hover:accent-black focus:outline-none"
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-[#6B6B65] tracking-wider uppercase">
          <span>LOW (10–35)</span>
          <span>MEDIUM (36–65)</span>
          <span>HIGH (66–100)</span>
        </div>
      </div>
    </div>
  );
};

export default IntensitySlider;
