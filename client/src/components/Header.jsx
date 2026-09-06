import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Disc, Sparkles } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          aria-label="MoodMix Home Page"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
                MoodMix
              </span>
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Soundtrack Your Emotion</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            aria-label="Navigate to Home Page"
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
              isActive('/')
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/player"
            aria-label="Navigate to Player Page"
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
              isActive('/player')
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Disc className="w-4 h-4" />
            <span>Player</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
