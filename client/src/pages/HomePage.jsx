import React, { useState, useEffect, useRef } from 'react';
import { recommendSongs } from '../services/api';
import SongCard from '../components/SongCard';
import MoodSelector from '../components/MoodSelector';
import IntensitySlider from '../components/IntensitySlider';
import LanguageSelector from '../components/LanguageSelector';
import { usePlayer } from '../context/PlayerContext';
import { Sparkles, Play, RefreshCw, AlertCircle, Music } from 'lucide-react';
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
      setMixTitle(`${mood.toUpperCase()} • ${val}% INTENSITY • ${langLabel}`);

      if (songsList.length > 0 && shouldAutoPlay) {
        playSong(songsList[0], songsList);
      }

      if (shouldAutoPlay && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Failed to generate mix:', err);
      setError('Unable to connect to MoodMix server. Please check backend status.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-36 space-y-12">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive Music Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          What is your <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">MoodMix</span> today?
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Select a mood, tune your intensity, pick your language, and let MoodMix create your custom soundtrack.
        </p>
      </motion.div>

      {/* Mood Control Panel Setup Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 sm:p-8 rounded-3xl space-y-8 border-purple-500/20 shadow-2xl glow-purple"
      >
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

        {/* Start My Mix Button */}
        <div className="flex justify-center pt-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleGenerateMix(selectedMood, intensity, selectedLanguage, true)}
            disabled={loading}
            aria-label="Start My Mix recommendation generation"
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-purple-900/40 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5 fill-white" />
            )}
            <span>Start My Mix</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Recommended Results Section */}
      <div ref={resultsRef} className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-400" />
              Recommended Songs
            </h2>
            {mixTitle && (
              <p className="text-xs text-purple-300 font-mono mt-0.5">
                Current Mix: {mixTitle}
              </p>
            )}
          </div>
          <span className="text-xs font-mono text-slate-400">
            {recommendations.length} track{recommendations.length !== 1 ? 's' : ''} matched
          </span>
        </div>

        {initialLoading || loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
            <p className="text-sm font-medium">Finding suitable tracks for your mood & language...</p>
          </div>
        ) : error ? (
          <div className="glass-card p-8 rounded-2xl text-center max-w-md mx-auto space-y-4 border-red-500/30">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-sm text-slate-300">{error}</p>
            <button
              type="button"
              onClick={() => handleGenerateMix(selectedMood, intensity, selectedLanguage, true)}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl hover:bg-purple-500 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl space-y-2">
            <p className="text-lg font-semibold text-slate-300">No songs found for this mood & language combination.</p>
            <p className="text-xs text-slate-500">Try choosing 'All Languages' or selecting another mood.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedMood}-${intensity}-${selectedLanguage}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {recommendations.map((song) => (
                <SongCard
                  key={song._id}
                  song={song}
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
