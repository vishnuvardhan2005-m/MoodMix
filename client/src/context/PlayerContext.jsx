import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const ytTimerRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [audioError, setAudioError] = useState(null);
  const [ytApiReady, setYtApiReady] = useState(false);

  // Initialize HTML5 Audio instance for direct audio tracks
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 1.0;
    audio.muted = false;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (!currentSong?.youtubeVideoId) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleLoadedMetadata = () => {
      if (!currentSong?.youtubeVideoId) {
        setDuration(audio.duration || 0);
        setAudioError(null);
      }
    };
    const handleEnded = () => {
      if (!currentSong?.youtubeVideoId) {
        playNext();
      }
    };
    const handleError = (e) => {
      if (!currentSong?.youtubeVideoId) {
        console.warn('Audio element load error:', audio.src, e);
        setAudioError('Unable to load audio track source.');
        setIsPlaying(false);
      }
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
    };
  }, [currentSong]);

  // Load YouTube IFrame Player API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setYtApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      setYtApiReady(true);
    };
  }, []);

  // Poll YouTube player time when playing
  useEffect(() => {
    if (isPlaying && currentSong?.youtubeVideoId && ytPlayerRef.current) {
      ytTimerRef.current = setInterval(() => {
        try {
          if (ytPlayerRef.current.getCurrentTime) {
            setCurrentTime(ytPlayerRef.current.getCurrentTime() || 0);
          }
          if (ytPlayerRef.current.getDuration) {
            setDuration(ytPlayerRef.current.getDuration() || 0);
          }
        } catch (err) {
          // ignore transient iframe poll errors
        }
      }, 500);
    } else {
      if (ytTimerRef.current) clearInterval(ytTimerRef.current);
    }

    return () => {
      if (ytTimerRef.current) clearInterval(ytTimerRef.current);
    };
  }, [isPlaying, currentSong]);

  // Initialize YouTube IFrame Player instance
  const initYouTubePlayer = (videoId) => {
    return new Promise((resolve) => {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.loadVideoById(videoId);
        resolve(ytPlayerRef.current);
        return;
      }

      let playerContainer = document.getElementById('youtube-player-element');
      if (!playerContainer) {
        playerContainer = document.createElement('div');
        playerContainer.id = 'youtube-player-element';
        playerContainer.style.position = 'absolute';
        playerContainer.style.top = '-9999px';
        playerContainer.style.left = '-9999px';
        playerContainer.style.width = '1px';
        playerContainer.style.height = '1px';
        document.body.appendChild(playerContainer);
      }

      ytPlayerRef.current = new window.YT.Player('youtube-player-element', {
        height: '1',
        width: '1',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(isMuted ? 0 : volume * 100);
            event.target.playVideo();
            resolve(event.target);
          },
          onStateChange: (event) => {
            // YT.PlayerState: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
            if (event.data === 1) {
              setIsPlaying(true);
              setAudioError(null);
            } else if (event.data === 2) {
              setIsPlaying(false);
            } else if (event.data === 0) {
              setIsPlaying(false);
              playNext();
            }
          },
          onError: (err) => {
            console.warn('YouTube Player playback error:', err);
            setAudioError('Unable to play YouTube video track.');
            setIsPlaying(false);
          }
        }
      });
    });
  };

  // Play song (handles YouTube tracks and direct audio)
  const playSong = (song, newQueue = []) => {
    if (!song) {
      setAudioError('Invalid song selection.');
      return;
    }

    setAudioError(null);
    setCurrentSong(song);

    let activeQueue = newQueue.length > 0 ? newQueue : queue;
    if (newQueue.length > 0) {
      setQueue(newQueue);
    }

    const index = activeQueue.findIndex((s) => s._id === song._id || (s.youtubeVideoId && s.youtubeVideoId === song.youtubeVideoId));
    setCurrentIndex(index !== -1 ? index : 0);

    // Stop HTML5 Audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (song.youtubeVideoId) {
      if (window.YT && window.YT.Player) {
        initYouTubePlayer(song.youtubeVideoId);
      } else {
        // Wait for API ready
        const checkInterval = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkInterval);
            initYouTubePlayer(song.youtubeVideoId);
          }
        }, 200);
      }
    } else if (song.audioUrl && audioRef.current) {
      // Pause YouTube player if active
      if (ytPlayerRef.current && ytPlayerRef.current.pauseVideo) {
        try { ytPlayerRef.current.pauseVideo(); } catch (e) {}
      }

      const audio = audioRef.current;
      audio.src = song.audioUrl;
      audio.currentTime = 0;
      audio.volume = isMuted ? 0 : volume;
      audio.muted = isMuted;

      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Direct audio play error:', err);
          setIsPlaying(false);
        });
    }
  };

  const togglePlay = () => {
    if (!currentSong) return;

    if (currentSong.youtubeVideoId && ytPlayerRef.current) {
      if (isPlaying) {
        try { ytPlayerRef.current.pauseVideo(); } catch (e) {}
        setIsPlaying(false);
      } else {
        try { ytPlayerRef.current.playVideo(); } catch (e) {}
        setIsPlaying(true);
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
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
    if (currentSong?.youtubeVideoId && ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
      if (ytPlayerRef.current.getCurrentTime() > 3) {
        ytPlayerRef.current.seekTo(0, true);
        setCurrentTime(0);
        return;
      }
    } else if (audioRef.current && audioRef.current.currentTime > 3) {
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
    const targetTime = Math.max(0, Math.min(seconds, duration));
    if (currentSong?.youtubeVideoId && ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      try {
        ytPlayerRef.current.seekTo(targetTime, true);
        setCurrentTime(targetTime);
      } catch (err) {}
    } else if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const setPlayerVolume = (val) => {
    const newVol = Math.max(0, Math.min(1, val));
    setVolume(newVol);

    if (currentSong?.youtubeVideoId && ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      try {
        ytPlayerRef.current.setVolume(isMuted ? 0 : newVol * 100);
      } catch (err) {}
    }

    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVol;
    }

    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (currentSong?.youtubeVideoId && ytPlayerRef.current && ytPlayerRef.current.unMute) {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(volume * 100);
        } catch (err) {}
      }
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = volume || 1.0;
      }
    } else {
      setIsMuted(true);
      if (currentSong?.youtubeVideoId && ytPlayerRef.current && ytPlayerRef.current.mute) {
        try { ytPlayerRef.current.mute(); } catch (err) {}
      }
      if (audioRef.current) {
        audioRef.current.muted = true;
        audioRef.current.volume = 0;
      }
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
