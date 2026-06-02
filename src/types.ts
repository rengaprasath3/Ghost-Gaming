/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GameStat {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export type GameID = 'coc' | 'bgmi' | 'pogo' | 'chess';

export interface GameData {
  id: GameID;
  title: string;
  icon: string;
  tagline: string;
  color: string; // Tailwind glow class/hex
  glowColor: string; // Tailwind border-glow, bg-glow
  primaryColor: string; // tailwind text color, e.g. text-orange-500
  secondaryColor: string;
  badge: string;
  mainStats: GameStat[];
  subStats: GameStat[];
  about: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  angle?: number;
  spin?: number;
  type?: string;
  gravity?: number;
}

export interface AnimationEvent {
  id: string;
  type: string;
  x: number;
  y: number;
  createdAt: number;
}
