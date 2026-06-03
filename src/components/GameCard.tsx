/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { GameData } from '../types';
import { AnimationCanvas, AnimationCanvasHandle } from './AnimationCanvas';
import { ArrowDownRight, Award, Flame, Swords, Shield, Target, Zap, CircleDot, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../audio';
import GameIcon from './GameIcon';

interface GameCardProps {
  key?: any;
  game: GameData;
  isActive: boolean;
  onSelect: () => void;
}

export default function GameCard({ game, isActive, onSelect }: GameCardProps) {
  const canvasRef = useRef<AnimationCanvasHandle>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

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
    setClickCount(prev => prev + 1);
    
    // Play the stylized synthesized real-time sound of the chosen game
    playSound(game.id as any);

    if (!isActive) {
      onSelect();
      setTimeout(() => {
        if (canvasRef.current && cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          canvasRef.current.triggerTap(rect.width / 2, rect.height / 3);
        }
      }, 100);
      return;
    }

    if (canvasRef.current && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      canvasRef.current.triggerTap(clickX, clickY);
    }
  };

  const colorConfig = {
    'coc': {
      borderActive: 'border-white bg-gradient-to-br from-[#1b080a] via-[#080505] to-[#150f10] shadow-[0_0_25px_rgba(255,255,255,0.2)]',
      borderInactive: 'border-white/10 bg-[#0c0506]/95 hover:bg-[#140809] hover:border-white/30 shadow-sm',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
      textAccent: 'text-red-400',
      themeGlow: 'bg-red-500',
      bgGradient: 'from-red-500/10 via-red-950/5 to-transparent',
      accentGlowColor: 'rgba(239, 68, 68, 0.6)',
      iconBg: 'bg-red-950/40 text-red-400 border-red-500/35'
    },
    'bgmi': {
      borderActive: 'border-white bg-gradient-to-br from-[#22070e] via-[#080505] to-[#150f10] shadow-[0_0_25px_rgba(255,255,255,0.2)]',
      borderInactive: 'border-white/10 bg-[#0c0506]/95 hover:bg-[#140809] hover:border-white/30 shadow-sm',
      badgeBg: 'bg-red-700/20 text-red-300 border-red-700/30',
      textAccent: 'text-red-400',
      themeGlow: 'bg-red-600',
      bgGradient: 'from-red-600/10 via-red-950/5 to-transparent',
      accentGlowColor: 'rgba(190, 18, 60, 0.6)',
      iconBg: 'bg-[#220a0e] text-red-400 border-red-600/35'
    },
    'pogo': {
      borderActive: 'border-white bg-gradient-to-br from-[#240c06] via-[#080505] to-[#150f10] shadow-[0_0_25px_rgba(255,255,255,0.2)]',
      borderInactive: 'border-white/10 bg-[#0c0506]/95 hover:bg-[#140809] hover:border-white/30 shadow-sm',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      textAccent: 'text-amber-400',
      themeGlow: 'bg-amber-500',
      bgGradient: 'from-amber-500/10 via-amber-950/5 to-transparent',
      accentGlowColor: 'rgba(217, 119, 6, 0.6)',
      iconBg: 'bg-[#240e08] text-amber-400 border-amber-600/35'
    },
    'chess': {
      borderActive: 'border-white bg-gradient-to-br from-[#250406] via-[#080505] to-[#150f10] shadow-[0_0_25px_rgba(255,255,255,0.2)]',
      borderInactive: 'border-white/10 bg-[#0c0506]/95 hover:bg-[#140809] hover:border-white/30 shadow-sm',
      badgeBg: 'bg-red-800/20 text-red-400 border-red-800/30',
      textAccent: 'text-red-400',
      themeGlow: 'bg-red-700',
      bgGradient: 'from-red-700/10 via-red-950/5 to-transparent',
      accentGlowColor: 'rgba(153, 27, 27, 0.6)',
      iconBg: 'bg-[#280a0e] text-red-400 border-red-800/35'
    }
  }[game.id];

  return (
    <motion.div
      id={`game-card-${game.id}`}
      ref={cardRef}
      onClick={handleCardClick}
      layout
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ 
        layout: { type: "spring", stiffness: 45, damping: 15, mass: 1.2 },
        default: { type: "spring", stiffness: 120, damping: 20 }
      }}
      className={`relative overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow] duration-500 group cursor-pointer select-none gpu-accelerated transform-gpu ${
        isActive ? colorConfig.borderActive : colorConfig.borderInactive
      } ${isShaking ? 'animate-card-shake' : ''}`}
    >
      {/* Interactive Canvas - Handles tap vectors */}
      <AnimationCanvas 
        ref={canvasRef} 
        gameId={game.id} 
        isActive={isActive} 
      />

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
            className={`absolute inset-0 transition-all duration-500 ${
              isActive 
                ? 'bg-zinc-950/75 group-hover:bg-zinc-950/68' 
                : 'bg-zinc-950/88 group-hover:bg-zinc-950/80'
            }`} 
          />
        </div>
      )}

      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.bgGradient} opacity-30 pointer-events-none z-0`} />

      {/* Laser Scanning Line Sweeping on Active */}
      {isActive && (
        <div 
          className={`absolute left-0 w-full h-[1.5px] z-10 pointer-events-none transition-all duration-[2500ms] ease-in-out`}
          style={{
            top: isSwiping ? '98%' : '2%',
            background: `linear-gradient(90deg, transparent 5%, ${colorConfig.accentGlowColor} 50%, transparent 95%)`,
            boxShadow: `0 0 10px 1px ${colorConfig.accentGlowColor}`
          }}
        />
      )}



      <div className="p-4 sm:p-6 md:p-8 relative z-10">
        
        {/* Upper Title Block */}
        <motion.div layout className={`flex flex-col ${isActive ? 'items-center text-center w-full' : 'sm:flex-row sm:items-center justify-between'} gap-4`}>
          <motion.div layout className={`flex ${isActive ? 'flex-col items-center w-full' : 'flex-row items-center'} gap-4`}>
            <motion.div 
              layoutId={`game-icon-container-${game.id}`}
              layout
              transition={{ type: "spring", stiffness: 45, damping: 15, mass: 1.2 }}
              id={`game-icon-${game.id}`} 
              className={`rounded-2xl border flex items-center justify-center overflow-hidden shrink-0 shadow-xl transform-gpu will-change-transform ${
                isActive ? 'w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 scale-105 border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.15)]' : 'w-14 h-14'
              } ${colorConfig.iconBg}`}
            >
              <motion.div layout className="w-[85%] h-[85%] flex items-center justify-center transform-gpu will-change-transform">
                <GameIcon gameId={game.id} className="w-full h-full" />
              </motion.div>
            </motion.div>
            
            <motion.div layout className={`flex flex-col ${isActive ? 'items-center' : 'items-start'} transition-all duration-[1200ms]`}>
              <div className="flex items-center gap-2">
                <motion.h3 layout id={`game-title-${game.id}`} className="text-xl md:text-2xl old-age-title transition group-hover:text-red-400 duration-300">
                  {game.title}
                </motion.h3>
                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${colorConfig.themeGlow} animate-ping`} />
                )}
              </div>
              <motion.p layout id={`game-tagline-${game.id}`} className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                {game.tagline}
              </motion.p>
            </motion.div>
          </motion.div>
          
          <motion.span layout className={`font-mono text-xs font-bold px-3 py-1.5 rounded-md border tracking-widest uppercase shrink-0 text-center shadow-sm ${colorConfig.badgeBg} ${isActive ? 'mt-2' : ''}`}>
            {game.badge}
          </motion.span>
        </motion.div>

        {/* Dynamic Horizontal Level Indicator */}
        <motion.div layout className="mt-6 w-full bg-[#05060d] border border-zinc-800 h-[5px] rounded-full overflow-hidden relative">
          <motion.div 
            layout
            className={`h-full rounded-full transition-all duration-[1500ms] ${colorConfig.themeGlow}`}
            style={{ width: isActive ? '100%' : '25%' }}
          />
        </motion.div>

        {/* Major Stat Widgets Row */}
        <motion.div layout className="grid grid-cols-3 gap-2 sm:gap-3.5 mt-5">
          {game.mainStats.map((stat, idx) => (
            <motion.div 
              layout
              key={idx} 
              className={`border p-2 sm:p-3 rounded-lg sm:rounded-xl text-center backdrop-blur-md transition-all duration-300 ${
                isActive ? 'bg-[#121426]/90 border-zinc-700/60 shadow-md' : 'bg-[#090b14]/75 border-zinc-800/80 group-hover:border-zinc-700'
              }`}
            >
              <div className="text-[9px] md:text-[10px] font-mono text-slate-450 uppercase tracking-widest font-bold text-slate-400">
                {stat.label}
              </div>
              <div className={`text-xs md:text-sm font-black font-mono mt-1 ${stat.highlight ? colorConfig.textAccent : 'text-slate-250 text-slate-200'}`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic expanding segment built on framer-motion AnimatePresence */}
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1.2 }}
              className="overflow-hidden"
            >
              <div className="mt-8 pt-6 border-t border-zinc-800/80">
                {/* Tactical Description block */}
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans mb-6 bg-[#090a14]/90 p-4 rounded-xl border border-zinc-800/60 shadow-inner">
                  {game.about}
                </p>

                {/* Highly structured Sub Diagnostics list */}
                <div className="mb-6">
                  <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-450 text-slate-450 mb-3 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    COGNITIVE TELEMETRY DIAGNOSTICS
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {game.subStats.map((sub, sIdx) => (
                      <div 
                        key={sIdx} 
                        className="flex justify-between items-center bg-[#090b14]/90 border border-zinc-800/80 p-2.5 px-3 rounded-lg text-xs font-mono transition hover:bg-[#111425] text-slate-200 shadow-sm"
                      >
                        <span className="text-slate-450 text-slate-400 uppercase tracking-wider">{sub.label}</span>
                        <span className={`font-black ${colorConfig.textAccent}`}>{sub.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Combat triggers indicators */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080a13]/80 border border-zinc-800/90 p-3 rounded-xl">
                  <div className="flex items-center gap-2.5 text-[10px] font-mono text-slate-400">
                    <CircleDot className={`w-3 h-3 ${colorConfig.textAccent} animate-ping`} />
                    <span>TAP ANYWHERE ON THE CARD TO FIRE PARTICLE EXPLOSIONS</span>
                  </div>
                  
                  <div className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/50 self-start uppercase tracking-wider font-bold">
                    TAP REACTION // ACTIVE
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
