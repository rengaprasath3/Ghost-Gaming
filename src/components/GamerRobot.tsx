/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface GamerRobotProps {
  status: 'idle' | 'charging' | 'flying' | 'targeting' | 'firing' | 'returning';
  isHeaderAvatar?: boolean;
  gameColorTheme?: string; // Used as fallback highlight theme color
  onClick?: () => void;
}

export default function GamerRobot({ 
  status, 
  isHeaderAvatar = false, 
  gameColorTheme = '#ea580c', 
  onClick 
}: GamerRobotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [emberCount, setEmberCount] = useState<number>(0);

  // Spark/Ember cycle when charging or firing to make Shendu feel alive
  useEffect(() => {
    const timer = setInterval(() => {
      setEmberCount(c => (c + 1) % 5);
    }, 180);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className={`relative select-none flex items-center justify-center ${isHeaderAvatar ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={isHeaderAvatar ? onClick : undefined}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Mystical Fire/Abyssal Glow Background Area */}
      <div 
        className="absolute inset-0 rounded-full transition-all duration-700 blur-2xl"
        style={{
          background: `radial-gradient(circle, ${status === 'firing' ? 'rgba(239,68,68,0.5)' : status === 'charging' ? 'rgba(249,115,22,0.35)' : 'rgba(21,128,61,0.25)'} 0%, transparent 70%)`,
          transform: isHovered || status !== 'idle' ? 'scale(1.4)' : 'scale(0.95)'
        }}
      />

      {/* Motion wrapper for the Real Shendu character asset */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={status}
        variants={{
          idle: {
            y: [0, -6, 0],
            rotate: [0, 1.5, -1.5, 0],
            transition: { repeat: Infinity, duration: 5, ease: "easeInOut" }
          },
          charging: {
            x: [0, -1, 1, -1, 1, 0],
            y: [0, 1, -1, 1, -1, 0],
            scale: 1.05,
            transition: { repeat: Infinity, duration: 0.12 }
          },
          flying: {
            y: [-3, 3, -3],
            rotate: [-2, 2, -2],
            transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
          },
          targeting: {
            scale: [1, 1.08, 1],
            rotate: [-1, 1, -1],
            transition: { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
          },
          firing: {
            x: [0, -2, 2, -1, 1, -2, 2, 0],
            y: [0, 2, -2, 1, -1, 2, -2, 0],
            scale: 1.15,
            transition: { repeat: Infinity, duration: 0.08 }
          },
          returning: {
            y: [0, -10, 0],
            opacity: [1, 0.5, 1],
            transition: { duration: 1.2, ease: "easeInOut" }
          }
        }}
      >
        <div
          className={`w-full h-full transition-all duration-300 ${
            isHovered ? 'scale-[1.08]' : ''
          }`}
          style={{
            filter: status === 'firing'
              ? 'drop-shadow(0 0 16px rgba(239, 68, 68, 0.95)) drop-shadow(0 0 6px rgba(34, 197, 94, 0.8)) brightness(1.15)'
              : status === 'charging'
                ? 'drop-shadow(0 0 14px rgba(34, 197, 94, 0.85)) drop-shadow(0 0 5px rgba(124, 58, 237, 0.6))'
                : status === 'targeting'
                  ? 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.85)) drop-shadow(0 0 4px rgba(34, 197, 94, 0.655))'
                  : 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6)) drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Dark green circular background gradient with glowing edge */}
              <radialGradient id="clown-bg-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#14532d" />
                <stop offset="70%" stopColor="#022c15" />
                <stop offset="100%" stopColor="#020804" />
              </radialGradient>
              
              {/* Neon green hair gradient */}
              <linearGradient id="clown-hair-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a3e635" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>

              {/* Metallic silver text gradient for 'CLOWN' */}
              <linearGradient id="chrome-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#e5e7eb" />
                <stop offset="50%" stopColor="#9ca3af" />
                <stop offset="65%" stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#1f2937" />
              </linearGradient>

              {/* Glowing eye effect */}
              <filter id="eye-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Subtle dropshadow for depth */}
              <filter id="mascot-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
              </filter>
            </defs>

            {/* Glowing background circle */}
            <circle cx="50" cy="50" r="46.5" fill="url(#clown-bg-grad)" stroke="#10b981" strokeWidth="2.2" strokeOpacity="1" />
            <circle cx="50" cy="50" r="44.2" stroke="#047857" strokeWidth="0.8" strokeOpacity="0.5" />
            
            {/* Symmetrical skull-like background watermark outline */}
            <g opacity="0.08" transform="translate(0, -6)">
              <path d="M 30,50 C 20,40 25,20 50,20 C 75,20 80,40 70,50 L 65,70 Q 50,85 35,70 Z" fill="#10b981" />
            </g>

            {/* Inner mascot with drop shadow */}
            <g filter="url(#mascot-shadow)">
              {/* Outer stroke shadow boundary */}
              <path d="
                M 30,54 
                Q 28,47 26,41 
                Q 23,31 28,23 
                Q 32,15 40,17 
                Q 43,12 49,14 
                Q 55,12 58,17 
                Q 66,15 70,23 
                Q 75,31 72,41 
                Q 70,47 68,54 
                L 70,58 
                Q 72,66 62,64 
                Q 50,68 38,64 
                Q 28,66 30,58 
                Z" 
                fill="#020602" 
              />
              
              {/* Neon Green Spiky Hair */}
              <path d="
                M 31,43 
                C 26,38 29,28 34,22 
                C 37,26 39,30 38,34 
                C 38,26 42,16 48,18 
                C 49,23 48,27 46,30 
                C 48,22 53,18 55,20 
                C 56,23 54,29 52,32 
                C 54,25 61,22 66,24 
                C 67,28 65,33 63,35 
                C 68,28 72,32 71,39 
                C 70,43 68,46 68,46
                C 68,46 62,49 50,47 
                C 38,49 32,46 32,46
                Z" 
                fill="url(#clown-hair-grad)" 
              />
              
              {/* Shading/Highlights in hair */}
              <path d="M 35,24 Q 39,29 41,34" stroke="#e2f8c0" strokeWidth="1.2" opacity="0.8" strokeLinecap="round" />
              <path d="M 44,20 Q 47,25 46,31" stroke="#e2f8c0" strokeWidth="1.2" opacity="0.8" strokeLinecap="round" />
              <path d="M 53,20 Q 55,25 52,32" stroke="#e2f8c0" strokeWidth="1.2" opacity="0.8" strokeLinecap="round" />
              <path d="M 63,24 Q 59,29 57,34" stroke="#e2f8c0" strokeWidth="1.2" opacity="0.8" strokeLinecap="round" />

              {/* White Clown Face Shape */}
              <path d="
                M 34,44 
                C 33,52 35,57 40,61 
                C 44,63 56,63 60,61 
                C 65,57 67,52 66,44 
                C 65,39 63,38 50,38 
                C 37,38 35,39 34,44 
                Z" 
                fill="#f8fafc" 
              />
              
              {/* Shading shadow on bottom & sides of the facial contour */}
              <path d="
                M 34,44 
                C 33,52 35,57 40,61 
                C 44,63 56,63 60,61 
                C 65,57 67,52 66,44
                C 64,50 60,54 50,54 
                C 40,54 36,50 34,44 
                Z"
                fill="#cbd5e1"
                opacity="0.45"
              />

              {/* Purple Symmetrical Eye Makeup Markings */}
              {/* Left Eye */}
              <path d="M 35,42 L 39,39 L 41,45 L 37,47 Z" fill="#6b21a8" />
              <path d="M 37,47 L 39,52 L 41,45 Z" fill="#7c3aed" />
              {/* Right Eye */}
              <path d="M 65,42 L 61,39 L 59,45 L 63,47 Z" fill="#6b21a8" />
              <path d="M 63,47 L 61,52 L 59,45 Z" fill="#7c3aed" />

              {/* Aggressive Angry Eyebrow creases */}
              <path d="M 35,41 Q 42,39 45,43" stroke="#020617" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 65,41 Q 58,39 55,43" stroke="#020617" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 50,39 L 50,42" stroke="#020617" strokeWidth="1" opacity="0.6" />

              {/* Sleek Angry Red Glowing Eyes */}
              <path d="M 37,42 Q 41,41 43,44 Q 40,45 37,42" fill="#ef4444" filter="url(#eye-glow)" />
              <path d="M 63,42 Q 59,41 57,44 Q 60,45 63,42" fill="#ef4444" filter="url(#eye-glow)" />
              
              {/* Sclera reflection points */}
              <circle cx="41.5" cy="42.8" r="0.6" fill="#ffffff" />
              <circle cx="58.5" cy="42.8" r="0.6" fill="#ffffff" />

              {/* Red Clown Nose with reflection highlight */}
              <circle cx="50" cy="48" r="4.8" fill="#dc2626" />
              <circle cx="51.8" cy="46.2" r="1.5" fill="#ffffff" opacity="0.9" />

              {/* Manic Grinning Mouth with Broad Red Lips */}
              <path d="M 37,51 Q 50,66 63,51 Q 50,56 37,51 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="0.8" />
              {/* Symmetrical white teeth grinning inside */}
              <path d="
                M 39,52 
                L 42,54 L 46,54 L 50,53 L 54,54 L 58,54 L 61,52 
                C 60,56 40,56 39,52 
                Z" 
                fill="#f8fafc" 
              />
              {/* Splitting teeth markers */}
              <path d="M 42,52 L 42,54 M 46,52 L 46,54 M 50,52 L 50,53 M 54,52 L 54,54 M 58,52 L 58,54" stroke="#475569" strokeWidth="0.6" />

              {/* White & Purple Pointed Collar/Ruff around shoulders */}
              <path d="
                M 32,59 
                L 34,65 L 42,61 L 50,67 L 58,61 L 66,65 L 68,59
                Q 50,64 32,59 
                Z" 
                fill="#f1f5f9" 
                stroke="#581c87" 
                strokeWidth="1.2" 
              />
              <path d="M 42,61 L 44,66 L 50,67 L 48,61" fill="#7c3aed" opacity="0.8" />
            </g>

            {/* Slanted Esports styled 'CLOWN' display text box */}
            <g transform="translate(0, 5.5)">
              {/* Shiny metal-bordered dark banner frame */}
              <path d="M 19,67 L 81,67 L 74,78 L 26,78 Z" fill="#090d16" stroke="#10b981" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M 21,68.5 L 79,68.5 L 77,70.5 L 23,70.5 Z" fill="#ffffff" opacity="0.22" />

              {/* Chrome 'CLOWN' styled wording with elegant font shadow */}
              <text 
                x="50" 
                y="75.2" 
                fill="url(#chrome-grad)" 
                stroke="#020617" 
                strokeWidth="0.8" 
                fontSize="10" 
                fontWeight="900" 
                fontFamily="Impact, Arial Black, sans-serif" 
                textAnchor="middle" 
                letterSpacing="1.5"
                transform="translate(50, 75.2) skewX(-9) translate(-50, -75.2)"
              >
                CLOWN
              </text>
            </g>
          </svg>
        </div>

        {/* Dynamic eye energy flares and flame breath when firing */}
        {status === 'firing' && (
          <>
            {/* Right eye fiery crimson flare */}
            <div 
              className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#ef4444,_0_0_5px_#dc2626] animate-ping"
              style={{ top: '44%', left: '42%' }}
            />
            {/* Left eye fiery crimson flare */}
            <div 
              className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#ef4444,_0_0_5px_#dc2626] animate-ping"
              style={{ top: '44%', left: '56%' }}
            />
            
            {/* Mythic Fire Cone blowing down from the clown mouth */}
            <div 
              className="absolute w-36 h-48 pointer-events-none z-10 origin-top bg-gradient-to-b from-green-300 via-emerald-500 to-transparent blur-sm rounded-full mix-blend-screen animate-pulse"
              style={{
                top: '55%',
                left: '50%',
                transform: 'translateX(-50%) scaleX(0.7)',
                animationDuration: '0.1s'
              }}
            />
            <div 
              className="absolute w-24 h-36 pointer-events-none z-20 origin-top bg-gradient-to-b from-white via-lime-400 to-transparent blur-xs rounded-full mix-blend-screen animate-ping"
              style={{
                top: '57%',
                left: '50%',
                transform: 'translateX(-50%) scaleX(0.5)',
                animationDuration: '0.15s'
              }}
            />
          </>
        )}
      </motion.div>

      {/* Decorative customized prompt HUD when idle */}
      {isHeaderAvatar && status === 'idle' && isHovered && (
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 via-green-600 to-lime-650 border border-white text-white font-mono text-[9px] font-black px-3 py-1.5 rounded-lg shadow-[0_8px_16px_rgba(34,197,94,0.4)] tracking-widest whitespace-nowrap animate-bounce z-40">
          🤡 UNLEASH THE CLOWN
        </div>
      )}
    </div>
  );
}
