import React from 'react';
import { Direction, GameState } from '../types/game';
import { ROOMS } from '../data/gameData';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Compass,
  BookOpen,
  Map as MapIcon,
  BookMarked,
} from 'lucide-react';

interface MobileNavDockProps {
  state: GameState;
  activeTab: 'nav' | 'log' | 'map' | 'inventory';
  onSelectTab: (tab: 'nav' | 'log' | 'map' | 'inventory') => void;
  onMove: (dir: Direction) => void;
}

export const MobileNavDock: React.FC<MobileNavDockProps> = ({
  state,
  activeTab,
  onSelectTab,
  onMove,
}) => {
  const currentDef = ROOMS[state.currentRoom];
  const exits = currentDef ? currentDef.exits : [];

  const isDirAvailable = (dir: Direction): boolean => {
    const exit = exits.find((e) => e.direction === dir);
    if (!exit) return false;
    if (exit.condition) {
      return exit.condition(state).allowed;
    }
    return true;
  };

  const getExitCount = () => {
    return exits.filter((e) => !e.condition || e.condition(state).allowed).length;
  };

  const renderDirBtn = (dir: Direction, icon: React.ReactNode, label: string) => {
    const available = isDirAvailable(dir);
    return (
      <button
        onClick={() => {
          if (available) onMove(dir);
        }}
        disabled={!available}
        aria-label={`Travel ${label}`}
        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg font-serif text-[10px] font-bold transition-all select-none border ${
          available
            ? 'bg-[#291f17] text-[#f7f1e5] border-[#6b4e36] hover:bg-[#382a1e] active:translate-y-0.5 cursor-pointer shadow-sm'
            : 'bg-[#120e0a]/80 text-[#544335] border-[#291f17] cursor-not-allowed opacity-35'
        }`}
      >
        <span className={`w-4 h-4 flex items-center justify-center ${available ? 'text-[#eec170]' : 'text-[#544335]'}`}>
          {icon}
        </span>
        <span className={`text-[9px] mt-0.5 font-manuscript leading-none ${available ? 'text-[#f7f1e5]' : 'text-[#544335]'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="md:hidden shrink-0 z-40 bg-[#18120e] border-t-2 border-[#4d3725] shadow-xl pb-safe font-serif text-[#f7f1e5]">
      {/* Upper Dock: Tactile D-PAD Touch Strip */}
      <div className="px-2 pt-2 pb-1.5 flex items-center gap-1.5 border-b border-[#3d2b1d]">
        <div className="flex items-center gap-1 shrink-0 px-2.5 py-1 bg-[#120e0a] rounded-lg border border-[#4d3725] text-[10px] font-manuscript text-[#eec170] font-bold">
          <Compass className="w-3.5 h-3.5 text-[#eec170]" />
          <span>{getExitCount()} EXITS</span>
        </div>

        {/* 6 Core Directions */}
        <div className="flex-1 flex items-center gap-1">
          {renderDirBtn('W', <ArrowLeft className="w-3.5 h-3.5" />, 'W')}
          {renderDirBtn('N', <ArrowUp className="w-3.5 h-3.5" />, 'N')}
          {renderDirBtn('S', <ArrowDown className="w-3.5 h-3.5" />, 'S')}
          {renderDirBtn('E', <ArrowRight className="w-3.5 h-3.5" />, 'E')}
          {renderDirBtn('UP', <ArrowUpRight className="w-3.5 h-3.5" />, 'UP')}
          {renderDirBtn('DOWN', <ArrowDownRight className="w-3.5 h-3.5" />, 'DN')}
        </div>
      </div>

      {/* Lower Dock: Field Tabs */}
      <div className="px-2 py-1.5 flex items-center justify-around gap-1 text-[11px] font-manuscript">
        <button
          onClick={() => onSelectTab('nav')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer border ${
            activeTab === 'nav'
              ? 'bg-[#38261b] border-[#b3844d] text-[#eec170] font-bold shadow-sm'
              : 'text-[#c4ad94] hover:text-[#f7f1e5] bg-[#1f1711] border-[#3d2b1d]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>ACTIONS</span>
        </button>

        <button
          onClick={() => onSelectTab('log')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer border ${
            activeTab === 'log'
              ? 'bg-[#38261b] border-[#b3844d] text-[#eec170] font-bold shadow-sm'
              : 'text-[#c4ad94] hover:text-[#f7f1e5] bg-[#1f1711] border-[#3d2b1d]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>CHRONICLE</span>
        </button>

        <button
          onClick={() => onSelectTab('map')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer border ${
            activeTab === 'map'
              ? 'bg-[#38261b] border-[#b3844d] text-[#eec170] font-bold shadow-sm'
              : 'text-[#c4ad94] hover:text-[#f7f1e5] bg-[#1f1711] border-[#3d2b1d]'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>CHART</span>
        </button>

        <button
          onClick={() => onSelectTab('inventory')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer border ${
            activeTab === 'inventory'
              ? 'bg-[#38261b] border-[#b3844d] text-[#eec170] font-bold shadow-sm'
              : 'text-[#c4ad94] hover:text-[#f7f1e5] bg-[#1f1711] border-[#3d2b1d]'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>SATCHEL ({state.inventory.length})</span>
        </button>
      </div>
    </div>
  );
};
