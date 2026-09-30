import React from 'react';
import { GameState, RoomId, ItemId } from '../types/game';
import { ROOMS, ITEMS } from '../data/gameData';
import {
  Zap,
  X,
  Compass,
  Key,
  Flame,
  Shield,
  Sparkles,
  Unlock,
  Sword,
  Eye,
  RefreshCw,
  Award,
  Check,
} from 'lucide-react';

interface GodModePanelProps {
  state: GameState;
  isOpen: boolean;
  onClose: () => void;
  onTeleport: (roomId: RoomId) => void;
  onToggleItem: (itemId: ItemId) => void;
  onGiveAllItems: () => void;
  onClearItems: () => void;
  onToggleLantern: () => void;
  onUnlockAll: () => void;
  onFrightenSnake: () => void;
  onToggleBridge: () => void;
  onSlayDragon: () => void;
  onRevealAllMap: () => void;
  onMaxScore: () => void;
  onResetGame: () => void;
}

export const GodModePanel: React.FC<GodModePanelProps> = ({
  state,
  isOpen,
  onClose,
  onTeleport,
  onToggleItem,
  onGiveAllItems,
  onClearItems,
  onToggleLantern,
  onUnlockAll,
  onFrightenSnake,
  onToggleBridge,
  onSlayDragon,
  onRevealAllMap,
  onMaxScore,
}) => {
  if (!isOpen) return null;

  const allRoomIds = Object.keys(ROOMS) as RoomId[];
  const allItemIds = Object.keys(ITEMS) as ItemId[];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150 font-mono text-[#f5e6d3]">
      <div className="bg-[#171310] border-2 border-[#855026] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2e1d12] via-[#1c140d] to-[#2e1d12] border-b border-[#543b24] p-3 sm:p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/60 text-amber-400 animate-pulse">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-amber-400 tracking-wider">
                  SUPER POWERS · EXPEDITION CONSOLE
                </h2>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[10px] text-[#a89582]">
                Subterranean quantum developer cheat engine & spatial warp matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#291e15] text-[#8a7562] hover:text-[#f5e6d3] hover:bg-[#382a1d] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-3 sm:p-5 overflow-y-auto slidebar-retro space-y-4 text-xs">
          {/* Quick Divine Cheats */}
          <div className="bg-[#120e0b] border border-[#44301d] rounded-xl p-3 shadow-inner">
            <h3 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              DIVINE POWERS & SHORTCUTS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={onUnlockAll}
                className="p-2 rounded-xl bg-[#1e1711] hover:bg-[#2e2319] border border-[#4a3521] hover:border-amber-500 text-[#f5e6d3] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Unlock & Open Grate</span>
              </button>

              <button
                onClick={onToggleLantern}
                className="p-2 rounded-xl bg-[#1e1711] hover:bg-[#2e2319] border border-[#4a3521] hover:border-amber-500 text-[#f5e6d3] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{state.lanternLit ? 'Extinguish Lantern' : 'Infinite Lantern'}</span>
              </button>

              <button
                onClick={onToggleBridge}
                className="p-2 rounded-xl bg-[#1e1711] hover:bg-[#2e2319] border border-[#4a3521] hover:border-amber-500 text-[#f5e6d3] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{state.crystalBridgeActive ? 'Dispel Bridge' : 'Manifest Bridge'}</span>
              </button>

              <button
                onClick={onFrightenSnake}
                className="p-2 rounded-xl bg-[#1e1711] hover:bg-[#2e2319] border border-[#4a3521] hover:border-amber-500 text-[#f5e6d3] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{state.snakeFrightened ? 'Restore Snake' : 'Charm Snake'}</span>
              </button>

              <button
                onClick={onSlayDragon}
                className="p-2 rounded-xl bg-[#1e1711] hover:bg-[#2e2319] border border-[#4a3521] hover:border-amber-500 text-[#f5e6d3] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <Sword className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">{state.dragonSlain ? 'Revive Dragon' : 'Vanquish Dragon'}</span>
              </button>

              <button
                onClick={onRevealAllMap}
                className="p-2 rounded-xl bg-[#1e1711] hover:bg-[#2e2319] border border-[#4a3521] hover:border-amber-500 text-[#f5e6d3] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <Eye className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">Reveal Entire Map</span>
              </button>

              <button
                onClick={onMaxScore}
                className="p-2 rounded-xl bg-[#1e1711] hover:bg-[#2e2319] border border-[#4a3521] hover:border-amber-500 text-[#f5e6d3] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Max Score (350 Pts)</span>
              </button>

              <button
                onClick={onGiveAllItems}
                className="p-2 rounded-xl bg-[#1e1711] hover:bg-[#2e2319] border border-[#4a3521] hover:border-amber-500 text-[#f5e6d3] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <Key className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">+ All 14 Items</span>
              </button>

              <button
                onClick={onClearItems}
                className="p-2 rounded-xl bg-[#1e1711] hover:bg-[#2e2319] border border-[#4a3521] hover:border-amber-500 text-[#f5e6d3] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <RefreshCw className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">Clear Backpack</span>
              </button>
            </div>
          </div>

          {/* Spatial Quantum Warp: Teleport to any Room */}
          <div className="bg-[#120e0b] border border-[#44301d] rounded-xl p-3 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                QUANTUM SPATIAL WARP (TELEPORT)
              </h3>
              <span className="text-[10px] text-[#8a7562]">
                Current: <b className="text-amber-300">{state.currentRoom}</b>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1 slidebar-retro">
              {allRoomIds.map((rid) => {
                const room = ROOMS[rid];
                const isCurrent = state.currentRoom === rid;
                return (
                  <button
                    key={rid}
                    onClick={() => {
                      onTeleport(rid);
                      onClose();
                    }}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col ${
                      isCurrent
                        ? 'bg-[#3b2718] border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-[#1e1711] hover:bg-[#2a2017] border-[#382618] text-[#c4b3a1] hover:text-[#f5e6d3]'
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate flex items-center gap-1">
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>}
                      {room.title}
                    </span>
                    <span className="text-[9px] text-[#8a7562] truncate">{rid}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Item Replicator Matrix */}
          <div className="bg-[#120e0b] border border-[#44301d] rounded-xl p-3 shadow-inner">
            <h3 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              ITEM REPLICATOR MATRIX (TOGGLE CARRIED)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {allItemIds.map((iid) => {
                const item = ITEMS[iid];
                const isCarried = state.inventory.includes(iid);
                return (
                  <button
                    key={iid}
                    onClick={() => onToggleItem(iid)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isCarried
                        ? 'bg-[#2b1f13] border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-[#1e1711]/70 hover:bg-[#2a2017] border-[#382618] text-[#8a7562] hover:text-[#f5e6d3]'
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <span className="font-bold text-[11px] block truncate">{item.shortName}</span>
                      <span className="text-[9px] text-[#8a7562]">
                        {item.isTreasure ? `Treasure (+${item.value})` : `Item (+${item.value})`}
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                        isCarried
                          ? 'bg-amber-500 border-amber-400 text-stone-950 font-bold'
                          : 'border-[#44301d] bg-[#14100d]'
                      }`}
                    >
                      {isCarried && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#120e0b] border-t border-[#3b2918] flex items-center justify-between shrink-0 text-[11px]">
          <span className="text-[#8a7562]">
            Super Powers changes reflect immediately in the game session.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 font-bold text-stone-950 uppercase tracking-wider cursor-pointer transition-all shadow-md active:scale-95"
          >
            RESUME EXPEDITION
          </button>
        </div>
      </div>
    </div>
  );
};
