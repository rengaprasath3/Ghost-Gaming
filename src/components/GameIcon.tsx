/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useId } from 'react';
import { GameID } from '../types';

interface GameIconProps {
  gameId: GameID;
  className?: string;
}

export default function GameIcon({ gameId, className = "w-full h-full" }: GameIconProps) {
  const baseId = useId().replace(/:/g, '');

  if (gameId === 'coc') {
    // Clash of Clans Stylized Barbarian Screaming face icon (high-fidelity vector recreate)
    const bgId = `coc-bg-${baseId}`;
    const skinRealId = `coc-skin-real-${baseId}`;
    const helmetMetalId = `coc-helmet-metal-${baseId}`;
    const hairId = `coc-hair-${baseId}`;
    const shadowId = `coc-shadow-${baseId}`;

    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8d4c1b" />
            <stop offset="50%" stopColor="#51220a" />
            <stop offset="100%" stopColor="#2c1103" />
          </linearGradient>
          <linearGradient id={skinRealId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffeedd" />
            <stop offset="60%" stopColor="#f3a673" />
            <stop offset="100%" stopColor="#cf6a32" />
          </linearGradient>
          <linearGradient id={hairId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffeaa7" />
            <stop offset="50%" stopColor="#f1c40f" />
            <stop offset="100%" stopColor="#d63031" />
          </linearGradient>
          <linearGradient id={helmetMetalId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe68a" />
            <stop offset="50%" stopColor="#cca100" />
            <stop offset="100%" stopColor="#7a5c00" />
          </linearGradient>
          <filter id={shadowId} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Icon Background */}
        <rect width="100" height="100" rx="20" fill={`url(#${bgId})`} />
        <rect x="2" y="2" width="96" height="96" rx="18" stroke="#cca100" strokeWidth="2.5" opacity="0.8" />

        {/* Angry/Screaming barbarian head container */}
        <g filter={`url(#${shadowId})`}>
          {/* Ear left/right */}
          <circle cx="24" cy="58" r="6" fill="#f3a673" stroke="#8d4c1b" strokeWidth="1.5" />
          <circle cx="76" cy="58" r="6" fill="#f3a673" stroke="#8d4c1b" strokeWidth="1.5" />

          {/* Skin face block */}
          <path d="M 28 42 C 28 32 72 32 72 42 L 72 68 C 72 78 28 78 28 68 Z" fill={`url(#${skinRealId})`} />

          {/* Sideburns Hair */}
          <path d="M 27 34 L 27 50 L 32 46 Z" fill="#f1c40f" />
          <path d="M 73 34 L 73 50 L 68 46 Z" fill="#f1c40f" />

          {/* Helmet on Head */}
          <path d="M 25 34 C 25 15 75 15 75 34 C 75 36 25 36 25 34 Z" fill={`url(#${helmetMetalId})`} stroke="#4a3b00" strokeWidth="1.5" />
          {/* Helmet center strip ridge */}
          <path d="M 47 16 C 47 16 50 12 50 12 C 50 12 53 16 53 16 L 53 34 L 47 34 Z" fill="#fff" opacity="0.3" />
          {/* Helmet rivets */}
          <circle cx="34" cy="28" r="1.5" fill="#eceff1" />
          <circle cx="44" cy="24" r="1.5" fill="#eceff1" />
          <circle cx="56" cy="24" r="1.5" fill="#eceff1" />
          <circle cx="66" cy="28" r="1.5" fill="#eceff1" />

          {/* Giant Screaming Mouth */}
          <path d="M 36 58 Q 50 50 64 58 C 65 72 35 72 36 58 Z" fill="#2c0c00" stroke="#8d4c1b" strokeWidth="2.5" />
          
          {/* Teeth Row Top */}
          <path d="M 38 56 L 41 59 L 45 57 L 50 60 L 55 57 L 59 59 L 62 56 L 61 54 L 39 54 Z" fill="#ffffff" />
          {/* Teeth Row Bottom */}
          <path d="M 38 64 L 42 61 L 46 62 L 50 60 L 54 62 L 58 61 L 62 64" fill="#ffffff" stroke="#2c0c00" strokeWidth="0.5" />

          {/* Golden Yellow Mustache Curve around mouth */}
          <path d="M 34 50 Q 50 48 66 50 C 72 66 65 76 60 76 Q 50 66 40 76 C 35 76 28 66 34 50 Z" fill={`url(#${hairId})`} stroke="#4a3b00" strokeWidth="1.5" />
          
          {/* Hollow nose */}
          <path d="M 46 48 Q 50 45 54 48 Z" fill="#cf6a32" />

          {/* Angry Eyes */}
          {/* Left Eye */}
          <path d="M 34 43 Q 41 40 45 45" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <path d="M 36 44 L 44 44 L 42 47 L 38 47 Z" fill="#fff" />
          <circle cx="41" cy="45" r="1.5" fill="#000" />
          {/* Right Eye */}
          <path d="M 66 43 Q 59 40 55 45" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <path d="M 64 44 L 56 44 L 58 47 L 62 47 Z" fill="#fff" />
          <circle cx="59" cy="45" r="1.5" fill="#000" />

          {/* Saliva / Clenched Spittle droplets coming out of mouth corners */}
          <path d="M 35 60 C 33 66 36 74 37 74 C 38 74 37 66 37 60 Z" fill="#e0f2fe" opacity="0.85" />
          <circle cx="37" cy="74.5" r="1" fill="#e0f2fe" opacity="0.9" />
          <path d="M 65 60 C 67 66 64 74 63 74 C 62 74 63 66 63 60 Z" fill="#e0f2fe" opacity="0.85" />
          <circle cx="63" cy="74.5" r="1" fill="#e0f2fe" opacity="0.9" />
        </g>
      </svg>
    );
  }

  if (gameId === 'bgmi') {
    // BGMI/PUBG Soldier Helmet with Orange Smoke backdrop + BGMI banner (exact layout)
    const skyBackId = `bgmi-sky-back-${baseId}`;
    const steelGradId = `bgmi-steel-grad-${baseId}`;
    const smokeCloudId = `smoke-cloud-${baseId}`;
    const blurId = `bgmi-blur-${baseId}`;

    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={skyBackId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff4500" />
            <stop offset="45%" stopColor="#e02000" />
            <stop offset="100%" stopColor="#120200" />
          </linearGradient>
          <linearGradient id={steelGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#707680" />
            <stop offset="50%" stopColor="#2e3136" />
            <stop offset="100%" stopColor="#111215" />
          </linearGradient>
          <linearGradient id={smokeCloudId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff0000" stopOpacity="0.1" />
          </linearGradient>
          <filter id={blurId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Icon Background Container */}
        <rect width="100" height="100" rx="20" fill={`url(#${skyBackId})`} />

        {/* Cinematic Fiery Explosive smoke trails/elements in backdrop */}
        <circle cx="15" cy="25" r="18" fill={`url(#${smokeCloudId})`} filter={`url(#${blurId})`} />
        <circle cx="85" cy="30" r="22" fill={`url(#${smokeCloudId})`} filter={`url(#${blurId})`} />
        <circle cx="50" cy="15" r="15" fill="#ffa500" opacity="0.6" filter={`url(#${blurId})`} />

        {/* Soldier Player Silhouette standing */}
        {/* Collar / White Shirt */}
        <path d="M 32 80 L 40 68 L 50 78 L 60 68 L 68 80 Z" fill="#ffffff" stroke="#111" strokeWidth="1" />
        {/* Black Tie */}
        <path d="M 47 75 L 53 75 L 54 90 L 50 94 L 46 90 Z" fill="#111111" />
        {/* Tactical vest Straps / Suspenders */}
        <path d="M 30 75 L 36 71 L 38 85 M 70 75 L 64 71 L 62 85" stroke="#1c1d22" strokeWidth="4" strokeLinecap="round" />

        {/* Tactical Helmet Level 3 (PUBG/BGMI signature item) */}
        {/* Dark neck and chin guard */}
        <path d="M 36 50 L 32 64 Q 50 70 68 64 L 64 50 Z" fill="#15171c" />

        {/* Helmet Main Dome */}
        <path d="M 24 50 C 24 22 76 22 76 50 L 78 57 L 22 57 Z" fill={`url(#${steelGradId})`} stroke="#111" strokeWidth="1.5" />

        {/* Welding Visor viewport plate slightly angled */}
        <path d="M 28 38 L 72 38 L 74 50 L 26 50 Z" fill="#0c0d10" stroke="#111" strokeWidth="1" />
        {/* Metallic visor framing bracket */}
        <path d="M 26 36 L 74 36 L 75 39 L 25 39 Z" fill="#4d525d" />

        {/* Vision slits on helmet */}
        <rect x="34" y="42" width="4" height="4" rx="0.5" fill="#000" />
        <rect x="42" y="42" width="4" height="4" rx="0.5" fill="#000" />
        <rect x="50" y="42" width="4" height="4" rx="0.5" fill="#000" />
        <rect x="58" y="42" width="4" height="4" rx="0.5" fill="#000" />
        <rect x="66" y="42" width="4" height="4" rx="0.5" fill="#000" />

        <line x1="36" y1="41" x2="36" y2="47" stroke="#4d525d" strokeWidth="0.8" />
        <line x1="44" y1="41" x2="44" y2="47" stroke="#4d525d" strokeWidth="0.8" />
        <line x1="52" y1="41" x2="52" y2="47" stroke="#4d525d" strokeWidth="0.8" />
        <line x1="60" y1="41" x2="60" y2="47" stroke="#4d525d" strokeWidth="0.8" />
        <line x1="68" y1="41" x2="68" y2="47" stroke="#4d525d" strokeWidth="0.8" />

        {/* Shiny Highlight across armor helmet */}
        <path d="M 34 26 C 34 26 55 18 68 26" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />

        {/* BGMI KRAFTON Banner box at the bottom */}
        <rect x="25" y="72" width="50" height="15" rx="2" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
        <rect x="27" y="74" width="46" height="11" fill="#0c0d10" />
        <text x="50" y="81" fill="#ffffff" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.8">BGMI</text>
        <text x="50" y="83.5" fill="#ffffff" fontSize="2.2" fontWeight="700" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">KRAFTON</text>
      </svg>
    );
  }

  if (gameId === 'pogo') {
    // Pokémon GO detailed emblem (Exact Pokeball floating in dynamic blue starry grid environment)
    const skyGradId = `pogo-sky-grad-${baseId}`;
    const ballRedId = `ball-red-${baseId}`;
    const ballWhiteId = `ball-white-${baseId}`;
    const ringShineId = `ring-shine-${baseId}`;

    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={skyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a3bc7" />
            <stop offset="50%" stopColor="#051559" />
            <stop offset="100%" stopColor="#01041c" />
          </linearGradient>
          <linearGradient id={ballRedId} x1="30" y1="20" x2="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff5959" />
            <stop offset="60%" stopColor="#dc0909" />
            <stop offset="100%" stopColor="#8a0000" />
          </linearGradient>
          <linearGradient id={ballWhiteId} x1="50" y1="50" x2="70" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#dedede" />
            <stop offset="100%" stopColor="#9e9e9e" />
          </linearGradient>
          <radialGradient id={ringShineId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dynamic Space Sky Background */}
        <rect width="100" height="100" rx="20" fill={`url(#${skyGradId})`} />
        <rect x="2" y="2" width="96" height="96" rx="18" stroke="#1e3a8a" strokeWidth="2" opacity="0.6" />

        {/* Star sparkles */}
        <polygon points="15,20 16.5,16 18,20 16.5,24" fill="#ffffff" opacity="0.7" />
        <polygon points="85,25 86,22 87,25 86,28" fill="#58a6ff" opacity="0.8" />
        <polygon points="25,45 25.5,43 26,45 25.5,47" fill="#ffffff" opacity="0.6" />
        <polygon points="78,75 79,72 80,75 79,78" fill="#ffffff" opacity="0.75" />
        {/* Twinkly core spark */}
        <circle cx="16.5" cy="16.5" r="1.5" fill="#fff" filter="blur-xs" />

        {/* Ground grid / road swooshes resembling Pokemon GO style */}
        <path d="M -10 95 C 10 90 40 85 50 100" stroke="#00f0ff" strokeWidth="4.5" opacity="0.45" />
        <path d="M 120 95 C 90 82 45 88 50 102" stroke="#00b0ff" strokeWidth="3" opacity="0.38" />

        {/* Center Floating PokeBall block */}
        <g id="pokeball" transform="translate(0, -2)">
          {/* Outer ball shadow */}
          <circle cx="50" cy="52" r="30" fill="#000000" opacity="0.35" />

          {/* White Hemisphere bottom half */}
          <path d="M 20 50 A 30 30 0 0 0 80 50 Z" fill={`url(#${ballWhiteId})`} />

          {/* Red Hemisphere top half */}
          <path d="M 20 50 A 30 30 0 0 1 80 50 Z" fill={`url(#${ballRedId})`} />

          {/* Top gloss white reflection crescents overlay */}
          <path d="M 25 45 C 27 30 40 22 55 24 C 42 24 30 32 27 45 Z" fill="#ffffff" opacity="0.4" />

          {/* Horizontal Black belt band */}
          <rect x="19.5" y="47" width="61" height="6" fill="#1c1d22" />

          {/* Center Button assemblies */}
          {/* Black core button outer ring */}
          <circle cx="50" cy="50" r="10" fill="#1c1d22" />
          {/* Silver spacer ring */}
          <circle cx="50" cy="50" r="7.5" fill="#f0f2f5" />
          {/* Inner trigger clicker */}
          <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
          <circle cx="48.5" cy="48.5" r="1" fill="#fff" opacity="0.9" /> {/* reflection dot */}
        </g>
      </svg>
    );
  }

  // chess - Chess.com Premium Pawn flat style matching the image uploaded.
  const chessTileBgId = `chess-tile-bg-${baseId}`;

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Soft chess.com standard gradient dark bg */}
        <linearGradient id={chessTileBgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#312e2b" />
          <stop offset="100%" stopColor="#211f1d" />
        </linearGradient>
      </defs>

      {/* Background with subtle 4-tile split line (like the Chess.com icon) */}
      <rect width="100" height="100" rx="20" fill={`url(#${chessTileBgId})`} fillOpacity="1" />
      
      {/* Visual quadrant quadrant shading */}
      <rect x="0" y="0" width="50" height="100" fill="#000" fillOpacity="0.1" /> {/** Left vertical half is slightly darkened */}
      <rect x="0" y="50" width="100" height="50" fill="#000" fillOpacity="0.08" /> {/** Bottom half is slightly darkened */}

      {/* Chess Pawn (The distinctive green pawn shape, flat vectors with two-tone shading divide) */}
      <g id="green-pawn" transform="translate(0, 3)">
        {/* Underlay dropshadow */}
        <ellipse cx="50" cy="80" rx="28" ry="6" fill="#000000" fillOpacity="0.4" />

        {/* Left Half (Light lime green #81b64c) */}
        <path d="
          M 50 15 
          A 15 15 0 0 0 35 30 
          C 35 34 38 37 41 39
          L 31 43 
          C 31 43 31 45 35 45 
          L 42 45 
          C 40 55 24 67 24 77 
          C 24 79 38 80 50 80
          Z" 
          fill="#81b64c" 
        />

        {/* Right Half (Darker forest/grass green #56842b) */}
        <path d="
          M 50 15 
          A 15 15 0 0 1 65 30 
          C 65 34 62 37 59 39
          L 69 43 
          C 69 43 69 45 65 45 
          L 58 45 
          C 60 55 76 67 76 77 
          C 76 79 62 80 50 80
          Z" 
          fill="#56842b" 
        />

        {/* Highlight flare glint on Left Top Head */}
        <path d="
          M 41.5 19.5 
          C 39 21.5 37.5 24.5 37.5 27 
          C 37.5 24 40.5 21 44 20
          Z" 
          fill="#ffffff" 
          fillOpacity="0.45" 
        />
        
        {/* Soft neck ring center overlay */}
        <ellipse cx="50" cy="45" rx="14.5" ry="1.5" fill="#4d7426" opacity="0.3" />
      </g>
    </svg>
  );
}
