/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GamerRobotProps {
  status: 'idle' | 'charging' | 'flying' | 'targeting' | 'firing' | 'returning';
  isHeaderAvatar?: boolean;
  gameColorTheme?: string; // Hex color or simple description used to theme visual highlights
  onClick?: () => void;
}

export default function GamerRobot({ 
  status, 
  isHeaderAvatar = false, 
  gameColorTheme = '#00f0ff', 
  onClick 
}: GamerRobotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [eyePulse, setEyePulse] = useState(0);

  // Micro-fluctuations for eyes to make the robot feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setEyePulse((curr) => (curr === 0 ? 1 : 0));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Determine eyes display path depending on status & hover
  const getVisorGraphic = () => {
    if (status === 'firing') {
      // Angry/Locked target eyes
      return (
        <g id="visor-angry-eyes" className="transition-all duration-300">
          <ellipse cx="32" cy="45" rx="10" ry="1.5" transform="rotate(-15 32 45)" fill="#ef4444" className="shadow-[0_0_12px_#ef4444]" />
          <ellipse cx="68" cy="45" rx="10" ry="1.5" transform="rotate(15 68 45)" fill="#ef4444" className="shadow-[0_0_12px_#ef4444]" />
          <circle cx="34" cy="45" r="2.5" fill="#ffffff" />
          <circle cx="66" cy="45" r="2.5" fill="#ffffff" />
          {/* Target lock overlay */}
          <line x1="50" y1="35" x2="50" y2="55" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
          <line x1="40" y1="45" x2="60" y2="45" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
        </g>
      );
    }

    if (status === 'targeting' || status === 'charging') {
      // Alert scanning eyes
      return (
        <g id="visor-alert-eyes" className="transition-all duration-300">
          <path d="M 22,48 L 42,42 L 22,42 Z" fill="#eab308" />
          <path d="M 78,48 L 58,42 L 78,42 Z" fill="#eab308" />
          <rect x="44" y="44" width="12" height="2" fill="#eab308" className="animate-pulse" />
        </g>
      );
    }

    if (status === 'flying' || status === 'returning') {
      // High-speed slit eyes
      return (
        <g id="visor-flight-eyes" className="transition-all duration-300">
          <rect x="24" y="44" width="16" height="3" rx="1.5" fill="#00f0ff" className="shadow-[0_0_10px_#00f0ff]" />
          <rect x="60" y="44" width="16" height="3" rx="1.5" fill="#00f0ff" className="shadow-[0_0_10px_#00f0ff]" />
        </g>
      );
    }

    if (isHovered) {
      // Inquisitive brackets eyes
      return (
        <g id="visor-hover-eyes" className="transition-all duration-300">
          <path d="M 24,40 L 20,40 L 20,50 L 24,50" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="28" cy="45" r="3" fill="#00f0ff" />
          <circle cx="72" cy="45" r="3" fill="#00f0ff" />
          <path d="M 76,40 L 80,40 L 80,50 L 76,50" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    }

    // Default: Friendly lazy digital eyes
    return (
      <g id="visor-friendly-eyes" className="transition-all duration-300">
        <path 
          d={eyePulse === 0 ? "M 22,46 Q 30,38 38,46" : "M 22,45 L 38,45"} 
          fill="none" 
          stroke={gameColorTheme} 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />
        <path 
          d={eyePulse === 0 ? "M 62,46 Q 70,38 78,46" : "M 62,45 L 78,45"} 
          fill="none" 
          stroke={gameColorTheme} 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />
      </g>
    );
  };

  return (
    <div 
      className={`relative select-none flex items-center justify-center ${isHeaderAvatar ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={isHeaderAvatar ? onClick : undefined}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Background glow shadow circle */}
      <div 
        className="absolute inset-0 rounded-full transition-all duration-500 blur-lg"
        style={{
          background: `radial-gradient(circle, ${gameColorTheme}33 0%, transparent 70%)`,
          transform: isHovered || status !== 'idle' ? 'scale(1.2)' : 'scale(0.8)'
        }}
      />

      {/* SVG Gaming Robot Model */}
      <svg 
        id="gaming-robot-model-svg"
        viewBox="0 0 100 100" 
        className={`w-full h-full transition-all duration-500 ${
          status === 'charging' ? 'animate-[bounce_0.2s_infinite]' : 
          status === 'targeting' ? 'animate-[pulse_0.8s_infinite]' : 
          status === 'firing' ? 'animate-[bounce_0.1s_infinite]' : 
          isHovered ? 'rotate-[-3deg] scale-[1.05]' : 'animate-[float_5s_ease-in-out_infinite]'
        }`}
        style={{
          filter: `drop-shadow(0 0 8px ${gameColorTheme}44)`
        }}
      >
        <defs>
          {/* Dynamic Glow Filter */}
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="armor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="thruster-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="1" />
            <stop offset="30%" stopColor="#00f0ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Thruster Flame vector (Animated height depending on state) */}
        {(status === 'flying' || status === 'returning' || status === 'targeting' || status === 'firing') && (
          <g id="thruster-fire">
            <path 
              d="M 40,82 L 50,105 L 60,82 Z" 
              fill="url(#thruster-grad)" 
              className="animate-pulse"
              style={{
                transformOrigin: '50px 82px',
                animationDuration: '0.15s'
              }}
            />
            {/* Spark particles falling from engine */}
            <circle cx="45" cy="88" r="1.5" fill="#f97316" className="animate-ping" />
            <circle cx="55" cy="94" r="1" fill="#38bdf8" className="animate-bounce" />
          </g>
        )}

        {/* Floating Side Thruster Ears */}
        <g id="side-ears">
          {/* Left Wing / Thruster */}
          <path 
            d="M 12,38 L 2,42 L 5,58 L 12,52 Z" 
            fill="url(#armor-grad)" 
            stroke={gameColorTheme} 
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="transition-all duration-500"
            style={{
              transform: isHovered || status !== 'idle' ? 'translate(-3px, 1px) rotate(-10deg)' : 'none',
              transformOrigin: '12px 45px'
            }}
          />
          {/* Left Wing LED */}
          <circle cx="5" cy="50" r="1.5" fill={gameColorTheme} className="animate-pulse" />

          {/* Right Wing / Thruster */}
          <path 
            d="M 88,38 L 98,42 L 95,58 L 88,52 Z" 
            fill="url(#armor-grad)" 
            stroke={gameColorTheme} 
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="transition-all duration-500"
            style={{
              transform: isHovered || status !== 'idle' ? 'translate(3px, 1px) rotate(10deg)' : 'none',
              transformOrigin: '88px 45px'
            }}
          />
          {/* Right Wing LED */}
          <circle cx="95" cy="50" r="1.5" fill={gameColorTheme} className="animate-pulse" />
        </g>

        {/* Antennas / Radar Spire */}
        <g id="radar-antennas">
          <line x1="50" y1="20" x2="50" y2="6" stroke={gameColorTheme} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="5" r="3.5" fill={gameColorTheme} style={{ filter: 'url(#neon-glow)' }} className="animate-ping" />
          <circle cx="50" cy="5" r="2.5" fill="#ffffff" />
          
          {/* Angular secondary spires */}
          <path d="M 32,25 L 24,12" stroke="url(#armor-grad)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 68,25 L 76,12" stroke="url(#armor-grad)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="12" r="1.5" fill={gameColorTheme} />
          <circle cx="76" cy="12" r="1.5" fill={gameColorTheme} />
        </g>

        {/* Robot Head Outer Helmet Frame */}
        <g id="helmet-armor">
          <path 
            d="M 28,26 L 72,26 L 86,42 L 86,64 L 70,80 L 30,80 L 14,64 L 14,42 Z" 
            fill="url(#armor-grad)" 
            stroke={gameColorTheme} 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          
          {/* Futuristic Rivets / Screws */}
          <circle cx="20" cy="32" r="1" fill="#475569" />
          <circle cx="80" cy="32" r="1" fill="#475569" />
          <circle cx="20" cy="74" r="1" fill="#475569" />
          <circle cx="80" cy="74" r="1" fill="#475569" />
        </g>

        {/* Visor Screen Shell */}
        <g id="visor-screeen">
          <path 
            d="M 18,38 L 82,38 L 82,54 L 72,68 L 28,68 L 18,54 Z" 
            fill="#020617" 
            stroke={status === 'firing' ? '#ef4444' : status === 'targeting' || status === 'charging' ? '#eab308' : '#003344'} 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
          />
          
          {/* Holographic scanner line overlay */}
          <path 
            d="M 18,48 L 82,48" 
            stroke={gameColorTheme} 
            strokeWidth="0.5" 
            opacity="0.25" 
          />
          
          {/* Visor eyes coordinates dynamic drawing */}
          {getVisorGraphic()}
        </g>

        {/* Speaker / Mouth line grilles */}
        <g id="mouth-grille">
          <line x1="40" y1="73" x2="60" y2="73" stroke={gameColorTheme} strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
          <line x1="45" y1="76" x2="55" y2="76" stroke={gameColorTheme} strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
        </g>

        {/* Top/Side Decals */}
        <g id="visor-decals" opacity="0.7">
          <rect x="50" y="29" width="6" height="1.5" rx="0.5" fill="#64748b" />
          <rect x="42" y="29" width="6" height="1.5" rx="0.5" fill="#64748b" />
        </g>
      </svg>

      {/* Decorative prompt HUD when idle */}
      {isHeaderAvatar && status === 'idle' && isHovered && (
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-cyan-950/95 border border-cyan-400 text-cyan-400 font-mono text-[9px] font-bold px-2 py-1 rounded shadow-[0_0_12px_rgba(0,240,255,0.4)] tracking-widest whitespace-nowrap animate-bounce z-40">
          🔋 CLICK TO INITIATE ASSAULT
        </div>
      )}
    </div>
  );
}
