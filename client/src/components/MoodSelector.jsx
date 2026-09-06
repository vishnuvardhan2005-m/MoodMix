import React from 'react';
import { motion } from 'framer-motion';

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😄', color: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/50', activeBg: 'bg-amber-500/20', shadow: 'shadow-amber-500/20' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: 'from-teal-500/20 to-emerald-500/20', border: 'border-teal-500/50', activeBg: 'bg-teal-500/20', shadow: 'shadow-teal-500/20' },
  { id: 'sad', label: 'Sad', emoji: '😔', color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/50', activeBg: 'bg-blue-500/20', shadow: 'shadow-blue-500/20' },
  { id: 'energetic', label: 'Energetic', emoji: '🔥', color: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/50', activeBg: 'bg-orange-500/20', shadow: 'shadow-orange-500/20' },
  { id: 'romantic', label: 'Romantic', emoji: '❤️', color: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-500/50', activeBg: 'bg-rose-500/20', shadow: 'shadow-rose-500/20' },
  { id: 'focus', label: 'Focus', emoji: '🧠', color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/50', activeBg: 'bg-purple-500/20', shadow: 'shadow-purple-500/20' }
];

const MoodSelector = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold uppercase tracking-wider text-slate-300">
          1. Select Your Mood
        </label>
        <span className="text-xs text-purple-400 font-medium">Pick a vibe</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.id;

          return (
            <motion.button
              key={mood.id}
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectMood(mood.id)}
              className={`relative p-4 rounded-2xl border transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-b ${mood.color} ${mood.border} text-white shadow-xl ${mood.shadow} ring-2 ring-purple-400/50`
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <span className="text-3xl select-none">{mood.emoji}</span>
              <span className="font-semibold text-sm capitalize">{mood.label}</span>

              {isSelected && (
                <motion.div
                  layoutId="activeMoodGlow"
                  className="absolute inset-0 rounded-2xl border-2 border-purple-400/60 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;
