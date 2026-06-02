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
    icon: 'https://play-lh.googleusercontent.com/LBy0v9g9Kq9ZfJ_P1A8Kx39Yq8A09Uny8VzG66R_n0hU8Fz4pW8_VvY8u5b2vX2K78',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Clash_of_Clans_logo.png',
    bgScene: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
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
    icon: 'https://play-lh.googleusercontent.com/gO0q6f2nB2f_Wcl_UonO5s8v_L84sC5v_u9S88mP8-L_O7rVq9m6aU0F1A1aG_YI7s',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Battlegrounds_Mobile_India_logo.png',
    bgScene: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
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
    icon: 'https://play-lh.googleusercontent.com/orZ96_6Wp70G9Sca9vY4q6c3U1hF5D3r70gOf9Z9B6kR6Dk1_R',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/512px-Pok%C3%A9_Ball_icon.svg.png',
    bgScene: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
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
    icon: 'https://play-lh.googleusercontent.com/v8pLa9XSTv7bChm0M9XG5SK0P5PfVgZ7_p2E5v79V4_X8',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Chess.com_logo.svg/480px-Chess.com_logo.svg.png',
    bgScene: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80',
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
