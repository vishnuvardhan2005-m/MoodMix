import React from 'react';

const LANGUAGES = [
  { id: 'all', label: 'ALL LANGUAGES', sub: 'Global Mix' },
  { id: 'Telugu', label: 'TELUGU', sub: 'తెలుగు' },
  { id: 'English', label: 'ENGLISH', sub: 'English' }
];

const LanguageSelector = ({ selectedLanguage, onSelectLanguage }) => {
  return (
    <div className="space-y-2 p-3 sm:p-3.5 bg-[#FAF8F2] border border-[#D8D3C8]">
      <div className="flex items-baseline justify-between border-b border-[#D8D3C8] pb-1">
        <span className="text-[10px] font-mono tracking-widest text-[#6B6B65] uppercase">
          03 / SELECT LANGUAGE
        </span>
        <span className="text-[10px] font-mono text-[#6B6B65]">Region preference</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage.toLowerCase() === lang.id.toLowerCase();

          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => onSelectLanguage(lang.id)}
              aria-label={`Select ${lang.label} language`}
              className={`p-2 text-center border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#111111] text-[#F4F0E7] border-[#111111] font-bold'
                  : 'bg-white text-[#111111] border-[#D8D3C8] hover:border-[#111111]'
              }`}
            >
              <div className="text-[10px] font-mono tracking-wider uppercase">{lang.label}</div>
              <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#D8D3C8]' : 'text-[#6B6B65]'}`}>
                {lang.sub}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
