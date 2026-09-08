import React from 'react';

const Logo = ({ className = "w-8 h-8", showText = false, textClassName = "" }) => {
  return (
    <div className="flex items-center gap-2.5 inline-flex">
      <div className={`relative shrink-0 rounded-full overflow-hidden shadow-sm ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
          <defs>
            <radialGradient id="moodmixBgGrad" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FFF000" />
              <stop offset="45%" stopColor="#FFB300" />
              <stop offset="85%" stopColor="#FF6600" />
              <stop offset="100%" stopColor="#E64A00" />
            </radialGradient>

            <linearGradient id="moodmixNoteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5B0EAB" />
              <stop offset="35%" stopColor="#8012B7" />
              <stop offset="70%" stopColor="#C2185B" />
              <stop offset="100%" stopColor="#E91E63" />
            </linearGradient>
          </defs>

          {/* Yellow/Orange Gradient Circle */}
          <circle cx="256" cy="256" r="236" fill="url(#moodmixBgGrad)" />

          {/* 3D Shadow Layer */}
          <g transform="translate(12, 14)" opacity="0.95">
            <path fill="#000000" d="
              M 215, 125
              L 375, 75
              v 175
              c -12, -7 -28, -11 -46, -11
              c -36, 0 -66, 20 -66, 46
              c 0, 26 30, 46 66, 46
              c 36, 0 66, -20 66, -46
              V 155
              L 237, 185
              v 115
              c -12, -7 -28, -11 -46, -11
              c -36, 0 -66, 20 -66, 46
              c 0, 26 30, 46 66, 46
              c 36, 0 66, -20 66, -46
              V 125
              Z
              M 237, 125
              l 138, -43
              v 32
              l -138, 43
              Z
              M 237, 172
              l 138, -43
              v 28
              l -138, 43
              Z
            " />
          </g>

          {/* Note Body */}
          <g>
            <path fill="url(#moodmixNoteGrad)" stroke="#111111" strokeWidth="7" strokeLinejoin="round" d="
              M 215, 125
              L 375, 75
              v 175
              c -12, -7 -28, -11 -46, -11
              c -36, 0 -66, 20 -66, 46
              c 0, 26 30, 46 66, 46
              c 36, 0 66, -20 66, -46
              V 155
              L 237, 185
              v 115
              c -12, -7 -28, -11 -46, -11
              c -36, 0 -66, 20 -66, 46
              c 0, 26 30, 46 66, 46
              c 36, 0 66, -20 66, -46
              V 125
              Z
            " />

            <path fill="url(#moodmixNoteGrad)" stroke="#111111" strokeWidth="6" strokeLinejoin="round" d="
              M 215, 125
              L 375, 75
              v 34
              L 215, 159
              Z
            " />

            <path fill="url(#moodmixNoteGrad)" stroke="#111111" strokeWidth="6" strokeLinejoin="round" d="
              M 215, 172
              L 375, 122
              v 28
              L 215, 200
              Z
            " />
          </g>
        </svg>
      </div>

      {showText && (
        <span className={`font-serif text-xl sm:text-2xl tracking-tight text-[#111111] ${textClassName}`}>
          MOODMIX
        </span>
      )}
    </div>
  );
};

export default Logo;
