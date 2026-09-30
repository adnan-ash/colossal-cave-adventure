import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { RoomId, GameState, Direction } from '../types/game';
import { ROOMS, ITEMS } from '../data/gameData';
import {
  MapPin,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crosshair,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Compass,
  Map as MapIcon,
} from 'lucide-react';

interface CaveMapProps {
  state: GameState;
  onMove?: (dir: Direction) => void;
}

interface MapNodeData {
  id: RoomId;
  label: string;
  depth: string;
  depthNum: number;
  tier: 'surface' | 'upper' | 'fissure' | 'maze' | 'deep';
  x: number;
  y: number;
}

interface MapConnection {
  from: RoomId;
  to: RoomId;
  label: string;
  blocked?: boolean;
  isCrystal?: boolean;
  isMagic?: boolean;
}

export const CaveMap: React.FC<CaveMapProps> = ({ state, onMove }) => {
  const {
    currentRoom,
    visitedRooms,
    grateUnlocked,
    grateOpen,
    lanternLit,
    snakeFrightened,
    roomItems,
    crystalBridgeActive,
    dragonSlain,
  } = state;

  const [selectedNode, setSelectedNode] = useState<RoomId | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // 1060 x 700 spacious cartographic canvas
  const mapNodes: MapNodeData[] = useMemo(
    () => [
      // SURFACE LEVEL
      { id: 'ROAD_END', label: 'Road End', depth: '0 ft', depthNum: 0, tier: 'surface', x: 150, y: 100 },
      { id: 'INSIDE_BUILDING', label: 'Well-House', depth: '0 ft', depthNum: 0, tier: 'surface', x: 370, y: 100 },
      { id: 'FOREST', label: 'Deep Forest', depth: '0 ft', depthNum: 0, tier: 'surface', x: 150, y: 210 },
      { id: 'VALLEY', label: 'Valley Gully', depth: '-10 ft', depthNum: 10, tier: 'surface', x: 370, y: 210 },
      { id: 'SLIT_IN_ROCK', label: 'Rock Slit', depth: '-15 ft', depthNum: 15, tier: 'surface', x: 590, y: 210 },

      // UPPER SUBTERRANEAN
      { id: 'DEPRESSION', label: 'Grate Depression', depth: '-20 ft', depthNum: 20, tier: 'upper', x: 590, y: 320 },
      { id: 'BELOW_GRATE', label: 'Below Grate', depth: '-35 ft', depthNum: 35, tier: 'upper', x: 370, y: 320 },
      { id: 'COBBLE_CRAWL', label: 'Cobble Crawl', depth: '-50 ft', depthNum: 50, tier: 'upper', x: 150, y: 320 },
      { id: 'TOP_OF_PIT', label: 'Top of Pit', depth: '-70 ft', depthNum: 70, tier: 'upper', x: 150, y: 440 },

      // FISSURE & CANYON
      { id: 'FISSURE', label: 'Bottomless Fissure', depth: '-75 ft', depthNum: 75, tier: 'fissure', x: 370, y: 440 },
      { id: 'DRAGON_DEN', label: 'Dragon’s Lair', depth: '-90 ft', depthNum: 90, tier: 'fissure', x: 610, y: 440 },

      // MAZES & PIRATE VAULT
      { id: 'MAZE_1', label: 'Twisty Maze (Diff)', depth: '-110 ft', depthNum: 110, tier: 'maze', x: 790, y: 440 },
      { id: 'MAZE_2', label: 'Twisty Maze (Alike)', depth: '-125 ft', depthNum: 125, tier: 'maze', x: 960, y: 440 },
      { id: 'MAZE_3', label: 'Maze Junction', depth: '-120 ft', depthNum: 120, tier: 'maze', x: 860, y: 320 },
      { id: 'PIRATE_LAIR', label: 'Pirate Cache', depth: '-135 ft', depthNum: 135, tier: 'maze', x: 990, y: 320 },

      // DEEP MOUNTAIN KING VAULTS
      { id: 'HALL_MISTS', label: 'Hall of Mists', depth: '-100 ft', depthNum: 100, tier: 'deep', x: 250, y: 580 },
      { id: 'LOW_CRAWL', label: 'Bird Sanctuary', depth: '-110 ft', depthNum: 110, tier: 'deep', x: 470, y: 580 },
      { id: 'MOUNTAIN_KING', label: 'Hall of Mtn King', depth: '-150 ft', depthNum: 150, tier: 'deep', x: 690, y: 580 },
      { id: 'TREASURY', label: 'The Royal Treasury', depth: '-200 ft', depthNum: 200, tier: 'deep', x: 930, y: 580 },
    ],
    []
  );

  const connections: MapConnection[] = useMemo(
    () => [
      { from: 'ROAD_END', to: 'INSIDE_BUILDING', label: 'E / W' },
      { from: 'ROAD_END', to: 'FOREST', label: 'N / S' },
      { from: 'ROAD_END', to: 'SLIT_IN_ROCK', label: 'DN / UP' },
      { from: 'FOREST', to: 'VALLEY', label: 'GULLY' },
      { from: 'VALLEY', to: 'ROAD_END', label: 'UP / S' },
      { from: 'VALLEY', to: 'SLIT_IN_ROCK', label: 'DN / UP' },
      { from: 'SLIT_IN_ROCK', to: 'DEPRESSION', label: 'DN / UP' },
      {
        from: 'DEPRESSION',
        to: 'BELOW_GRATE',
        label: 'GRATE',
        blocked: !grateUnlocked || !grateOpen,
      },
      { from: 'BELOW_GRATE', to: 'COBBLE_CRAWL', label: 'W / E' },
      { from: 'COBBLE_CRAWL', to: 'TOP_OF_PIT', label: 'W / E' },
      { from: 'TOP_OF_PIT', to: 'FISSURE', label: 'E / W' },
      {
        from: 'FISSURE',
        to: 'DRAGON_DEN',
        label: 'CRYSTAL BRIDGE',
        blocked: !crystalBridgeActive,
        isCrystal: true,
      },
      { from: 'DRAGON_DEN', to: 'MAZE_1', label: 'N / S' },
      { from: 'MAZE_1', to: 'MAZE_2', label: 'E / W' },
      { from: 'MAZE_1', to: 'MAZE_3', label: 'N / S' },
      { from: 'MAZE_2', to: 'MAZE_3', label: 'N / S' },
      { from: 'MAZE_2', to: 'PIRATE_LAIR', label: 'E / W' },
      { from: 'MAZE_3', to: 'PIRATE_LAIR', label: 'E / W' },
      { from: 'TOP_OF_PIT', to: 'HALL_MISTS', label: 'DN / UP' },
      { from: 'HALL_MISTS', to: 'LOW_CRAWL', label: 'E / W' },
      { from: 'HALL_MISTS', to: 'MOUNTAIN_KING', label: 'W / E' },
      {
        from: 'MOUNTAIN_KING',
        to: 'TREASURY',
        label: 'ROYAL ARCH',
        blocked: !snakeFrightened,
      },
      {
        from: 'INSIDE_BUILDING',
        to: 'HALL_MISTS',
        label: 'XYZZY',
        isMagic: true,
      },
    ],
    [grateUnlocked, grateOpen, crystalBridgeActive, snakeFrightened]
  );

  const centerOnPlayer = useCallback(() => {
    const currentNode = mapNodes.find((n) => n.id === currentRoom);
    if (currentNode && svgContainerRef.current) {
      const containerW = svgContainerRef.current.clientWidth || 600;
      const containerH = svgContainerRef.current.clientHeight || 300;
      const targetPanX = containerW / 2 - currentNode.x * zoom;
      const targetPanY = containerH / 2 - currentNode.y * zoom;
      setPan({ x: targetPanX, y: targetPanY });
    }
  }, [currentRoom, mapNodes, zoom]);

  useEffect(() => {
    centerOnPlayer();
  }, [centerOnPlayer]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(2.5, Number((prev + 0.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.6, Number((prev - 0.25).toFixed(2))));
  };

  const handleResetView = () => {
    setZoom(1);
    centerOnPlayer();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((prev) => Math.max(0.6, Math.min(2.8, Number((prev + delta).toFixed(2)))));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const adjacentExit = useMemo(() => {
    if (!selectedNode || selectedNode === currentRoom) return null;
    const currentDef = ROOMS[currentRoom];
    if (!currentDef) return null;
    return currentDef.exits.find((e) => e.targetRoom === selectedNode);
  }, [selectedNode, currentRoom]);

  const selectedNodeData = selectedNode ? mapNodes.find((n) => n.id === selectedNode) : null;
  const selectedRoomDef = selectedNode ? ROOMS[selectedNode] : null;
  const selectedRoomItems = selectedNode ? roomItems[selectedNode] || [] : [];

  const getHazardInfo = (id: RoomId) => {
    if (id === 'DEPRESSION') {
      if (!grateUnlocked) return { text: 'Locked Iron Grate (Key needed)', type: 'danger' };
      if (!grateOpen) return { text: 'Grate Unlocked (Lid shut)', type: 'warning' };
      return { text: 'Grate open & passage clear', type: 'success' };
    }
    if (id === 'HALL_MISTS' && !lanternLit) {
      return { text: 'Pitch darkness (Fatal fall hazard)', type: 'danger' };
    }
    if (id === 'MOUNTAIN_KING' && !snakeFrightened) {
      return { text: 'Fierce serpent blocks passage', type: 'danger' };
    }
    if (id === 'DRAGON_DEN' && !dragonSlain) {
      return { text: 'Green Dragon roosting', type: 'danger' };
    }
    if (id === 'FISSURE' && !crystalBridgeActive) {
      return { text: 'Chasm impassable (Wave black rod)', type: 'warning' };
    }
    return null;
  };

  const isAdjacentToVisited = (id: RoomId) => {
    return connections.some(
      (c) => (c.from === id && visitedRooms.includes(c.to)) || (c.to === id && visitedRooms.includes(c.from))
    );
  };

  return (
    <div
      className={`bg-[#140f0c] border-2 border-[#4d3725] rounded-xl flex flex-col font-serif select-none overflow-hidden transition-all duration-300 shadow-md text-[#f7f1e5] ${
        isFullscreen ? 'fixed inset-3 sm:inset-6 z-50 bg-[#140f0c] border-4 border-[#c99a4c] shadow-2xl' : ''
      }`}
    >
      {/* Top Cartographic Header */}
      <div className="shrink-0 p-2.5 sm:p-3 bg-[#1f1711] border-b border-[#3d2b1d] flex flex-wrap items-center justify-between gap-2 z-10 text-[#f7f1e5]">
        {/* Left: Title & Survey Stats */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#2a1e15] border border-[#5c432d] text-[#eec170]">
            <MapIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-monument font-bold tracking-widest text-[#f7f1e5]">
                UNDERGROUND CARTOGRAPHY
              </span>
              <span className="text-[9px] font-manuscript px-2 py-0.5 rounded-full border border-[#5c432d] bg-[#140f0c] text-[#eec170]">
                Scale: {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-manuscript text-[#c4ad94] mt-0.5">
              <span>Charted: <b className="text-[#eec170]">{visitedRooms.length}</b>/18 Chambers</span>
              <span>·</span>
              <span className="text-[#8a7562]">Surveyed by Hand [1976]</span>
            </div>
          </div>
        </div>

        {/* Right: Map Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={handleZoomIn}
            title="Magnify Chart"
            className="p-1.5 rounded bg-[#241a12] hover:bg-[#33261c] text-[#f7f1e5] border border-[#5c432d] cursor-pointer transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5 text-[#eec170]" />
          </button>

          <button
            onClick={handleZoomOut}
            title="Reduce Chart"
            className="p-1.5 rounded bg-[#241a12] hover:bg-[#33261c] text-[#f7f1e5] border border-[#5c432d] cursor-pointer transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5 text-[#eec170]" />
          </button>

          <button
            onClick={centerOnPlayer}
            title="Center on Traveler Location"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#2c1f15] hover:bg-[#3d2a1c] border border-[#c99a4c] text-[#eec170] text-xs font-manuscript font-bold cursor-pointer transition-colors"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">WHERE AM I</span>
          </button>

          <button
            onClick={handleResetView}
            title="Reset Chart View"
            className="p-1.5 rounded bg-[#241a12] hover:bg-[#33261c] text-[#f7f1e5] border border-[#5c432d] cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#eec170]" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Close Full Folio' : 'Open Full Folio'}
            className="p-1.5 rounded bg-[#241a12] hover:bg-[#33261c] border border-[#5c432d] text-[#f7f1e5] cursor-pointer transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Cartographic Viewport */}
      <div
        ref={svgContainerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`relative w-full bg-[#0f0c09] overflow-hidden cursor-grab active:cursor-grabbing select-none ${
          isFullscreen ? 'flex-1 min-h-[500px]' : 'h-52 sm:h-64 lg:h-72'
        }`}
      >
        {/* Subtle obsidian cavern stone grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #5c432d 1px, transparent 0)`,
            backgroundSize: `${28 * zoom}px ${28 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />

        {/* Scaled & Panned SVG World */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Geological Stratum Horizon Rules */}
          <g opacity="0.4" pointerEvents="none">
            <line x1="50" y1="150" x2="1050" y2="150" stroke="#5c432d" strokeWidth="1" strokeDasharray="5 5" />
            <text x="60" y="142" fill="#c4ad94" fontSize="11" fontFamily="'EB Garamond', serif" fontStyle="italic">
              SURFACE LEVEL [ 0 Feet ]
            </text>

            <line x1="50" y1="260" x2="1050" y2="260" stroke="#5c432d" strokeWidth="1" strokeDasharray="5 5" />
            <text x="60" y="252" fill="#c4ad94" fontSize="11" fontFamily="'EB Garamond', serif" fontStyle="italic">
              VALLEY & STREAMBED [ -20 Feet ]
            </text>

            <line x1="50" y1="380" x2="1050" y2="380" stroke="#5c432d" strokeWidth="1" strokeDasharray="5 5" />
            <text x="60" y="372" fill="#c4ad94" fontSize="11" fontFamily="'EB Garamond', serif" fontStyle="italic">
              SUBTERRANEAN BEDROCK [ -50 Feet ]
            </text>

            <line x1="50" y1="500" x2="1050" y2="500" stroke="#5c432d" strokeWidth="1" strokeDasharray="5 5" />
            <text x="60" y="492" fill="#c4ad94" fontSize="11" fontFamily="'EB Garamond', serif" fontStyle="italic">
              THE ABYSSAL FISSURE & CANYON [ -90 Feet ]
            </text>

            <line x1="50" y1="640" x2="1050" y2="640" stroke="#5c432d" strokeWidth="1" strokeDasharray="5 5" />
            <text x="60" y="632" fill="#c4ad94" fontSize="11" fontFamily="'EB Garamond', serif" fontStyle="italic">
              VAULTS OF THE MOUNTAIN KING [ -150 to -200 Feet ]
            </text>
          </g>

          {/* Subterranean Cavern Tunnels (Rich Gold & Bronze Paths) */}
          {connections.map((conn, idx) => {
            const from = mapNodes.find((n) => n.id === conn.from);
            const to = mapNodes.find((n) => n.id === conn.to);
            if (!from || !to) return null;

            const isKnown = visitedRooms.includes(conn.from) && visitedRooms.includes(conn.to);
            const isPartiallyKnown = visitedRooms.includes(conn.from) || visitedRooms.includes(conn.to);

            if (!isKnown && !isPartiallyKnown) return null;

            let strokeColor = isKnown ? '#c99a4c' : '#3d2b1d';
            let strokeWidth = isKnown ? '3' : '1.5';
            let strokeDash = isKnown ? 'none' : '4 4';

            if (conn.isMagic && isKnown) {
              strokeColor = '#c084fc';
              strokeWidth = '2.5';
              strokeDash = '6 3';
            } else if (conn.isCrystal && isKnown) {
              strokeColor = crystalBridgeActive ? '#38bdf8' : '#b83a3b';
              strokeWidth = crystalBridgeActive ? '3.5' : '2';
              strokeDash = crystalBridgeActive ? 'none' : '4 3';
            } else if (conn.blocked && isKnown) {
              strokeColor = '#b83a3b';
              strokeDash = '5 3';
            }

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            return (
              <g key={`conn-${idx}`}>
                {conn.isMagic ? (
                  <path
                    d={`M${from.x},${from.y} C${from.x + 100},${from.y + 160} ${to.x - 100},${to.y - 160} ${to.x},${to.y}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                  />
                ) : (
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    strokeLinecap="round"
                  />
                )}

                {isKnown && (
                  <g transform={`translate(${midX}, ${midY})`} pointerEvents="none">
                    <rect
                      x="-22"
                      y="-7"
                      width="44"
                      height="14"
                      rx="3"
                      fill="#19120d"
                      stroke="#4d3725"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3.5"
                      fill={conn.blocked ? '#fca5a5' : '#eec170'}
                      fontSize="8"
                      fontFamily="'EB Garamond', serif"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {conn.blocked ? 'BLOCKED' : conn.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Chamber Cartouches / Station Nodes */}
          {mapNodes.map((node) => {
            const isVisited = visitedRooms.includes(node.id);
            const isCurrent = node.id === currentRoom;
            const isSelected = selectedNode === node.id;
            const isAdjacent = isAdjacentToVisited(node.id);

            if (!isVisited && !isAdjacent) return null;

            const roomDef = ROOMS[node.id];
            const itemsHere = roomItems[node.id] || [];
            const hazard = getHazardInfo(node.id);

            return (
              <g
                key={`node-${node.id}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Pro Gamer UX: If node is already selected and has direct exit, click steps into it!
                  if (isSelected && onMove) {
                    const currentDef = ROOMS[currentRoom];
                    const exit = currentDef?.exits.find((ex) => ex.targetRoom === node.id);
                    if (exit) {
                      const allowed = !exit.condition || exit.condition(state).allowed;
                      if (allowed) {
                        onMove(exit.direction);
                        setSelectedNode(null);
                        return;
                      }
                    }
                  }
                  setSelectedNode(isSelected ? null : node.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (onMove) {
                    const currentDef = ROOMS[currentRoom];
                    const exit = currentDef?.exits.find((ex) => ex.targetRoom === node.id);
                    if (exit) {
                      const allowed = !exit.condition || exit.condition(state).allowed;
                      if (allowed) {
                        onMove(exit.direction);
                        setSelectedNode(null);
                      }
                    }
                  }
                }}
                className="cursor-pointer group"
              >
                {/* Traveler's Current Location Wax-Seal Ring */}
                {isCurrent && (
                  <>
                    <circle cx="0" cy="0" r="22" fill="none" stroke="#eec170" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="0" cy="0" r="16" fill="#381619" stroke="#b83a3b" strokeWidth="2.5" />
                  </>
                )}

                {/* Node Outer Circle */}
                <circle
                  cx="0"
                  cy="0"
                  r={isCurrent ? '13' : isSelected ? '12' : isVisited ? '10' : '8'}
                  fill={isCurrent ? '#b83a3b' : isVisited ? '#241b14' : '#140f0c'}
                  stroke={isCurrent ? '#f7f1e5' : isSelected ? '#eec170' : isVisited ? '#c99a4c' : '#3d2b1d'}
                  strokeWidth={isSelected ? '3' : isCurrent ? '2.5' : isVisited ? '2' : '1.5'}
                  strokeDasharray={isVisited ? 'none' : '3 3'}
                />

                {/* Inked Center Core */}
                {isVisited ? (
                  <circle
                    cx="0"
                    cy="0"
                    r={isCurrent ? '4' : '3'}
                    fill={isCurrent ? '#f7f1e5' : '#eec170'}
                  />
                ) : (
                  <text
                    x="0"
                    y="3.5"
                    fill="#614e41"
                    fontSize="9"
                    fontFamily="serif"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    ?
                  </text>
                )}

                {/* Inscribed Chamber Title Cartouche */}
                <g transform="translate(0, 18)">
                  <rect
                    x="-55"
                    y="-7"
                    width="110"
                    height="16"
                    rx="3"
                    fill="#19120d"
                    stroke={isCurrent ? '#b83a3b' : isSelected ? '#eec170' : '#4d3725'}
                    strokeWidth={isCurrent || isSelected ? '1.5' : '1'}
                  />
                  <text
                    x="0"
                    y="4.5"
                    textAnchor="middle"
                    fill={isCurrent ? '#fca5a5' : isSelected ? '#eec170' : '#f7f1e5'}
                    fontSize="9.5"
                    fontFamily="'EB Garamond', serif"
                    fontWeight={isCurrent || isSelected ? 'bold' : '600'}
                  >
                    {isVisited ? node.label : 'Uncharted Cavern'}
                  </text>
                </g>

                {/* Depth Inscription */}
                <text
                  x="0"
                  y="-14"
                  textAnchor="middle"
                  fill="#c4ad94"
                  fontSize="9"
                  fontFamily="'EB Garamond', serif"
                  fontStyle="italic"
                >
                  {node.depth}
                </text>

                {/* Items Badge */}
                {isVisited && itemsHere.length > 0 && (
                  <g transform="translate(13, -8)">
                    <circle cx="0" cy="0" r="6.5" fill="#2b1f13" stroke="#eec170" strokeWidth="1" />
                    <text x="0" y="2.5" textAnchor="middle" fill="#eec170" fontSize="8" fontWeight="bold">
                      {itemsHere.length}
                    </text>
                  </g>
                )}

                {/* Hazard Badge */}
                {isVisited && hazard && (
                  <g transform="translate(-13, -8)">
                    <circle cx="0" cy="0" r="6.5" fill="#381619" stroke="#b83a3b" strokeWidth="1" />
                    <text x="0" y="2.5" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
                      !
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Antique Chart Legend */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#140f0c]/95 border border-[#4d3725] text-[10px] font-manuscript text-[#c4ad94] pointer-events-none shadow-sm">
          <span className="flex items-center gap-1 text-[#fca5a5] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#b83a3b]"></span> YOU
          </span>
          <span className="text-[#3d2b1d]">|</span>
          <span className="flex items-center gap-1 text-[#eec170]">
            <span className="w-2 h-2 rounded-full bg-[#c99a4c]"></span> SURVEYED
          </span>
          <span className="text-[#3d2b1d]">|</span>
          <span className="flex items-center gap-1 text-[#614e41]">
            <span className="w-2 h-2 rounded-full border border-[#614e41]"></span> UNCHARTED
          </span>
        </div>
      </div>

      {/* TACTICAL ROOM DOSSIER DRAWER */}
      {selectedNodeData && (
        <div className="p-3 bg-[#19120d] border-t border-[#3d2b1d] flex flex-col gap-2 font-serif text-[#f7f1e5]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base font-monument text-[#f7f1e5]">
                  {selectedNodeData.label}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full border border-[#5c432d] bg-[#140f0c] text-[#eec170] font-manuscript">
                  Depth: {selectedNodeData.depth}
                </span>
                {selectedNodeData.id === currentRoom && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#b83a3b] bg-[#381619] text-[#fca5a5] font-manuscript font-bold">
                    CURRENT RESTING SPOT
                  </span>
                )}
              </div>
              <p className="text-xs font-manuscript text-[#c4ad94] mt-1 leading-relaxed">
                {visitedRooms.includes(selectedNodeData.id) && selectedRoomDef
                  ? selectedRoomDef.shortDescription
                  : 'Uncharted underground rock strata. Step into adjacent passages to lift fog of war.'}
              </p>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="px-2 py-1 rounded bg-[#241a12] hover:bg-[#33261c] text-[#c4ad94] hover:text-[#f7f1e5] font-bold text-xs cursor-pointer border border-[#5c432d]"
            >
              ✕
            </button>
          </div>

          {/* Items & Hazards badges in room */}
          {visitedRooms.includes(selectedNodeData.id) && (
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[#3d2b1d] text-xs">
              {selectedRoomItems.length > 0 ? (
                <div className="flex items-center gap-1 text-[#eec170] font-bold font-manuscript">
                  <Sparkles className="w-3.5 h-3.5 text-[#eec170]" />
                  <span>Relics resting here:</span>
                  <span className="font-normal text-[#f7f1e5]">
                    {selectedRoomItems.map((i) => ITEMS[i]?.name || i).join(', ')}
                  </span>
                </div>
              ) : (
                <span className="text-[#8a7562] text-[11px] font-manuscript italic">No articles found resting in this chamber.</span>
              )}

              {getHazardInfo(selectedNodeData.id) && (
                <div className="flex items-center gap-1 text-[#fca5a5] font-bold font-manuscript">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#fca5a5]" />
                  <span>{getHazardInfo(selectedNodeData.id)?.text}</span>
                </div>
              )}
            </div>
          )}

          {/* 1-TAP TRAVEL ACTION */}
          {adjacentExit && onMove && (
            <div className="pt-2 border-t border-[#3d2b1d] flex items-center justify-between">
              <span className="text-[11px] font-manuscript text-[#c4ad94]">
                Direct passage available: <b className="text-[#eec170]">{adjacentExit.direction}</b>
              </span>
              <button
                onClick={() => {
                  onMove(adjacentExit.direction);
                  setSelectedNode(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#eec170] hover:bg-[#dfb05d] text-[#1a120c] font-manuscript font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 shadow-sm"
              >
                <span>Step Into Chamber ({adjacentExit.direction})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
