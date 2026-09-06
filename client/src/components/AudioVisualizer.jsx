import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

const MOOD_PALETTES = {
  calm: { primary: '#06b6d4', secondary: '#14b8a6', accent: '#38bdf8', speedMult: 0.5 },
  sad: { primary: '#3b82f6', secondary: '#6366f1', accent: '#818cf8', speedMult: 0.3 },
  happy: { primary: '#f59e0b', secondary: '#ec4899', accent: '#f43f5e', speedMult: 1.2 },
  energetic: { primary: '#a855f7', secondary: '#ef4444', accent: '#ff007f', speedMult: 1.8 },
  romantic: { primary: '#f43f5e', secondary: '#8b5cf6', accent: '#e879f9', speedMult: 0.6 },
  focus: { primary: '#10b981', secondary: '#0284c7', accent: '#34d399', speedMult: 0.4 }
};

const AudioVisualizer = ({ mode = 'circular', mood = 'calm', enabled = true, height = 300 }) => {
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const particlesRef = useRef([]);

  const { isPlaying, getAnalyser } = usePlayer();

  // Initialize background floating particles once
  useEffect(() => {
    const particleCount = 45;
    const tempParticles = [];
    for (let i = 0; i < particleCount; i++) {
      tempParticles.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        alpha: Math.random() * 0.5 + 0.2
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

    // Handle high DPI crisp canvas resolution
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
        // Subtle ambient idle animation when paused
        bass = 0.15;
        mids = 0.1;
        treble = 0.1;
        totalAmp = 0.1;
      }

      phase += (0.015 + treble * 0.05) * palette.speedMult;

      // MODE 1: CIRCULAR VISUALIZER
      if (mode === 'circular') {
        const centerX = width / 2;
        const centerY = h / 2;
        const baseRadius = Math.min(width, h) * 0.22 + bass * 25;

        // Central glowing core
        const coreGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          baseRadius * 1.4
        );
        coreGradient.addColorStop(0, `${palette.primary}66`);
        coreGradient.addColorStop(0.6, `${palette.secondary}33`);
        coreGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * (1 + bass * 0.3), 0, Math.PI * 2);
        ctx.fill();

        // Radial Frequency Spokes
        const barsCount = 64;
        const step = (Math.PI * 2) / barsCount;

        for (let i = 0; i < barsCount; i++) {
          const angle = i * step + phase * 0.2;
          const dataIndex = Math.floor((i / barsCount) * (dataArray.length / 2));
          const barVal = isPlaying ? (dataArray[dataIndex] || 20) / 255 : 0.15;
          const barHeight = barVal * (Math.min(width, h) * 0.28) + 5;

          const x1 = centerX + Math.cos(angle) * baseRadius;
          const y1 = centerY + Math.sin(angle) * baseRadius;
          const x2 = centerX + Math.cos(angle) * (baseRadius + barHeight);
          const y2 = centerY + Math.sin(angle) * (baseRadius + barHeight);

          ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.accent;
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // MODE 2: FREQUENCY BARS
      else if (mode === 'bars') {
        const barCount = 48;
        const padding = 4;
        const totalPadding = (barCount - 1) * padding;
        const barWidth = Math.max(3, (width - 40 - totalPadding) / barCount);
        const startX = 20;

        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor((i / barCount) * (dataArray.length * 0.75));
          const barVal = isPlaying ? (dataArray[dataIndex] || 15) / 255 : 0.12;
          const barHeight = Math.max(6, barVal * (h * 0.75));
          const x = startX + i * (barWidth + padding);
          const y = h - barHeight - 15;

          const barGradient = ctx.createLinearGradient(x, y + barHeight, x, y);
          barGradient.addColorStop(0, palette.primary);
          barGradient.addColorStop(1, palette.accent);

          ctx.fillStyle = barGradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();
        }
      }

      // MODE 3: PARTICLE / WAVE VISUALIZER
      else if (mode === 'wave') {
        // Floating particles reacting to treble & bass
        particlesRef.current.forEach((p) => {
          p.x += p.vx * palette.speedMult * (1 + treble * 3);
          p.y += p.vy * palette.speedMult * (1 + treble * 3);

          if (p.x < 0) p.x = 1;
          if (p.x > 1) p.x = 0;
          if (p.y < 0) p.y = 1;
          if (p.y > 1) p.y = 0;

          const px = p.x * width;
          const py = p.y * h;
          const dynamicRadius = p.radius * (1 + bass * 2);

          ctx.fillStyle = palette.primary;
          ctx.globalAlpha = p.alpha * (0.4 + totalAmp * 0.6);
          ctx.beginPath();
          ctx.arc(px, py, dynamicRadius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // Sine wave layer
        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();

        const waveAmplitude = 25 + bass * 40;
        const waveFreq = 0.02 + treble * 0.03;

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
    <div className="relative w-full overflow-hidden rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
      />
    </div>
  );
};

export default AudioVisualizer;
