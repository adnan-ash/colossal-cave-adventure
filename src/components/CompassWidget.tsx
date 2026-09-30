import React from 'react';
import { Direction, GameState } from '../types/game';
import { ROOMS } from '../data/gameData';
import { Compass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CompassWidgetProps {
  state: GameState;
  onMove: (dir: Direction) => void;
}

export const CompassWidget: React.FC<CompassWidgetProps> = ({ state, onMove }) => {
  const currentDef = ROOMS[state.currentRoom];
  const exits = currentDef ? currentDef.exits : [];

  const getExitForDir = (dir: Direction) => {
    return exits.find((e) => e.direction === dir);
  };

  const isDirAvailable = (dir: Direction): boolean => {
    const exit = getExitForDir(dir);
    if (!exit) return false;
    if (exit.condition) {
      const check = exit.condition(state);
      return check.allowed;
    }
    return true;
  };

  const getDirLabel = (dir: Direction): string => {
    const exit = getExitForDir(dir);
    if (!exit) return 'Impassable cavern wall';
    if (exit.condition) {
      const check = exit.condition(state);
      if (!check.allowed && check.reason) {
        return check.reason;
      }
    }
    return exit.label;
  };

  const renderCompassButton = (dir: Direction, icon: React.ReactNode, label: string) => {
    const available = isDirAvailable(dir);
    const tooltip = getDirLabel(dir);

    return (
      <button
        onClick={() => {
          if (available) onMove(dir);
        }}
        disabled={!available}
        title={tooltip}
        className={`relative w-full h-full flex flex-col items-center justify-center rounded-lg transition-all duration-150 select-none border font-serif ${
          available
            ? 'bg-gradient-to-b from-[#291f17] to-[#1c150f] hover:from-[#3a2c20] hover:to-[#271d15] active:translate-y-0.5 text-[#f7f1e5] border-[#6b4e36] hover:border-[#b3844d] shadow-[0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer'
            : 'bg-[#120e0a]/80 text-[#544335] border-[#291f17] cursor-not-allowed opacity-40'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className={available ? 'text-[#eec170]' : 'text-[#544335]'}>{icon}</span>
          <span className={`font-bold text-xs tracking-wider font-manuscript ${available ? 'text-[#f7f1e5]' : 'text-[#544335]'}`}>
            {label}
          </span>
        </div>
      </button>
    );
  };

  const openExitsCount = exits.filter((e) => !e.condition || e.condition(state).allowed).length;

  return (
    <div className="bg-[#18120e] border-2 border-[#4d3725] rounded-xl p-3 sm:p-3.5 flex flex-col gap-2.5 shadow-md font-serif text-[#f7f1e5]">
      {/* Antique Inked Header */}
      <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-1.5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#eec170]" />
          <span className="text-xs font-monument font-bold tracking-widest text-[#f7f1e5]">
            SURVEY COMPASS ROSE
          </span>
        </div>
        <span className="text-[10px] font-manuscript px-2.5 py-0.5 rounded-full border border-[#5c432d] bg-[#221913] text-[#eec170] font-bold">
          {openExitsCount} {openExitsCount === 1 ? 'passage open' : 'passages open'}
        </span>
      </div>

      {/* 3x3 Tactile Compass Grid */}
      <div className="grid grid-cols-3 gap-2 h-36">
        {/* Top-Left: UP */}
        <div className="h-full">
          {renderCompassButton(
            'UP',
            <ArrowUpRight className="w-3.5 h-3.5" />,
            'UP'
          )}
        </div>

        {/* Top-Center: NORTH */}
        <div className="h-full">
          {renderCompassButton(
            'N',
            <ArrowUp className="w-3.5 h-3.5" />,
            'NORTH'
          )}
        </div>

        {/* Top-Right: DOWN */}
        <div className="h-full">
          {renderCompassButton(
            'DOWN',
            <ArrowDownRight className="w-3.5 h-3.5" />,
            'DOWN'
          )}
        </div>

        {/* Mid-Left: WEST */}
        <div className="h-full">
          {renderCompassButton(
            'W',
            <ArrowLeft className="w-3.5 h-3.5" />,
            'WEST'
          )}
        </div>

        {/* Center: Inked Compass Rose Woodcut Seal */}
        <div className="h-full flex flex-col items-center justify-center bg-[#130f0b] border-2 border-[#4d3725] rounded-lg p-1 text-center shadow-inner relative">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Engraved Compass Rose Ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#5c432d]" />
            {/* Cardinal cross lines */}
            <div className="absolute w-6 h-px bg-[#5c432d]" />
            <div className="absolute h-6 w-px bg-[#5c432d]" />
            {/* North Red Pointer */}
            <div className="w-1.5 h-6 bg-gradient-to-t from-[#c99a4c] to-[#b83a3b] rounded-sm transform rotate-4" />
            <div className="absolute w-2 h-2 rounded-full bg-[#f7f1e5] border border-[#2c1a10]" />
          </div>
          <span className="text-[8px] font-monument text-[#c4ad94] tracking-widest mt-0.5 font-bold">
            MAGNETIC
          </span>
        </div>

        {/* Mid-Right: EAST */}
        <div className="h-full">
          {renderCompassButton(
            'E',
            <ArrowRight className="w-3.5 h-3.5" />,
            'EAST'
          )}
        </div>

        {/* Bottom Row: Empty, SOUTH, Empty */}
        <div className="h-full" />
        <div className="h-full">
          {renderCompassButton(
            'S',
            <ArrowDown className="w-3.5 h-3.5" />,
            'SOUTH'
          )}
        </div>
        <div className="h-full" />
      </div>
    </div>
  );
};
