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
    <div className="h-full max-w-7xl mx-auto p-3 sm:p-5 lg:p-5 overflow-hidden flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 h-full min-h-0 items-stretch">
        {/* Left Column: Form Controls & Dark Header */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5 h-full min-h-0 overflow-y-auto lg:overflow-visible pr-1">
          {/* Editorial Dark Header Banner */}
          <div className="bg-[#151515] text-white p-3.5 sm:p-4 border border-[#262626] shadow-md space-y-1 shrink-0">
            <p className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
              ISSUE N° 01 — EDITORIAL DIGITAL VINYL ENGINE
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl tracking-tight text-white uppercase leading-none">
              MUSIC FOR YOUR MOOD.
            </h1>
            <p className="text-[11px] font-mono text-neutral-400 tracking-wider">
              A digital record player crafting curated soundscapes for your exact vibe.
            </p>
          </div>

          {/* Form Controls Stack */}
          <div className="space-y-2.5 flex-1 flex flex-col justify-between">
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
            <button
              type="button"
              onClick={() => handleGenerateMix(selectedMood, intensity, selectedLanguage, true)}
              disabled={loading}
              aria-label="Create My Mix"
              className="w-full py-3 bg-[#111111] hover:bg-black text-[#F4F0E7] font-mono text-xs tracking-widest uppercase border border-[#111111] flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>CREATE MY MIX →</span>
            </button>
          </div>
        </div>

        {/* Right Column: Recommended Songs List */}
        <div ref={resultsRef} className="lg:col-span-7 flex flex-col h-full min-h-0 overflow-hidden border border-[#D8D3C8] bg-[#FAF8F2] shadow-sm">
          {/* Dark Editorial Title Box */}
          <div className="bg-[#151515] text-white p-3.5 sm:p-4 border-b border-[#262626] shrink-0 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-tight leading-none">
                YOUR RECOMMENDED MIX
              </h2>
              {mixTitle && (
                <p className="text-[10px] font-mono text-amber-400 tracking-wider uppercase mt-1">
                  SELECTION: {mixTitle}
                </p>
              )}
            </div>
            <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase shrink-0">
              [{recommendations.length} TRACKS MATCHED]
            </span>
          </div>

          {/* Songs List Container with smooth inner scrolling */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {initialLoading || loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#6B6B65] font-mono text-xs h-full">
                <RefreshCw className="w-5 h-5 animate-spin text-[#111111]" />
                <span>SELECTING CURATED TRACKS FROM CATALOG...</span>
              </div>
            ) : error ? (
              <div className="p-6 bg-[#FAF8F2] border border-red-300 text-center max-w-md mx-auto my-auto space-y-3">
                <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
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
              <div className="text-center py-12 bg-[#FAF8F2] space-y-2 h-full flex flex-col justify-center">
                <p className="font-serif text-lg text-[#111111]">No tracks found for this configuration.</p>
                <p className="text-xs font-mono text-[#6B6B65]">Try choosing 'All Languages' or selecting another mood.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedMood}-${intensity}-${selectedLanguage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="divide-y divide-[#D8D3C8]"
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
      </div>
    </div>
  );
};

export default HomePage;
