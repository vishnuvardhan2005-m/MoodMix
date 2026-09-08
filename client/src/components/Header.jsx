import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="shrink-0 z-40 bg-[#F4F0E7]/95 backdrop-blur-md border-b border-[#D8D3C8] px-4 sm:px-6 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Masthead */}
        <Link
          to="/"
          aria-label="MoodMix Home Page"
          className="group flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 focus:outline-none"
        >
          <Logo className="w-8 h-8 sm:w-9 sm:h-9" showText={true} textClassName="group-hover:opacity-80 transition-opacity" />
          <span className="text-[11px] font-mono tracking-widest text-[#6B6B65] uppercase">
            — a digital record player for your mood
          </span>
        </Link>

        {/* Minimal Navigation */}
        <nav className="flex items-center gap-5 text-xs font-semibold tracking-widest uppercase">
          <Link
            to="/"
            aria-label="Navigate to Home Page"
            className={`transition-colors py-0.5 focus:outline-none ${
              isActive('/')
                ? 'text-[#111111] border-b-2 border-[#111111]'
                : 'text-[#6B6B65] hover:text-[#111111]'
            }`}
          >
            HOME
          </Link>

          <span className="text-[#D8D3C8] select-none">/</span>

          <Link
            to="/player"
            aria-label="Navigate to Player Page"
            className={`transition-colors py-0.5 focus:outline-none ${
              isActive('/player')
                ? 'text-[#111111] border-b-2 border-[#111111]'
                : 'text-[#6B6B65] hover:text-[#111111]'
            }`}
          >
            PLAYER
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
