/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameData } from './types';

export const GAMER_PROFILE = {
  primaryUsername: "Renga",
  alias: "Clown Ghost",
  secondaryAlias: "Rengaprasath",
  title: "VIRTUAL SYSTEMS CORE OPERATOR",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Renga&backgroundColor=030712",
  globalRank: "#12",
  uptime: "99.98%",
  coreStatus: "ACTIVE",
  sector: "Sector 7-India",
  level: 99
};

export const GAMES_DATA: GameData[] = [
  {
    id: 'coc',
    title: 'Clash of Clans',
    icon: '⚔️',
    tagline: 'Strategic Fortress Mastermind',
    color: 'coc-orange',
    glowColor: 'border-glow-coc',
    primaryColor: 'text-orange-500',
    secondaryColor: 'bg-orange-950/40 text-orange-400 border-orange-500/30',
    badge: 'TH18 Maxed',
    about: 'Legendary sieges coordinator and elite clan warrior. Achieved supreme Hall of Fame status with unbreakable base designs and custom strategy schemes.',
    mainStats: [
      { label: 'Town Hall', value: 'TH18', highlight: true },
      { label: 'League Rank', value: 'Legend League', highlight: true },
      { label: 'Heroes', value: 'All Maxed 👑', highlight: true },
    ],
    subStats: [
      { label: 'In-Game Nick', value: 'Renga' },
      { label: 'Active Clan', value: 'tamilanda' },
      { label: 'Strategic Zone', value: 'India' },
      { label: 'War Stars Won', value: '5,240' },
      { label: 'Clan Games Peak', value: '8,500' },
    ]
  },
  {
    id: 'bgmi',
    title: 'BGMI',
    icon: '🎯',
    tagline: 'High-Precision Special Ops Fragger',
    color: 'bgmi-cyan',
    glowColor: 'border-glow-bgmi',
    primaryColor: 'text-cyan-400',
    secondaryColor: 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30',
    badge: 'Dominator',
    about: 'Elite front-line Marksman and strategic team vanguard. Famed in competitive tournaments for high-speed headshot clicks and seamless close-combat sweeps.',
    mainStats: [
      { label: 'Rank League', value: 'Dominator', highlight: true },
      { label: 'F/D Ratio', value: '3.1', highlight: true },
      { label: 'Win Ratio', value: '42.5%', highlight: true },
    ],
    subStats: [
      { label: 'Profile Name', value: 'Clown Ghost' },
      { label: 'Accuracy', value: '31.2%' },
      { label: 'Squad Role', value: 'Assaulter / Sniper' },
      { label: 'Avg Survival', value: '24.5 min' },
      { label: 'Kills Total', value: '14,810' },
    ]
  },
  {
    id: 'pogo',
    title: 'Pokémon GO',
    icon: '⚡',
    tagline: 'Apex Shadow Mythic Collector',
    color: 'pogo-yellow',
    glowColor: 'border-glow-pogo',
    primaryColor: 'text-yellow-400',
    secondaryColor: 'bg-yellow-950/40 text-yellow-400 border-yellow-500/30',
    badge: 'Lv.75 Legendary',
    about: 'Worldwide wanderer and battle league champion. Possesses a premier line of high CP legendary mythic shadows. Mystic guild commander in his home territory.',
    mainStats: [
      { label: 'Account level', value: 'Level 75', highlight: true },
      { label: 'Assigned Team', value: 'Team Mystic ❄️', highlight: true },
      { label: 'Battles Won', value: '25,480', highlight: true },
    ],
    subStats: [
      { label: 'Trainer Name', value: 'Rengaprasath' },
      { label: 'Distance Covered', value: '18,500 km' },
      { label: 'Pokémon Caught', value: '320,400' },
      { label: 'Stardust Reserve', value: '45.2M' },
      { label: 'Gyms Guarded', value: '620' },
    ]
  },
  {
    id: 'chess',
    title: 'Chess.com',
    icon: '♟️',
    tagline: 'Tactical Blitz Mindbender',
    color: 'chess-green',
    glowColor: 'border-glow-chess',
    primaryColor: 'text-emerald-400',
    secondaryColor: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30',
    badge: 'Rating 200',
    about: 'An completely unpredictable grand strategist. Master of high-stress speed blunders and shocking early Queen gambits. Deeply feared for complete board chaos.',
    mainStats: [
      { label: 'Chess Rating', value: '200 ELO', highlight: true },
      { label: 'Active Category', value: 'Rapid / Blitz', highlight: true },
      { label: 'Puzzles Core', value: 'Rating 520', highlight: true },
    ],
    subStats: [
      { label: 'Member Handle', value: 'Renga' },
      { label: 'Total Matches', value: '41,120' },
      { label: 'Blunders Ratio', value: 'High Chaos' },
      { label: 'En Passant Executed', value: '100%' },
      { label: 'Current Streak', value: '1 victory' },
    ]
  }
];
