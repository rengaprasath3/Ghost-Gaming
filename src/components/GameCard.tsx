/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { GameData } from '../types';
import { AnimationCanvas, AnimationCanvasHandle } from './AnimationCanvas';
import { ArrowDownRight, Award, Flame, Swords, Shield, Target, Zap, CircleDot, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
      borderActive: 'border-orange-500/80 shadow-[0_0_25px_rgba(255,114,0,0.3)]',
      borderInactive: 'border-white/5 hover:border-orange-500/40 bg-zinc-950/40',
      badgeBg: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
      textAccent: 'text-coc-orange',
      themeGlow: 'bg-orange-500',
      bgGradient: 'from-orange-950/20 via-orange-950/5 to-transparent',
      accentGlowColor: 'rgba(255, 114, 0, 0.4)',
      iconBg: 'bg-orange-950/30 text-orange-400 border-orange-500/20'
    },
    'bgmi': {
      borderActive: 'border-cyan-400/90 shadow-[0_0_25px_rgba(0,240,255,0.3)]',
      borderInactive: 'border-white/5 hover:border-cyan-400/40 bg-zinc-950/40',
      badgeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40',
      textAccent: 'text-bgmi-cyan',
      themeGlow: 'bg-cyan-400',
      bgGradient: 'from-cyan-950/20 via-cyan-950/5 to-transparent',
      accentGlowColor: 'rgba(0, 240, 255, 0.4)',
      iconBg: 'bg-cyan-950/30 text-cyan-400 border-cyan-500/20'
    },
    'pogo': {
      borderActive: 'border-yellow-400/90 shadow-[0_0_25px_rgba(254,254,0,0.3)]',
      borderInactive: 'border-white/5 hover:border-yellow-400/40 bg-zinc-950/40',
      badgeBg: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40',
      textAccent: 'text-pogo-yellow',
      themeGlow: 'bg-yellow-400',
      bgGradient: 'from-yellow-950/20 via-yellow-950/5 to-transparent',
      accentGlowColor: 'rgba(254, 254, 0, 0.4)',
      iconBg: 'bg-yellow-950/30 text-yellow-400 border-yellow-500/20'
    },
    'chess': {
      borderActive: 'border-emerald-400/90 shadow-[0_0_25px_rgba(0,230,118,0.3)]',
      borderInactive: 'border-white/5 hover:border-emerald-400/40 bg-zinc-950/40',
      badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/40',
      textAccent: 'text-chess-green',
      themeGlow: 'bg-emerald-400',
      bgGradient: 'from-emerald-950/20 via-emerald-950/5 to-transparent',
      accentGlowColor: 'rgba(0, 230, 118, 0.4)',
      iconBg: 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20'
    }
  }[game.id];

  return (
    <motion.div
      id={`game-card-${game.id}`}
      ref={cardRef}
      onClick={handleCardClick}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`relative overflow-hidden rounded-2xl border bg-black/60 backdrop-blur-xl transition-all duration-500 group cursor-pointer select-none ${
        isActive ? colorConfig.borderActive : colorConfig.borderInactive
      }`}
    >
      {/* Interactive Canvas - Handles tap vectors */}
      <AnimationCanvas 
        ref={canvasRef} 
        gameId={game.id} 
        isActive={isActive} 
      />

      {/* Cyber Aesthetic Scanline Grid */}
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none z-0" />
      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.bgGradient} opacity-40 pointer-events-none z-0`} />

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

      {/* Futuristic Hinges */}
      <div className={`absolute top-0 left-0 w-3 h-[3px] transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-white/10'}`} />
      <div className={`absolute top-0 left-0 w-[3px] h-3 transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-white/10'}`} />
      
      <div className={`absolute top-0 right-0 w-3 h-[3px] transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-white/10'}`} />
      <div className={`absolute top-0 right-0 w-[3px] h-3 transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-white/10'}`} />

      <div className={`absolute bottom-0 left-0 w-3 h-[3px] transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-white/10'}`} />
      <div className={`absolute bottom-0 left-0 w-[3px] h-3 transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-white/10'}`} />

      <div className={`absolute bottom-0 right-0 w-3 h-[3px] transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-white/10'}`} />
      <div className={`absolute bottom-0 right-0 w-[3px] h-3 transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-white/10'}`} />

      {/* Secondary Holographic Frame overlay */}
      {isActive && (
        <div className={`absolute inset-1.5 border border-dashed rounded-xl pointer-events-none z-0 transition duration-500 ${game.id === 'coc' ? 'border-orange-500/10' : game.id === 'bgmi' ? 'border-cyan-400/10' : game.id === 'pogo' ? 'border-yellow-400/10' : 'border-emerald-400/10'}`} />
      )}

      <div className="p-6 md:p-8 relative z-10">
        
        {/* Upper Title Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span 
              id={`game-icon-${game.id}`} 
              className={`text-4xl p-3 rounded-xl border flex items-center justify-center transition duration-500 group-hover:rotate-6 ${colorConfig.iconBg}`}
            >
              {game.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 id={`game-title-${game.id}`} className="text-xl md:text-2xl font-display font-black tracking-wide text-white group-hover:text-white transition">
                  {game.title}
                </h3>
                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${colorConfig.themeGlow} animate-ping`} />
                )}
              </div>
              <p id={`game-tagline-${game.id}`} className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
                {game.tagline}
              </p>
            </div>
          </div>
          
          <span className={`font-mono text-xs font-bold px-3 py-1.5 rounded-md border tracking-widest uppercase shrink-0 text-center shadow-[0_0_12px_rgba(0,0,0,0.6)] ${colorConfig.badgeBg}`}>
            {game.badge}
          </span>
        </div>

        {/* Dynamic Horizontal Level Indicator */}
        <div className="mt-6 w-full bg-white/5 h-[3px] rounded-full overflow-hidden relative">
          <div 
            className={`h-full rounded-full transition-all duration-700 ${colorConfig.themeGlow}`}
            style={{ width: isActive ? '100%' : '25%' }}
          />
        </div>

        {/* Major Stat Widgets Row */}
        <div className="grid grid-cols-3 gap-3.5 mt-5">
          {game.mainStats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`bg-black/85 border border-white/5 p-3 rounded-xl text-center backdrop-blur-md transition-all duration-300 ${
                isActive ? 'border-cyan-500/15' : 'group-hover:border-zinc-700/50'
              }`}
            >
              <div className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                {stat.label}
              </div>
              <div className={`text-xs md:text-sm font-black font-mono mt-1 ${stat.highlight ? colorConfig.textAccent : 'text-zinc-200'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic expanding segment built on framer-motion AnimatePresence */}
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="overflow-hidden"
            >
              <div className="mt-8 pt-6 border-t border-cyan-500/10">
                {/* Tactical Description block */}
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                  {game.about}
                </p>

                {/* Highly structured Sub Diagnostics list */}
                <div className="mb-6">
                  <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                    COGNITIVE TELEMETRY DIAGNOSTICS
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {game.subStats.map((sub, sIdx) => (
                      <div 
                        key={sIdx} 
                        className="flex justify-between items-center bg-black/60 border border-white/5 p-2.5 px-3 rounded-lg text-xs font-mono transition hover:bg-white/5"
                      >
                        <span className="text-zinc-500 uppercase tracking-wider">{sub.label}</span>
                        <span className={`font-black ${colorConfig.textAccent}`}>{sub.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Combat triggers indicators */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/70 border border-cyan-500/10 p-3 rounded-xl">
                  <div className="flex items-center gap-2.5 text-[10px] font-mono text-zinc-400">
                    <CircleDot className={`w-3 h-3 ${colorConfig.textAccent} animate-ping`} />
                    <span>TAP ANYWHERE ON THE CARD TO FIRE PARTICLE EXPLOSIONS</span>
                  </div>
                  
                  <div className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-500/20 self-start uppercase tracking-wider">
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
