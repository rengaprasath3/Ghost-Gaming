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
        <img
          src="https://static.wikia.nocookie.net/jackiechanadventures/images/1/1b/Shendu.png"
          alt="Shendu"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-contain transition-all duration-300 ${
            isHovered ? 'scale-[1.08]' : ''
          }`}
          style={{
            filter: status === 'firing'
              ? 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.95)) drop-shadow(0 0 5px rgba(234, 88, 12, 0.7)) brightness(1.2)'
              : status === 'charging'
                ? 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.95)) drop-shadow(0 0 4px rgba(234, 88, 12, 0.6)) brightness(1.1)'
                : status === 'targeting'
                  ? 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.9)) drop-shadow(0 0 4px rgba(22, 163, 74, 0.65))'
                  : 'drop-shadow(0 0 8px rgba(21, 128, 61, 0.65)) drop-shadow(0 0 3px rgba(2, 44, 34, 0.45))'
          }}
        />

        {/* Dynamic eye energy flares and flame breath when firing */}
        {status === 'firing' && (
          <>
            {/* Right eye fiery crimson flare */}
            <div 
              className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#ef4444,_0_0_5px_#f97316] animate-ping"
              style={{ top: '42%', left: '46%' }}
            />
            {/* Left eye fiery crimson flare */}
            <div 
              className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#ef4444,_0_0_5px_#f97316] animate-ping"
              style={{ top: '40%', left: '55%' }}
            />
            
            {/* Mythic Fire Cone blowing down from snout */}
            <div 
              className="absolute w-36 h-48 pointer-events-none z-10 origin-top bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent blur-sm rounded-full mix-blend-screen animate-pulse"
              style={{
                top: '52%',
                left: '50%',
                transform: 'translateX(-50%) scaleX(0.7)',
                animationDuration: '0.1s'
              }}
            />
            <div 
              className="absolute w-24 h-36 pointer-events-none z-20 origin-top bg-gradient-to-b from-white via-yellow-400 to-transparent blur-xs rounded-full mix-blend-screen animate-ping"
              style={{
                top: '54%',
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
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 border border-white text-white font-mono text-[9px] font-black px-3 py-1.5 rounded-lg shadow-[0_8px_16px_rgba(234,88,12,0.4)] tracking-widest whitespace-nowrap animate-bounce z-40">
          🐉 UNLEASH SHENDU'S FLAMES
        </div>
      )}
    </div>
  );
}
