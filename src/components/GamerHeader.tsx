/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GAMER_PROFILE, GAMES_DATA } from '../data';
import { Shield, Compass, Swords, Terminal, Radio, Cpu, Activity, UserCheck, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';
import GamerRobot from './GamerRobot';

interface GamerHeaderProps {
  onRobotAttack: () => void;
  robotStatus: 'idle' | 'charging' | 'flying' | 'targeting' | 'firing' | 'returning';
  gameColorTheme?: string;
}

export default function GamerHeader({ onRobotAttack, robotStatus, gameColorTheme = '#00f0ff' }: GamerHeaderProps) {
  const [pulse, setPulse] = useState(true);
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1500);

    // Dynamic clock ticking in terminal format
    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <div 
      id="gamer-header-container" 
      className="relative overflow-hidden rounded-2xl border-2 border-zinc-805 border-zinc-800 bg-[#0c0e1a]/95 p-6 md:p-8 backdrop-blur-xl mb-8 shadow-[0_12px_45px_rgba(0,0,0,0.35)]"
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
            <div className={`absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-400 via-orange-400 to-emerald-400 opacity-90 blur-md group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ${robotStatus !== 'idle' ? 'animate-pulse' : ''}`} />
            
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-zinc-950/90 border-4 border-cyan-500/50 flex items-center justify-center shadow-[0_8px_25px_rgba(6,182,212,0.3)]">
              {robotStatus === 'idle' || robotStatus === 'charging' ? (
                <div id="gamer-robot-avatar" className="w-[85%] h-[85%]">
                  <GamerRobot 
                    status={robotStatus} 
                    isHeaderAvatar={true} 
                    gameColorTheme={gameColorTheme}
                    onClick={onRobotAttack} 
                  />
                </div>
              ) : (
                /* Virtual hologram indicating that Shendu has left his base */
                <div className="text-center p-2 flex flex-col items-center justify-center select-none">
                  <Flame className="w-8 h-8 text-orange-500 animate-[bounce_0.2s_infinite]" />
                  <span className="text-[8px] font-mono text-orange-600/90 uppercase tracking-widest mt-1.5 font-bold">SHENDU AWOKEN</span>
                  <span className="text-[7px] font-mono text-orange-500/60">SACRED INCINERATION</span>
                </div>
              )}
              
              {/* Dynamic HUD layout on avatar */}
              <div className="absolute inset-0 border-2 border-dotted border-cyan-400/30 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none" />
            </div>
 
            {/* Level Badge in Neo-Tokyo Cyber styling */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-cyan-600 text-white font-mono text-[10px] uppercase font-black px-3 py-1 rounded-md border-2 border-zinc-950 shadow-[0_4px_12px_rgba(6,182,212,0.4)] tracking-widest whitespace-nowrap">
              LVL {GAMER_PROFILE.level} // SS9
            </div>
          </div>
 
          {/* Core system state indicator */}
          <div className="mt-5 flex items-center gap-2 bg-cyan-950/30 border border-cyan-500/40 px-3 py-1.5 rounded-full font-mono text-[10px] text-cyan-400 tracking-wider">
            <span className={`w-2 h-2 rounded-full ${pulse ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-cyan-950'} transition-all duration-300`} />
            <span>LINK-STATE: <strong className="text-cyan-300">{GAMER_PROFILE.coreStatus}</strong></span>
          </div>
        </div>
 
        {/* Center Segment: Core Stats Terminal */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div className="text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <h1 id="gamer-username" className="text-4xl md:text-5xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-50 via-slate-200 to-cyan-400 animate-pulse uppercase">
                  {GAMER_PROFILE.primaryUsername}
                </h1>
                <span className="bg-gradient-to-r from-cyan-950/80 to-slate-950/85 text-cyan-400 border border-cyan-805 border-cyan-800 font-mono text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest shadow-md">
                  GLOBAL RANK {GAMER_PROFILE.globalRank}
                </span>
              </div>
              <p id="gamer-title" className="text-xs font-mono mt-1.5 text-slate-400 uppercase tracking-[0.25em] flex items-center justify-center lg:justify-start gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span>{GAMER_PROFILE.title}</span>
              </p>
            </div>
 
            {/* Simulated Live Diagnostic HUD clock */}
            <div className="bg-[#05060e]/90 border border-zinc-800 rounded-lg p-3 font-mono text-right max-lg:text-center shrink-0 min-w-[200px]">
              <div className="text-[9px] text-slate-450 text-slate-400 uppercase tracking-widest flex items-center gap-1 justify-end max-lg:justify-center">
                <Radio className="w-3 h-3 text-orange-500 animate-pulse" />
                COGNITIVE NETWORK UPTIME: <strong className="text-emerald-400 ml-auto">{GAMER_PROFILE.uptime}</strong>
              </div>
              <div id="hud-terminal-clock" className="text-xs text-cyan-400 font-bold tracking-wider mt-1 select-none">
                {timestamp ? timestamp : '2026-06-02 20:47:03 UTC'}
              </div>
            </div>
          </div>
 
          {/* Account matrix linking section */}
          <div className="mt-5">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 justify-center lg:justify-start">
              <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
              INTEGRATED FEDERATED SYSTEM IDENTITIES
            </h4>
 
            {/* Beautiful responsive badges listing exact target usernames of the user */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GAMES_DATA.map((game, key) => {
                const accConfig = {
                  'coc': { user: 'Renga', label: 'Clash of Clans', status: 'tamilanda', color: 'border-orange-500/30 text-orange-400 bg-orange-950/25 hover:bg-orange-950/45' },
                  'bgmi': { user: 'Clown Ghost', label: 'BGMI Mobile', status: '3.1 F/D', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/25 hover:bg-cyan-950/45' },
                  'pogo': { user: 'Rengaprasath', label: 'Pokémon GO', status: 'Mystic ❄️', color: 'border-yellow-500/30 text-yellow-400 bg-yellow-950/25 hover:bg-yellow-950/45' },
                  'chess': { user: 'Renga', label: 'Chess.com', status: '200 Rating', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/25 hover:bg-emerald-950/45' }
                }[game.id];
 
                return (
                  <div 
                    key={key} 
                    className={`border p-3 rounded-xl transition duration-300 hover:scale-[1.02] flex flex-col justify-between ${accConfig.color}`}
                  >
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-mono opacity-80 gap-2">
                      <span className="truncate">{accConfig.label}</span>
                      <div className="w-6 h-6 flex items-center justify-center shrink-0 select-none">
                        <span className="text-sm">{game.icon}</span>
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
