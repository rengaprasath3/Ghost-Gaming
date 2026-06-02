/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { GAMES_DATA, GAMER_PROFILE } from './data';
import GamerHeader from './components/GamerHeader';
import GameCard from './components/GameCard';
import GamerRobot from './components/GamerRobot';
import MatrixReboot from './components/MatrixReboot';
import { GameID } from './types';
import { playSound } from './audio';
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
  const [isRebooting, setIsRebooting] = useState<boolean>(false);

  // Auto-focused game node detection based on viewport scroll geometry
  const isScrollingLockedRef = useRef(false);
  const activeGameIdRef = useRef<GameID>('coc');

  useEffect(() => {
    activeGameIdRef.current = activeGameId;
  }, [activeGameId]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      
      window.requestAnimationFrame(() => {
        ticking = false;
        
        // Prevent layout transitions (from card clicks) from overriding explicitly selected nodes
        if (isScrollingLockedRef.current) return;

        const gameIds: GameID[] = ['coc', 'bgmi', 'pogo', 'chess'];
        const viewportCenterY = window.innerHeight / 2;

        let closestGameId: GameID | null = null;
        let minDistance = Infinity;

        gameIds.forEach(id => {
          const el = document.getElementById(`game-card-${id}`);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Calculate center point of the card relative to viewport bounds
            const cardCenterY = rect.top + rect.height / 2;
            const distance = Math.abs(cardCenterY - viewportCenterY);
            if (distance < minDistance) {
              minDistance = distance;
              closestGameId = id;
            }
          }
        });

        if (closestGameId && closestGameId !== activeGameIdRef.current) {
          setActiveGameId(closestGameId);
          setActiveTerminalLogs(prev => [
            `SCROLL_AUTO: Auto-opened cockpit focus on [${closestGameId!.toUpperCase()}] database.`,
            ...prev
          ]);
        }
      });
      
      ticking = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Floating robot flight states
  const [robotStatus, setRobotStatus] = useState<'idle' | 'charging' | 'flying' | 'targeting' | 'firing' | 'returning'>('idle');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [destPos, setDestPos] = useState({ x: 0, y: 0 });
  const [activeAttackGameId, setActiveAttackGameId] = useState<GameID | null>(null);
  const [laserBeams, setLaserBeams] = useState<{ id: number; x1: number; y1: number; x2: number; y2: number }[]>([]);

  // Orchestrator method for combat drone flight
  const initiateRobotAssault = () => {
    if (robotStatus !== 'idle') return;

    const avatarEl = document.getElementById('gamer-robot-avatar');
    if (!avatarEl) {
      setActiveTerminalLogs(prev => [
        `ERROR: Clown summoning failed. Base coordinates obscured or files corrupted.`,
        ...prev
      ]);
      return;
    }

    const avatarRect = avatarEl.getBoundingClientRect();
    const startX = avatarRect.left + avatarRect.width / 2;
    const startY = avatarRect.top + avatarRect.height / 2;

    setStartPos({ x: startX, y: startY });
    setRobotStatus('charging');

    setActiveTerminalLogs(prev => [
      `SYS_WAR: [CLOWN ACTIVATED] - Manic mascot pre-heating plasma engine and grinning...`,
      ...prev
    ]);

    const gameIds: GameID[] = ['coc', 'bgmi', 'pogo', 'chess'];

    // Timed recursive path flow over every card
    const runAttackSequence = (index: number) => {
      if (index >= gameIds.length) {
        // Complete sweep! Clown returns home
        setRobotStatus('returning');
        setActiveAttackGameId(null);
        setLaserBeams([]);
        setActiveTerminalLogs(prev => [
          `COMPLETED: All sectors cleared! Clown madness concluded. Returning to base database.`,
          ...prev
        ]);

        // Flight home transition duration
        setTimeout(() => {
          setRobotStatus('idle');
          setActiveTerminalLogs(prev => [
            `SYS_LINK: Clown docked as baseline emblem. Relink stability: OK.`,
            ...prev
          ]);
        }, 1100);
        return;
      }

      const targetId = gameIds[index];
      const targetEl = document.getElementById(`game-card-${targetId}`);
      if (!targetEl) {
        // Skip card if not rendered
        runAttackSequence(index + 1);
        return;
      }

      // Smoothly scroll the card element to center so player can watch the assault
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setRobotStatus('flying');
      setActiveAttackGameId(null);
      setLaserBeams([]);

      // Continuously fetch and update coordinates dynamically during flight
      const updateDestPosition = () => {
        const freshEl = document.getElementById(`game-card-${targetId}`);
        if (freshEl) {
          const rect = freshEl.getBoundingClientRect();
          setDestPos({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          });
        }
      };

      updateDestPosition();

      setActiveTerminalLogs(prev => [
        `COMMAND: Clown flying down coordinates! Trajectory lock set on Grid Sector: [${targetId.toUpperCase()}]`,
        ...prev
      ]);

      // Flight time to travel (900ms)
      setTimeout(() => {
        setRobotStatus('targeting');
        updateDestPosition();
        setActiveTerminalLogs(prev => [
          `TELEMETRY: Clown hovering. Plasma strike lock-status: LOCKED. Target grid: ${targetId.toUpperCase()}`,
          ...prev
        ]);

        // Spend 500ms for lock flare effect, then open jaws and breathe fire!
        setTimeout(() => {
          setRobotStatus('firing');
          setActiveAttackGameId(targetId);
          updateDestPosition();
          playSound('fire');
          setActiveTerminalLogs(prev => [
            `FIREPOWER: 🤡 Clown unleashing manic plasma energy onto Sector ${targetId.toUpperCase()}! Base databases under severe fire!`,
            ...prev
          ]);

          let wavesFired = 0;
          const totalWaves = 6;
          const fireInterval = setInterval(() => {
            if (wavesFired >= totalWaves) {
              clearInterval(fireInterval);
              setLaserBeams([]);
              
              // Proceed sweep to next waypoints after brief exhaust cooling
              setTimeout(() => {
                runAttackSequence(index + 1);
              }, 250);
              return;
            }

            const freshEl = document.getElementById(`game-card-${targetId}`);
            if (freshEl) {
              const rect = freshEl.getBoundingClientRect();
              const endX = rect.left + rect.width / 2;
              const endY = rect.top + rect.height / 2;
              const currentRobotY = endY - 80;

              // Scatter flames across the card size
              const targetXVar = endX - 120 + Math.random() * 240;
              const targetYVar = endY - 70 + Math.random() * 140;

              setLaserBeams([
                {
                  id: Math.random(),
                  x1: endX,
                  y1: currentRobotY + 32, // Position coordinate corresponds to mouth opening of Clown
                  x2: targetXVar,
                  y2: targetYVar
                },
                {
                  id: Math.random(),
                  x1: endX + (Math.random() - 0.5) * 8,
                  y1: currentRobotY + 32,
                  x2: targetXVar - 40 + Math.random() * 80,
                  y2: targetYVar - 45 + Math.random() * 90
                }
              ]);

              // Dispatch explosive laser-hit event
              window.dispatchEvent(new CustomEvent('robot-laser-hit', { detail: { targetId } }));
            }

            wavesFired++;
          }, 180);

        }, 500);

      }, 900);
    };

    // Charge power at base coordinates for 1200ms before soaring out
    setTimeout(() => {
      runAttackSequence(0);
    }, 1200);
  };

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
    setIsRebooting(true);
    playSound('reboot');
  };

  const handleRebootComplete = () => {
    setIsRebooting(false);
    setActiveGameId('coc');
    setActiveTerminalLogs([
      "CORE_LINK: Reset sequence verified by terminal user Renga.",
      "SYS: Restored primary TownHall 18 state matrices...",
      "MATRIX: Dynamic IST timeline resynchronized successfully!"
    ]);
  };

  // Sound spectrum configurations
  const activeColorTheme = {
    'coc': {
      text: 'text-red-400',
      borderGlow: 'border-red-650/35 bg-[#0e0607]/90 shadow-[0_12px_45px_rgba(239,68,68,0.18)]',
      label: 'COC // RETRIEVED: Renga',
      colorCode: '#ef4444',
      soundFrequency: [12, 18, 25, 42, 60, 48, 30, 20, 36, 12, 38, 55, 40, 18, 5]
    },
    'bgmi': {
      text: 'text-red-500',
      borderGlow: 'border-red-700/35 bg-[#0e0607]/90 shadow-[0_12px_45px_rgba(190,18,60,0.18)]',
      label: 'BGMI // RETRIEVED: Clown Ghost',
      colorCode: '#be123c',
      soundFrequency: [30, 48, 62, 75, 40, 25, 58, 68, 72, 85, 44, 30, 60, 48, 25]
    },
    'pogo': {
      text: 'text-amber-550 text-amber-500',
      borderGlow: 'border-amber-600/35 bg-[#0e0607]/90 shadow-[0_12px_45px_rgba(217,119,6,0.18)]',
      label: 'POGO // RETRIEVED: Rengaprasath',
      colorCode: '#d97706',
      soundFrequency: [18, 28, 48, 32, 15, 45, 60, 40, 55, 65, 38, 25, 48, 20, 12]
    },
    'chess': {
      text: 'text-red-500',
      borderGlow: 'border-red-800/35 bg-[#0e0607]/90 shadow-[0_12px_45px_rgba(153,27,27,0.18)]',
      label: 'CHESS // RETRIEVED: Renga',
      colorCode: '#991b1b',
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
    <div className="min-h-screen bg-cyber-bg text-slate-100 selection:bg-red-600 selection:text-white font-sans relative overflow-x-hidden p-4 md:p-8">
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 cyber-grid opacity-65 pointer-events-none z-0" />
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none z-0" />
      
      {/* Dynamic drifting background glows */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-red-600/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#3e0809]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Futuristic Fixed Navigation pillars & decorative rails */}
      <div className="fixed left-3 top-1/2 -translate-y-1/2 writing-mode-vertical hidden xl:flex flex-col items-center gap-3.5 font-mono text-[9px] text-red-500 uppercase tracking-[0.35em] pointer-events-none select-none z-30">
        <Cpu className="w-3.5 h-3.5 text-red-500" />
        <span>ANCIENT COCKPIT PORTFOLIO // SS9</span>
        <span className="w-[1.5px] h-24 bg-gradient-to-b from-red-650/40 to-transparent" />
      </div>

      <div className="fixed right-3 top-1/2 -translate-y-1/2 writing-mode-vertical hidden xl:flex flex-col items-center gap-3.5 font-mono text-[9px] text-red-500 uppercase tracking-[0.35em] pointer-events-none select-none z-30">
        <span>STABLE EMULATION COMPILED</span>
        <span className="w-[1.5px] h-24 bg-gradient-to-b from-red-650/40 to-transparent" />
        <Activity className="w-3.5 h-3.5 text-red-500" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Futuristic Command Header Section */}
        <GamerHeader 
          onRobotAttack={initiateRobotAssault} 
          robotStatus={robotStatus} 
          gameColorTheme={activeColorTheme.colorCode}
        />

        {/* Dynamic Holographic Audio / Spectrum Equalizer Panel */}
        <div 
          id="holographic-tactical-hud"
          className={`relative border-2 rounded-2xl transition-all duration-500 p-5 md:p-6 backdrop-blur-xl flex flex-col xl:flex-row justify-between gap-6 overflow-hidden ${activeColorTheme.borderGlow}`}
        >
          {/* Active grid highlight backdrop */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[50px] pointer-events-none" />

          {/* Left panel: Live Signal Metrics */}
          <div className="flex flex-col md:flex-row sm:items-center gap-6 flex-1 min-w-0">
            {/* Live pulsing signal point */}
            <div className="relative shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-[#0b0e1a] border border-slate-800 select-none">
              <span className={`absolute w-3 h-3 rounded-full ${activeGameId === 'coc' ? 'bg-orange-500 shadow-[0_0_12px_#ea580c]' : activeGameId === 'bgmi' ? 'bg-cyan-500 shadow-[0_0_12px_#06b6d4]' : activeGameId === 'pogo' ? 'bg-yellow-500 shadow-[0_0_12px_#eab308]' : 'bg-emerald-500 shadow-[0_0_12px_#10b981]'} animate-pulse`} />
              <Activity className="w-6 h-6 text-slate-500 animate-pulse" />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block flex items-center gap-1 font-bold">
                <Radio className="w-3 h-3 text-orange-500 shrink-0 animate-pulse" />
                SYSTEM FREQUENCY INTERPRETATION MATRIX
              </span>
              
              <h2 className="font-display font-black tracking-tight text-lg md:text-xl text-slate-100 mt-1 uppercase flex flex-wrap items-center gap-2">
                ACTIVE COCKPIT NODE: <strong className={activeColorTheme.text}>{activeGame.title}</strong>
                <span className="text-slate-400 font-mono text-xs font-normal">[{activeColorTheme.label}]</span>
              </h2>
            </div>
          </div>

          {/* Center Graphic Spectrum Equalizer Bars */}
          <div className="flex items-end justify-center gap-1.5 h-14 px-4 bg-[#080b13]/90 border border-slate-800/80 rounded-xl min-w-[220px] self-center py-2 relative overflow-hidden select-none">
            <span className="absolute top-1.5 left-2 px-1 text-[8px] font-mono text-slate-400 tracking-wider font-bold">SPECTRUM WAVE</span>
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
                  opacity: 0.5 + (idx / 30)
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
                  ? 'bg-slate-900 border-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                  : 'bg-[#12090a]/80 border-red-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-4 h-4 text-red-500" />
              <span>FX EQUALIZER: {soundEnabled ? 'HUD ON' : 'MUTED'}</span>
            </button>

            {/* Core reset selector */}
            <button 
              id="console-hard-reboot"
              onClick={handleResetAll}
              className="flex items-center gap-2 font-mono text-xs border border-red-950 bg-[#12090a]/80 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 rounded-xl px-4 py-2 text-slate-300"
            >
              <RefreshCw className="w-4 h-4 text-red-500 animate-spin-slow" />
              <span>REBOOT MATRIX</span>
            </button>
          </div>
        </div>

        {/* Console Hub Main Split Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Main Games Portfolio Cards (occupies 8 columns on desktop) */}
          <div id="games-grid-wrapper" className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-red-950/80 pb-3">
              <h3 className="font-display font-extrabold tracking-wider text-sm md:text-base flex items-center gap-2 text-white">
                <Gamepad2 className="w-5 h-5 text-red-600 animate-pulse" />
                <span className="old-age-title text-sm md:text-base">GAMES DIRECTORY & PROFILE PORTAL</span>
              </h3>
              <span className="font-mono text-[10px] text-slate-400">
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
                    isScrollingLockedRef.current = true;
                    setActiveGameId(game.id);
                    // Append diagnostic log of active node shift
                    setActiveTerminalLogs(prev => [
                      `SIGNAL: Connected to ${game.title} database dynamically.`,
                      ...prev
                    ]);
                    // Let the accordion expansion animation complete before unlocking auto-scroll focus
                    setTimeout(() => {
                      isScrollingLockedRef.current = false;
                    }, 900);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Holographic Control & Log Terminal Column (occupies 4 columns) */}
          <div id="control-terminal-pillar" className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8">
            
            {/* Live Performance System Diagnostics Tracker */}
            <div className="rounded-2xl border border-white/20 bg-[#12090a]/90 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.15)] relative overflow-hidden hover:border-white/40 transition-colors duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-[40px] pointer-events-none" />
              
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-slate-200 mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
                <span className="old-age-title text-xs">SYSTEM PERFORMANCE</span>
                <Sliders className="w-4 h-4 text-red-500 animate-pulse" />
              </h4>
              <div className="space-y-4">
                {/* 120 FPS Metric */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                    <span>DYNAMIC REACTION SPEED</span>
                    <strong className="text-red-400 text-xs font-black">{fps} FPS</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full transition-all duration-300"
                      style={{ width: `${(fps / 122) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Account Linked Ratio */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                    <span>ACCOUNT LINKAGE PROGRESS</span>
                    <strong className="text-emerald-400 text-xs font-black">4 / 4 STABLE</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-full" />
                  </div>
                </div>

                {/* India Regional Nodes ping */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs font-mono">
                  <div className="bg-[#0b0e1a]/80 border border-white/10 p-2 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block">SECTOR PING</span>
                    <span className="text-slate-100 font-bold block mt-0.5">8ms</span>
                  </div>
                  <div className="bg-[#0b0e1a]/80 border border-white/10 p-2 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block">PACKET LOSS</span>
                    <span className="text-emerald-400 font-bold block mt-0.5">0.00%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Holographic Diagnostic Stream Logs */}
            <div className="rounded-2xl border border-white/20 bg-[#12090a]/90 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.15)] relative overflow-hidden hover:border-white/40 transition-colors duration-300">
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-slate-200 mb-3 pb-2 border-b border-white/10 flex items-center justify-between">
                <span className="old-age-title text-xs">TERMINAL SYSTEMS FEED</span>
                <Activity className="w-4 h-4 text-red-500 animate-pulse" />
              </h4>

              <div className="bg-[#0c0505] border border-white/10 p-4 rounded-xl font-mono text-[10px] space-y-2 h-[150px] overflow-y-auto shadow-inner">
                {activeTerminalLogs.length === 0 ? (
                  <div className="text-slate-500 italic">No system signal logs recorded yet...</div>
                ) : (
                  activeTerminalLogs.map((log, lIdx) => (
                    <div key={lIdx} className="text-slate-300 border-l-2 border-red-500/40 pl-2 leading-normal">
                      <span className="text-red-700/60 mr-1">[{new Date().toLocaleTimeString().substring(0, 8)}]</span>
                      {log}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 flex justify-between items-center text-[9px] font-mono text-slate-400 px-1 font-bold">
                <span>FEED: CH_1 // SECURE</span>
                <span className="text-slate-500 animate-pulse">● RECORDING_STREAM</span>
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
              className="rounded-2xl border border-emerald-500/25 bg-emerald-950/40 backdrop-blur-xl p-5 mb-8 flex items-start gap-4 shadow-[0_4px_20px_rgba(16,185,129,0.15)] relative overflow-hidden"
            >
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
              <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
              <div className="text-xs font-mono text-emerald-300 leading-relaxed">
                <strong className="text-white text-sm block mb-1 font-bold">COGNITIVE GRANDMASTER REPORT:</strong>
                User profile <strong className="text-white font-bold">Renga</strong> rating verified at <strong className="text-emerald-400 font-bold">200 ELO</strong>. 
                Diagnostic analysis indicates highly complex early Queen maneuvers that completely disregard standard chess openings. 
                Use caution during checkmate coordinates mapping.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blazing Flame Breathing SVGs drawn absolutely across the entire viewport during firing */}
        {robotStatus === 'firing' && (
          <svg className="fixed inset-0 w-full h-full pointer-events-none z-50">
            <defs>
              <linearGradient id="flame-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" /> {/* Pure hot yellow */}
                <stop offset="45%" stopColor="#f97316" /> {/* Molten Orange */}
                <stop offset="100%" stopColor="#dc2626" /> {/* Scorched Red */}
              </linearGradient>
            </defs>
            {laserBeams.map(laser => {
              // Create wavy coordinate shifts for an organic breathing fire effect
              const midX = (laser.x1 + laser.x2) / 2 + Math.sin(laser.id * 12) * 18;
              const midY = (laser.y1 + laser.y2) / 2 + Math.cos(laser.id * 12) * 18;

              return (
                <g key={laser.id}>
                  {/* Broad thermal heatwave aura */}
                  <path 
                    d={`M ${laser.x1} ${laser.y1} Q ${midX} ${midY} ${laser.x2} ${laser.y2}`}
                    fill="none"
                    stroke="#dc2626" 
                    strokeWidth="28" 
                    strokeLinecap="round" 
                    opacity="0.32"
                    className="blur-md"
                  />
                  {/* Thick primary flame path */}
                  <path 
                    d={`M ${laser.x1} ${laser.y1} Q ${midX} ${midY} ${laser.x2} ${laser.y2}`}
                    fill="none"
                    stroke="#ea580c" 
                    strokeWidth="14" 
                    strokeLinecap="round" 
                    opacity="0.8"
                    className="blur-sm"
                  />
                  {/* Glowing hot composite core plasma */}
                  <path 
                    d={`M ${laser.x1} ${laser.y1} Q ${midX} ${midY} ${laser.x2} ${laser.y2}`}
                    fill="none"
                    stroke="url(#flame-grad)" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    opacity="0.95"
                  />
                  {/* Blending core intensity beam */}
                  <path 
                    d={`M ${laser.x1} ${laser.y1} Q ${midX} ${midY} ${laser.x2} ${laser.y2}`}
                    fill="none"
                    stroke="#fffbeb" 
                    strokeWidth="2.2" 
                    strokeLinecap="round" 
                  />

                  {/* Explosive impact shockwave rings on the target card */}
                  <circle cx={laser.x2} cy={laser.y2} r="25" fill="none" stroke="#f97316" strokeWidth="2.5" className="animate-ping" opacity="0.5" />
                  <circle cx={laser.x2} cy={laser.y2} r="12" fill="#ef4444" opacity="0.8" className="animate-pulse" />
                  <circle cx={laser.x2 + Math.sin(laser.id * 4) * 22} cy={laser.y2 - 12} r="2" fill="#fbbf24" className="animate-bounce" />
                  <circle cx={laser.x2 - Math.cos(laser.id * 4) * 22} cy={laser.y2 - 25} r="1.5" fill="#f97316" className="animate-ping" />
                </g>
              );
            })}
          </svg>
        )}

        {/* Floating Tactical Evil Clown mascot in viewport flight */}
        <AnimatePresence>
          {robotStatus !== 'idle' && (
            <motion.div
              id="flying-combat-drone"
              initial={{ x: startPos.x, y: startPos.y, scale: 0.2, opacity: 0 }}
              animate={
                robotStatus === 'charging' ? {
                  x: startPos.x,
                  y: startPos.y,
                  scale: 0.9,
                  opacity: 0.95,
                  rotate: 0
                } : robotStatus === 'flying' ? {
                  x: destPos.x,
                  y: destPos.y - 80,
                  scale: 1.35,
                  opacity: 1,
                  rotate: 15
                } : robotStatus === 'targeting' ? {
                  x: destPos.x,
                  y: destPos.y - 80,
                  scale: 1.4,
                  opacity: 1,
                  rotate: 0
                } : robotStatus === 'firing' ? {
                  x: destPos.x,
                  y: destPos.y - 80,
                  scale: 1.45,
                  opacity: 1,
                  rotate: 0
                } : robotStatus === 'returning' ? {
                  x: startPos.x,
                  y: startPos.y,
                  scale: 0.3,
                  opacity: 0.15,
                  rotate: -25
                } : { x: startPos.x, y: startPos.y }
              }
              exit={{ scale: 0.1, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: robotStatus === 'flying' || robotStatus === 'returning' ? 120 : 180,
                damping: robotStatus === 'flying' || robotStatus === 'returning' ? 14 : 18,
                mass: 0.9
              }}
              className="fixed w-20 h-20 -ml-10 -mt-10 pointer-events-none z-50 flex items-center justify-center"
            >
              <div className={`w-[90%] h-[90%] ${
                robotStatus === 'charging' ? 'animate-shake-tight' :
                robotStatus === 'firing' ? 'animate-shake-strong' : ''
              }`}>
                <GamerRobot 
                  status={robotStatus} 
                  isHeaderAvatar={false} 
                  gameColorTheme={activeAttackGameId ? '#f97316' : activeColorTheme.colorCode} 
                />
              </div>

              {/* Holographic HUD reticle projected beneath when locked */}
              {(robotStatus === 'targeting' || robotStatus === 'firing') && (
                <div className="absolute top-full mt-3 flex flex-col items-center">
                  <motion.div 
                    animate={{ scale: [1, 1.25, 1], rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                    className="w-11 h-11 rounded-full border border-dashed flex items-center justify-center"
                    style={{ borderColor: '#ef4444', boxShadow: `0 0 12px rgba(239, 68, 68, 0.25)` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  </motion.div>
                  <span className="text-[6.5px] font-mono mt-1 px-1.5 py-0.5 bg-black/90 border border-emerald-500/50 rounded text-emerald-400 select-none whitespace-nowrap tracking-widest font-black">
                    🤡 CLOWN CARNAGE // LAUNCHING
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {isRebooting && (
          <MatrixReboot onComplete={handleRebootComplete} />
        )}

        {/* Minimalist tactical footer */}
        <footer id="app-footer" className="mt-20 mb-8 border-t border-slate-800/60 pt-8 text-center select-none">
          <p className="font-mono text-[10px] text-slate-400 uppercase tracking-[0.35em]">
            NEO SYSTEM COCKPIT CONFIG PORTFOLIO &copy; {new Date().getFullYear()} — CHANNELS STABLE OVER INTEL GROUND PING
          </p>
        </footer>

      </div>
    </div>
  );
}
