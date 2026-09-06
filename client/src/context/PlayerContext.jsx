import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceNodeRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [audioError, setAudioError] = useState(null);

  // Initialize HTML5 Audio instance once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 1.0;
    audio.muted = false;
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(null);
    };
    const handleEnded = () => playNext();
    const handleError = (e) => {
      console.warn('Audio element load warning:', audio.src, e);
      setAudioError('Unable to load audio track source.');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);

      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Web Audio API analyzer setup - keeps HTML5 native sound output active & audible
  const setupWebAudio = () => {
    if (!audioRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }

      const audioCtx = audioCtxRef.current;

      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      if (!analyserRef.current) {
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;
      }
    } catch (err) {
      console.warn('Web Audio setup note:', err.message);
    }
  };

  // Play a specific song
  const playSong = (song, newQueue = []) => {
    if (!song || !song.audioUrl) {
      setAudioError('Invalid song audio URL.');
      return;
    }

    setAudioError(null);
    setCurrentSong(song);

    let activeQueue = newQueue.length > 0 ? newQueue : queue;
    if (newQueue.length > 0) {
      setQueue(newQueue);
    }

    const index = activeQueue.findIndex((s) => s._id === song._id);
    setCurrentIndex(index !== -1 ? index : 0);

    const audio = audioRef.current;
    if (audio) {
      audio.src = song.audioUrl;
      audio.currentTime = 0;
      audio.volume = isMuted ? 0 : volume;
      audio.muted = isMuted;

      setupWebAudio();

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAudioError(null);
          })
          .catch((err) => {
            console.warn('Playback error / Autoplay policy:', err);
            setIsPlaying(false);
          });
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;
    setupWebAudio();

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = isMuted ? 0 : volume;
      audio.muted = isMuted;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAudioError(null);
          })
          .catch((err) => {
            console.warn('Resume error:', err);
            setIsPlaying(false);
          });
      }
    }
  };

  const playNext = () => {
    if (!queue || queue.length === 0) return;
    const nextIdx = (currentIndex + 1) % queue.length;
    const nextTrack = queue[nextIdx];
    if (nextTrack) {
      playSong(nextTrack, queue);
    }
  };

  const playPrev = () => {
    if (!audioRef.current) return;

    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (!queue || queue.length === 0) return;
    const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
    const prevTrack = queue[prevIdx];
    if (prevTrack) {
      playSong(prevTrack, queue);
    }
  };

  const seekTo = (seconds) => {
    if (audioRef.current) {
      const targetTime = Math.max(0, Math.min(seconds, duration));
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const setPlayerVolume = (val) => {
    const newVol = Math.max(0, Math.min(1, val));
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVol;
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      audioRef.current.volume = volume || 1.0;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const getAnalyser = () => analyserRef.current;

  const value = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    queue,
    currentIndex,
    audioError,
    getAnalyser,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    setPlayerVolume,
    toggleMute
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
