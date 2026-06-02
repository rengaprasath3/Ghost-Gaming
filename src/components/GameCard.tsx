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
      borderActive: 'border-orange-500 bg-gradient-to-br from-orange-950/30 via-[#0e101f] to-[#070913]/90 shadow-[0_0_30px_rgba(249,115,22,0.25)]',
      borderInactive: 'border-zinc-800/80 bg-[#0c0e1a]/95 hover:bg-[#101326] hover:border-orange-500/20 shadow-sm',
      badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      textAccent: 'text-orange-400',
      themeGlow: 'bg-orange-500',
      bgGradient: 'from-orange-500/10 via-orange-950/5 to-transparent',
      accentGlowColor: 'rgba(249, 115, 22, 0.6)',
      iconBg: 'bg-orange-950/40 text-orange-400 border-orange-500/35'
    },
    'bgmi': {
      borderActive: 'border-cyan-400 bg-gradient-to-br from-cyan-950/30 via-[#0e101f] to-[#070913]/90 shadow-[0_0_30px_rgba(6,182,212,0.25)]',
      borderInactive: 'border-zinc-800/80 bg-[#0c0e1a]/95 hover:bg-[#101326] hover:border-cyan-400/20 shadow-sm',
      badgeBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30',
      textAccent: 'text-cyan-400',
      themeGlow: 'bg-cyan-400',
      bgGradient: 'from-cyan-500/10 via-cyan-950/5 to-transparent',
      accentGlowColor: 'rgba(6, 182, 212, 0.6)',
      iconBg: 'bg-cyan-950/40 text-cyan-400 border-cyan-400/35'
    },
    'pogo': {
      borderActive: 'border-yellow-400 bg-gradient-to-br from-yellow-950/30 via-[#0e101f] to-[#070913]/90 shadow-[0_0_30px_rgba(234,179,8,0.25)]',
      borderInactive: 'border-zinc-800/80 bg-[#0c0e1a]/95 hover:bg-[#101326] hover:border-yellow-400/20 shadow-sm',
      badgeBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
      textAccent: 'text-yellow-400',
      themeGlow: 'bg-yellow-400',
      bgGradient: 'from-yellow-500/10 via-yellow-950/5 to-transparent',
      accentGlowColor: 'rgba(234, 179, 8, 0.6)',
      iconBg: 'bg-yellow-950/40 text-yellow-400 border-yellow-400/35'
    },
    'chess': {
      borderActive: 'border-emerald-400 bg-gradient-to-br from-emerald-950/30 via-[#0e101f] to-[#070913]/90 shadow-[0_0_30px_rgba(16,185,129,0.25)]',
      borderInactive: 'border-zinc-800/80 bg-[#0c0e1a]/95 hover:bg-[#101326] hover:border-emerald-400/20 shadow-sm',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30',
      textAccent: 'text-emerald-400',
      themeGlow: 'bg-emerald-400',
      bgGradient: 'from-emerald-500/10 via-emerald-950/5 to-transparent',
      accentGlowColor: 'rgba(16, 185, 129, 0.6)',
      iconBg: 'bg-emerald-950/40 text-emerald-400 border-emerald-400/35'
    }
  }[game.id];

  return (
    <motion.div
      id={`game-card-${game.id}`}
      ref={cardRef}
      onClick={handleCardClick}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 group cursor-pointer select-none ${
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

      {/* Futuristic Hinges */}
      <div className={`absolute top-0 left-0 w-3 h-[3px] transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-slate-200'}`} />
      <div className={`absolute top-0 left-0 w-[3px] h-3 transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-slate-200'}`} />
      
      <div className={`absolute top-0 right-0 w-3 h-[3px] transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-slate-200'}`} />
      <div className={`absolute top-0 right-0 w-[3px] h-3 transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-slate-200'}`} />

      <div className={`absolute bottom-0 left-0 w-3 h-[3px] transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-slate-200'}`} />
      <div className={`absolute bottom-0 left-0 w-[3px] h-3 transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-slate-200'}`} />

      <div className={`absolute bottom-0 right-0 w-3 h-[3px] transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-slate-200'}`} />
      <div className={`absolute bottom-0 right-0 w-[3px] h-3 transition-colors duration-500 ${isActive ? colorConfig.themeGlow : 'bg-slate-200'}`} />

      {/* Secondary Holographic Frame overlay */}
      {isActive && (
        <div className={`absolute inset-1.5 border border-dashed rounded-xl pointer-events-none z-0 transition duration-500 ${game.id === 'coc' ? 'border-orange-500/10' : game.id === 'bgmi' ? 'border-cyan-400/10' : game.id === 'pogo' ? 'border-yellow-400/10' : 'border-emerald-400/10'}`} />
      )}

      <div className="p-6 md:p-8 relative z-10">
        
        {/* Upper Title Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              id={`game-icon-${game.id}`} 
              className={`w-14 h-14 rounded-xl border flex items-center justify-center transition duration-500 group-hover:rotate-6 overflow-hidden shrink-0 shadow-md ${colorConfig.iconBg}`}
            >
              <span className="text-3xl select-none">{game.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id={`game-title-${game.id}`} className="text-xl md:text-2xl font-display font-black tracking-wide text-white transition group-hover:text-cyan-400 duration-300">
                  {game.title}
                </h3>
                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${colorConfig.themeGlow} animate-ping`} />
                )}
              </div>
              <p id={`game-tagline-${game.id}`} className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                {game.tagline}
              </p>
            </div>
          </div>
          
          <span className={`font-mono text-xs font-bold px-3 py-1.5 rounded-md border tracking-widest uppercase shrink-0 text-center shadow-sm ${colorConfig.badgeBg}`}>
            {game.badge}
          </span>
        </div>

        {/* Dynamic Horizontal Level Indicator */}
        <div className="mt-6 w-full bg-[#05060d] border border-zinc-800 h-[5px] rounded-full overflow-hidden relative">
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
              className={`border p-3 rounded-xl text-center backdrop-blur-md transition-all duration-300 ${
                isActive ? 'bg-[#121426]/90 border-zinc-700/60 shadow-md' : 'bg-[#090b14]/75 border-zinc-800/80 group-hover:border-zinc-700'
              }`}
            >
              <div className="text-[9px] md:text-[10px] font-mono text-slate-450 uppercase tracking-widest font-bold text-slate-400">
                {stat.label}
              </div>
              <div className={`text-xs md:text-sm font-black font-mono mt-1 ${stat.highlight ? colorConfig.textAccent : 'text-slate-250 text-slate-200'}`}>
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
