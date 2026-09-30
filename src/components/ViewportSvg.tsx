import React, { useState } from 'react';
import { GameState, ItemId } from '../types/game';
import { Info, Sparkles } from 'lucide-react';

interface ViewportSvgProps {
  state: GameState;
  onTakeItem?: (item: ItemId) => void;
  onToggleLantern?: () => void;
  onUnlockGrate?: () => void;
  onOpenGrate?: () => void;
  onCatchBird?: () => void;
}

export const ViewportSvg: React.FC<ViewportSvgProps> = ({
  state,
  onTakeItem,
  onToggleLantern,
  onUnlockGrate,
  onOpenGrate,
  onCatchBird,
}) => {
  const { currentRoom, lanternLit, grateUnlocked, grateOpen, roomItems, snakeFrightened } = state;
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);

  // Common SVG filters and reusable gradients with authentic natural tones
  const renderDefs = () => (
    <defs>
      {/* Subtle Natural Ambient Softening */}
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Gentle Warm Specular Highlight */}
      <filter id="superGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Fine Vignette Shadow */}
      <radialGradient id="vignetteGrad" cx="50%" cy="50%" r="55%">
        <stop offset="70%" stopColor="#000000" stopOpacity="0" />
        <stop offset="100%" stopColor="#0f0c09" stopOpacity="0.45" />
      </radialGradient>

      {/* Genuine Antique Gold Foil */}
      <linearGradient id="richGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#faecd0" />
        <stop offset="30%" stopColor="#e2bc72" />
        <stop offset="70%" stopColor="#b6893c" />
        <stop offset="100%" stopColor="#7a5520" />
      </linearGradient>

      {/* Weathered Antique Brass */}
      <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#f5e6cc" />
        <stop offset="35%" stopColor="#cca972" />
        <stop offset="70%" stopColor="#9e7b44" />
        <stop offset="100%" stopColor="#634924" />
      </linearGradient>

      {/* Natural Mountain Brook Water */}
      <linearGradient id="waterFlow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#437785" stopOpacity="0.88" />
        <stop offset="50%" stopColor="#5d98a6" stopOpacity="0.82" />
        <stop offset="100%" stopColor="#7cb4bf" stopOpacity="0.9" />
      </linearGradient>

      {/* Clear Brook Surface Highlights */}
      <linearGradient id="waterSurface" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a5d2dc" stopOpacity="0.7" />
        <stop offset="50%" stopColor="#e8f4f6" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#78abb6" stopOpacity="0.65" />
      </linearGradient>
    </defs>
  );

  // 1. ROAD_END (Outside Brick Building) - Realistic Classical Landscape Painting
  const renderRoadEnd = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
      {renderDefs()}
      <defs>
        {/* Natural Daylight Sky: Soft cerulean blue descending into warm horizon */}
        <linearGradient id="countrySky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4e82aa" />
          <stop offset="35%" stopColor="#7fa8c7" />
          <stop offset="70%" stopColor="#b9d3e3" />
          <stop offset="92%" stopColor="#e7e5d8" />
          <stop offset="100%" stopColor="#faecd6" />
        </linearGradient>

        {/* Distant Atmospheric Mountains */}
        <linearGradient id="mountainRidgeFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6c889a" />
          <stop offset="100%" stopColor="#9cb3c1" />
        </linearGradient>
        <linearGradient id="mountainRidgeMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d5849" />
          <stop offset="100%" stopColor="#627d6d" />
        </linearGradient>

        {/* Authentic Red Brick Wall Gradient with Mortar Tone */}
        <linearGradient id="brickWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#964334" />
          <stop offset="40%" stopColor="#ab4f3f" />
          <stop offset="70%" stopColor="#873a2c" />
          <stop offset="100%" stopColor="#732e22" />
        </linearGradient>

        {/* Natural Weathered Slate Roof */}
        <linearGradient id="roofSlate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c3339" />
          <stop offset="45%" stopColor="#3b444c" />
          <stop offset="85%" stopColor="#48535c" />
          <stop offset="100%" stopColor="#262c32" />
        </linearGradient>

        {/* Sandy Gravel Country Road */}
        <linearGradient id="dirtRoadGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b6a38c" />
          <stop offset="45%" stopColor="#9e8b74" />
          <stop offset="80%" stopColor="#87755e" />
          <stop offset="100%" stopColor="#6e5e4b" />
        </linearGradient>

        {/* Natural Sun Flare */}
        <radialGradient id="gentleSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffdf7" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#fef3c7" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#fde68a" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Country Sky Canvas */}
      <rect width="880" height="340" fill="url(#countrySky)" />

      {/* Gentle Fluffy Clouds with Soft Highlights and Under-Shading */}
      <g opacity="0.85">
        {/* High Cirrus streaks */}
        <path d="M40,50 Q180,35 340,55 Q500,40 680,60" fill="none" stroke="#ffffff" strokeWidth="6" opacity="0.35" strokeLinecap="round" />
        <path d="M220,75 Q380,60 560,80" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.3" strokeLinecap="round" />

        {/* Main Cumulus Cloud Bank (Left) */}
        <path
          d="M60,140 Q80,105 125,115 Q150,90 195,95 Q235,80 270,105 Q300,95 330,115 Q360,120 375,145 Q360,170 320,175 L90,175 Q60,165 60,140 Z"
          fill="#cbd7e2"
          opacity="0.4"
        />
        <path
          d="M65,135 Q85,100 125,110 Q150,85 195,90 Q235,75 270,100 Q300,90 330,110 Q355,115 370,140 Q350,160 310,165 L95,165 Q65,155 65,135 Z"
          fill="#fbfaf6"
          opacity="0.9"
        />

        {/* Soft Cumulus (Right near Sun) */}
        <path
          d="M520,130 Q545,95 590,100 Q625,75 670,85 Q710,70 750,95 Q785,90 815,115 Q820,145 780,155 L540,155 Q515,145 520,130 Z"
          fill="#faecd6"
          opacity="0.5"
        />
        <path
          d="M525,125 Q550,90 590,95 Q625,70 670,80 Q710,65 750,90 Q780,85 810,110 Q815,135 775,145 L545,145 Q520,140 525,125 Z"
          fill="#ffffff"
          opacity="0.85"
        />
      </g>

      {/* Afternoon Natural Sun */}
      <circle cx="710" cy="85" r="70" fill="url(#gentleSun)" pointerEvents="none" />
      <circle cx="710" cy="85" r="24" fill="#fffef7" />

      {/* 2. Distant Mountain Ranges (Atmospheric Perspective) */}
      {/* Far Blue-Grey Ridge */}
      <polygon
        points="0,260 90,210 180,240 290,180 430,240 570,170 710,230 810,190 880,225 880,330 0,330"
        fill="url(#mountainRidgeFar)"
        opacity="0.75"
      />
      {/* Mid Greenish Ridge */}
      <polygon
        points="0,285 130,235 250,270 380,215 510,265 650,205 780,260 880,220 880,340 0,340"
        fill="url(#mountainRidgeMid)"
        opacity="0.85"
      />

      {/* 3. Deep Background Pine & Fir Canopy */}
      <g fill="#1b3523">
        {[0, 35, 70, 105, 140, 175, 210, 680, 715, 750, 785, 820, 855].map((x, i) => (
          <polygon key={i} points={`${x},325 ${x + 22},205 ${x + 44},325`} />
        ))}
      </g>

      {/* 4. Midground Rolling Grassy Hills & Valley */}
      {/* Upper Meadow Slope */}
      <path
        d="M0,310 Q220,290 440,305 T880,295 L880,520 L0,520 Z"
        fill="#3e5f2e"
      />
      {/* Warm Sunlit Pasture Ridge */}
      <path
        d="M0,330 Q260,310 520,335 T880,315 L880,520 L0,520 Z"
        fill="#4d7237"
      />

      {/* Midground Layered Forest with Organic Pine & Leafy Trees */}
      <g>
        {/* Pine Trees Group (Left Forest) */}
        {[
          { x: 15, h: 140, w: 55, c: '#23442a' },
          { x: 50, h: 170, w: 65, c: '#2c5334' },
          { x: 95, h: 150, w: 60, c: '#213f27' },
          { x: 135, h: 180, w: 70, c: '#315c3a' },
          { x: 180, h: 145, w: 55, c: '#284d30' },
          { x: 220, h: 160, w: 60, c: '#3a6843' },
          { x: 260, h: 130, w: 50, c: '#274b2f' },
          // Right Forest behind house
          { x: 670, h: 165, w: 65, c: '#26482d' },
          { x: 715, h: 190, w: 70, c: '#325e3b' },
          { x: 765, h: 175, w: 65, c: '#274a2f' },
          { x: 810, h: 185, w: 70, c: '#396742' },
          { x: 845, h: 155, w: 55, c: '#224027' },
        ].map((tree, i) => (
          <g key={i}>
            {/* Trunk */}
            <rect x={tree.x + tree.w / 2 - 4} y={345 - 25} width="8" height="30" fill="#463426" />
            {/* Bottom tier */}
            <polygon
              points={`${tree.x},330 ${tree.x + tree.w / 2},${330 - tree.h * 0.45} ${tree.x + tree.w},330`}
              fill={tree.c}
            />
            {/* Middle tier */}
            <polygon
              points={`${tree.x + tree.w * 0.12},${330 - tree.h * 0.3} ${tree.x + tree.w / 2},${330 - tree.h * 0.75} ${tree.x + tree.w * 0.88},${330 - tree.h * 0.3}`}
              fill={tree.c}
            />
            {/* Top tier */}
            <polygon
              points={`${tree.x + tree.w * 0.22},${330 - tree.h * 0.6} ${tree.x + tree.w / 2},${330 - tree.h} ${tree.x + tree.w * 0.78},${330 - tree.h * 0.6}`}
              fill={tree.c}
            />
            {/* Sunlit needle highlight on south side */}
            <polygon
              points={`${tree.x + tree.w / 2},${330 - tree.h} ${tree.x + tree.w * 0.78},${330 - tree.h * 0.6} ${tree.x + tree.w / 2},${330 - tree.h * 0.6}`}
              fill="#528359"
              opacity="0.5"
            />
          </g>
        ))}
      </g>

      {/* 5. Country Dirt & Gravel Road */}
      {/* Roadbed sweeping in from bottom-left up to the well-house entrance */}
      <path
        d="M80,520 Q180,450 260,400 T360,345 L430,345 Q360,375 290,440 T180,520 Z"
        fill="url(#dirtRoadGrad)"
      />
      {/* Sandy wagon ruts and crushed river pebble details */}
      <path d="M105,520 Q200,450 280,405 T380,350" fill="none" stroke="#7e6c56" strokeWidth="4" opacity="0.6" />
      <path d="M150,520 Q235,455 315,410 T400,352" fill="none" stroke="#7e6c56" strokeWidth="4" opacity="0.6" />
      <path d="M125,520 Q215,452 295,408 T390,351" fill="none" stroke="#cfc0aa" strokeWidth="2" strokeDasharray="14 10" opacity="0.75" />

      {/* Grassy margins and clover tufts along the road edges */}
      <g fill="#436530">
        {[90, 130, 170, 210, 250, 290, 330, 370].map((x, idx) => (
          <ellipse key={idx} cx={x} cy={515 - idx * 22} rx={10 + (idx % 3) * 3} ry={4} />
        ))}
      </g>

      {/* 6. The Historic Brick Well-House */}
      <g id="wellhouse" transform="translate(420, 175)">
        {/* Shadow cast by building onto the grass */}
        <polygon points="0,170 230,170 270,195 40,195" fill="#25381d" opacity="0.5" />

        {/* Foundation: Rough-hewn Fieldstone Base */}
        <rect x="-4" y="150" width="238" height="22" rx="2" fill="#584f45" stroke="#3e3730" strokeWidth="2" />
        {[20, 55, 95, 140, 185].map((x, i) => (
          <line key={i} x1={x} y1="150" x2={x} y2="172" stroke="#3e3730" strokeWidth="1.5" />
        ))}
        {/* Moss clinging to foundation stones */}
        <path d="M-2,168 Q30,164 60,170 Q110,165 150,171 Q200,167 232,170" fill="none" stroke="#3f5a2b" strokeWidth="4" opacity="0.8" />

        {/* Stone Arch Culvert (where stream emerges from beneath well-house) */}
        <path d="M50,172 A22,22 0 0,1 94,172 Z" fill="#1f272a" stroke="#3e3730" strokeWidth="2" />

        {/* Main Brick Wall */}
        <rect x="0" y="20" width="230" height="132" fill="url(#brickWall)" stroke="#5c2419" strokeWidth="2.5" />

        {/* Realistic Brick Courses & Mortar Lines */}
        <g stroke="#ded6cb" strokeWidth="1.2" opacity="0.6">
          {[34, 48, 62, 76, 90, 104, 118, 132, 146].map((y, row) => (
            <React.Fragment key={row}>
              <line x1="0" y1={y} x2="230" y2={y} />
              {/* Staggered vertical mortar joints */}
              {[15, 45, 75, 105, 135, 165, 195, 225].map((x, col) => (
                <line
                  key={col}
                  x1={x + (row % 2 === 0 ? 0 : 15)}
                  y1={y}
                  x2={x + (row % 2 === 0 ? 0 : 15)}
                  y2={y + 14}
                />
              ))}
            </React.Fragment>
          ))}
        </g>

        {/* Steep Pitched Slate Shingle Roof */}
        <polygon points="-25,22 115,-65 255,22" fill="url(#roofSlate)" stroke="#1a1e22" strokeWidth="3" />
        {/* Roof Overhang Shadow on Brick Front */}
        <polygon points="-5,22 235,22 230,30 0,30" fill="#2d130d" opacity="0.75" />
        {/* Shingle horizontal course textures */}
        {[-45, -28, -10, 8].map((y, idx) => {
          const w = 115 + (y + 65) * 1.5;
          return (
            <line
              key={idx}
              x1={115 - w * 0.8}
              y1={y}
              x2={115 + w * 0.8}
              y2={y}
              stroke="#58636d"
              strokeWidth="2"
              opacity="0.5"
            />
          );
        })}
        {/* Ridge cap with zinc lead roll */}
        <line x1="115" y1="-67" x2="115" y2="-63" stroke="#8492a0" strokeWidth="4" strokeLinecap="round" />

        {/* Fieldstone Chimney */}
        <rect x="185" y="-55" width="28" height="60" fill="#63594d" stroke="#3f3830" strokeWidth="2" />
        <rect x="181" y="-58" width="36" height="8" rx="2" fill="#3f3830" />
        {/* Stone details on chimney */}
        <line x1="185" y1="-38" x2="213" y2="-38" stroke="#3f3830" strokeWidth="1.5" />
        <line x1="185" y1="-20" x2="213" y2="-20" stroke="#3f3830" strokeWidth="1.5" />
        {/* Gentle, soft curling woodsmoke drifting into sky */}
        <path
          d="M199,-62 Q195,-82 208,-98 Q222,-115 212,-132 Q202,-148 218,-168"
          fill="none"
          stroke="#f2ede4"
          strokeWidth="6"
          opacity="0.32"
          strokeLinecap="round"
          filter="url(#softGlow)"
        />
        <path
          d="M201,-62 Q206,-86 198,-106 Q190,-125 204,-145"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          opacity="0.4"
          strokeLinecap="round"
        />

        {/* Weathered Oak Entrance Door */}
        <g id="frontDoor">
          {/* Stone Jamb / Arch Frame */}
          <rect x="36" y="58" width="60" height="94" rx="3" fill="#3d362e" />
          {/* Vertical Oak Planks */}
          <rect x="40" y="62" width="52" height="90" rx="2" fill="#543722" stroke="#2a1b11" strokeWidth="1.5" />
          <line x1="53" y1="62" x2="53" y2="152" stroke="#332014" strokeWidth="1.5" />
          <line x1="66" y1="62" x2="66" y2="152" stroke="#332014" strokeWidth="1.5" />
          <line x1="79" y1="62" x2="79" y2="152" stroke="#332014" strokeWidth="1.5" />

          {/* Black Wrought-Iron Strap Hinges */}
          <rect x="38" y="76" width="34" height="4" fill="#1b1c1e" />
          <circle cx="70" cy="78" r="2.5" fill="#1b1c1e" />
          <rect x="38" y="130" width="34" height="4" fill="#1b1c1e" />
          <circle cx="70" cy="132" r="2.5" fill="#1b1c1e" />

          {/* Antique Brass Knob & Keyhole */}
          <circle cx="85" cy="108" r="3.5" fill="url(#brassGrad)" stroke="#452f14" strokeWidth="1" />
          <ellipse cx="85" cy="116" rx="1.5" ry="2.5" fill="#1a110a" />
        </g>

        {/* Country Multi-Pane Window with Sunlight Reflections */}
        <g id="countryWindow" transform="translate(132, 62)">
          {/* Brick Arch Header */}
          <rect x="-4" y="-5" width="68" height="8" rx="2" fill="#7a2a1c" stroke="#521a11" strokeWidth="1" />
          {/* Heavy White/Cream Painted Wooden Frame */}
          <rect x="0" y="0" width="60" height="60" rx="2" fill="#eae2d2" stroke="#5a4c3e" strokeWidth="2.5" />
          {/* Warm Interior Glow with Soft Sky Reflection in Glass Panes */}
          <rect x="4" y="4" width="24" height="24" fill="#2d4857" />
          <rect x="32" y="4" width="24" height="24" fill="#3a5868" />
          <rect x="4" y="32" width="24" height="24" fill="#fef3c7" opacity="0.85" />
          <rect x="32" y="32" width="24" height="24" fill="#fef08a" opacity="0.75" />
          {/* Soft Sunlight Gleam on Glass */}
          <polygon points="4,4 28,4 12,28 4,28" fill="#ffffff" opacity="0.35" />
          <polygon points="32,4 56,4 40,28 32,28" fill="#ffffff" opacity="0.35" />
          {/* Wood Mullion Crossbars */}
          <line x1="28" y1="0" x2="28" y2="60" stroke="#eae2d2" strokeWidth="3" />
          <line x1="0" y1="28" x2="60" y2="28" stroke="#eae2d2" strokeWidth="3" />
          {/* Window Sill */}
          <rect x="-4" y="58" width="68" height="6" rx="1" fill="#c7bba8" stroke="#5a4c3e" strokeWidth="1" />
        </g>
      </g>

      {/* 7. The Crystal Mountain Stream (Flowing out of well-house down into gully) */}
      <g id="brook">
        {/* Visible Riverbed & Stones underneath clear water */}
        <path
          d="M485,348 Q465,375 415,405 T265,455 T0,495 L0,520 L310,520 Q485,485 510,375 Z"
          fill="#5a4d3f"
        />
        {/* Riverbed Smooth Cobblestones */}
        {[
          { x: 470, y: 365, r: 5, c: '#7a6a57' },
          { x: 440, y: 390, r: 7, c: '#91806b' },
          { x: 385, y: 420, r: 8, c: '#6d5e4d' },
          { x: 330, y: 445, r: 10, c: '#867663' },
          { x: 260, y: 470, r: 11, c: '#5f5243' },
          { x: 190, y: 485, r: 9, c: '#7e6f5d' },
          { x: 120, y: 505, r: 12, c: '#6a5b4c' },
        ].map((stone, i) => (
          <ellipse key={i} cx={stone.x} cy={stone.y} rx={stone.r} ry={stone.r * 0.6} fill={stone.c} />
        ))}

        {/* Clear Turquoise Mountain Brook Water Body */}
        <path
          d="M485,347 Q465,374 415,404 T265,454 T0,494 L0,520 L310,520 Q485,485 508,373 Z"
          fill="url(#waterFlow)"
        />

        {/* Water Surface Stream Reflections */}
        <path
          d="M480,355 Q450,385 390,418 T215,478 T10,510"
          fill="none"
          stroke="url(#waterSurface)"
          strokeWidth="3.5"
          opacity="0.85"
        />
        <path
          d="M495,368 Q435,418 335,448 T125,498"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="20 12"
          opacity="0.75"
        />

        {/* Foam Cascades & Eddies around river rocks */}
        <ellipse cx="445" cy="392" rx="14" ry="4" fill="#e8f5f7" opacity="0.8" />
        <ellipse cx="375" cy="425" rx="18" ry="5" fill="#e8f5f7" opacity="0.8" />
        <ellipse cx="270" cy="468" rx="22" ry="6" fill="#e8f5f7" opacity="0.85" />
      </g>

      {/* 8. Foreground Mossy Boulders & Wildflowers */}
      {/* Boulder Cluster on Brook Bank */}
      <g id="foregroundRocks" transform="translate(670, 430)">
        {/* Main River Granite Boulder */}
        <ellipse cx="35" cy="30" rx="65" ry="36" fill="#4d5761" stroke="#2d343b" strokeWidth="2.5" />
        <ellipse cx="25" cy="20" rx="52" ry="24" fill="#626e7a" />
        {/* Lush Green Moss Cushion */}
        <path d="M-15,18 Q30,0 75,20 Q40,30 -15,18 Z" fill="#4a6d34" />
        <path d="M-5,16 Q28,4 62,18" fill="none" stroke="#689349" strokeWidth="2.5" />

        {/* Smaller Companion Boulder */}
        <ellipse cx="110" cy="45" rx="42" ry="24" fill="#3c434a" stroke="#24292d" strokeWidth="2" />
        <ellipse cx="105" cy="40" rx="30" ry="14" fill="#525d67" />
        <path d="M85,38 Q105,28 125,38" fill="none" stroke="#4a6d34" strokeWidth="3" />
      </g>

      {/* Wildflowers blooming in the grass */}
      {/* Golden Buttercups */}
      {[
        { x: 340, y: 470 },
        { x: 355, y: 485 },
        { x: 540, y: 440 },
        { x: 560, y: 455 },
        { x: 580, y: 435 },
        { x: 620, y: 475 },
        { x: 640, y: 490 },
      ].map((pos, i) => (
        <g key={`bc-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
          <circle cx="0" cy="0" r="3" fill="#eab308" />
          <circle cx="0" cy="0" r="1.5" fill="#fef08a" />
          <line x1="0" y1="3" x2="0" y2="8" stroke="#3d5c2a" strokeWidth="1" />
        </g>
      ))}

      {/* Mountain Bluebells near the water */}
      {[
        { x: 230, y: 435 },
        { x: 245, y: 445 },
        { x: 420, y: 380 },
        { x: 435, y: 375 },
      ].map((pos, i) => (
        <g key={`bb-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
          <circle cx="0" cy="0" r="3" fill="#60a5fa" />
          <circle cx="0" cy="0" r="1.2" fill="#dbeafe" />
          <line x1="0" y1="3" x2="-2" y2="9" stroke="#3d5c2a" strokeWidth="1" />
        </g>
      ))}

      {/* Fern Fronds on Damp Stream Bank */}
      <g stroke="#395827" strokeWidth="1.5" fill="none">
        <path d="M515,410 Q500,390 480,395 M505,403 L495,398 M498,400 L490,405" />
        <path d="M525,415 Q515,395 500,400 M518,406 L510,402" />
        <path d="M210,465 Q195,445 175,450 M200,457 L190,453" />
      </g>

      {/* Atmospheric Vignette Frame */}
      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // 2. INSIDE_BUILDING (The Well-House) - Rustic Stone & Timber Interior
  const renderInsideBuilding = () => {
    const hasKeys = roomItems.INSIDE_BUILDING.includes('KEYS');
    const hasLantern = roomItems.INSIDE_BUILDING.includes('LANTERN');
    const hasBottle = roomItems.INSIDE_BUILDING.includes('BOTTLE');
    const hasFood = roomItems.INSIDE_BUILDING.includes('FOOD');

    return (
      <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
        {renderDefs()}
        <defs>
          {/* Warm Fieldstone Interior Wall */}
          <linearGradient id="intWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#352e27" />
            <stop offset="50%" stopColor="#2c251f" />
            <stop offset="100%" stopColor="#1e1814" />
          </linearGradient>

          {/* Antique Honey Oak Workbench */}
          <linearGradient id="woodTable" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#634427" />
            <stop offset="45%" stopColor="#7a5532" />
            <stop offset="85%" stopColor="#5c3e23" />
            <stop offset="100%" stopColor="#432c18" />
          </linearGradient>

          {/* Natural Afternoon Sunbeam Streaming through Window */}
          <linearGradient id="windowSunbeam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#faebd7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#faecd6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Interior Fieldstone Wall Background */}
        <rect width="880" height="520" fill="url(#intWall)" />
        {/* Subtle stone coursing */}
        {[70, 130, 190, 250, 310, 370].map((y, idx) => (
          <line key={idx} x1="0" y1={y} x2="880" y2={y} stroke="#1a1511" strokeWidth="2" opacity="0.65" />
        ))}

        {/* Heavy Oak Timber Rafters */}
        <rect width="880" height="42" fill="#241911" />
        {[90, 210, 330, 450, 570, 690, 810].map((x, idx) => (
          <rect key={idx} x={x} y="0" width="24" height="48" fill="#18100b" />
        ))}

        {/* Flagstone Cave Floor */}
        <rect y="375" width="880" height="145" fill="#211c18" />
        <line x1="0" y1="435" x2="880" y2="435" stroke="#14110e" strokeWidth="2.5" />
        <line x1="0" y1="485" x2="880" y2="485" stroke="#14110e" strokeWidth="2" />

        {/* Arched Stone Window with Sunlight Streaming */}
        {/* Sky and green trees visible outside through arch */}
        <path d="M120,170 A50,50 0 0,1 220,170 L220,265 L120,265 Z" fill="#7fa8c7" />
        <ellipse cx="140" cy="240" rx="30" ry="20" fill="#385b2e" />
        <ellipse cx="190" cy="235" rx="35" ry="25" fill="#2a4522" />
        {/* Window sunbeam illumination across floor */}
        <polygon points="120,170 220,170 540,490 260,490" fill="url(#windowSunbeam)" pointerEvents="none" />
        {/* Heavy Oak Window Frame */}
        <rect x="112" y="130" width="116" height="142" rx="4" fill="none" stroke="#48321e" strokeWidth="8" />

        {/* Natural Fresh Spring Water Basin in the Corner */}
        <g id="springBasin" transform="translate(620, 260)">
          <ellipse cx="110" cy="110" rx="110" ry="45" fill="#3a3229" stroke="#251f1a" strokeWidth="4" />
          <ellipse cx="110" cy="105" rx="95" ry="34" fill="url(#waterFlow)" />
          {/* Subtle water shimmer */}
          <ellipse cx="110" cy="103" rx="75" ry="22" fill="#a4d1dc" opacity="0.4" />
          <text x="110" y="145" textAnchor="middle" fill="#cbe3e9" fontSize="11" fontFamily="Georgia, serif" fontWeight="bold">
            FRESH SPRING WATER BASIN
          </text>
        </g>

        {/* Heavy Oak Equipment Table */}
        <g id="workbench" transform="translate(240, 280)">
          <polygon points="0,70 400,70 440,110 40,110" fill="url(#woodTable)" stroke="#2b1c11" strokeWidth="3" />
          <rect x="40" y="110" width="400" height="24" fill="#3e2513" stroke="#1d1109" strokeWidth="2" />
          {/* Table Legs */}
          <rect x="50" y="134" width="22" height="110" fill="#2b1c11" />
          <rect x="405" y="134" width="22" height="110" fill="#2b1c11" />

          {/* ITEM 1: Set of Keys */}
          {hasKeys && (
            <g
              transform="translate(80, 50)"
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onTakeItem && onTakeItem('KEYS')}
              onMouseEnter={() => setHoveredTarget('Click to take Set of Brass Keys')}
              onMouseLeave={() => setHoveredTarget(null)}
            >
              <circle cx="20" cy="20" r="16" fill="#cca972" opacity="0.2" />
              <circle cx="20" cy="15" r="9" fill="none" stroke="url(#brassGrad)" strokeWidth="3" />
              <rect x="18" y="24" width="4" height="20" rx="1" fill="url(#brassGrad)" />
              <rect x="22" y="32" width="6" height="3" fill="url(#brassGrad)" />
              <rect x="22" y="38" width="8" height="3" fill="url(#brassGrad)" />
              <text x="20" y="58" textAnchor="middle" fill="#f0dbb6" fontSize="10" fontFamily="Georgia, serif" fontWeight="bold">
                [KEYS]
              </text>
            </g>
          )}

          {/* ITEM 2: Brass Lantern */}
          {hasLantern && (
            <g
              transform="translate(160, 20)"
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onTakeItem && onTakeItem('LANTERN')}
              onMouseEnter={() => setHoveredTarget('Click to take Brass Miner’s Lantern')}
              onMouseLeave={() => setHoveredTarget(null)}
            >
              <circle cx="30" cy="40" r="28" fill="#d4a359" opacity="0.2" />
              {/* Bail handle */}
              <path d="M15,25 Q30,5 45,25" fill="none" stroke="url(#brassGrad)" strokeWidth="3" />
              {/* Lantern top cap */}
              <polygon points="12,25 48,25 40,16 20,16" fill="url(#brassGrad)" stroke="#543719" strokeWidth="1.5" />
              {/* Glass chimney */}
              <rect x="16" y="25" width="28" height="36" rx="2" fill="#fffbe8" opacity="0.85" stroke="url(#brassGrad)" strokeWidth="2" />
              {/* Flickering wick flame inside */}
              <path d="M30,52 Q25,41 30,34 Q35,41 30,52 Z" fill="#dc2626" />
              <path d="M30,50 Q27,42 30,37 Q33,42 30,50 Z" fill="#fde047" />
              {/* Base reservoir */}
              <rect x="10" y="61" width="40" height="15" rx="3" fill="url(#brassGrad)" stroke="#543719" strokeWidth="2" />
              <text x="30" y="88" textAnchor="middle" fill="#f0dbb6" fontSize="10" fontFamily="Georgia, serif" fontWeight="bold">
                [LANTERN]
              </text>
            </g>
          )}

          {/* ITEM 3: Water Bottle */}
          {hasBottle && (
            <g
              transform="translate(250, 35)"
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onTakeItem && onTakeItem('BOTTLE')}
              onMouseEnter={() => setHoveredTarget('Click to take Water Bottle')}
              onMouseLeave={() => setHoveredTarget(null)}
            >
              <circle cx="20" cy="30" r="20" fill="#6ba5b5" opacity="0.2" />
              {/* Cork */}
              <rect x="17" y="5" width="6" height="6" rx="1" fill="#8c6239" />
              {/* Bottle Neck */}
              <rect x="16" y="11" width="8" height="12" fill="#90bfc8" opacity="0.8" />
              {/* Bottle Body */}
              <rect x="10" y="23" width="20" height="34" rx="4" fill="url(#waterFlow)" stroke="#5a909d" strokeWidth="1.5" />
              <line x1="14" y1="28" x2="14" y2="48" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
              <text x="20" y="70" textAnchor="middle" fill="#cbe3e9" fontSize="10" fontFamily="Georgia, serif" fontWeight="bold">
                [BOTTLE]
              </text>
            </g>
          )}

          {/* ITEM 4: Tasty Food */}
          {hasFood && (
            <g
              transform="translate(330, 48)"
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onTakeItem && onTakeItem('FOOD')}
              onMouseEnter={() => setHoveredTarget('Click to take Tasty Food Rations')}
              onMouseLeave={() => setHoveredTarget(null)}
            >
              <circle cx="22" cy="20" r="18" fill="#b45309" opacity="0.2" />
              {/* Wrapped parcel with twine */}
              <rect x="4" y="8" width="36" height="24" rx="3" fill="#9a6538" stroke="#5a381a" strokeWidth="2" />
              <line x1="22" y1="8" x2="22" y2="32" stroke="#fef3c7" strokeWidth="2" />
              <line x1="4" y1="20" x2="40" y2="20" stroke="#fef3c7" strokeWidth="2" />
              <text x="22" y="45" textAnchor="middle" fill="#ecd7be" fontSize="10" fontFamily="Georgia, serif" fontWeight="bold">
                [FOOD]
              </text>
            </g>
          )}
        </g>

        {/* Ancient Magic Runes carved on wall */}
        <g opacity="0.35" transform="translate(680, 120)">
          <text x="0" y="0" fill="#dfc08b" fontSize="14" fontFamily="Georgia, serif" letterSpacing="4">
            ᚷ ᛖ ᛟ ᚱ ᚲ
          </text>
          <text x="0" y="24" fill="#c4a56e" fontSize="10" fontFamily="Georgia, serif">
            XYZZY PORTAL SANCTUARY
          </text>
        </g>

        <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
      </svg>
    );
  };

  // 3. FOREST (Deep Woods) - Natural Dappled Pine Forest
  const renderForest = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
      {renderDefs()}
      <defs>
        <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f7887" />
          <stop offset="35%" stopColor="#2e4e32" />
          <stop offset="70%" stopColor="#1e3422" />
          <stop offset="100%" stopColor="#142116" />
        </linearGradient>
      </defs>
      <rect width="880" height="520" fill="url(#forestSky)" />

      {/* Layered pine and oak tree trunks with rich organic foliage */}
      {[
        { x: 30, w: 28, c: '#233d28' },
        { x: 100, w: 32, c: '#1c3120' },
        { x: 175, w: 26, c: '#29472e' },
        { x: 245, w: 34, c: '#1f3623' },
        { x: 320, w: 30, c: '#26422b' },
        { x: 390, w: 26, c: '#1e3422' },
        { x: 460, w: 32, c: '#28462d' },
        { x: 535, w: 28, c: '#1c3120' },
        { x: 610, w: 34, c: '#2a492f' },
        { x: 680, w: 26, c: '#203724' },
        { x: 745, w: 32, c: '#26432c' },
        { x: 815, w: 28, c: '#1b2f1f' },
      ].map((tree, idx) => (
        <g key={idx} opacity={idx % 2 === 0 ? 0.75 : 0.9}>
          <rect x={tree.x + 8} y="150" width={tree.w * 0.4} height="370" fill="#3a281c" />
          {/* Canopy boughs */}
          <polygon points={`${tree.x - 30},360 ${tree.x + 15},110 ${tree.x + 60},360`} fill={tree.c} />
          <polygon points={`${tree.x - 20},270 ${tree.x + 15},60 ${tree.x + 50},270`} fill={tree.c} />
          <polygon points={`${tree.x - 10},180 ${tree.x + 15},15 ${tree.x + 40},180`} fill={tree.c} />
        </g>
      ))}

      {/* Soft Ground Mist drifting through trees */}
      <ellipse cx="240" cy="460" rx="220" ry="50" fill="#6d8e72" opacity="0.25" />
      <ellipse cx="640" cy="470" rx="240" ry="55" fill="#587c5e" opacity="0.2" />

      {/* Natural dirt path winding through trees */}
      <path d="M380,520 Q410,440 440,390 T480,320" fill="none" stroke="#7e6b54" strokeWidth="45" opacity="0.75" />

      {/* Path signpost pointing in all directions */}
      <g transform="translate(420, 310)">
        <rect x="16" y="0" width="9" height="160" fill="#4d3521" stroke="#2c1d12" strokeWidth="1.5" />
        <polygon points="10,20 -30,20 -40,32 -30,44 10,44" fill="#6b4a2f" stroke="#332114" strokeWidth="2" />
        <text x="-15" y="35" fill="#fdf6e7" fontSize="9" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle">
          WEST
        </text>
        <polygon points="30,55 70,55 80,67 70,79 30,79" fill="#6b4a2f" stroke="#332114" strokeWidth="2" />
        <text x="55" y="70" fill="#fdf6e7" fontSize="9" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle">
          EAST
        </text>
      </g>

      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // 4. VALLEY (The Gully) - Natural Mountain Valley & Creek
  const renderValley = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
      {renderDefs()}
      <defs>
        <linearGradient id="valleySky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5d8fae" />
          <stop offset="60%" stopColor="#9ec0d6" />
          <stop offset="100%" stopColor="#dce8ee" />
        </linearGradient>
      </defs>
      <rect width="880" height="520" fill="url(#valleySky)" />

      {/* Gentle Valley Slopes covered in lush grass */}
      <polygon points="0,0 280,330 0,520" fill="#355527" />
      <polygon points="0,150 260,340 0,520" fill="#446a32" />
      <polygon points="880,0 600,330 880,520" fill="#2d4821" />
      <polygon points="880,140 620,340 880,520" fill="#3d602d" />

      {/* Creek bed through the valley */}
      <polygon points="260,340 620,340 680,520 200,520" fill="#584c3e" />
      {/* Clear Mountain Stream */}
      <path d="M430,340 Q450,420 420,520 L480,520 Q510,420 450,340 Z" fill="url(#waterFlow)" />

      {/* Smooth River Pebbles and Mossy Banks */}
      {[220, 290, 380, 520, 590, 660].map((x, i) => (
        <ellipse key={i} cx={x} cy={390 + (i % 3) * 35} rx={12 + (i % 4) * 3} ry={7 + (i % 3) * 2} fill="#7e6f5c" stroke="#4a3e30" strokeWidth="1.5" />
      ))}

      {/* Wildflowers and Ferns */}
      <g fill="#eab308">
        {[240, 270, 310, 570, 610, 650].map((x, idx) => (
          <circle key={idx} cx={x} cy={440 + (idx % 3) * 20} r="2.5" />
        ))}
      </g>

      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // 5. SLIT_IN_ROCK - Exposed Limestone Bedrock & Waterfall Plunge
  const renderSlitInRock = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
      {renderDefs()}
      <defs>
        <linearGradient id="limestoneBedrock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f473d" />
          <stop offset="40%" stopColor="#675d50" />
          <stop offset="80%" stopColor="#544b3f" />
          <stop offset="100%" stopColor="#3d352b" />
        </linearGradient>
      </defs>
      <rect width="880" height="520" fill="#29231c" />

      {/* Massive weathered limestone bedrock surface */}
      <rect y="160" width="880" height="360" fill="url(#limestoneBedrock)" />
      {/* Stratified rock horizontal fissure lines */}
      {[200, 250, 310, 370, 430, 480].map((y, idx) => (
        <line key={idx} x1="0" y1={y} x2="880" y2={y} stroke="#322b22" strokeWidth="2.5" opacity="0.7" />
      ))}

      {/* Moss patches clinging to limestone cracks */}
      <path d="M60,220 Q120,205 180,225" fill="none" stroke="#466632" strokeWidth="5" opacity="0.8" />
      <path d="M700,280 Q760,265 820,285" fill="none" stroke="#466632" strokeWidth="6" opacity="0.8" />

      {/* Stream splashing over the stone */}
      <path d="M410,160 Q450,230 435,280 L465,280 Q480,230 450,160 Z" fill="url(#waterFlow)" />

      {/* The narrow vertical Slit in the Rock where water plunges */}
      <g transform="translate(420, 270)">
        <ellipse cx="25" cy="40" rx="35" ry="16" fill="#140f0c" stroke="#42392e" strokeWidth="3" />
        <polygon points="5,40 45,40 35,160 15,160" fill="#0c0907" />
        {/* Waterfall plunging down into crevice */}
        <path d="M18,40 L18,150 L32,150 L32,40 Z" fill="url(#waterFlow)" opacity="0.9" />
        {/* Spray droplets */}
        <circle cx="20" cy="110" r="2.5" fill="#e8f4f6" />
        <circle cx="30" cy="90" r="2" fill="#e8f4f6" />
        <circle cx="15" cy="130" r="3" fill="#e8f4f6" />
        <text x="25" y="185" textAnchor="middle" fill="#d8e8ec" fontSize="11" fontFamily="Georgia, serif" fontWeight="bold">
          NARROW SLIT IN ROCK
        </text>
      </g>

      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // 6. DEPRESSION (Outside Iron Grate) - Secluded Woodland Hollow
  const renderDepression = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
      {renderDefs()}
      <defs>
        <radialGradient id="grateHollow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#251e18" />
          <stop offset="70%" stopColor="#1c1611" />
          <stop offset="100%" stopColor="#120e0a" />
        </radialGradient>
      </defs>
      <rect width="880" height="520" fill="url(#grateHollow)" />

      {/* 20-Foot Ravine Slopes covered in forest soil and ferns */}
      <polygon points="0,0 220,320 0,520" fill="#38492c" />
      <polygon points="880,0 660,320 880,520" fill="#2d3d23" />

      {/* Fern clusters on slopes */}
      <g stroke="#4f7338" strokeWidth="2" fill="none">
        <path d="M40,240 Q70,210 90,225" />
        <path d="M60,260 Q90,230 110,245" />
        <path d="M800,240 Q770,210 750,225" />
        <path d="M820,260 Q790,230 770,245" />
      </g>

      {/* The Deep Pit Floor with exposed bedrock */}
      <ellipse cx="440" cy="380" rx="240" ry="90" fill="#221b15" stroke="#3d3126" strokeWidth="4" />

      {/* The Iron Grate */}
      <g
        transform="translate(340, 310)"
        className="cursor-pointer"
        onClick={() => {
          if (!grateUnlocked && onUnlockGrate) onUnlockGrate();
          else if (grateUnlocked && !grateOpen && onOpenGrate) onOpenGrate();
        }}
        onMouseEnter={() =>
          setHoveredTarget(
            !grateUnlocked
              ? 'Click to Unlock Grate with Brass Keys'
              : !grateOpen
              ? 'Click to Open Iron Grate'
              : 'Grate is Open: Leads Down into Subterranean Cave'
          )
        }
        onMouseLeave={() => setHoveredTarget(null)}
      >
        {/* Heavy Wrought Iron Frame */}
        <rect
          x="0"
          y="0"
          width="200"
          height="120"
          rx="6"
          fill={grateOpen ? '#0c0907' : '#1e1914'}
          stroke="#4a3e31"
          strokeWidth="6"
        />

        {/* If open, dark subterranean stair descending */}
        {grateOpen ? (
          <g>
            <rect x="10" y="10" width="180" height="100" fill="#080604" />
            {/* Steps descending */}
            <line x1="30" y1="40" x2="170" y2="40" stroke="#36291e" strokeWidth="4" />
            <line x1="45" y1="65" x2="155" y2="65" stroke="#36291e" strokeWidth="4" />
            <line x1="60" y1="90" x2="140" y2="90" stroke="#36291e" strokeWidth="4" />
            {/* Open Grate Lid standing tilted */}
            <polygon points="0,0 -40,-60 160,-60 200,0" fill="#2d251d" opacity="0.9" stroke="#4a3e31" strokeWidth="3" />
          </g>
        ) : (
          /* Sturdy Antique Iron Bars */
          <g stroke="#5c4e3e" strokeWidth="5">
            {[30, 60, 90, 120, 150, 175].map((x, idx) => (
              <line key={idx} x1={x} y1="8" x2={x} y2="112" />
            ))}
            <line x1="10" y1="40" x2="190" y2="40" strokeWidth="4" />
            <line x1="10" y1="80" x2="190" y2="80" strokeWidth="4" />
          </g>
        )}

        {/* Brass Padlock status indicator */}
        <g transform="translate(100, 60)">
          <circle cx="0" cy="0" r="18" fill="#140f0c" stroke={grateUnlocked ? '#4ade80' : '#d4a359'} strokeWidth="2.5" />
          <text x="0" y="4" textAnchor="middle" fill={grateUnlocked ? '#4ade80' : '#eec170'} fontSize="14">
            {grateUnlocked ? '🔓' : '🔒'}
          </text>
        </g>
      </g>

      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // 7. BELOW_GRATE
  const renderBelowGrate = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
      {renderDefs()}
      <defs>
        <linearGradient id="daylightBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
          <stop offset="60%" stopColor="#fef08a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="880" height="520" fill="#050811" />

      {/* Ceiling Iron Grate silhouette */}
      <rect x="360" y="0" width="160" height="30" fill="#334155" />
      {[380, 410, 440, 470, 500].map((x, i) => (
        <rect key={i} x={x} y="0" width="8" height="30" fill="#fef08a" filter="url(#softGlow)" />
      ))}

      {/* Dramatic vertical daylight beam striking the cave floor */}
      <polygon points="360,30 520,30 640,460 240,460" fill="url(#daylightBeam)" pointerEvents="none" />

      {/* Subterranean chamber flagstones */}
      <rect y="440" width="880" height="80" fill="#1e293b" />
      <ellipse cx="440" cy="460" rx="140" ry="30" fill="#fef08a" opacity="0.3" filter="url(#softGlow)" />

      {/* Low tunnel entrance heading West */}
      <path d="M0,320 Q90,300 130,440 L0,440 Z" fill="#000000" stroke="#334155" strokeWidth="3" />
      <text x="60" y="475" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
        WEST: COBBLE CRAWL
      </text>

      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // 8. COBBLE_CRAWL
  const renderCobbleCrawl = () => {
    const hasCage = roomItems.COBBLE_CRAWL.includes('CAGE');

    return (
      <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
        {renderDefs()}
        <rect width="880" height="520" fill="#030712" />

        {/* Low, claustrophobic stone ceiling */}
        <polygon points="0,0 880,0 880,180 660,195 440,175 220,190 0,180" fill="#1e293b" stroke="#0f172a" strokeWidth="4" />

        {/* Dim light glow from East */}
        <radialGradient id="eastDimGlow" cx="1" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#030712" stopOpacity="0" />
        </radialGradient>
        <rect width="880" height="520" fill="url(#eastDimGlow)" pointerEvents="none" />

        {/* Floor covered in smooth river cobbles */}
        <rect y="360" width="880" height="160" fill="#1e293b" />
        {[60, 140, 220, 300, 380, 460, 540, 620, 700, 780, 840].map((x, idx) => (
          <ellipse key={idx} cx={x} cy={390 + (idx % 3) * 20} rx={22 + (idx % 4) * 4} ry={12 + (idx % 3) * 3} fill="#475569" stroke="#334155" strokeWidth="2" />
        ))}

        {/* ITEM: Wicker Cage */}
        {hasCage && (
          <g
            transform="translate(420, 320)"
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => onTakeItem && onTakeItem('CAGE')}
            onMouseEnter={() => setHoveredTarget('Click to take Wicker Birdcage')}
            onMouseLeave={() => setHoveredTarget(null)}
          >
            <circle cx="30" cy="30" r="28" fill="#d97706" opacity="0.2" filter="url(#softGlow)" />
            {/* Wicker cage structure */}
            <rect x="6" y="8" width="48" height="48" rx="4" fill="#92400e" opacity="0.3" stroke="#b45309" strokeWidth="3" />
            {[14, 22, 30, 38, 46].map((x, i) => (
              <line key={i} x1={x} y1="8" x2={x} y2="56" stroke="#f59e0b" strokeWidth="2.5" />
            ))}
            <line x1="6" y1="32" x2="54" y2="32" stroke="#d97706" strokeWidth="2.5" />
            <text x="30" y="74" textAnchor="middle" fill="#fde68a" fontSize="10" fontFamily="monospace" fontWeight="bold">
              [WICKER CAGE]
            </text>
          </g>
        )}

        <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
      </svg>
    );
  };

  // 9. TOP_OF_PIT
  const renderTopOfPit = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
      {renderDefs()}
      <rect width="880" height="520" fill="#020617" />

      {/* Precipice ledge over bottomless mist pit */}
      <polygon points="0,180 400,210 360,520 0,520" fill="#1e293b" stroke="#334155" strokeWidth="3" />

      {/* Rough carved stone steps descending into the abyss */}
      <g stroke="#0f172a" strokeWidth="2">
        <polygon points="340,250 430,250 430,280 340,280" fill="#475569" />
        <polygon points="390,280 480,280 480,310 390,310" fill="#475569" />
        <polygon points="440,310 530,310 530,340 440,340" fill="#334155" />
        <polygon points="490,340 580,340 580,370 490,370" fill="#334155" />
        <polygon points="540,370 630,370 630,400 540,400" fill="#1e293b" />
      </g>

      {/* White mist plumes breathing up from the pit */}
      <ellipse cx="640" cy="420" rx="180" ry="70" fill="#e2e8f0" opacity="0.25" filter="url(#softGlow)" />
      <ellipse cx="580" cy="360" rx="140" ry="50" fill="#f8fafc" opacity="0.35" filter="url(#softGlow)" />

      <text x="640" y="470" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">
        DOWN: HALL OF MISTS
      </text>

      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // 10. HALL_MISTS
  const renderHallMists = () => {
    const hasGold = roomItems.HALL_MISTS.includes('GOLD');

    if (!lanternLit) {
      // PITCH DARKNESS WITH RED EYES & LETHAL PIT
      return (
        <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
          {renderDefs()}
          <rect width="880" height="520" fill="#020617" />
          {/* Dripping stalactite silhouettes */}
          <polygon points="120,0 140,120 160,0" fill="#090d16" />
          <polygon points="440,0 470,160 500,0" fill="#090d16" />
          <polygon points="740,0 770,130 800,0" fill="#090d16" />

          {/* Glowing menacing red eyes in dark abyss */}
          <circle cx="520" cy="250" r="3.5" fill="#ef4444" filter="url(#softGlow)" />
          <circle cx="545" cy="250" r="3.5" fill="#ef4444" filter="url(#softGlow)" />

          {/* Warning Banner */}
          <g transform="translate(290, 200)">
            <rect width="300" height="90" rx="8" fill="#1e1b4b" stroke="#ef4444" strokeWidth="2.5" />
            <text x="150" y="38" textAnchor="middle" fill="#ef4444" fontFamily="monospace" fontSize="16" fontWeight="bold">
              ⚠ TOTAL PITCH DARKNESS
            </text>
            <text x="150" y="62" textAnchor="middle" fill="#f8fafc" fontFamily="monospace" fontSize="12">
              Moving without lantern light is FATAL!
            </text>
          </g>
        </svg>
      );
    }

    // Lit Hall of Mists
    return (
      <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
        {renderDefs()}
        <rect width="880" height="520" fill="#030712" />

        {/* Giant Fluted Limestone Columns */}
        <polygon points="120,0 170,0 160,520 110,520" fill="#1e293b" opacity="0.8" />
        <polygon points="720,0 770,0 760,520 710,520" fill="#1e293b" opacity="0.8" />

        {/* Rolling ground mist blankets the floor */}
        <ellipse cx="440" cy="460" rx="360" ry="70" fill="#e2e8f0" opacity="0.3" filter="url(#softGlow)" />
        <ellipse cx="320" cy="430" rx="280" ry="50" fill="#cbd5e1" opacity="0.25" filter="url(#softGlow)" />

        {/* ITEM: Large Gold Nugget */}
        {hasGold && (
          <g
            transform="translate(420, 360)"
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => onTakeItem && onTakeItem('GOLD')}
            onMouseEnter={() => setHoveredTarget('Click to take Large Gold Nugget')}
            onMouseLeave={() => setHoveredTarget(null)}
          >
            <circle cx="20" cy="20" r="26" fill="#facc15" opacity="0.35" filter="url(#superGlow)" />
            <polygon points="10,25 25,10 38,18 32,32 15,35" fill="url(#richGold)" stroke="#fef08a" strokeWidth="2" />
            <polygon points="18,16 28,14 26,24 16,22" fill="#fef9c3" opacity="0.8" />
            <text x="20" y="52" textAnchor="middle" fill="#fef08a" fontSize="10" fontFamily="monospace" fontWeight="bold">
              [GOLD NUGGET]
            </text>
          </g>
        )}

        <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
      </svg>
    );
  };

  // 11. LOW_CRAWL (Bird Sanctuary Grotto)
  const renderLowCrawl = () => {
    const birdPresent = roomItems.LOW_CRAWL.includes('BIRD');

    return (
      <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
        {renderDefs()}
        <defs>
          <radialGradient id="grottoEmerald" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="#047857" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#064e3b" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
          </radialGradient>
        </defs>
        <rect width="880" height="520" fill="#020617" />
        <rect width="880" height="520" fill="url(#grottoEmerald)" />

        {/* Delicate Flowstone Draperies */}
        <path d="M0,0 Q110,220 220,70 Q330,240 440,50 Q550,260 660,80 Q770,230 880,0 Z" fill="#1e293b" />

        {/* Mirror Pool Basin */}
        <ellipse cx="440" cy="420" rx="210" ry="45" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
        <ellipse cx="440" cy="415" rx="190" ry="34" fill="#0284c7" opacity="0.45" />

        {/* Little Green Bird Perched on Limestone Ledge */}
        {birdPresent ? (
          <g
            transform="translate(420, 260)"
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => onCatchBird && onCatchBird()}
            onMouseEnter={() => setHoveredTarget('Click to catch Singing Green Songbird')}
            onMouseLeave={() => setHoveredTarget(null)}
          >
            <circle cx="20" cy="20" r="28" fill="#10b981" opacity="0.25" filter="url(#softGlow)" />
            {/* Body */}
            <ellipse cx="20" cy="22" rx="14" ry="10" fill="#10b981" />
            {/* Head */}
            <circle cx="28" cy="14" r="7" fill="#34d399" />
            {/* Yellow Beak */}
            <polygon points="34,14 42,16 34,18" fill="#facc15" />
            {/* Eye */}
            <circle cx="30" cy="13" r="1.5" fill="#020617" />
            {/* Wing */}
            <path d="M12,20 Q20,16 26,22 Q18,26 12,20 Z" fill="#059669" />
            {/* Tail */}
            <polygon points="6,24 0,28 8,26" fill="#047857" />
            {/* Musical Notes */}
            <text x="36" y="4" fill="#6ee7b7" fontSize="14" fontFamily="monospace">
              ♪ ♫
            </text>
            <text x="20" y="45" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace" fontWeight="bold">
              [LITTLE GREEN BIRD]
            </text>
          </g>
        ) : (
          <text x="440" y="300" textAnchor="middle" fill="#6ee7b7" fontSize="12" fontFamily="monospace" opacity="0.6">
            The grotto echoes with faint memories of song.
          </text>
        )}

        <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
      </svg>
    );
  };

  // 12. MOUNTAIN_KING (The Serpent Cavern)
  const renderMountainKing = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
      {renderDefs()}
      <rect width="880" height="520" fill="#050508" />

      {/* Grand Archway leading to Treasury */}
      <path d="M300,440 L300,160 A140,140 0 0,1 580,160 L580,440 Z" fill="#1e1b4b" stroke="#4338ca" strokeWidth="4" />
      {/* Golden glow from treasury beyond */}
      <path d="M310,440 L310,170 A130,130 0 0,1 570,170 L570,440 Z" fill="url(#richGold)" opacity="0.25" filter="url(#softGlow)" />

      {/* Snake Present or Cleared */}
      {!snakeFrightened ? (
        <g id="fierceSnake" transform="translate(360, 240)">
          {/* Threatening coiled body */}
          <path
            d="M-30,160 Q-50,60 40,80 T130,100 T180,160"
            fill="none"
            stroke="#15803d"
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M-30,160 Q-50,60 40,80 T130,100 T180,160"
            fill="none"
            stroke="#22c55e"
            strokeWidth="22"
            strokeLinecap="round"
          />
          {/* Serpent Head */}
          <polygon points="50,20 100,5 110,45 60,60" fill="#16a34a" stroke="#14532d" strokeWidth="3" />
          {/* Slitted Yellow Eyes */}
          <circle cx="85" cy="20" r="5" fill="#facc15" filter="url(#softGlow)" />
          <ellipse cx="85" cy="20" rx="1.5" ry="4" fill="#000000" />
          {/* Forked Tongue */}
          <path d="M108,30 L135,32 L145,24 M135,32 L145,40" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          <text x="80" y="195" textAnchor="middle" fill="#ef4444" fontSize="12" fontFamily="monospace" fontWeight="bold">
            ⚠ FIERCE GREEN VIPER BLOCKS EXITS
          </text>
        </g>
      ) : (
        <g transform="translate(440, 280)">
          <text x="0" y="0" textAnchor="middle" fill="#34d399" fontSize="14" fontFamily="monospace" fontWeight="bold">
            ✓ THE SERPENT HAS FLED IN TERROR!
          </text>
          <text x="0" y="24" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontFamily="monospace">
            Passages to the Royal Vault are open!
          </text>
        </g>
      )}

      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // 13. TREASURY (Grandmaster Vault)
  const renderTreasury = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none" preserveAspectRatio="xMidYMid slice">
      {renderDefs()}
      <rect width="880" height="520" fill="#090702" />

      {/* Radial Celestial Gold Rays */}
      <g opacity="0.4" filter="url(#superGlow)">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
          <line
            key={idx}
            x1="440"
            y1="260"
            x2={440 + 500 * Math.cos((angle * Math.PI) / 180)}
            y2={260 + 500 * Math.sin((angle * Math.PI) / 180)}
            stroke="#fde047"
            strokeWidth="8"
          />
        ))}
      </g>

      {/* Heaps of Gold Doubloons and Jewels */}
      <polygon points="120,520 440,320 760,520" fill="url(#richGold)" stroke="#ca8a04" strokeWidth="4" />
      <polygon points="240,520 440,360 640,520" fill="#fef08a" opacity="0.6" />

      {/* Sparkling Gem Crystals */}
      {[280, 360, 440, 520, 600].map((x, i) => (
        <polygon
          key={i}
          points={`${x},${440 - (i % 2) * 30} ${x + 15},${410 - (i % 2) * 30} ${x + 30},${440 - (i % 2) * 30} ${x + 15},${460 - (i % 2) * 30}`}
          fill={i % 2 === 0 ? '#38bdf8' : '#f43f5e'}
          stroke="#ffffff"
          strokeWidth="1.5"
          filter="url(#softGlow)"
        />
      ))}

      {/* Victory Crest Banner */}
      <g transform="translate(440, 140)">
        <circle cx="0" cy="0" r="46" fill="#020617" stroke="#facc15" strokeWidth="3" filter="url(#softGlow)" />
        <text x="0" y="8" textAnchor="middle" fill="#fde047" fontSize="26">
          🏆
        </text>
        <text x="0" y="65" textAnchor="middle" fill="#fde047" fontSize="16" fontFamily="monospace" fontWeight="bold">
          GRANDMASTER ADVENTURER
        </text>
        <text x="0" y="85" textAnchor="middle" fill="#fef08a" fontSize="11" fontFamily="monospace">
          You conquered the Royal Treasury of the Mountain King!
        </text>
      </g>

      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // New Room: Bottomless Fissure & Crystal Bridge
  const renderFissure = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none">
      {renderDefs()}
      <rect width="880" height="520" fill="#020617" />
      {/* Deep yawning abyss */}
      <path d="M 0 0 L 280 0 L 240 520 L 0 520 Z" fill="#090d16" />
      <path d="M 600 0 L 880 0 L 880 520 L 640 520 Z" fill="#090d16" />
      {/* Chasm Void Center */}
      <rect x="240" y="0" width="400" height="520" fill="#010204" />
      {/* Abyssal Fog & Wind */}
      <path d="M 240 380 Q 440 320 640 400 L 640 520 L 240 520 Z" fill="#0f172a" opacity="0.4" />
      <path d="M 240 420 Q 440 380 640 440 L 640 520 L 240 520 Z" fill="#1e293b" opacity="0.5" />

      {/* Crystal Bridge spanning the chasm */}
      {state.crystalBridgeActive ? (
        <g filter="url(#superGlow)">
          <polygon
            points="220,310 660,310 680,335 200,335"
            fill="url(#crystalGrad)"
            stroke="#e0f2fe"
            strokeWidth="2"
            opacity="0.9"
          />
          {/* Prismatic rainbow crystal ribs */}
          {[260, 320, 380, 440, 500, 560, 620].map((cx, i) => (
            <line
              key={i}
              x1={cx}
              y1="310"
              x2={cx - 15}
              y2="335"
              stroke="#bae6fd"
              strokeWidth="2"
              opacity="0.8"
            />
          ))}
          {/* Crystalline Railing */}
          <line x1="210" y1="290" x2="670" y2="290" stroke="#38bdf8" strokeWidth="2.5" />
          {[230, 310, 390, 470, 550, 630].map((px, i) => (
            <line key={i} x1={px} y1="290" x2={px} y2="310" stroke="#38bdf8" strokeWidth="2" />
          ))}
          <text x="440" y="275" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontFamily="monospace" fontWeight="bold">
            ✨ SHIMMERING CRYSTAL BRIDGE (ACTIVE) ✨
          </text>
        </g>
      ) : (
        <g>
          <text x="440" y="320" textAnchor="middle" fill="#f43f5e" fontSize="13" fontFamily="monospace" fontWeight="bold">
            ⚠️ BOTTOMLESS VOID — NO BRIDGE ACROSS
          </text>
          <text x="440" y="345" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">
            (Wave the Black Star Rod to bridge the fissure)
          </text>
        </g>
      )}

      {/* Stone Pillars */}
      <polygon points="170,260 230,260 250,520 150,520" fill="#1e293b" stroke="#334155" />
      <polygon points="650,260 710,260 730,520 630,520" fill="#1e293b" stroke="#334155" />
      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // New Room: Secret Canyon & Dragon's Lair
  const renderDragonDen = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none">
      {renderDefs()}
      <rect width="880" height="520" fill="#180a0a" />
      {/* Volcanic Canyon walls */}
      <path d="M 0 0 L 260 0 L 200 520 L 0 520 Z" fill="#2d1212" />
      <path d="M 620 0 L 880 0 L 880 520 L 680 520 Z" fill="#2d1212" />
      {/* Lava Veins */}
      <path d="M 120 180 Q 200 300 160 520" stroke="#f97316" strokeWidth="3" fill="none" opacity="0.6" filter="url(#softGlow)" />
      <path d="M 760 140 Q 680 320 720 520" stroke="#f97316" strokeWidth="3" fill="none" opacity="0.6" filter="url(#softGlow)" />

      {/* Persian Rug */}
      <g transform="translate(440, 380)">
        <polygon
          points="-180,-30 180,-30 220,50 -220,50"
          fill="#831843"
          stroke="#facc15"
          strokeWidth="3"
        />
        <polygon points="-160,-20 160,-20 195,40 -195,40" fill="#9d174d" stroke="#fde047" strokeWidth="1" strokeDasharray="4 2" />
        <text x="0" y="25" textAnchor="middle" fill="#fde047" fontSize="10" fontFamily="monospace">
          ROYAL PERSIAN RUG
        </text>
      </g>

      {/* Dragon Figure */}
      {state.dragonSlain ? (
        <g transform="translate(440, 310)">
          {/* Slain dragon sleeping peacefully defeated */}
          <ellipse cx="0" cy="20" rx="140" ry="40" fill="#064e3b" opacity="0.7" />
          <text x="0" y="25" textAnchor="middle" fill="#a7f3d0" fontSize="14" fontFamily="monospace" fontWeight="bold">
            ⚔️ SLAIN GREEN DRAGON (CONQUERED WITH BARE HANDS)
          </text>
        </g>
      ) : (
        <g transform="translate(440, 270)">
          {/* Living Ferocious Green Dragon */}
          {/* Dragon Body */}
          <ellipse cx="0" cy="40" rx="150" ry="60" fill="#047857" stroke="#10b981" strokeWidth="3" />
          {/* Dragon Scales */}
          <path d="M -100 20 Q -80 0 -60 20 Q -40 0 -20 20 Q 0 0 20 20 Q 40 0 60 20 Q 80 0 100 20" fill="none" stroke="#059669" strokeWidth="4" />
          {/* Dragon Wings */}
          <path d="M -80 10 Q -150 -70 -70 -30 Q -30 -10 -40 20" fill="#065f46" stroke="#34d399" strokeWidth="2" />
          <path d="M 80 10 Q 150 -70 70 -30 Q 30 -10 40 20" fill="#065f46" stroke="#34d399" strokeWidth="2" />
          {/* Dragon Head */}
          <ellipse cx="-130" cy="-10" rx="40" ry="25" fill="#059669" stroke="#10b981" strokeWidth="2" />
          {/* Eye */}
          <circle cx="-145" cy="-15" r="5" fill="#facc15" />
          <circle cx="-145" cy="-15" r="2" fill="#000000" />
          {/* Horns */}
          <path d="M -120 -25 Q -130 -55 -150 -60" fill="none" stroke="#e2e8f0" strokeWidth="3" />
          <path d="M -110 -22 Q -115 -50 -130 -55" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
          {/* Smoke curling from nostrils */}
          <path d="M -170 -5 Q -210 -20 -190 -45 Q -230 -60 -210 -90" fill="none" stroke="#94a3b8" strokeWidth="3" opacity="0.6" strokeDasharray="3 3" />
          <text x="0" y="115" textAnchor="middle" fill="#ef4444" fontSize="13" fontFamily="monospace" fontWeight="bold">
            🐉 FEROCIOUS GREEN DRAGON ASLEEP ATOP THE HORDE
          </text>
        </g>
      )}

      {/* Golden Dragon Egg Item (Clickable) */}
      {(state.roomItems['DRAGON_DEN'] || []).includes('DRAGON_EGG') && (
        <g
          transform="translate(480, 360)"
          className="cursor-pointer group"
          onClick={() => onTakeItem && onTakeItem('DRAGON_EGG')}
          onMouseEnter={() => setHoveredTarget('Golden Dragon Egg (+50 pts) — Solid gold ancient egg')}
          onMouseLeave={() => setHoveredTarget(null)}
        >
          <ellipse cx="0" cy="0" rx="18" ry="26" fill="#facc15" stroke="#fef08a" strokeWidth="2" filter="url(#superGlow)" />
          <ellipse cx="-4" cy="-6" rx="6" ry="12" fill="#ffffff" opacity="0.6" />
          <text x="0" y="38" textAnchor="middle" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="bold">
            [DRAGON EGG]
          </text>
        </g>
      )}

      {/* Persian Rug Item (Clickable) */}
      {(state.roomItems['DRAGON_DEN'] || []).includes('RUG') && (
        <g
          transform="translate(360, 390)"
          className="cursor-pointer group"
          onClick={() => onTakeItem && onTakeItem('RUG')}
          onMouseEnter={() => setHoveredTarget('Jeweled Persian Rug (+40 pts) — Silk royal rug')}
          onMouseLeave={() => setHoveredTarget(null)}
        >
          <rect x="-35" y="-12" width="70" height="24" rx="4" fill="#be185d" stroke="#facc15" strokeWidth="1.5" />
          <text x="0" y="4" textAnchor="middle" fill="#fde047" fontSize="8" fontFamily="monospace" fontWeight="bold">
            [PERSIAN RUG]
          </text>
        </g>
      )}

      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // New Room: Maze of Twisty Passages (All 3 variations)
  const renderMaze = (variant: string) => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none">
      {renderDefs()}
      <rect width="880" height="520" fill="#090d16" />
      {/* Stone Archways */}
      <path d="M 120 520 L 120 220 Q 440 80 760 220 L 760 520" fill="#030712" stroke="#1e293b" strokeWidth="4" />
      <path d="M 220 520 L 220 260 Q 440 160 660 260 L 660 520" fill="#0f172a" stroke="#334155" strokeWidth="3" />
      <path d="M 320 520 L 320 300 Q 440 220 560 300 L 560 520" fill="#020617" stroke="#475569" strokeWidth="2" />

      {/* Twisty Corridor Exits */}
      <polygon points="120,400 220,380 220,520 120,520" fill="#020617" stroke="#1e293b" />
      <polygon points="760,400 660,380 660,520 760,520" fill="#020617" stroke="#1e293b" />

      {/* Wall Torches */}
      <circle cx="210" cy="270" r="10" fill="#f59e0b" filter="url(#softGlow)" />
      <circle cx="670" cy="270" r="10" fill="#f59e0b" filter="url(#softGlow)" />

      {/* Maze Descriptor Tag */}
      <g transform="translate(440, 160)">
        <text x="0" y="0" textAnchor="middle" fill="#38bdf8" fontSize="16" fontFamily="monospace" fontWeight="bold">
          MAZE OF TWISTY PASSAGES
        </text>
        <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">
          {variant === 'MAZE_2' ? 'Passages All Alike' : 'Passages All Different'}
        </text>
      </g>

      {/* Render Dropped Breadcrumb Items on Floor */}
      <g transform="translate(440, 440)">
        {(state.roomItems[currentRoom] || []).map((it, idx) => (
          <g
            key={it}
            transform={`translate(${(idx - 1) * 60}, 0)`}
            className="cursor-pointer"
            onClick={() => onTakeItem && onTakeItem(it)}
            onMouseEnter={() => setHoveredTarget(`Breadcrumb item: ${it}`)}
            onMouseLeave={() => setHoveredTarget(null)}
          >
            <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">
              {it}
            </text>
          </g>
        ))}
      </g>

      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  // New Room: Pirate's Dead-End Cache
  const renderPirateLair = () => (
    <svg viewBox="0 0 880 520" className="w-full h-full select-none">
      {renderDefs()}
      <rect width="880" height="520" fill="#120e0a" />
      {/* Shipwreck timber arches */}
      <path d="M 60 520 Q 200 120 440 80 Q 680 120 820 520" fill="#1c1611" stroke="#5c432d" strokeWidth="6" />
      <polygon points="340,320 540,320 580,480 300,480" fill="#241b14" stroke="#6b4e36" strokeWidth="2" />

      {/* Skull and Crossbones Banner */}
      <rect x="400" y="120" width="80" height="60" fill="#18120e" stroke="#c4ad94" strokeWidth="1.5" />
      <text x="440" y="160" textAnchor="middle" fill="#f7f1e5" fontSize="26">
        ☠️
      </text>

      {/* Pirate's Treasure Chest */}
      {(state.roomItems['PIRATE_LAIR'] || []).includes('PIRATE_CHEST') && (
        <g
          transform="translate(440, 390)"
          className="cursor-pointer group"
          onClick={() => onTakeItem && onTakeItem('PIRATE_CHEST')}
          onMouseEnter={() => setHoveredTarget('Pirate’s Treasure Chest (+35 pts) — Packed with silver doubloons')}
          onMouseLeave={() => setHoveredTarget(null)}
        >
          {/* Chest Base & Lid */}
          <rect x="-45" y="-15" width="90" height="45" rx="6" fill="#78350f" stroke="#facc15" strokeWidth="2.5" />
          <path d="M -45 -15 Q 0 -40 45 -15 Z" fill="#92400e" stroke="#facc15" strokeWidth="2" />
          <circle cx="0" cy="5" r="5" fill="#facc15" />
          <text x="0" y="45" textAnchor="middle" fill="#fde047" fontSize="10" fontFamily="monospace" fontWeight="bold">
            [PIRATE CHEST]
          </text>
        </g>
      )}

      {/* Flawless Diamonds Item */}
      {(state.roomItems['PIRATE_LAIR'] || []).includes('DIAMOND') && (
        <g
          transform="translate(360, 420)"
          className="cursor-pointer group"
          onClick={() => onTakeItem && onTakeItem('DIAMOND')}
          onMouseEnter={() => setHoveredTarget('Flawless Diamonds (+35 pts) — Sparkling gemstones')}
          onMouseLeave={() => setHoveredTarget(null)}
        >
          <polygon points="0,-16 14,0 0,16 -14,0" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" filter="url(#softGlow)" />
          <text x="0" y="28" textAnchor="middle" fill="#bae6fd" fontSize="9" fontFamily="monospace" fontWeight="bold">
            [DIAMONDS]
          </text>
        </g>
      )}

      {/* Ming Dynasty Vase Item */}
      {(state.roomItems['PIRATE_LAIR'] || []).includes('VASE') && (
        <g
          transform="translate(520, 420)"
          className="cursor-pointer group"
          onClick={() => onTakeItem && onTakeItem('VASE')}
          onMouseEnter={() => setHoveredTarget('Ming Dynasty Vase (+40 pts) — Fragile antique porcelain')}
          onMouseLeave={() => setHoveredTarget(null)}
        >
          <path d="M -10 -20 L 10 -20 Q 18 0 8 18 L -8 18 Q -18 0 -10 -20 Z" fill="#0284c7" stroke="#e0f2fe" strokeWidth="1.5" />
          <circle cx="0" cy="-2" r="4" fill="#ffffff" opacity="0.6" />
          <text x="0" y="30" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace" fontWeight="bold">
            [MING VASE]
          </text>
        </g>
      )}

      <rect width="880" height="520" fill="url(#vignetteGrad)" pointerEvents="none" />
    </svg>
  );

  const getViewportContent = () => {
    switch (currentRoom) {
      case 'ROAD_END':
        return renderRoadEnd();
      case 'INSIDE_BUILDING':
        return renderInsideBuilding();
      case 'FOREST':
        return renderForest();
      case 'VALLEY':
        return renderValley();
      case 'SLIT_IN_ROCK':
        return renderSlitInRock();
      case 'DEPRESSION':
        return renderDepression();
      case 'BELOW_GRATE':
        return renderBelowGrate();
      case 'COBBLE_CRAWL':
        return renderCobbleCrawl();
      case 'TOP_OF_PIT':
        return renderTopOfPit();
      case 'FISSURE':
        return renderFissure();
      case 'DRAGON_DEN':
        return renderDragonDen();
      case 'MAZE_1':
      case 'MAZE_2':
      case 'MAZE_3':
        return renderMaze(currentRoom);
      case 'PIRATE_LAIR':
        return renderPirateLair();
      case 'HALL_MISTS':
        return renderHallMists();
      case 'LOW_CRAWL':
        return renderLowCrawl();
      case 'MOUNTAIN_KING':
        return renderMountainKing();
      case 'TREASURY':
        return renderTreasury();
      default:
        return renderRoadEnd();
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#120e0b]">
      {getViewportContent()}

      {/* Interactive Tooltip Toast when Hovering Items/Locations */}
      {hoveredTarget && (
        <div className="absolute bottom-3 left-4 right-4 py-1.5 px-3 rounded-lg bg-[#19120d]/95 border border-[#c99a4c] text-[#f7f1e5] text-xs font-serif shadow-xl backdrop-blur-sm flex items-center gap-2 animate-in fade-in duration-150 z-20">
          <Info className="w-3.5 h-3.5 text-[#eec170] shrink-0" />
          <span className="truncate font-manuscript font-bold">{hoveredTarget}</span>
        </div>
      )}
    </div>
  );
};
