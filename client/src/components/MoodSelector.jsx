import React from 'react';
import { motion } from 'framer-motion';

const MOODS = [
  { id: 'happy', num: '01', label: 'HAPPY', emoji: '😄', desc: 'bright & uplifting' },
  { id: 'calm', num: '02', label: 'CALM', emoji: '😌', desc: 'slow & peaceful' },
  { id: 'sad', num: '03', label: 'SAD', emoji: '😔', desc: 'melancholic & reflective' },
  { id: 'energetic', num: '04', label: 'ENERGETIC', emoji: '🔥', desc: 'fast & high rhythm' },
  { id: 'romantic', num: '05', label: 'ROMANTIC', emoji: '❤️', desc: 'soft & intimate' },
  { id: 'focus', num: '06', label: 'FOCUS', emoji: '🧠', desc: 'deep & steady' }
];

const MoodSelector = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between border-b border-[#D8D3C8] pb-2">
        <span className="text-xs font-mono tracking-widest text-[#6B6B65] uppercase">
          01 / SELECT MOOD
        </span>
        <span className="text-xs font-mono text-[#6B6B65]">Pick your current vibe</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {MOODS.map((m) => {
          const isSelected = selectedMood === m.id;

          return (
            <motion.button
              key={m.id}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMood(m.id)}
              aria-label={`Select mood ${m.label}`}
              className={`relative p-5 text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 ${
                isSelected
                  ? 'bg-[#151515] text-[#FAF8F2] border-[#151515] shadow-md'
                  : 'bg-[#FAF8F2] text-[#111111] border-[#D8D3C8] hover:border-[#111111]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs font-mono ${isSelected ? 'text-[#D8D3C8]' : 'text-[#6B6B65]'}`}>
                  {m.num}
                </span>
                <span className="text-lg select-none">{m.emoji}</span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xl tracking-tight uppercase">{m.label}</span>
                  {isSelected && (
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                      — ACTIVE
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 ${isSelected ? 'text-[#A0A09C]' : 'text-[#6B6B65]'}`}>
                  {m.desc}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;
