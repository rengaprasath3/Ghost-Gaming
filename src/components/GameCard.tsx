/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { GameData } from '../types';
import { AnimationCanvas, AnimationCanvasHandle } from './AnimationCanvas';
import { Award, CircleDot } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { playSound } from '../audio';
import GameIcon from './GameIcon';

interface GameCardProps {
  game: GameData;
  isActive: boolean;
  onSelect?: () => void;
}

export default function GameCard({ game, isActive, onSelect }: GameCardProps) {
  const canvasRef = useRef<AnimationCanvasHandle>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Viewport scroll relative offset tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Mapped physical parameters
  const rawScale = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.1, 1.00, 1.00, 0.1]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.45, 1.0, 1.0, 0.45]);
  const rawRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8]);
  const rawTranslateY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);
  const rawIconScale = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.85, 1.15, 1.15, 0.85]);

  // Spring interpolations for continuous, fluid inertial kinetic motion
  const springConfig = { stiffness: 95, damping: 22, mass: 0.8 };
  const scale = useSpring(rawScale, springConfig);
  const opacity = useSpring(rawOpacity, springConfig);
  const rotateX = useSpring(rawRotateX, springConfig);
  const translateY = useSpring(rawTranslateY, springConfig);
  const iconScale = useSpring(rawIconScale, { stiffness: 100, damping: 20, mass: 0.8 });

  // Custom Event listener for robot laser attacks
  useEffect(() => {
    const handleRobotLaserHit = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetId: string }>;
      if (customEvent.detail && customEvent.detail.targetId === game.id) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 220);

        if (canvasRef.current && cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          // Spawn particle bursts at multiple locations on the card to make it look explosive
          const attackX = rect.width * (0.2 + Math.random() * 0.6);
          const attackY = rect.height * (0.25 + Math.random() * 0.35);
          canvasRef.current.triggerTap(attackX, attackY);
        }
      }
    };

    window.addEventListener('robot-laser-hit', handleRobotLaserHit);
    return () => {
      window.removeEventListener('robot-laser-hit', handleRobotLaserHit);
    };
  }, [game.id]);

  // Manage automated/interactive laser scanner loop
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setIsSwiping(s => !s);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    playSound(game.id as any);

    if (canvasRef.current && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      canvasRef.current.triggerTap(clickX, clickY);
    }
  };

  const colorConfig = {
    'coc': {
      borderActive: 'border-red-500/80 bg-gradient-to-br from-[#1b080a] via-[#080505] to-[#150f10] shadow-[0_0_25px_rgba(239,68,68,0.15)]',
      borderInactive: 'border-white/10 bg-[#0c0506]/95 hover:bg-[#140809] hover:border-white/30 shadow-sm',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
      textAccent: 'text-red-400',
      themeGlow: 'bg-red-500',
      bgGradient: 'from-red-500/10 via-red-950/5 to-transparent',
      accentGlowColor: 'rgba(239, 68, 68, 0.6)',
      iconBg: 'bg-red-950/40 text-red-400 border-red-500/35'
    },
    'bgmi': {
      borderActive: 'border-rose-500/80 bg-gradient-to-br from-[#22070e] via-[#080505] to-[#150f10] shadow-[0_0_25px_rgba(244,63,94,0.15)]',
      borderInactive: 'border-white/10 bg-[#0c0506]/95 hover:bg-[#140809] hover:border-white/30 shadow-sm',
      badgeBg: 'bg-red-700/20 text-red-300 border-red-700/30',
      textAccent: 'text-rose-400',
      themeGlow: 'bg-red-650',
      bgGradient: 'from-red-650/10 via-rose-950/5 to-transparent',
      accentGlowColor: 'rgba(190, 18, 60, 0.6)',
      iconBg: 'bg-[#220a0e] text-red-400 border-red-650/35'
    },
    'pogo': {
      borderActive: 'border-amber-500/80 bg-gradient-to-br from-[#240c06] via-[#080505] to-[#150f10] shadow-[0_0_25px_rgba(245,158,11,0.15)]',
      borderInactive: 'border-white/10 bg-[#0c0506]/95 hover:bg-[#140809] hover:border-white/30 shadow-sm',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      textAccent: 'text-amber-400',
      themeGlow: 'bg-amber-500',
      bgGradient: 'from-amber-500/10 via-amber-950/5 to-transparent',
      accentGlowColor: 'rgba(217, 119, 6, 0.6)',
      iconBg: 'bg-[#240e08] text-amber-400 border-amber-600/35'
    },
    'chess': {
      borderActive: 'border-emerald-500/80 bg-gradient-to-br from-[#122515] via-[#080505] to-[#150f10] shadow-[0_0_25px_rgba(16,185,129,0.15)]',
      borderInactive: 'border-white/10 bg-[#0c0506]/95 hover:bg-[#140809] hover:border-white/30 shadow-sm',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      textAccent: 'text-emerald-400',
      themeGlow: 'bg-emerald-550 bg-emerald-500',
      bgGradient: 'from-emerald-700/10 via-emerald-950/5 to-transparent',
      accentGlowColor: 'rgba(16, 185, 129, 0.6)',
      iconBg: 'bg-[#0f2812] text-emerald-400 border-emerald-800/35'
    }
  }[game.id];

  return (
    <div ref={containerRef} className="w-full relative py-2" style={{ perspective: "1000px" }}>
      <motion.div
        id={`game-card-${game.id}`}
        ref={cardRef}
        onClick={handleCardClick}
        style={{
          scale,
          opacity,
          rotateX,
          translateY,
          transformStyle: "preserve-3d",
          willChange: "transform, opacity"
        }}
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 select-none cursor-pointer ${
          isActive ? colorConfig.borderActive : colorConfig.borderInactive
        } ${isShaking ? 'animate-card-shake shadow-[0_0_40px_rgba(239,68,68,0.3)]' : ''}`}
      >
      {/* Interactive Play Canvas */}
      {isActive && (
        <AnimationCanvas 
          ref={canvasRef} 
          gameId={game.id} 
          isActive={isActive} 
        />
      )}

      {/* Cyber Aesthetic Scanline Grid */}
      <div className="absolute inset-0 scanlines opacity-[0.03] pointer-events-none z-0" />

      {/* Immersive Game Scene Background Artwork */}
      {game.bgScene && (
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
          style={{
            backgroundImage: `url(${game.bgScene})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          {/* Overlay to preserve readable, immersive dark cyberpunk analytics theme */}
          <div 
            className="absolute inset-0 transition-all duration-500 bg-zinc-950/90" 
          />
        </div>
      )}

      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.bgGradient} opacity-30 pointer-events-none z-0`} />

      {/* Laser Scanning Line Sweeping on Active */}
      {isActive && (
        <div 
          className="absolute left-0 w-full h-[1.5px] z-10 pointer-events-none transition-all duration-[2500ms] ease-in-out"
          style={{
            top: isSwiping ? '98%' : '2%',
            background: `linear-gradient(90deg, transparent 5%, ${colorConfig.accentGlowColor} 50%, transparent 95%)`,
            boxShadow: `0 0 10px 1px ${colorConfig.accentGlowColor}`
          }}
        />
      )}

      <div className="p-5 sm:p-7 md:p-8 relative z-10">
        
        {/* Upper Title Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-5 sm:gap-7">
            <motion.div 
              id={`game-icon-${game.id}`} 
              style={{ scale: iconScale }}
              className={`rounded-2xl border flex items-center justify-center overflow-hidden shrink-0 shadow-xl w-16 h-16 sm:w-20 sm:h-20 ${colorConfig.iconBg}`}
            >
              <div className="w-[85%] h-[85%] flex items-center justify-center">
                <GameIcon gameId={game.id} className="w-full h-full" />
              </div>
            </motion.div>
            
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <h3 id={`game-title-${game.id}`} className="text-xl md:text-2xl old-age-title text-white">
                  {game.title}
                </h3>
                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${colorConfig.themeGlow} animate-pulse`} />
                )}
              </div>
              <p id={`game-tagline-${game.id}`} className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                {game.tagline}
              </p>
            </div>
          </div>
          
          <span className={`font-mono text-xs font-bold px-3 py-1.5 rounded-md border tracking-widest uppercase shrink-0 text-center shadow-sm ${colorConfig.badgeBg}`}>
            {game.badge}
          </span>
        </div>

        {/* Dynamic Horizontal Level Indicator */}
        <div className="mt-5 w-full bg-[#05060d] border border-zinc-900 h-[5px] rounded-full overflow-hidden relative">
          <div 
            className={`h-full rounded-full transition-all duration-[1500ms] ${colorConfig.themeGlow}`}
            style={{ width: '100%' }}
          />
        </div>

        {/* Major Stat Widgets Row */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mt-5">
          {game.mainStats.map((stat, idx) => (
            <div 
              key={idx} 
              className="border p-1.5 sm:p-3 rounded-xl flex flex-col justify-center text-center bg-[#121426]/95 border-zinc-850 shadow-md min-w-0"
            >
              <div className="text-[8px] md:text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold truncate">
                {stat.label}
              </div>
              <div className={`text-[10px] min-[380px]:text-xs md:text-sm leading-tight font-black font-mono mt-1 break-words whitespace-normal ${stat.highlight ? colorConfig.textAccent : 'text-slate-200'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic expanded info */}
        <div className="mt-6 pt-5 border-t border-zinc-800/60">
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans mb-5 bg-[#090a14]/90 p-4 rounded-xl border border-zinc-900 shadow-inner">
            {game.about}
          </p>

          <div className="mb-5">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              COGNITIVE DIAGNOSTIC DATA
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {game.subStats.map((sub, sIdx) => (
                <div 
                  key={sIdx} 
                  className="flex justify-between items-center bg-[#090b14]/90 border border-zinc-900 p-2.5 px-3 rounded-lg text-xs font-mono text-slate-200 shadow-sm"
                >
                  <span className="text-slate-400 uppercase tracking-wider">{sub.label}</span>
                  <span className={`font-black ${colorConfig.textAccent}`}>{sub.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Combat triggers indicators */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080a13]/85 border border-zinc-900 p-3 rounded-xl">
            <div className="flex items-center gap-2.5 text-[9.5px] font-mono text-slate-400">
              <CircleDot className={`w-2.5 h-2.5 ${colorConfig.textAccent} animate-pulse`} />
              <span>TAP COCKPIT MONITOR CANVAS FOR DYNAMIC PARTICLE SPARKS</span>
            </div>
            
            <div className="text-[8px] font-mono text-cyan-450 text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50 self-start uppercase tracking-wider font-extrabold">
              TAP SENSORS ON
            </div>
          </div>
        </div>

      </div>
      </motion.div>
    </div>
  );
}
