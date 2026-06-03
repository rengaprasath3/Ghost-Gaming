/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { GameID } from '../types';
import { GAMER_PROFILE } from '../data';

interface AnimationCanvasProps {
  gameId: GameID;
  isActive: boolean;
}

export interface AnimationCanvasHandle {
  triggerTap: (x: number, y: number) => void;
  resetAnimations: () => void;
}

export const AnimationCanvas = forwardRef<AnimationCanvasHandle, AnimationCanvasProps>(
  ({ gameId, isActive }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    
    // Core states
    const [killFeeds, setKillFeeds] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
    const [eloDisplay, setEloDisplay] = useState<number>(200);

    // Keep track of particles & animations using refs to avoid React render delays
    const particlesRef = useRef<any[]>([]);
    const assetsRef = useRef<{
      cocWallsY: number;
      cocWallsTargetY: number;
      cocShieldScale: number;
      cocShieldRotation: number;
      cocShieldPulse: number;
      cocAxe: { x: number; y: number; angle: number; vx: number; vy: number; active: boolean } | null;
      
      bgmiCrosshair: { x: number; y: number; scale: number; pulse: number; active: boolean } | null;
      bgmiAirdrop: { x: number; y: number; targetY: number; active: boolean; landTimer: number } | null;
      bgmiSmokePuffs: { x: number; y: number; size: number; alpha: number }[];
      
      pogoPokeball: { x: number; y: number; state: 'spin' | 'wobble' | 'crack' | 'burst'; timer: number; wobbleAngle: number; scale: number; active: boolean } | null;
      pogoXpProgress: number;
      pogoXpTarget: number;
      pogoSilhouettes: { x: number; y: number; type: number; vx: number; alpha: number }[];
      
      chessFlashActive: boolean;
      chessFlashTimer: number;
      chessKnight: { x: number; y: number; startX: number; startY: number; targetX: number; targetY: number; progress: number; active: boolean } | null;
      chessClockTimer: { active: boolean; scale: number; rotation: number; timerIndex: number; value: string } | null;
      chessCapturedPieces: { x: number; y: number; vx: number; vy: number; rotation: number; spin: number; type: string }[];
    }>({
      cocWallsY: 100,
      cocWallsTargetY: 100,
      cocShieldScale: 0,
      cocShieldRotation: 0,
      cocShieldPulse: 0,
      cocAxe: null,
      
      bgmiCrosshair: null,
      bgmiAirdrop: null,
      bgmiSmokePuffs: [],
      
      pogoPokeball: null,
      pogoXpProgress: 0,
      pogoXpTarget: 0,
      pogoSilhouettes: [],
      
      chessFlashActive: false,
      chessFlashTimer: 0,
      chessKnight: null,
      chessClockTimer: null,
      chessCapturedPieces: [],
    });

    // Handle background active states
    useEffect(() => {
      assetsRef.current.cocWallsTargetY = isActive ? 35 : 100;
    }, [isActive]);

    // Expose methods to trigger click/tap effects
    useImperativeHandle(ref, () => ({
      triggerTap: (x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Sound-like visual triggers
        if (gameId === 'coc') {
          // 1. Sword sparks (orange starburst sparks)
          for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            particlesRef.current.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 2 * Math.random() * 3,
              color: `rgba(255, ${100 + Math.random() * 120}, 40, ${0.8 + Math.random() * 0.2})`,
              life: 40 + Math.random() * 40,
              maxLife: 80,
              type: 'spark',
              gravity: 0.05
            });
          }

          // 2. Gold coins scattering
          for (let i = 0; i < 15; i++) {
            const angle = -Math.PI / 6 - Math.random() * (Math.PI * 2 / 3);
            const speed = 3 + Math.random() * 5;
            particlesRef.current.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 2, // jump up
              size: 6 + Math.random() * 4,
              color: '#ffd700',
              life: 100,
              maxLife: 100,
              type: 'coin',
              gravity: 0.15,
              spin: Math.random() * 0.2 - 0.1,
              angle: Math.random() * Math.PI * 2
            });
          }

          // 3. Shield slam hook
          assetsRef.current.cocShieldScale = 2.5; // slam down
          assetsRef.current.cocShieldPulse = 0.01;
          assetsRef.current.cocShieldRotation = Math.random() * 0.4 - 0.2;

          // Expand a ring shockwave immediately
          for (let i = 0; i < 12; i++) {
            const ringAngle = (i / 12) * Math.PI * 2;
            particlesRef.current.push({
              x,
              y,
              vx: Math.cos(ringAngle) * 3,
              vy: Math.sin(ringAngle) * 3,
              size: 4,
              color: 'rgba(255, 170, 50, 0.4)',
              life: 30,
              maxLife: 30,
              type: 'shockwave'
            });
          }

          // 4. Barbarian Axe throw
          if (!assetsRef.current.cocAxe || !assetsRef.current.cocAxe.active) {
            assetsRef.current.cocAxe = {
              x: -40,
              y: canvas.height * 0.4 + Math.random() * 50,
              vx: 5 + Math.random() * 3,
              vy: -4 - Math.random() * 3,
              angle: 0,
              active: true
            };
          }

        } else if (gameId === 'bgmi') {
          // 1. Zoom Crosshair target lock
          assetsRef.current.bgmiCrosshair = {
            x,
            y,
            scale: 3.0,
            pulse: 1.0,
            active: true
          };

          // 2. Red muzzle flash burst
          for (let i = 0; i < 15; i++) {
            const flashAngle = Math.random() * Math.PI * 2;
            const size = 15 + Math.random() * 20;
            particlesRef.current.push({
              x,
              y,
              vx: Math.cos(flashAngle) * (1 + Math.random() * 4),
              vy: Math.sin(flashAngle) * (1 + Math.random() * 4),
              size,
              color: Math.random() > 0.4 ? 'rgba(255, 50, 50, 0.9)' : 'rgba(255, 200, 50, 0.8)',
              life: 12,
              maxLife: 15,
              type: 'flash'
            });
          }

          // 3. Bullet trail lines shoot across screen
          const bulletY = y + (Math.random() * 40 - 20);
          particlesRef.current.push({
            x: 0,
            y: bulletY,
            vx: 18 + Math.random() * 10,
            vy: 0,
            size: 4,
            color: 'rgba(0, 240, 255, 0.8)',
            life: 60,
            maxLife: 60,
            type: 'bullet_trail'
          });

          // 4. Parachute Airdrop falls slowly
          if (!assetsRef.current.bgmiAirdrop || !assetsRef.current.bgmiAirdrop.active) {
            assetsRef.current.bgmiAirdrop = {
              x: x + (Math.random() * 60 - 30),
              y: -50,
              targetY: canvas.height - 40,
              active: true,
              landTimer: 0
            };
          }

          // 5. Smoke grenade spreads from corner
          for (let i = 0; i < 6; i++) {
            assetsRef.current.bgmiSmokePuffs.push({
              x: canvas.width - 20,
              y: canvas.height - 25,
              size: 20 + Math.random() * 30,
              alpha: 0.6
            });
          }

          // 6. Kill Feed text "+1 FRAG" in HUD
          setKillFeeds(prev => [...prev, {
            id: Date.now() + Math.random(),
            text: "+1 FRAG",
            x: canvas.width - 120,
            y: 40 + (prev.length * 28) % 100
          }]);

        } else if (gameId === 'pogo') {
          // 1. Pokéball wobbles and cracks open
          assetsRef.current.pogoPokeball = {
            x,
            y,
            state: 'spin',
            timer: 0,
            wobbleAngle: 0,
            scale: 0.3,
            active: true
          };

          // 2. Yellow lightning bolts strike outward
          for (let k = 0; k < 6; k++) {
            particlesRef.current.push({
              x,
              y,
              vx: 0,
              vy: 0,
              size: 2 + Math.random() * 2,
              color: '#fefe00',
              life: 25,
              maxLife: 25,
              type: 'lightning_strike',
              angle: Math.random() * Math.PI * 2
            });
          }

          // 3. Electric neon rings pulse
          particlesRef.current.push({
            x,
            y,
            vx: 0,
            vy: 0,
            size: 15,
            color: '#00f0ff',
            life: 35,
            maxLife: 35,
            type: 'electric_ring'
          });

          // 4. Stardust sparkles rain triggers
          for (let i = 0; i < 20; i++) {
            particlesRef.current.push({
              x: Math.random() * canvas.width,
              y: 0,
              vx: Math.random() * 2 - 1,
              vy: 2 + Math.random() * 3,
              size: 3 + Math.random() * 4,
              color: Math.random() > 0.5 ? '#fefe00' : '#00f0ff',
              life: 100,
              maxLife: 100,
              type: 'stardust'
            });
          }

          // 5. XP bar dynamic rise
          assetsRef.current.pogoXpTarget = Math.min(100, assetsRef.current.pogoXpTarget + 20);
          if (assetsRef.current.pogoXpTarget >= 100) {
            assetsRef.current.pogoXpTarget = 0;
            assetsRef.current.pogoXpProgress = 0;
            // Level celebration particle burst
            for (let i = 0; i < 40; i++) {
              const capAngle = Math.random() * Math.PI * 2;
              const capSpeed = 3 + Math.random() * 6;
              particlesRef.current.push({
                x: canvas.width / 2,
                y: canvas.height - 20,
                vx: Math.cos(capAngle) * capSpeed,
                vy: Math.sin(capAngle) * capSpeed - 1,
                size: 4 + Math.random() * 4,
                color: Math.random() > 0.5 ? '#00e676' : '#ffd700',
                life: 80,
                maxLife: 80,
                type: 'stardust'
              });
            }
          }

          // 6. Spawn running pokemons silhouettes across the card width
          assetsRef.current.pogoSilhouettes.push({
            x: -40,
            y: canvas.height - 35,
            vx: 2 + Math.random() * 3,
            type: Math.floor(Math.random() * 3), // pikachu / round / quad
            alpha: 1.0
          });

        } else if (gameId === 'chess') {
          // 1. Slide and scatter pieces
          for (let i = 0; i < 8; i++) {
            const pieceType = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'][Math.floor(Math.random() * 6)];
            const scatterAngle = Math.random() * Math.PI * 2;
            const scatterSpeed = 2 + Math.random() * 4;
            particlesRef.current.push({
              x,
              y,
              vx: Math.cos(scatterAngle) * scatterSpeed,
              vy: Math.sin(scatterAngle) * scatterSpeed - 1,
              size: 16,
              color: 'rgba(255, 255, 255, 0.8)',
              life: 90,
              maxLife: 90,
              type: 'chess_piece',
              angle: Math.random() * Math.PI * 2,
              spin: Math.random() * 0.1 - 0.05,
              gravity: 0.1,
              meta: { shape: pieceType, style: Math.random() > 0.5 ? 'white' : 'black' }
            });
          }

          // 2. Knight jumps in L-shape action
          assetsRef.current.chessKnight = {
            startX: x,
            startY: y,
            x,
            y,
            targetX: x + (Math.random() > 0.5 ? 120 : -120),
            targetY: y + (Math.random() > 0.5 ? 60 : -60),
            progress: 0,
            active: true
          };

          // 3. Checkerboard flash
          assetsRef.current.chessFlashActive = true;
          assetsRef.current.chessFlashTimer = 18;

          // 4. Clock ticking & slam down
          assetsRef.current.chessClockTimer = {
            active: true,
            scale: 1.5,
            rotation: 0.1,
            timerIndex: Math.floor(Math.random() * 10),
            value: `0:${Math.floor(10 + Math.random() * 50)}`
          };

          // 5. Captured pieces tumble off board edge
          assetsRef.current.chessCapturedPieces.push({
            x: x + (Math.random() * 30 - 15),
            y,
            vx: Math.random() * 4 - 2,
            vy: -4 - Math.random() * 3,
            rotation: Math.random() * Math.PI * 2,
            spin: Math.random() * 0.3 - 0.15,
            type: ['pawn', 'bishop', 'rook'][Math.floor(Math.random() * 3)]
          });

          // 6. ELO Rating animation - counts up with each click
          setEloDisplay(prev => prev + Math.floor(2 + Math.random() * 6));
        }
      },
      resetAnimations: () => {
        particlesRef.current = [];
        assetsRef.current.bgmiSmokePuffs = [];
        assetsRef.current.pogoSilhouettes = [];
        assetsRef.current.chessCapturedPieces = [];
        assetsRef.current.cocAxe = null;
        assetsRef.current.bgmiCrosshair = null;
        assetsRef.current.bgmiAirdrop = null;
        assetsRef.current.pogoPokeball = null;
        assetsRef.current.chessKnight = null;
        setKillFeeds([]);
      }
    }));

    // Trigger state cleanups for killfeeds over time
    useEffect(() => {
      if (killFeeds.length > 0) {
        const timer = setTimeout(() => {
          setKillFeeds(prev => prev.slice(1));
        }, 1200);
        return () => clearTimeout(timer);
      }
    }, [killFeeds]);

    // Canvas execution loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationId: number;
      let width = 0;
      let height = 0;

      const handleResize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      };

      const resizeObserver = new ResizeObserver(() => handleResize());
      if (canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
      }
      handleResize();

      let isIntersecting = true;
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        isIntersecting = entry.isIntersecting;
      }, { threshold: 0.01 });
      intersectionObserver.observe(canvas);

      const hasActiveAnimations = () => {
        const assets = assetsRef.current;
        if (particlesRef.current.length > 0) return true;
        if (gameId === 'coc') {
          if (assets.cocAxe && assets.cocAxe.active) return true;
          if (assets.cocShieldScale > 0.01) return true;
        } else if (gameId === 'bgmi') {
          if (assets.bgmiCrosshair && assets.bgmiCrosshair.active) return true;
          if (assets.bgmiAirdrop && assets.bgmiAirdrop.active) return true;
        } else if (gameId === 'pogo') {
          if (assets.pogoPokeball && assets.pogoPokeball.active) return true;
        } else if (gameId === 'chess') {
          if (assets.chessKnight && assets.chessKnight.active) return true;
          if (assets.chessCapturedPieces && assets.chessCapturedPieces.length > 0) return true;
        }
        return false;
      };

      // Simple drawing routines for modular features
      const drawShield = (cx: number, cy: number, scale: number, rotation: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.rotate(rotation);
        
        ctx.shadowColor = 'rgba(255,114,0,0.8)';
        ctx.shadowBlur = 10;
        
        // Base Shield shape
        ctx.fillStyle = '#ff7200';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2.5;
        
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.bezierCurveTo(15, -18, 18, -12, 18, 4);
        ctx.bezierCurveTo(18, 14, 10, 22, 0, 26);
        ctx.bezierCurveTo(-10, 22, -18, 14, -18, 4);
        ctx.bezierCurveTo(-18, -12, -15, -18, 0, -18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner Shield emblem crest
        ctx.fillStyle = '#ffb300';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.quadraticCurveTo(8, -10, 8, 4);
        ctx.quadraticCurveTo(8, 10, 0, 16);
        ctx.quadraticCurveTo(-8, 10, -8, 4);
        ctx.quadraticCurveTo(-8, -10, 0, -10);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      };

      const drawAxe = (cx: number, cy: number, rot: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);

        ctx.shadowColor = 'rgba(255,255,255,0.4)';
        ctx.shadowBlur = 8;

        // Wood shaft
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(0, 18);
        ctx.stroke();

        // Steel Double axe blade
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;

        // Left blade
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.bezierCurveTo(-14, -12, -14, 12, 0, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right blade
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.bezierCurveTo(14, -12, 14, 12, 0, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      };

      const drawAirdrop = (drop: any) => {
        ctx.save();
        ctx.translate(drop.x, drop.y);
        
        ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
        ctx.shadowBlur = 10;

        // Parachute if actively falling
        if (drop.y < drop.targetY) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          // ropes
          ctx.moveTo(-15, 0);
          ctx.lineTo(0, -32);
          ctx.moveTo(15, 0);
          ctx.lineTo(0, -32);
          ctx.stroke();

          // Chute nylon canopy
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.beginPath();
          ctx.arc(0, -35, 18, Math.PI, 0, false);
          ctx.closePath();
          ctx.fill();
        }

        // The crate (cube design with signature red base + blue cover)
        // Red base box
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-12, 0, 24, 20);

        // Blue secure top lid
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(-14, -2, 28, 6);

        // Straps wrap
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-4, 0, 2, 20);
        ctx.fillRect(4, 0, 2, 20);

        ctx.restore();
      };

      const drawPokeballShape = (cx: number, cy: number, pRatio: number, wobbleAng: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(wobbleAng);
        ctx.scale(pRatio, pRatio);

        ctx.shadowBlur = 12;
        ctx.shadowColor = '#fefe00';

        const size = 30;

        // Top Red Half
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, size, Math.PI, 0, false);
        ctx.closePath();
        ctx.fill();

        // Bottom White Half
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI, false);
        ctx.closePath();
        ctx.fill();

        // Horizontal band
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-size, -2, size * 2, 4);

        // Center Button ring
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();

        // Inner button center
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
      };

      const drawKnight = (cx: number, cy: number, scale: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        ctx.shadowColor = '#00e676';
        ctx.shadowBlur = 12;
        ctx.fillStyle = 'rgba(0, 230, 118, 0.9)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;

        // Draw simple neon Knight vector
        ctx.beginPath();
        ctx.moveTo(-10, 15);
        ctx.lineTo(-10, 12);
        ctx.bezierCurveTo(-10, 8, -6, 2, -6, -2);
        ctx.bezierCurveTo(-15, -2, -15, -12, -4, -14);
        ctx.bezierCurveTo(-4, -18, 2, -16, 6, -10);
        ctx.bezierCurveTo(12, -10, 12, 0, 8, 6);
        ctx.bezierCurveTo(8, 12, 12, 15, 12, 15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      };

      const drawChessPawn = (cx: number, cy: number, scale: number, rotation: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;

        // Head circle
        ctx.beginPath();
        ctx.arc(0, -12, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Collar & pedestal
        ctx.beginPath();
        ctx.moveTo(-8, 12);
        ctx.lineTo(-4, -2);
        ctx.arc(0, -6, 4, Math.PI, 0);
        ctx.lineTo(4, -2);
        ctx.lineTo(8, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      };

      // Continuous animation execution cycle
      const updateFrame = () => {
        // 1. Off-screen check
        if (!isIntersecting) {
          animationId = requestAnimationFrame(updateFrame);
          return;
        }

        // 2. Idle state optimization: if card is resting/inactive and has no active animations or clicks running, do not redraw.
        const active = isActive;
        const printing = hasActiveAnimations();
        if (!active && !printing) {
          ctx.clearRect(0, 0, width, height);
          animationId = requestAnimationFrame(updateFrame);
          return;
        }

        ctx.clearRect(0, 0, width, height);

        // --- Continuous Ambient background particles ---
        if (isActive) {
          if (gameId === 'coc') {
            // Embers float upward continuously
            if (Math.random() < 0.15) {
              particlesRef.current.push({
                x: Math.random() * width,
                y: height + 10,
                vx: Math.random() * 0.8 - 0.4,
                vy: -(0.5 + Math.random() * 1.5),
                size: 2 + Math.random() * 4,
                color: `rgba(255, ${75 + Math.random() * 80}, 0, ${0.4 + Math.random() * 0.4})`,
                life: 110,
                maxLife: 150,
                type: 'amber'
              });
            }
          } else if (gameId === 'bgmi') {
            // Spontaneous smoke puffs or ambient sparks
            if (assetsRef.current.bgmiSmokePuffs.length < 5 && Math.random() < 0.02) {
              assetsRef.current.bgmiSmokePuffs.push({
                x: Math.random() * width,
                y: height + 5,
                size: 15 + Math.random() * 15,
                alpha: 0.35
              });
            }
          } else if (gameId === 'pogo') {
            // Continuous stardust fall
            if (Math.random() < 0.12) {
              particlesRef.current.push({
                x: Math.random() * width,
                y: -10,
                vx: Math.random() * 0.4 - 0.2,
                vy: 0.8 + Math.random() * 1.2,
                size: 1.5 + Math.random() * 3,
                color: Math.random() > 0.45 ? '#fefe00' : '#00f0ff',
                life: 140,
                maxLife: 200,
                type: 'stardust'
              });
            }
          } else if (gameId === 'chess') {
            // Chess game ambient clocks, ticking grids
            if (Math.random() < 0.01) {
              // Alternate grid cell blinking
              assetsRef.current.chessFlashActive = true;
              assetsRef.current.chessFlashTimer = 6;
            }
          }
        }

        // --- Draw background static assets (Castle walls rising for CoC) ---
        if (gameId === 'coc') {
          // Walls rise
          const wallsRef = assetsRef.current;
          wallsRef.cocWallsY += (wallsRef.cocWallsTargetY - wallsRef.cocWallsY) * 0.08;
          
          if (wallsRef.cocWallsY < 95) {
            ctx.fillStyle = '#334155';
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1.5;
            
            const wallH = 40;
            const yPos = height - wallH + (wallH * wallsRef.cocWallsY / 100);
            
            ctx.fillRect(0, yPos, width, wallH);
            ctx.strokeRect(0, yPos, width, wallH);

            // Draw parapets / battlements
            ctx.fillStyle = '#1e293b';
            const numMerlons = 8;
            const merlonW = width / numMerlons;
            for (let i = 0; i < numMerlons; i++) {
              if (i % 2 === 0) {
                ctx.fillRect(i * merlonW, yPos - 8, merlonW, 8);
                ctx.strokeRect(i * merlonW, yPos - 8, merlonW, 8);
              }
            }
          }
        }

        // --- Active Event Asset Process: CoC Axe & Shield ---
        const assets = assetsRef.current;
        if (gameId === 'coc') {
          // Axe spinning across
          if (assets.cocAxe && assets.cocAxe.active) {
            assets.cocAxe.x += assets.cocAxe.vx;
            assets.cocAxe.y += assets.cocAxe.vy;
            assets.cocAxe.vy += 0.12; // gravity
            assets.cocAxe.angle += 0.25;

            // Axe spark particles trailing
            if (Math.random() < 0.5) {
              particlesRef.current.push({
                x: assets.cocAxe.x,
                y: assets.cocAxe.y,
                vx: -assets.cocAxe.vx * 0.2,
                vy: Math.random() * 2 - 1,
                size: 2,
                color: '#cbd5e1',
                life: 15,
                maxLife: 15,
                type: 'spark'
              });
            }

            drawAxe(assets.cocAxe.x, assets.cocAxe.y, assets.cocAxe.angle);

            if (assets.cocAxe.x > width + 40 || assets.cocAxe.y > height + 40) {
              assets.cocAxe.active = false;
            }
          }

          // Shield slam
          if (assets.cocShieldScale > 0.01) {
            assets.cocShieldScale += (1.0 - assets.cocShieldScale) * 0.18;
            assets.cocShieldPulse += 0.02;
            
            drawShield(width / 2, height / 2 - 20, assets.cocShieldScale, assets.cocShieldRotation);
            
            // Fades after a bit
            if (Math.abs(assets.cocShieldScale - 1.0) < 0.02) {
              assets.cocShieldScale -= 0.02; // gradual shrink/fade trigger
            }
          }
        }

        // --- BGMI: Crosshair, Airdrop, Smoke ---
        if (gameId === 'bgmi') {
          // Smoke clouds
          assets.bgmiSmokePuffs = assets.bgmiSmokePuffs.map(puff => {
            puff.size += 0.4;
            puff.alpha -= 0.003;
            ctx.fillStyle = `rgba(100, 116, 139, ${Math.max(0, puff.alpha)})`;
            ctx.beginPath();
            ctx.arc(puff.x, puff.y, puff.size, 0, Math.PI * 2);
            ctx.fill();
            return puff;
          }).filter(puff => puff.alpha > 0);

          // Airdrop Cargo
          if (assets.bgmiAirdrop && assets.bgmiAirdrop.active) {
            const drop = assets.bgmiAirdrop;
            if (drop.y < drop.targetY) {
              drop.y += 1.4; // constant slow fall
            } else {
              // landed! create landing sparks or smoke
              drop.landTimer += 1;
              if (drop.landTimer < 2) {
                // red land dust clouds
                for (let i = 0; i < 8; i++) {
                  particlesRef.current.push({
                    x: drop.x,
                    y: drop.targetY + 15,
                    vx: Math.random() * 4 - 2,
                    vy: -Math.random() * 2,
                    size: 8 + Math.random() * 10,
                    color: 'rgba(239, 68, 68, 0.4)',
                    life: 40,
                    maxLife: 40,
                    type: 'smoke'
                  });
                }
              }
              // remain on ground for 120 frames, then fade out
              if (drop.landTimer > 180) {
                drop.active = false;
              }
            }
            drawAirdrop(drop);
          }

          // Crosshair target lock
          if (assets.bgmiCrosshair && assets.bgmiCrosshair.active) {
            const lock = assets.bgmiCrosshair;
            lock.scale += (1.0 - lock.scale) * 0.22;
            lock.pulse += 0.05;
            
            ctx.save();
            ctx.translate(lock.x, lock.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 2.0 - lock.pulse)})`;
            ctx.lineWidth = 1.5;

            // Circle ring
            ctx.beginPath();
            ctx.arc(0, 0, 15 * lock.scale, 0, Math.PI * 2);
            ctx.stroke();

            // Center dot
            ctx.fillStyle = '#00f0ff';
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();

            // Reticle dashes
            ctx.beginPath();
            ctx.moveTo(-25 * lock.scale, 0); ctx.lineTo(-12 * lock.scale, 0);
            ctx.moveTo(12 * lock.scale, 0); ctx.lineTo(25 * lock.scale, 0);
            ctx.moveTo(0, -25 * lock.scale); ctx.lineTo(0, -12 * lock.scale);
            ctx.moveTo(0, 12 * lock.scale); ctx.lineTo(0, 25 * lock.scale);
            ctx.stroke();

            ctx.restore();

            if (lock.pulse > 2.0) {
              lock.active = false;
            }
          }
        }

        // --- Pokémon GO: Pokéball, Silhouettes, XP Glow ---
        if (gameId === 'pogo') {
          // Pokéball burst sequence
          if (assets.pogoPokeball && assets.pogoPokeball.active) {
            const ball = assets.pogoPokeball;
            ball.timer += 1;

            if (ball.state === 'spin') {
              ball.y += (height / 2 - ball.y) * 0.12;
              ball.scale += (1.0 - ball.scale) * 0.12;
              if (ball.timer > 25) {
                ball.state = 'wobble';
                ball.timer = 0;
              }
            } else if (ball.state === 'wobble') {
              // wobble left and right 3 times
              ball.wobbleAngle = Math.sin(ball.timer * 0.5) * 0.25;
              if (ball.timer > 45) {
                ball.state = 'crack';
                ball.timer = 0;
              }
            } else if (ball.state === 'crack') {
              // Expand sparks & lightning at ball origin
              for (let i = 0; i < 4; i++) {
                const strikeAngle = Math.random() * Math.PI * 2;
                particlesRef.current.push({
                  x: ball.x,
                  y: ball.y,
                  vx: Math.cos(strikeAngle) * 5,
                  vy: Math.sin(strikeAngle) * 5,
                  size: 3,
                  color: '#fefe00',
                  life: 20,
                  maxLife: 20,
                  type: 'lightning_strike'
                });
              }
              ball.state = 'burst';
              ball.timer = 0;
            } else if (ball.state === 'burst') {
              // Pokéball bursts completely with energy rings
              ball.scale += 0.15;
              if (ball.timer > 15) {
                ball.active = false;
              }
            }

            if (ball.active && ball.state !== 'burst') {
              drawPokeballShape(ball.x, ball.y, ball.scale, ball.wobbleAngle);
            }
          }

          // Pokémon Silhouettes runs
          assets.pogoSilhouettes = assets.pogoSilhouettes.map(pkm => {
            pkm.x += pkm.vx;
            
            ctx.save();
            ctx.translate(pkm.x, pkm.y);
            ctx.fillStyle = `rgba(15, 23, 42, ${pkm.alpha})`;
            ctx.strokeStyle = `rgba(0, 240, 255, ${pkm.alpha * 0.6})`;
            ctx.lineWidth = 1.5;
            
            // Draw silhouette
            ctx.beginPath();
            if (pkm.type === 0) { // Pikachu shape approx
              ctx.arc(0, 0, 8, 0, Math.PI * 2);
              ctx.moveTo(-4, -6); ctx.lineTo(-12, -18); ctx.lineTo(-6, -10);
              ctx.moveTo(4, -6); ctx.lineTo(12, -18); ctx.lineTo(6, -10);
            } else if (pkm.type === 1) { // round body (Jigglypuff)
              ctx.arc(0, 0, 11, 0, Math.PI * 2);
              ctx.moveTo(-10, -5); ctx.lineTo(-12, -12); ctx.lineTo(-5, -10);
              ctx.moveTo(10, -5); ctx.lineTo(12, -12); ctx.lineTo(5, -10);
            } else { // Quadruped body
              ctx.ellipse(0, 0, 12, 7, 0, 0, Math.PI * 2);
              ctx.arc(-8, -5, 5, 0, Math.PI * 2); // head
              ctx.fillRect(-11, 4, 3, 6); // legs
              ctx.fillRect(8, 4, 3, 6);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            return pkm;
          }).filter(p => p.x < width + 40);

          // Render XP bar
          assets.pogoXpProgress += (assets.pogoXpTarget - assets.pogoXpProgress) * 0.1;
          const barW = width * 0.7;
          const barH = 8;
          const barX = (width - barW) / 2;
          const barY = height - 15;

          // Bar Border/Track
          ctx.fillStyle = 'rgba(255,255,255,0.06)';
          ctx.fillRect(barX, barY, barW, barH);
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.strokeRect(barX, barY, barW, barH);

          // Bar Filled progress
          ctx.shadowColor = '#00e676';
          ctx.shadowBlur = 6;
          ctx.fillStyle = '#00e676';
          ctx.fillRect(barX, barY, barW * (assets.pogoXpProgress / 100), barH);
          ctx.shadowBlur = 0; // reset
        }

        // --- Chess.com: Boards flash, Knight L-Jump, Clocks ---
        if (gameId === 'chess') {
          // Checkerboard click flash
          if (assets.chessFlashActive) {
            assets.chessFlashTimer -= 1;
            if (assets.chessFlashTimer <= 0) {
              assets.chessFlashActive = false;
            } else {
              // Draw alternating overlay grid
              ctx.fillStyle = 'rgba(0, 230, 118, 0.08)';
              const gridSize = width / 8;
              for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                  if ((r + c) % 2 === 0) {
                    ctx.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
                  }
                }
              }
            }
          }

          // Knight L-Jump (L-curve jump!)
          if (assets.chessKnight && assets.chessKnight.active) {
            const kn = assets.chessKnight;
            kn.progress += 0.03;

            // Calculate L-path using Bezier control point
            // Goes horizontally, then vertically (L outline!)
            const t = kn.progress;
            // Arc coordinates
            const midX = kn.startX + (kn.targetX - kn.startX) * 0.95;
            const midY = kn.startY; // moving straight on x, then down x
            
            // Parabolic Y hump for jumping feel
            const jumpHeight = -45;
            const humpY = Math.sin(t * Math.PI) * jumpHeight;

            // Bezier bezier interpolate for curve
            const currentX = (1 - t) * (1 - t) * kn.startX + 2 * (1 - t) * t * midX + t * t * kn.targetX;
            const currentY = (1 - t) * (1 - t) * kn.startY + 2 * (1 - t) * t * midY + t * t * kn.targetY + humpY;

            // Draw line trails
            particlesRef.current.push({
              x: currentX,
              y: currentY,
              vx: 0, vy: 0, size: 2.5,
              color: 'rgba(0, 230, 118, 0.5)',
              life: 30, maxLife: 30,
              type: 'trail'
            });

            drawKnight(currentX, currentY, 1.0);

            if (kn.progress >= 1.0) {
              kn.active = false;
              // Smash impact particles
              for (let i = 0; i < 10; i++) {
                const angle = Math.random() * Math.PI * 2;
                particlesRef.current.push({
                  x: kn.targetX,
                  y: kn.targetY,
                  vx: Math.cos(angle) * 3,
                  vy: Math.sin(angle) * 3,
                  size: 4,
                  color: '#00e676',
                  life: 30, maxLife: 30,
                  type: 'spark'
                });
              }
            }
          }

          // Clock ticker
          if (assets.chessClockTimer && assets.chessClockTimer.active) {
            const clock = assets.chessClockTimer;
            clock.scale += (1.0 - clock.scale) * 0.15;
            clock.rotation += (0 - clock.rotation) * 0.15;

            ctx.save();
            ctx.translate(width - 70, 30);
            ctx.scale(clock.scale, clock.scale);
            ctx.rotate(clock.rotation);
            
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#00e676';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#00e676';
            ctx.shadowBlur = 4;
            
            // Frame rect
            ctx.fillRect(-35, -12, 70, 24);
            ctx.strokeRect(-35, -12, 70, 24);

            // Time Display text
            ctx.fillStyle = '#00e676';
            ctx.font = 'bold 11px "JetBrains Mono", Courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(clock.value, 0, 1);
            ctx.restore();
          }

          // Captured pieces fell off board edge.
          assets.chessCapturedPieces = assets.chessCapturedPieces.map(piece => {
            piece.x += piece.vx;
            piece.y += piece.vy;
            piece.vy += 0.2; // heavy gravity
            piece.rotation += piece.spin;
            
            drawChessPawn(piece.x, piece.y, 0.9, piece.rotation);
            return piece;
          }).filter(piece => piece.y < height + 40);
        }

        // --- PARTICLE PHYSICS & PHYSICS PROCESSING ---
        particlesRef.current = particlesRef.current.map(p => {
          // Motion Physics
          p.x += p.vx;
          p.y += p.vy;
          if (p.gravity) p.vy += p.gravity;
          if (p.spin && p.angle !== undefined) p.angle += p.spin;

          p.life -= 1;

          // Draw logic based on style
          if (p.type === 'airdrop') {
            drawAirdrop(p);
          } else if (p.type === 'spark' || p.type === 'amber') {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (p.type === 'coin') {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle || 0);
            ctx.scale(Math.sin(p.angle || 0), 1); // spin visual effect
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#b58900';
            ctx.lineWidth = 1;
            ctx.stroke();
            // Draw inner details
            ctx.fillStyle = '#ffd700';
            ctx.fillText('$', -3, 3);
            ctx.restore();
          } else if (p.type === 'shockwave') {
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2.0 * (p.life / p.maxLife);
            ctx.beginPath();
            ctx.arc(p.x, p.y, (p.maxLife - p.life) * 4.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          } else if (p.type === 'bullet_trail') {
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p.x - 30, p.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            ctx.restore();
          } else if (p.type === 'flash') {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (p.type === 'lightning_strike') {
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.beginPath();
            let startLocX = p.x;
            let startLocY = p.y;
            ctx.moveTo(startLocX, startLocY);
            
            // draw irregular bolts
            const segments = 4;
            const boltAngle = p.angle || 0;
            const dist = 30;
            for (let j = 0; j < segments; j++) {
              const segLen = dist / segments;
              const nextX = startLocX + Math.cos(boltAngle) * segLen + (Math.random() * 12 - 6);
              const nextY = startLocY + Math.sin(boltAngle) * segLen + (Math.random() * 12 - 6);
              ctx.lineTo(nextX, nextY);
              startLocX = nextX;
              startLocY = nextY;
            }
            ctx.stroke();
            ctx.restore();
          } else if (p.type === 'electric_ring') {
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, (p.maxLife - p.life) * 3.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          } else if (p.type === 'stardust') {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 5;
            ctx.shadowColor = p.color;
            // Draw star shape
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - p.size);
            ctx.lineTo(p.x + p.size/3, p.y - p.size/3);
            ctx.lineTo(p.x + p.size, p.y);
            ctx.lineTo(p.x + p.size/3, p.y + p.size/3);
            ctx.lineTo(p.x, p.y + p.size);
            ctx.lineTo(p.x - p.size/3, p.y + p.size/3);
            ctx.lineTo(p.x - p.size, p.y);
            ctx.lineTo(p.x - p.size/3, p.y - p.size/3);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          } else if (p.type === 'chess_piece') {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle || 0);
            ctx.scale(0.8, 0.8);
            ctx.fillStyle = p.meta.style === 'white' ? '#f8fafc' : '#334155';
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1.5;
            
            ctx.beginPath();
            if (p.meta.shape === 'pawn') {
              ctx.arc(0, -5, 4, 0, Math.PI * 2);
              ctx.fillRect(-5, 0, 10, 8);
            } else if (p.meta.shape === 'knight') {
              ctx.moveTo(-6, 8); ctx.lineTo(-6, 2); ctx.quadraticCurveTo(-10, -6, 0, -10); ctx.lineTo(6, 8);
            } else {
              ctx.rect(-6, -6, 12, 12);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          } else if (p.type === 'trail') {
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            // default dot
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillRect(p.x, p.y, p.size, p.size);
          }

          return p;
        }).filter(p => p.life > 0);

        animationId = requestAnimationFrame(updateFrame);
      };

      updateFrame();

      return () => {
        cancelAnimationFrame(animationId);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
      };
    }, [gameId, isActive]);

    // Chess Board coordinates logic to count rating and killfeeds
    return (
      <div 
        id={`canvas-wrapper-${gameId}`}
        ref={containerRef} 
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-20"
      >
        <canvas 
          id={`interactive-canvas-${gameId}`}
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />

        {/* Floating HTML UI elements mapped directly to game events */}
        {gameId === 'bgmi' && (
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 pointer-events-none select-none z-30">
            {killFeeds.map(feed => (
              <div 
                key={feed.id} 
                className="bg-black/95 text-red-500 border border-red-500/30 px-3 py-1 text-xs font-mono tracking-widest uppercase animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)] rounded"
              >
                🎮 {GAMER_PROFILE.primaryUsername} <span className="text-white font-sans font-normal opacity-70">CONQUERED</span> {feed.text}
              </div>
            ))}
          </div>
        )}

        {gameId === 'chess' && (
          <div className="absolute bottom-4 left-4 bg-emerald-950/80 border border-emerald-500/20 px-3 py-1.5 rounded flex items-center gap-2 font-mono text-xs text-emerald-400 z-30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>LIVE RATING: <strong className="text-white text-sm">{eloDisplay} ELO</strong></span>
          </div>
        )}
      </div>
    );
  }
);
AnimationCanvas.displayName = 'AnimationCanvas';
