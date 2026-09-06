import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { id: 'all', label: 'All Languages', icon: '🌐' },
  { id: 'Telugu', label: 'Telugu', icon: '🎵' },
  { id: 'English', label: 'English', icon: '🎧' }
];

const LanguageSelector = ({ selectedLanguage, onSelectLanguage }) => {
  return (
    <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-400" />
          3. Select Music Language
        </label>
        <span className="text-xs text-slate-400 font-medium">Filter preferences</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage.toLowerCase() === lang.id.toLowerCase();

          return (
            <motion.button
              key={lang.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectLanguage(lang.id)}
              aria-label={`Select ${lang.label} language`}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 border border-purple-400/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{lang.icon}</span>
              <span>{lang.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
