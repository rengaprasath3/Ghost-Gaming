/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GAMES_DATA, GAMER_PROFILE } from './data';
import GamerHeader from './components/GamerHeader';
import GameCard from './components/GameCard';
import { GameID } from './types';
import { 
  Gamepad2, 
  Activity, 
  RefreshCw, 
  Volume2, 
  ShieldAlert, 
  Cpu, 
  Radio, 
  Sliders, 
  Check, 
  Terminal, 
  Zap, 
  Eye,
  Settings,
  FlameKindling
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeGameId, setActiveGameId] = useState<GameID>('coc');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTerminalLogs, setActiveTerminalLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'diagnostics'>('profile');
  const [fps, setFps] = useState<number>(120);

  // Fluctuating FPS simulation ticker
  useEffect(() => {
    const fpsInterval = setInterval(() => {
      setFps(Math.floor(118 + Math.random() * 4));
    }, 450);

    const logTimer = setInterval(() => {
      const logs = [
        "SYS_GRID: Stabilized dynamic asset loading sequence...",
        "NET_TELEMETRY: Packets linking verified with Sector-India servers.",
        "HOLOGRAPH_CORE: 120 FPS rendering is running at optimal peak.",
        "SYS_SECURITY: Identity logs matching profile usernames.",
        "STATE_ENGINE: Awaiting touch combat effects coordinates..."
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setActiveTerminalLogs(prev => [randomLog, ...prev.slice(0, 5)]);
    }, 4000);

    return () => {
      clearInterval(fpsInterval);
      clearInterval(logTimer);
    };
  }, []);

  const activeGame = GAMES_DATA.find(g => g.id === activeGameId) || GAMES_DATA[0];

  const handleResetAll = () => {
    setActiveGameId('coc');
    setActiveTerminalLogs([
      "CORE_LINK: Reset sequence verified by terminal user Renga.",
      "SYS: Restored primary TownHall 18 state matrices..."
    ]);
  };

  // Sound spectrum configurations
  const activeColorTheme = {
    'coc': {
      text: 'text-orange-500',
      borderGlow: 'border-orange-500/30 shadow-[0_0_20px_rgba(255,114,0,0.2)]',
      label: 'COC // RETRIEVED: Renga',
      colorCode: '#ff7200',
      soundFrequency: [12, 18, 25, 42, 60, 48, 30, 20, 36, 12, 38, 55, 40, 18, 5]
    },
    'bgmi': {
      text: 'text-cyan-400',
      borderGlow: 'border-cyan-400/30 shadow-[0_0_20px_rgba(0,240,255,0.2)]',
      label: 'BGMI // RETRIEVED: Clown Ghost',
      colorCode: '#00f0ff',
      soundFrequency: [30, 48, 62, 75, 40, 25, 58, 68, 72, 85, 44, 30, 60, 48, 25]
    },
    'pogo': {
      text: 'text-yellow-400',
      borderGlow: 'border-yellow-400/30 shadow-[0_0_20px_rgba(254,254,0,0.2)]',
      label: 'POGO // RETRIEVED: Rengaprasath',
      colorCode: '#fefe00',
      soundFrequency: [18, 28, 48, 32, 15, 45, 60, 40, 55, 65, 38, 25, 48, 20, 12]
    },
    'chess': {
      text: 'text-emerald-400',
      borderGlow: 'border-emerald-400/30 shadow-[0_0_20px_rgba(0,230,118,0.2)]',
      label: 'CHESS // RETRIEVED: Renga',
      colorCode: '#00e676',
      soundFrequency: [5, 12, 18, 24, 30, 35, 40, 42, 38, 30, 24, 18, 12, 6, 2]
    }
  }[activeGameId];

  // Tactical observer commentary matching active state
  const activeCommentary = {
    'coc': "🔥 Defending Renga's Legend League with elite base configurations in Sector India. Active clan 'tamilanda' is currently initiating strategic Clan War sieges.",
    'bgmi': "🎯 Clown Ghost sniper systems deployed at maximum efficiency. Current battle matches represent a calibrated F/D ratio of 3.1.",
    'pogo': "⚡ Rengaprasath has initiated high-speed mystic raids. Stardust metrics verified at 45.2 Million in local sector.",
    'chess': "♟️ Renga ELO 200 strategy online. Psychological confusion rating stands at 100%. Highly dangerous blunders imminent."
  }[activeGameId];

  return (
    <div className="min-h-screen bg-[#030304] text-white selection:bg-cyan-400 selection:text-black font-sans relative overflow-x-hidden p-4 md:p-8">
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none z-0" />
      <div className="absolute inset-0 scanlines opacity-[0.04] pointer-events-none z-0" />
      
      {/* Dynamic drifting background glows */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Futuristic Fixed Navigation pillars & decorative rails */}
      <div className="fixed left-3 top-1/2 -translate-y-1/2 writing-mode-vertical hidden xl:flex flex-col items-center gap-3.5 font-mono text-[9px] text-zinc-500 uppercase tracking-[0.35em] pointer-events-none select-none z-30">
        <Cpu className="w-3.5 h-3.5 text-cyan-500" />
        <span>NEO COCKPIT PORTFOLIO // VER 2.4</span>
        <span className="w-[1.5px] h-24 bg-gradient-to-b from-cyan-500/40 to-transparent" />
      </div>

      <div className="fixed right-3 top-1/2 -translate-y-1/2 writing-mode-vertical hidden xl:flex flex-col items-center gap-3.5 font-mono text-[9px] text-zinc-500 uppercase tracking-[0.35em] pointer-events-none select-none z-30">
        <span>STABLE EMULATION COMPILED</span>
        <span className="w-[1.5px] h-24 bg-gradient-to-b from-orange-500/40 to-transparent" />
        <Activity className="w-3.5 h-3.5 text-orange-400" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Futuristic Command Header Section */}
        <GamerHeader />

        {/* Dynamic Holographic Audio / Spectrum Equalizer Panel */}
        <div 
          id="holographic-tactical-hud"
          className={`relative border-2 rounded-2xl p-5 mb-8 transition-all duration-500 bg-black/90 p-6 backdrop-blur-xl flex flex-col xl:flex-row justify-between gap-6 overflow-hidden ${activeColorTheme.borderGlow}`}
        >
          {/* Active grid highlight backdrop */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-[50px] pointer-events-none" />

          {/* Left panel: Live Signal Metrics */}
          <div className="flex flex-col md:flex-row sm:items-center gap-6 flex-1 min-w-0">
            {/* Live pulsing signal point */}
            <div className="relative shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 border border-white/10 select-none">
              <span className={`absolute w-3 h-3 rounded-full ${activeGameId === 'coc' ? 'bg-orange-500 shadow-[0_0_12px_#ff7200]' : activeGameId === 'bgmi' ? 'bg-cyan-400 shadow-[0_0_12px_#00f0ff]' : activeGameId === 'pogo' ? 'bg-yellow-400 shadow-[0_0_12px_#fefe00]' : 'bg-emerald-400 shadow-[0_0_12px_#00e676]'} animate-pulse`} />
              <Activity className="w-6 h-6 text-zinc-400 animate-pulse" />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block flex items-center gap-1">
                <Radio className="w-3 h-3 text-orange-500 shrink-0" />
                SYSTEM FREQUENCY INTERPRETATION MATRIX
              </span>
              
              <h2 className="font-display font-black tracking-tight text-lg md:text-xl text-white mt-1 uppercase flex flex-wrap items-center gap-2">
                ACTIVE COCKPIT NODE: <strong className={activeColorTheme.text}>{activeGame.title}</strong>
                <span className="text-zinc-500 font-mono text-xs font-normal">[{activeColorTheme.label}]</span>
              </h2>
            </div>
          </div>

          {/* Center Graphic Spectrum Equalizer Bars */}
          <div className="flex items-end justify-center gap-1.5 h-14 px-4 bg-zinc-950/60 border border-white/5 rounded-xl min-w-[220px] self-center py-2 relative overflow-hidden select-none">
            <span className="absolute top-1.5 left-2 px-1 text-[8px] font-mono text-zinc-500 tracking-wider">SPECTRUM WAVE</span>
            {activeColorTheme.soundFrequency.map((maxH, idx) => (
              <motion.div
                key={idx}
                animate={{
                  height: soundEnabled 
                    ? [`${maxH * 0.25}%`, `${maxH}%`, `${maxH * 0.4}%`, `${maxH}%`] 
                    : "10%"
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + (idx % 4) * 0.15,
                  ease: "easeInOut"
                }}
                className="w-1.5 rounded-t"
                style={{
                  backgroundColor: activeColorTheme.colorCode,
                  opacity: 0.35 + (idx / 25)
                }}
              />
            ))}
          </div>

          {/* Right Controller Panel: interactive system dials */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-center">
            {/* Audio Toggle */}
            <button
              id="synthesizer-mute-button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 font-mono text-xs border rounded-xl px-4 py-2 transition-all duration-300 ${
                soundEnabled 
                  ? 'bg-zinc-900 border-cyan-400/40 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                  : 'bg-transparent border-white/5 text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>FX EQUALIZER: {soundEnabled ? 'HUD ON' : 'MUTED'}</span>
            </button>

            {/* Core reset selector */}
            <button 
              id="console-hard-reboot"
              onClick={handleResetAll}
              className="flex items-center gap-2 font-mono text-xs border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-950/20 transition-all duration-300 rounded-xl px-4 py-2 text-zinc-300"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span>REBOOT MATRIX</span>
            </button>
          </div>
        </div>

        {/* Console Hub Main Split Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Main Games Portfolio Cards (occupies 8 columns on desktop) */}
          <div id="games-grid-wrapper" className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-display font-extrabold tracking-wider text-sm md:text-base flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                <span>GAMES DIRECTORY & PROFILE PORTAL</span>
              </h3>
              <span className="font-mono text-[10px] text-zinc-500">
                TOTAL INTEGRATIONS: 4 // OPERATOR STATE: OK
              </span>
            </div>

            <div id="games-display-grid" className="grid grid-cols-1 gap-6">
              {GAMES_DATA.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  isActive={activeGameId === game.id}
                  onSelect={() => {
                    setActiveGameId(game.id);
                    // Append diagnostic log of active node shift
                    setActiveTerminalLogs(prev => [
                      `SIGNAL: Connected to ${game.title} database dynamically.`,
                      ...prev
                    ]);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Holographic Control & Log Terminal Column (occupies 4 columns) */}
          <div id="control-terminal-pillar" className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8">
            
            {/* Live Performance System Diagnostics Tracker */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />
              <div className="absolute top-0 left-0 w-3 h-[3px] bg-cyan-400" />
              <div className="absolute top-0 left-0 w-[3px] h-3 bg-cyan-400" />
              
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-4 pb-2 border-b border-white/5 flex items-center justify-between">
                <span>SYSTEM PERFORMANCE</span>
                <Sliders className="w-4 h-4 text-cyan-400 animate-pulse" />
              </h4>

              <div className="space-y-4">
                {/* 120 FPS Metric */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1">
                    <span>DYNAMIC REACTION SPEED</span>
                    <strong className="text-cyan-400 text-xs font-black">{fps} FPS</strong>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${(fps / 122) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Account Linked Ratio */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1">
                    <span>ACCOUNT LINKAGE PROGRESS</span>
                    <strong className="text-emerald-400 text-xs font-black">4 / 4 STABLE</strong>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-full" />
                  </div>
                </div>

                {/* India Regional Nodes ping */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs font-mono">
                  <div className="bg-[#0c0d12] border border-white/5 p-2 rounded-lg">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">SECTOR PING</span>
                    <span className="text-white font-bold block mt-0.5">8ms</span>
                  </div>
                  <div className="bg-[#0c0d12] border border-white/5 p-2 rounded-lg">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">PACKET LOSS</span>
                    <span className="text-emerald-400 font-bold block mt-0.5">0.00%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tactical Commentary HUD Observation Log */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-[3px] bg-orange-400" />
              <div className="absolute top-0 left-0 w-[3px] h-3 bg-orange-400" />

              <h4 className="font-display font-black text-xs uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-3 pb-2 border-b border-white/5 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-400" />
                <span>TACTICAL CONSOLE NOTES</span>
              </h4>

              <div className="bg-black/80 border border-white/5 rounded-xl p-4 font-mono text-xs">
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[9px] px-2 py-0.5 rounded tracking-widest uppercase font-bold block w-fit mb-3">
                  AUDIO LOG ANALYZER
                </span>
                <p className="text-zinc-300 leading-relaxed font-sans mt-1 text-xs select-none">
                  &quot;{activeCommentary}&quot;
                </p>
              </div>
            </div>

            {/* Holographic Diagnostic Stream Logs */}
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-[3px] bg-yellow-400" />
              <div className="absolute top-0 left-0 w-[3px] h-3 bg-yellow-400" />

              <h4 className="font-display font-black text-xs uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-3 pb-2 border-b border-white/5 flex items-center justify-between">
                <span>TERMINAL SYSTEMS FEED</span>
                <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
              </h4>

              <div className="bg-zinc-950/90 border border-white/5 p-4 rounded-xl font-mono text-[10px] space-y-2 h-[150px] overflow-y-auto">
                {activeTerminalLogs.length === 0 ? (
                  <div className="text-zinc-600 italic">No system signal logs recorded yet...</div>
                ) : (
                  activeTerminalLogs.map((log, lIdx) => (
                    <div key={lIdx} className="text-zinc-300 border-l-2 border-cyan-500/30 pl-2 leading-normal">
                      <span className="text-zinc-600 mr-1">[{new Date().toLocaleTimeString().substring(0, 8)}]</span>
                      {log}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 flex justify-between items-center text-[9px] font-mono text-zinc-500 px-1">
                <span>FEED: CH_1 // SECURE</span>
                <span className="animate-pulse">● RECORDING_STREAM</span>
              </div>
            </div>

          </div>

        </div>

        {/* Special Warning alert for Chess ELO 200 rating */}
        <AnimatePresence>
          {activeGameId === 'chess' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              id="chess-easter-egg-alert"
              className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl p-5 mb-8 flex items-start gap-4 shadow-[0_0_20px_rgba(0,230,118,0.1)] relative overflow-hidden"
            >
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-400/5 rounded-full blur-[40px] pointer-events-none" />
              <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs font-mono text-emerald-300 leading-relaxed">
                <strong className="text-white text-sm block mb-1">COGNITIVE GRANDMASTER REPORT:</strong>
                User profile <strong className="text-white font-bold">Renga</strong> rating verified at <strong className="text-emerald-400 font-bold">200 ELO</strong>. 
                Diagnostic analysis indicates highly complex early Queen maneuvers that completely disregard standard chess openings. 
                Use caution during checkmate coordinates mapping.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimalist tactical footer */}
        <footer id="app-footer" className="mt-20 mb-8 border-t border-white/5 pt-8 text-center select-none">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.35em]">
            NEO SYSTEM COCKPIT CONFIG PORTFOLIO &copy; {new Date().getFullYear()} // CHANNELS STABLE OVER INTEL GROUND PING
          </p>
        </footer>

      </div>
    </div>
  );
}
