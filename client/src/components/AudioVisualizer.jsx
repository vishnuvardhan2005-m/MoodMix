import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

const MOOD_PALETTES = {
  calm: { primary: '#0284c7', secondary: '#0f766e', accent: '#0d9488', speedMult: 0.5 },
  sad: { primary: '#4338ca', secondary: '#3730a3', accent: '#6366f1', speedMult: 0.3 },
  happy: { primary: '#d97706', secondary: '#b45309', accent: '#f59e0b', speedMult: 1.2 },
  energetic: { primary: '#dc2626', secondary: '#991b1b', accent: '#b91c1c', speedMult: 1.8 },
  romantic: { primary: '#be185d', secondary: '#9d174d', accent: '#e11d48', speedMult: 0.6 },
  focus: { primary: '#047857', secondary: '#065f46', accent: '#10b981', speedMult: 0.4 }
};

const AudioVisualizer = ({ mode = 'circular', mood = 'calm', enabled = true, height = 300 }) => {
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const particlesRef = useRef([]);

  const { isPlaying, getAnalyser } = usePlayer();

  // Initialize fine line background particles
  useEffect(() => {
    const particleCount = 40;
    const tempParticles = [];
    for (let i = 0; i < particleCount; i++) {
      tempParticles.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.0015,
        vy: (Math.random() - 0.5) * 0.0015,
        alpha: Math.random() * 0.4 + 0.2
      });
    }
    particlesRef.current = tempParticles;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = (height || rect.height || 300) * dpr;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const palette = MOOD_PALETTES[mood?.toLowerCase()] || MOOD_PALETTES.calm;
    const dataArray = new Uint8Array(128);

    let phase = 0;

    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const h = height || 300;

      ctx.clearRect(0, 0, width, h);

      const analyser = getAnalyser();
      let bass = 0;
      let mids = 0;
      let treble = 0;
      let totalAmp = 0;

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);

        let bassSum = 0;
        let midsSum = 0;
        let trebleSum = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const val = dataArray[i];
          totalAmp += val;
          if (i < 10) bassSum += val;
          else if (i < 45) midsSum += val;
          else trebleSum += val;
        }

        bass = bassSum / 10 / 255;
        mids = midsSum / 35 / 255;
        treble = trebleSum / (dataArray.length - 45) / 255;
        totalAmp = totalAmp / dataArray.length / 255;
      } else {
        bass = 0.12;
        mids = 0.08;
        treble = 0.08;
        totalAmp = 0.08;
      }

      phase += (0.015 + treble * 0.04) * palette.speedMult;

      // MODE 1: CIRCULAR RECORD GROOVE FREQUENCIES
      if (mode === 'circular') {
        const centerX = width / 2;
        const centerY = h / 2;
        const baseRadius = Math.min(width, h) * 0.24 + bass * 20;

        // Subtle inner ring
        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * (0.8 + bass * 0.2), 0, Math.PI * 2);
        ctx.stroke();

        // Radial fine line spokes
        const barsCount = 64;
        const step = (Math.PI * 2) / barsCount;

        for (let i = 0; i < barsCount; i++) {
          const angle = i * step + phase * 0.15;
          const dataIndex = Math.floor((i / barsCount) * (dataArray.length / 2));
          const barVal = isPlaying ? (dataArray[dataIndex] || 15) / 255 : 0.12;
          const barHeight = barVal * (Math.min(width, h) * 0.25) + 4;

          const x1 = centerX + Math.cos(angle) * baseRadius;
          const y1 = centerY + Math.sin(angle) * baseRadius;
          const x2 = centerX + Math.cos(angle) * (baseRadius + barHeight);
          const y2 = centerY + Math.sin(angle) * (baseRadius + barHeight);

          ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.accent;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // MODE 2: EDITORIAL FREQUENCY BARS
      else if (mode === 'bars') {
        const barCount = 44;
        const padding = 3;
        const totalPadding = (barCount - 1) * padding;
        const barWidth = Math.max(3, (width - 40 - totalPadding) / barCount);
        const startX = 20;

        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor((i / barCount) * (dataArray.length * 0.75));
          const barVal = isPlaying ? (dataArray[dataIndex] || 15) / 255 : 0.1;
          const barHeight = Math.max(4, barVal * (h * 0.7));
          const x = startX + i * (barWidth + padding);
          const y = h - barHeight - 15;

          ctx.fillStyle = i % 2 === 0 ? palette.primary : palette.accent;
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      }

      // MODE 3: FINE LINE WAVE & PARTICLES
      else if (mode === 'wave') {
        particlesRef.current.forEach((p) => {
          p.x += p.vx * palette.speedMult * (1 + treble * 2);
          p.y += p.vy * palette.speedMult * (1 + treble * 2);

          if (p.x < 0) p.x = 1;
          if (p.x > 1) p.x = 0;
          if (p.y < 0) p.y = 1;
          if (p.y > 1) p.y = 0;

          const px = p.x * width;
          const py = p.y * h;
          const dynamicRadius = p.radius * (1 + bass * 1.5);

          ctx.fillStyle = palette.primary;
          ctx.globalAlpha = p.alpha * (0.3 + totalAmp * 0.7);
          ctx.beginPath();
          ctx.arc(px, py, dynamicRadius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const waveAmplitude = 20 + bass * 30;
        const waveFreq = 0.015 + treble * 0.02;

        for (let x = 0; x < width; x += 3) {
          const y = h / 2 + Math.sin(x * waveFreq + phase) * waveAmplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [mode, mood, enabled, isPlaying, height, getAnalyser]);

  if (!enabled) return null;

  return (
    <div className="relative w-full overflow-hidden bg-[#121212] border border-neutral-800">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
      />
    </div>
  );
};

export default AudioVisualizer;
