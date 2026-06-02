/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

interface MatrixRebootProps {
  onComplete: () => void;
}

export default function MatrixReboot({ onComplete }: MatrixRebootProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bootStep, setBootStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const logs = [
    "INIT: EMERGENCY HARD RESET SEQUENCE INITIATED...",
    "NET: CLOSING HOST SOCKET PORT 3000 CONTEXT STREAM...",
    "SYS: POWERING DOWN CORE HOLOGRAM EMULATOR GRID...",
    "DISK: RE-INDEXING MEMORY SECTOR MEMORY SEGMENTS...",
    "SYS: ENABLING CYBER-CLOWN SECURE CRYPTO MODULE...",
    "FIRMWARE: VERIFYING INTEGRITY OF GAME CHROME ENGINES...",
    "THEME: RE-LOADING NEON EMERALD MATRIX MATRICES...",
    "CLOCK: DOCKING WITH INDIAN STANDARD TIME (IST) SPECTRUM...",
    "STATUS: REBOOT SEQUENCE SUCCEEDED. OPERATOR RE-ENGAGING..."
  ];

  // 1. Matrix Digital Rain Canvas Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fluid sizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters (katakana, binary, and math symbols)
    const characters = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890X+=*<>V$@#🤡";
    const charArr = characters.split('');
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const drops: number[] = Array(columns).fill(1).map(() => Math.floor(Math.random() * -100));

    let animationId: number;

    const draw = () => {
      // Semi-transparent background to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981'; // emerald-500 neon
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArr[Math.floor(Math.random() * charArr.length)];
        
        // Randomly make some characters brighter/white
        if (Math.random() > 0.98) {
          ctx.fillStyle = '#ffffff';
        } else if (Math.random() > 0.9) {
          ctx.fillStyle = '#34d399'; // emerald-400
        } else {
          ctx.fillStyle = '#059669'; // emerald-600
        }

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        // Reset drops if they go beyond screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // 2. Incremental logs timer simulation
  useEffect(() => {
    const logInterval = setInterval(() => {
      setBootStep(prev => {
        if (prev < logs.length - 1) {
          return prev + 1;
        } else {
          clearInterval(logInterval);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(logInterval);
  }, []);

  // 3. Percentage increment progress bar
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          const increment = Math.floor(Math.random() * 8) + 4;
          return Math.min(prev + increment, 100);
        } else {
          clearInterval(progressInterval);
          return prev;
        }
      });
    }, 180);

    return () => clearInterval(progressInterval);
  }, []);

  // 4. Trigger onComplete once loaded and complete
  useEffect(() => {
    if (progress === 100 && bootStep === logs.length - 1) {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(finishTimer);
    }
  }, [progress, bootStep, onComplete]);

  return (
    <div id="matrix-reboot-overlay" className="fixed inset-0 z-[100] bg-black flex flex-col justify-between p-6 md:p-12 select-none overflow-hidden font-mono text-emerald-400">
      {/* Background Rain Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Styled Scanning CRTs effect */}
      <div className="absolute inset-0 bg-retro-crt pointer-events-none opacity-20 z-10" />

      {/* Header telemetry HUD */}
      <div className="relative z-20 flex justify-between items-center border-b border-emerald-500/30 pb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="font-extrabold tracking-widest text-[10px]">COGNITIVE MATRIX EMERGENCY RESTORE v9.8.4</span>
        </div>
        <div className="text-[10px] opacity-75 hidden sm:block">STATUS: CRITICAL RESYNCHRONIZATION</div>
      </div>

      {/* Center Console with Terminal Stream output */}
      <div className="relative z-20 max-w-2xl w-full mx-auto my-auto bg-black/90 border border-emerald-500/40 p-6 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.25)] flex flex-col gap-4">
        {/* Terminal Header */}
        <div className="flex items-center justify-between text-[10px] border-b border-emerald-500/20 pb-2">
          <span className="text-emerald-500 font-bold tracking-wider">RENGA_OPERATOR_ROOT@MATRIX-TERMINAL</span>
          <span className="bg-emerald-950 px-2 py-0.5 rounded text-[8px] border border-emerald-500/20 animate-pulse">REBOOTING...</span>
        </div>

        {/* Dynamic Log Lines */}
        <div className="h-44 flex flex-col justify-end gap-1.5 overflow-hidden text-xs md:text-sm select-text select-none">
          {logs.slice(0, bootStep + 1).map((log, idx) => (
            <div key={idx} className="flex gap-2 items-start animate-fade-in">
              <span className="opacity-40 select-none">&gt;</span>
              <span className={idx === bootStep ? "text-emerald-200" : "text-emerald-500 font-medium opacity-85"}>{log}</span>
            </div>
          ))}
          {bootStep < logs.length - 1 && (
            <div className="flex gap-1 items-center">
              <span className="opacity-40 animate-pulse">&gt;</span>
              <div className="w-1.5 h-3 bg-emerald-400 animate-blink" />
            </div>
          )}
        </div>

        {/* Loading Progress Bar */}
        <div className="border-t border-emerald-500/10 pt-4 mt-2">
          <div className="flex justify-between text-[10px] mb-1.5 font-bold">
            <span className="tracking-widest">ALLOCATING QUANTUM ARCHITECTURE</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-emerald-950/80 border border-emerald-500/20 h-4 rounded p-0.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded transition-all duration-150 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-linear-stripes animate-scroll-stripes opacity-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer System coordinates */}
      <div className="relative z-20 flex flex-wrap justify-between items-center text-[8px] opacity-60 border-t border-emerald-500/20 pt-4">
        <span>MATRIX ENGAGE ENVELOPE: 2026-06-02 22:30:15 IST</span>
        <span>SECURITY SEAL LEVEL: ULTIMATE CLOWN SECURITY ACT 👑</span>
      </div>
    </div>
  );
}
