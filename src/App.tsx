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
  ShieldAlert, 
  Cpu, 
  Sliders, 
  Terminal, 
  FlameKindling
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GameIcon from './components/GameIcon';

export default function App() {
  const [activeGameId, setActiveGameId] = useState<GameID>('coc');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTerminalLogs, setActiveTerminalLogs] = useState<string[]>([
    "CORE_LINK: Initialized secure operator tunnel.",
    "SYS_STAGE: Cockpit displays linked at 120Hz.",
    "IDENTITY: Logged in successfully as operator Renga."
  ]);
  const [fps, setFps] = useState<number>(120);
  const [isRebooting, setIsRebooting] = useState<boolean>(false);

  // References for scroll tracking to prevent choppy UI state feedback-loops
  const activeGameIdRef = useRef<GameID>('coc');
  const isScrollingLockedRef = useRef<boolean>(false);

  useEffect(() => {
    activeGameIdRef.current = activeGameId;
  }, [activeGameId]);

  // Floating robot flight states
  const [robotStatus, setRobotStatus] = useState<'idle' | 'charging' | 'flying' | 'targeting' | 'firing' | 'returning'>('idle');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [destPos, setDestPos] = useState({ x: 0, y: 0 });
  const [activeAttackGameId, setActiveAttackGameId] = useState<GameID | null>(null);
  const [laserBeams, setLaserBeams] = useState<{ id: number; x1: number; y1: number; x2: number; y2: number }[]>([]);

  // Telemetry updates
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let animId: number;

    const calculateFps = () => {
      frameCount++;
      const now = performance.now();
      const elapsed = now - lastTime;

      if (elapsed >= 500) {
        let measuredFps = Math.round((frameCount * 1000) / elapsed);
        if (measuredFps > 120) measuredFps = 120;
        setFps(measuredFps);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calculateFps);
    };

    animId = requestAnimationFrame(calculateFps);

    const logTimer = setInterval(() => {
      const logs = [
        "SYS_GRID: Auto-leveling graphics engine raster...",
        "NET_TELEMETRY: Checked latency bounds: 8ms OK.",
        "HOLOGRAPH_CORE: 120 FPS render baseline locked.",
        "SYS_SECURITY: Cloud connection is active & secure."
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setActiveTerminalLogs(prev => [randomLog, ...prev.slice(0, 15)]);
    }, 8000);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(logTimer);
    };
  }, []);

  // Sync scroll positioning to highlighted segment index
  useEffect(() => {
    const gameIds: GameID[] = ['coc', 'bgmi', 'pogo', 'chess'];
    const ratiosMap: { [key in GameID]?: number } = {};

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -25% 0px", // Focus selection in the middle 50% band
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingLockedRef.current) return;

      entries.forEach(entry => {
        const id = entry.target.id.replace('game-feed-card-', '') as GameID;
        if (gameIds.includes(id)) {
          ratiosMap[id] = entry.intersectionRatio;
        }
      });

      let maxRatio = -1;
      let closestGameId: GameID | null = null;

      gameIds.forEach(id => {
        const ratio = ratiosMap[id] || 0;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          closestGameId = id;
        }
      });

      if (closestGameId && maxRatio > 0.15 && closestGameId !== activeGameIdRef.current) {
        setActiveGameId(closestGameId);
        setActiveTerminalLogs(prev => [
          `TELEMETRY_LINK: Focus switched to Sector Link [${closestGameId!.toUpperCase()}].`,
          ...prev.slice(0, 15)
        ]);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const timer = setTimeout(() => {
      gameIds.forEach(id => {
        const el = document.getElementById(`game-feed-card-${id}`);
        if (el) observer.observe(el);
      });
    }, 250);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const activeGame = GAMES_DATA.find(g => g.id === activeGameId) || GAMES_DATA[0];

  const handleGameSelect = (id: GameID) => {
    setActiveGameId(id);
    playSound(id as any);
    setActiveTerminalLogs(prev => [
      `SIGNAL: Dynamic link focused on Segment [${id.toUpperCase()}].`,
      ...prev.slice(0, 15)
    ]);

    isScrollingLockedRef.current = true;
    const el = document.getElementById(`game-feed-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => {
      isScrollingLockedRef.current = false;
    }, 850);
  };

  const handleResetAll = () => {
    setIsRebooting(true);
    playSound('reboot');
  };

  const handleRebootComplete = () => {
    setIsRebooting(false);
    setActiveGameId('coc');
    setActiveTerminalLogs([
      "CORE_LINK: Reset sequence verified by terminal user Renga.",
      "SYS: Restored dynamic TownHall 18 state matrices...",
      "MATRIX: Dynamic IST timeline resynchronized successfully!"
    ]);
  };

  // Orchestrator method for combat drone flight
  const initiateRobotAssault = () => {
    if (robotStatus !== 'idle') return;

    const avatarEl = document.getElementById('gamer-robot-avatar');
    if (!avatarEl) {
      setActiveTerminalLogs(prev => [
        `ERROR: Clown summoning failed. Base coordinates obscured or files corrupted.`,
        ...prev.slice(0, 15)
      ]);
      return;
    }

    const avatarRect = avatarEl.getBoundingClientRect();
    const startX = avatarRect.left + avatarRect.width / 2;
    const startY = avatarRect.top + avatarRect.height / 2;

    setStartPos({ x: startX, y: startY });
    setRobotStatus('charging');

    setActiveTerminalLogs(prev => [
      `SYS_WAR: [CLOWN ACTIVATION APPROVED] - Companion pre-heating tactical systems...`,
      ...prev.slice(0, 15)
    ]);

    const gameIds: GameID[] = ['coc', 'bgmi', 'pogo', 'chess'];

    const runAttackSequence = (index: number) => {
      if (index >= gameIds.length) {
        setRobotStatus('returning');
        setActiveAttackGameId(null);
        setLaserBeams([]);
        setActiveTerminalLogs(prev => [
          `COMPLETED: All deck links swept! Mascot returning to core base slot.`,
          ...prev.slice(0, 15)
        ]);

        setTimeout(() => {
          setRobotStatus('idle');
          setActiveTerminalLogs(prev => [
            `SYS_LINK: Clown mascot safely re-docked. Relink status: OK.`,
            ...prev.slice(0, 15)
          ]);
        }, 1100);
        return;
      }

      const targetId = gameIds[index];
      const targetEl = document.getElementById(`game-card-${targetId}`);
      if (!targetEl) {
        runAttackSequence(index + 1);
        return;
      }

      setRobotStatus('flying');
      setActiveAttackGameId(null);
      setLaserBeams([]);

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
        `COMMAND: Propelling clown mascot to Sector Deck [${targetId.toUpperCase()}].`,
        ...prev.slice(0, 15)
      ]);

      setTimeout(() => {
        setRobotStatus('targeting');
        updateDestPosition();
        setActiveTerminalLogs(prev => [
          `TELEMETRY: Lock status: LOCKED. Preparing plasma blast on link ${targetId.toUpperCase()}...`,
          ...prev.slice(0, 15)
        ]);

        setTimeout(() => {
          setRobotStatus('firing');
          setActiveAttackGameId(targetId);
          updateDestPosition();
          playSound('fire');
          setActiveTerminalLogs(prev => [
            `FIREPOWER: 🤡 Clown unleashing tactical plasma energy onto [${targetId.toUpperCase()}].`,
            ...prev.slice(0, 15)
          ]);

          let wavesFired = 0;
          const totalWaves = 4;
          const fireInterval = setInterval(() => {
            if (wavesFired >= totalWaves) {
              clearInterval(fireInterval);
              setLaserBeams([]);
              setTimeout(() => {
                runAttackSequence(index + 1);
              }, 150);
              return;
            }

            const freshEl = document.getElementById(`game-card-${targetId}`);
            if (freshEl) {
              const rect = freshEl.getBoundingClientRect();
              const endX = rect.left + rect.width / 2;
              const endY = rect.top + rect.height / 2;
              const currentRobotY = endY - 85;

              const targetXVar = endX - 45 + Math.random() * 90;
              const targetYVar = endY - 25 + Math.random() * 50;

              setLaserBeams([
                {
                  id: Math.random(),
                  x1: endX,
                  y1: currentRobotY + 28,
                  x2: targetXVar,
                  y2: targetYVar
                }
              ]);

              window.dispatchEvent(new CustomEvent('robot-laser-hit', { detail: { targetId } }));
            }

            wavesFired++;
          }, 150);

        }, 450);

      }, 850);
    };

    setTimeout(() => {
      runAttackSequence(0);
    }, 1000);
  };

  const activeColorTheme = {
    'coc': '#ef4444',
    'bgmi': '#be123c',
    'pogo': '#d97706',
    'chess': '#991b1b'
  }[activeGameId];

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 selection:bg-red-600 selection:text-white font-sans relative overflow-x-hidden p-3 sm:p-6 md:p-8">
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 cyber-grid opacity-65 pointer-events-none z-0" />
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none z-0" />
      
      {/* Dynamic drifting background glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#3e0809]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Futuristic Command Header Section */}
        <GamerHeader 
          onRobotAttack={initiateRobotAssault} 
          robotStatus={robotStatus} 
          gameColorTheme={activeColorTheme}
        />

        {/* Global actions control */}
        <div className="flex justify-center sm:justify-end mb-6">
          <button 
            id="console-hard-reboot"
            onClick={handleResetAll}
            className="flex items-center gap-2 font-mono text-xs border border-red-950 bg-[#12090a]/80 hover:border-red-500 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300 rounded-xl px-4 py-2 text-slate-300 shadow-lg"
          >
            <RefreshCw className="w-4 h-4 text-red-500 animate-spin-slow" />
            <span>REBOOT SYSTEM MATRIX</span>
          </button>
        </div>

        {/* Dual-Pane Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* LEFT: Central Display Cockpit */}
          <div id="active-game-viewport" className="lg:col-span-8 flex flex-col gap-6 scroll-mt-6">
            <div className="flex items-center justify-between border-b border-red-950 pb-2 mb-4">
              <h3 className="font-display font-extrabold tracking-wider text-xs sm:text-sm flex items-center gap-2 text-white">
                <Gamepad2 className="w-4.5 h-4.5 text-red-650 text-red-550 animate-pulse" />
                <span>DYNAMIC COCKPIT SECTOR FEED</span>
              </h3>
              <span className="font-mono text-[9px] text-red-400 font-extrabold bg-red-950/40 px-2 py-0.5 rounded border border-red-900/55 tracking-widest uppercase">
                LINK ACCELERATORS ACTIVE // GPU 120HZ
              </span>
            </div>

            <div className="flex flex-col gap-10 md:gap-14">
              {GAMES_DATA.map(game => (
                <div key={game.id} id={`game-feed-card-${game.id}`} className="scroll-mt-24">
                  <GameCard
                    game={game}
                    isActive={activeGameId === game.id}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Tactical Control deck & Diagnostics panel */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8">
            
            {/* 1. Emulation deck quick selection links */}
            <div className="rounded-2xl border border-white/20 bg-[#12090a]/90 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:border-white/30 transition-all duration-300">
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-slate-200 mb-3 pb-2 border-b border-white/10 flex items-center justify-between">
                <span className="old-age-title text-xs">EMULATION LINKS COCKPIT</span>
                <Sliders className="w-4 h-4 text-red-500" />
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {GAMES_DATA.map(game => {
                  const isSelected = activeGameId === game.id;
                  const borderTheme = {
                    'coc': 'border-red-500 bg-red-950/20 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]',
                    'bgmi': 'border-red-650 bg-red-950/20 text-red-400 shadow-[0_0_12px_rgba(225,29,72,0.1)]',
                    'pogo': 'border-amber-500 bg-amber-950/20 text-amber-500 shadow-[0_0_12px_rgba(217,119,6,0.1)]',
                    'chess': 'border-emerald-500 bg-emerald-950/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                  }[game.id];

                  return (
                    <button
                      key={game.id}
                      id={`game-card-${game.id}`}
                      onClick={() => handleGameSelect(game.id)}
                      className={`w-full text-left rounded-xl border p-3 flex @container items-center justify-between transition-all duration-300 transform hover:translate-x-1 ${
                        isSelected 
                          ? `${borderTheme} font-extrabold border-2`
                          : 'border-white/5 bg-[#090505]/95 hover:border-white/20 hover:bg-[#120607]/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-950 flex items-center justify-center p-1 border border-white/10 shrink-0">
                          <GameIcon gameId={game.id} className="w-full h-full" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white tracking-wide">{game.title}</span>
                          <span className="text-[9px] font-mono text-slate-400 truncate max-w-[150px]">{game.tagline}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1 font-mono shrink-0">
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-black tracking-widest text-[#ef4444] block">
                          {game.badge.split(' ')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Dr. Clown Mascot sweep combat centre */}
            <div className="rounded-2xl border border-white/20 bg-[#12090a]/90 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:border-white/30 transition-all duration-300">
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-slate-200 mb-2 pb-2 border-b border-white/10 flex items-center justify-between">
                <span className="old-age-title text-xs">COCKPIT SECURITY ASSAULT</span>
                <FlameKindling className="w-4 h-4 text-orange-500 animate-pulse" />
              </h4>
              <p className="text-[9.5px] font-mono text-slate-400 leading-normal mb-4">
                Launch Mascot sweep. The tactical Companion Drone flies from header, Locks on selectors sequentially, and unleashes plasma fireworks.
              </p>
              <button
                onClick={initiateRobotAssault}
                disabled={robotStatus !== 'idle'}
                className={`w-full py-2.5 px-4 font-mono text-xs rounded-xl border tracking-widest font-black uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                  robotStatus !== 'idle'
                    ? 'bg-zinc-800/40 border-zinc-700 text-zinc-500 cursor-not-allowed animate-pulse'
                    : 'bg-red-650/25 border-red-500 hover:bg-red-500 hover:text-white text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.12)] hover:shadow-[0_0_25px_rgba(239,68,68,0.35)]'
                }`}
              >
                <span>{robotStatus === 'idle' ? '🔥 TRIGGER CLOWN SWEEP' : `SWEEP STATE: ${robotStatus.toUpperCase()}`}</span>
              </button>
            </div>

            {/* 3. Terminal Feeds diagnostics */}
            <div className="rounded-2xl border border-white/20 bg-[#12090a]/90 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:border-white/30 transition-colors duration-300">
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-slate-200 mb-3 pb-2 border-b border-white/10 flex items-center justify-between">
                <span className="old-age-title text-xs">TELEMETRY DIAGNOSTIC STREAM</span>
                <Terminal className="w-3.5 h-3.5 text-red-500" />
              </h4>

              <div className="bg-[#050202] border border-white/10 p-3 rounded-xl font-mono text-[9px] space-y-1.5 h-[130px] overflow-y-auto">
                {activeTerminalLogs.length === 0 ? (
                  <div className="text-slate-500 italic">No signals logged.</div>
                ) : (
                  activeTerminalLogs.map((log, lIdx) => (
                    <div key={lIdx} className="text-slate-300 border-l-2 border-red-500/40 pl-2 leading-relaxed">
                      <span className="text-red-700/60 mr-1">[{new Date().toLocaleTimeString().substring(0, 8)}]</span>
                      {log}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-2 text-[8px] font-mono text-slate-500 flex justify-between font-bold">
                <span>FEED: EMULATE // LINK</span>
                <span className="text-emerald-400 animate-pulse">● FEED SECURED</span>
              </div>
            </div>

            {/* Live Performance System Diagnostics Tracker */}
            <div className="rounded-2xl border border-white/20 bg-[#12090a]/90 p-5 shadow-[0_8px_25px_rgba(0,0,0,0.25)] relative overflow-hidden hover:border-white/30 transition-colors duration-300">
              <div className="space-y-3.5">
                {/* 120 FPS Metric */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                    <span>HARDWARE ACCELERATION RATE</span>
                    <strong className="text-red-400 text-xs font-black">{fps} FPS</strong>
                  </div>
                  <div className="w-full h-1 bg-slate-950/65 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: `${(fps / 120) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Account Linked Ratio */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                    <span>DATABASE CLOUD SYNCED</span>
                    <strong className="text-emerald-450 text-emerald-400 text-xs font-black">4 / 4 HEALTHY</strong>
                  </div>
                  <div className="w-full h-1 bg-slate-950/65 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-full" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Special Warning alert for Chess ELO 200 rating */}
        <AnimatePresence>
          {activeGameId === 'chess' && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              id="chess-easter-egg-alert"
              className="rounded-2xl border border-emerald-500/25 bg-emerald-950/30 backdrop-blur-xl p-5 mb-8 flex items-start gap-4 shadow-[0_4px_20px_rgba(16,185,129,0.15)] relative overflow-hidden"
            >
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
              <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
              <div className="text-xs font-mono text-emerald-300 leading-relaxed">
                <strong className="text-white text-sm block mb-1 font-bold">COGNITIVE GRANDMASTER REPORT:</strong>
                User profile <strong className="text-white font-bold">Renga</strong> rating verified at <strong className="text-emerald-400 font-bold">200 ELO</strong>. 
                Diagnostic analysis indicates highly complex early Queen maneuvers that completely disregard standard chess openings. 
                Use caution during checkmate mappings.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blazing Flame Breathing SVGs drawn absolutely across the entire viewport during firing */}
        {robotStatus === 'firing' && (
          <svg className="fixed inset-0 w-full h-full pointer-events-none z-50">
            <defs>
              <linearGradient id="flame-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            {laserBeams.map(laser => {
              const midX = (laser.x1 + laser.x2) / 2 + Math.sin(laser.id * 12) * 15;
              const midY = (laser.y1 + laser.y2) / 2 + Math.cos(laser.id * 12) * 15;

              return (
                <g key={laser.id}>
                  {/* Broad thermal heatwave aura */}
                  <path 
                    d={`M ${laser.x1} ${laser.y1} Q ${midX} ${midY} ${laser.x2} ${laser.y2}`}
                    fill="none"
                    stroke="#dc2626" 
                    strokeWidth="20" 
                    strokeLinecap="round" 
                    opacity="0.32"
                    className="blur-md"
                  />
                  {/* Thick primary flame path */}
                  <path 
                    d={`M ${laser.x1} ${laser.y1} Q ${midX} ${midY} ${laser.x2} ${laser.y2}`}
                    fill="none"
                    stroke="#ea580c" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    opacity="0.8"
                    className="blur-sm"
                  />
                  {/* Glowing hot composite core plasma */}
                  <path 
                    d={`M ${laser.x1} ${laser.y1} Q ${midX} ${midY} ${laser.x2} ${laser.y2}`}
                    fill="none"
                    stroke="url(#flame-grad)" 
                    strokeWidth="5" 
                    strokeLinecap="round" 
                    opacity="0.95"
                  />

                  {/* Explosive impact shockwave rings on the target card */}
                  <circle cx={laser.x2} cy={laser.y2} r="20" fill="none" stroke="#f97316" strokeWidth="2" className="animate-ping" opacity="0.5" />
                  <circle cx={laser.x2} cy={laser.y2} r="10" fill="#ef4444" opacity="0.8" className="animate-pulse" />
                </g>
              );
            })}
          </svg>
        )}

        {/* Floating Mascot Companion Drone */}
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
                  y: destPos.y - 85,
                  scale: 1.3,
                  opacity: 1,
                  rotate: 15
                } : robotStatus === 'targeting' ? {
                  x: destPos.x,
                  y: destPos.y - 85,
                  scale: 1.35,
                  opacity: 1,
                  rotate: 0
                } : robotStatus === 'firing' ? {
                  x: destPos.x,
                  y: destPos.y - 85,
                  scale: 1.4,
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
                damping: robotStatus === 'flying' || robotStatus === 'returning' ? 16 : 18,
                mass: 0.9
              }}
              className="fixed w-20 h-20 -ml-10 -mt-10 pointer-events-none z-50 flex items-center justify-center animate-gpu"
            >
              <div className={`w-[90%] h-[90%] ${
                robotStatus === 'charging' ? 'animate-shake-tight' :
                robotStatus === 'firing' ? 'animate-shake-strong' : ''
              }`}>
                <GamerRobot 
                  status={robotStatus} 
                  isHeaderAvatar={false} 
                  gameColorTheme={activeAttackGameId ? '#f97316' : activeColorTheme} 
                />
              </div>

              {/* Holographic reticle below mascot */}
              {(robotStatus === 'targeting' || robotStatus === 'firing') && (
                <div className="absolute top-full mt-3 flex flex-col items-center">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-10 h-10 rounded-full border border-dashed flex items-center justify-center"
                    style={{ borderColor: '#ef4444', boxShadow: `0 0 10px rgba(239, 68, 68, 0.25)` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {isRebooting && (
          <MatrixReboot onComplete={handleRebootComplete} />
        )}

        {/* Minimalist tactical footer */}
        <footer id="app-footer" className="mt-20 mb-8 border-t border-slate-850 pt-8 text-center select-none opacity-50">
          <p className="font-mono text-[9px] text-slate-400 uppercase tracking-[0.3em]">
            SYSTEM PORTFOLIO &copy; {new Date().getFullYear()} — SECTOR LINK OPERATING OVER SECURE INTEL LINES
          </p>
        </footer>

      </div>
    </div>
  );
}
