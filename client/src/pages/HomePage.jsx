import React, { useState, useEffect, useRef } from 'react';
import { recommendSongs } from '../services/api';
import SongCard from '../components/SongCard';
import MoodSelector from '../components/MoodSelector';
import IntensitySlider from '../components/IntensitySlider';
import LanguageSelector from '../components/LanguageSelector';
import { usePlayer } from '../context/PlayerContext';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const { playSong } = usePlayer();

  const [selectedMood, setSelectedMood] = useState('happy');
  const [intensity, setIntensity] = useState(50);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [recommendations, setRecommendations] = useState([]);
  const [mixTitle, setMixTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const resultsRef = useRef(null);

  useEffect(() => {
    handleGenerateMix('happy', 50, 'all', false);
  }, []);

  const handleGenerateMix = async (
    mood = selectedMood,
    val = intensity,
    lang = selectedLanguage,
    shouldAutoPlay = true
  ) => {
    try {
      setLoading(true);
      setError(null);

      const res = await recommendSongs(mood, val, lang);
      const songsList = res.data || [];

      setRecommendations(songsList);
      const langLabel = lang.toUpperCase() === 'ALL' ? 'ALL LANGUAGES' : lang.toUpperCase();
      setMixTitle(`${mood.toUpperCase()} · ${val}% INTENSITY · ${langLabel}`);

      if (songsList.length > 0 && shouldAutoPlay) {
        playSong(songsList[0], songsList);
      }

      if (shouldAutoPlay && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Failed to generate mix:', err);
      setError('Unable to connect to MoodMix server. Please verify backend service status.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 pb-40 space-y-12">
      {/* Editorial Title Banner */}
      <div className="space-y-2 border-b border-[#D8D3C8] pb-6">
        <h1 className="font-serif text-4xl sm:text-6xl tracking-tight text-[#111111] uppercase leading-none">
          MUSIC FOR YOUR MOOD.
        </h1>
        <p className="text-xs font-mono tracking-widest text-[#6B6B65] uppercase">
          ISSUE N° 01 — EDITORIAL DIGITAL VINYL ENGINE
        </p>
      </div>

      {/* Music Selector Form Setup */}
      <div className="space-y-8">
        <MoodSelector
          selectedMood={selectedMood}
          onSelectMood={setSelectedMood}
        />

        <IntensitySlider
          intensity={intensity}
          onChangeIntensity={setIntensity}
        />

        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />

        {/* Create My Mix Action Button */}
        <div className="pt-2 flex justify-start">
          <button
            type="button"
            onClick={() => handleGenerateMix(selectedMood, intensity, selectedLanguage, true)}
            disabled={loading}
            aria-label="Create My Mix"
            className="w-full sm:w-auto px-10 py-5 bg-[#111111] hover:bg-black text-[#F4F0E7] font-mono text-sm tracking-widest uppercase border border-[#111111] flex items-center justify-center gap-4 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <ArrowRight className="w-4 h-4 text-amber-400" />
            )}
            <span>CREATE MY MIX →</span>
          </button>
        </div>
      </div>

      {/* Recommended Songs Editorial List */}
      <div ref={resultsRef} className="space-y-6 pt-8 border-t border-[#D8D3C8]">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#D8D3C8] pb-3">
          <div>
            <h2 className="font-serif text-3xl text-[#111111] uppercase tracking-tight">
              YOUR RECOMMENDED MIX
            </h2>
            {mixTitle && (
              <p className="text-xs font-mono text-[#6B6B65] tracking-wider uppercase mt-1">
                SELECTION: {mixTitle}
              </p>
            )}
          </div>
          <span className="text-xs font-mono text-[#6B6B65] tracking-widest uppercase">
            [{recommendations.length} TRACKS MATCHED]
          </span>
        </div>

        {initialLoading || loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#6B6B65] font-mono text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-[#111111]" />
            <span>SELECTING CURATED TRACKS FROM CATALOG...</span>
          </div>
        ) : error ? (
          <div className="p-8 bg-[#FAF8F2] border border-red-300 text-center max-w-md mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-xs font-mono text-[#111111]">{error}</p>
            <button
              type="button"
              onClick={() => handleGenerateMix(selectedMood, intensity, selectedLanguage, true)}
              className="px-4 py-2 bg-[#111111] text-[#F4F0E7] font-mono text-xs uppercase"
            >
              TRY AGAIN
            </button>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF8F2] border border-[#D8D3C8] space-y-2">
            <p className="font-serif text-xl text-[#111111]">No tracks found for this configuration.</p>
            <p className="text-xs font-mono text-[#6B6B65]">Try choosing 'All Languages' or selecting another mood.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedMood}-${intensity}-${selectedLanguage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-[#D8D3C8]"
            >
              {recommendations.map((song, idx) => (
                <SongCard
                  key={song._id}
                  song={song}
                  index={idx}
                  queue={recommendations}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default HomePage;
