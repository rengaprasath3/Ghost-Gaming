/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GAMER_PROFILE, GAMES_DATA } from '../data';
import { Shield, Compass, Swords, Terminal, Radio, Cpu, Activity, UserCheck, Flame, Skull } from 'lucide-react';
import { useState, useEffect } from 'react';
import GamerRobot from './GamerRobot';
import GameIcon from './GameIcon';

interface GamerHeaderProps {
  onRobotAttack?: () => void;
  robotStatus?: 'idle' | 'charging' | 'flying' | 'targeting' | 'firing' | 'returning';
  gameColorTheme?: string;
}

export default function GamerHeader({ onRobotAttack, robotStatus = 'idle', gameColorTheme = '#00f0ff' }: GamerHeaderProps) {
  const [pulse, setPulse] = useState(true);
  const [timestamp, setTimestamp] = useState<string>('');
  const [headerFps, setHeaderFps] = useState<number>(120);
  const [headerPing, setHeaderPing] = useState<number>(8);
  const [headerCpu, setHeaderCpu] = useState<number>(18);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1500);

    // Dynamic clock ticking in terminal format
    const updateTime = () => {
      const now = new Date();
      // IST is UTC + 5:30
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const year = istTime.getUTCFullYear();
      const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
      const day = String(istTime.getUTCDate()).padStart(2, '0');
      const hours = String(istTime.getUTCHours()).padStart(2, '0');
      const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
      const seconds = String(istTime.getUTCSeconds()).padStart(2, '0');
      setTimestamp(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} IST`);
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    const statsInterval = setInterval(() => {
      setHeaderFps(Math.floor(118 + Math.random() * 5));
      setHeaderPing(Math.floor(6 + Math.random() * 6));
      setHeaderCpu(Math.floor(12 + Math.random() * 11));
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
      clearInterval(statsInterval);
    };
  }, []);

  return (
    <div 
      id="gamer-header-container" 
      className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#0c0e1a]/95 p-6 md:p-8 backdrop-blur-xl mb-8 shadow-[0_12px_45px_rgba(0,0,0,0.35)]"
    >
      {/* Glitch Overlay Laser Lines */}
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-[pan_3s_linear_infinite]" />
 
      {/* Decorative Blueprint/Radar Circles */}
      <div className="absolute -top-16 -right-16 w-48 h-48 border border-cyan-500/10 rounded-full flex items-center justify-center animate-[spin_30s_linear_infinite] pointer-events-none">
        <div className="w-40 h-40 border border-dashed border-cyan-500/15 rounded-full" />
        <div className="w-28 h-28 border border-dotted border-cyan-500/25 rounded-full" />
      </div>
 
      <div className="absolute -bottom-20 -left-20 w-64 h-64 border border-orange-500/10 rounded-full flex items-center justify-center animate-[spin_45s_linear_infinite] pointer-events-none">
        <div className="w-52 h-52 border border-dashed border-orange-500/15 rounded-full" />
        <div className="w-36 h-36 border border-emerald-500/10 rounded-full" />
      </div>
 
      {/* Grid Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none z-0" />
 
      {/* Content Layout */}
      <div className="flex flex-col xl:flex-row gap-8 relative z-10">
        
        {/* Left Segment: Avatar & Core State */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative group select-none">
            {/* Spinning hexagonal/isometric aura */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-400 via-orange-400 to-emerald-400 opacity-90 blur-md group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
            
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-zinc-950/90 border-4 border-cyan-500/50 flex items-center justify-center shadow-[0_8px_25px_rgba(6,182,212,0.3)]">
              <div id="gamer-robot-avatar" className="w-[85%] h-[85%] flex items-center justify-center">
                <GamerRobot 
                  status="idle" 
                  isHeaderAvatar={false} 
                  gameColorTheme={gameColorTheme}
                />
              </div>
              
              {/* Dynamic HUD layout on avatar */}
              <div className="absolute inset-0 border-2 border-dotted border-cyan-400/30 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none" />
            </div>
 
            {/* Level Badge in Neo-Tokyo Cyber styling */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-cyan-600 text-white font-mono text-[10px] uppercase font-black px-3 py-1 rounded-md border-2 border-zinc-950 shadow-[0_4px_12px_rgba(6,182,212,0.4)] tracking-widest whitespace-nowrap">
              LVL {GAMER_PROFILE.level} // SS9
            </div>
          </div>
 
          {/* Real-time System Metrics Panel below Avatar */}
          <div className="mt-6 w-full bg-slate-950/70 border border-white/10 rounded-xl p-3 font-mono text-[10px] text-slate-300 space-y-2 select-none min-w-[200px] shadow-lg">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#070913]/90 border border-white/10 p-1.5 rounded flex flex-col items-center">
                <span className="text-[8px] text-slate-400 uppercase tracking-wider">FPS</span>
                <strong className="text-emerald-400 font-extrabold mt-0.5">{headerFps} FPS</strong>
              </div>
              <div className="bg-[#070913]/90 border border-white/10 p-1.5 rounded flex flex-col items-center">
                <span className="text-[8px] text-slate-400 uppercase tracking-wider">NETWORK</span>
                <strong className="text-cyan-400 font-extrabold mt-0.5">{headerPing} ms</strong>
              </div>
              <div className="bg-[#070913]/90 border border-white/10 p-1.5 rounded flex flex-col items-center">
                <span className="text-[8px] text-slate-400 uppercase tracking-wider">CPU LOAD</span>
                <strong className="text-red-400 font-extrabold mt-0.5">{headerCpu}%</strong>
              </div>
              <div className="bg-[#070913]/90 border border-white/10 p-1.5 rounded flex flex-col items-center">
                <span className="text-[8px] text-slate-400 uppercase tracking-wider">LINK</span>
                <strong className="text-cyan-400 font-extrabold mt-0.5 truncate max-w-full text-[8px]">{GAMER_PROFILE.coreStatus}</strong>
              </div>
            </div>
            {/* Clock time beneath */}
            <div className="bg-[#070913]/90 border border-white/10 rounded p-1.5 text-center flex flex-col items-center">
              <span className="text-[8px] text-slate-400 uppercase tracking-wider">IST TIME</span>
              <strong className="text-yellow-400 font-mono text-[9px] font-bold mt-0.5 tracking-wider select-text">
                {timestamp ? timestamp : '2026-06-03 03:30:43 IST'}
              </strong>
            </div>
          </div>
        </div>
 
        {/* Center Segment: Core Stats Terminal */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div className="text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <h1 id="gamer-username" className="text-4xl md:text-5xl old-age-title animate-pulse uppercase">
                  {GAMER_PROFILE.primaryUsername}
                </h1>
              </div>
            </div>
          </div>
 
          {/* Account matrix linking section */}
          <div className="mt-5">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 justify-center lg:justify-start">
              <UserCheck className="w-3.5 h-3.5 text-red-500" />
              INTEGRATED FEDERATED SYSTEM IDENTITIES
            </h4>
 
            {/* Beautiful responsive badges listing exact target usernames of the user */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GAMES_DATA.map((game, key) => {
                const accConfig = {
                  'coc': { user: 'Renga', label: 'Clash of Clans', status: 'tamilanda', color: 'border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-950/40' },
                  'bgmi': { user: 'Clown Ghost', label: 'BGMI Mobile', status: '3.1 F/D', color: 'border-red-700/30 text-red-400 bg-red-950/20 hover:bg-red-950/40' },
                  'pogo': { user: 'Rengaprasath', label: 'Pokémon GO', status: 'Mystic ❄️', color: 'border-amber-600/30 text-amber-500 bg-amber-950/20 hover:bg-amber-950/40' },
                  'chess': { user: 'Renga', label: 'Chess.com', status: '200 Rating', color: 'border-red-900/30 text-red-500 bg-red-950/20 hover:bg-red-950/40' }
                }[game.id];
 
                return (
                  <div 
                    key={key} 
                    className={`border p-3 rounded-xl transition duration-300 hover:scale-[1.02] flex flex-col justify-between ${accConfig.color}`}
                  >
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-mono opacity-80 gap-2">
                      <span className="truncate">{accConfig.label}</span>
                      <div className="w-6 h-6 flex items-center justify-center shrink-0 select-none overflow-hidden rounded-md bg-white/5 border border-white/10">
                        <GameIcon gameId={game.id} className="w-[85%] h-[85%]" />
                      </div>
                    </div>
                    <div className="font-display font-black text-xs md:text-sm tracking-wide text-white mt-1.5">
                      {accConfig.user}
                    </div>
                    <div className="text-[9px] font-mono mt-1 opacity-90 border-t border-zinc-800/80 pt-1.5 flex justify-between">
                      <span>STATUS</span>
                      <strong className="text-white">{accConfig.status}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
