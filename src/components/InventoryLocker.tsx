import React from 'react';
import { GameState, ItemId } from '../types/game';
import { ITEMS } from '../data/gameData';
import {
  Key,
  Flame,
  Droplet,
  Utensils,
  Box,
  Sparkles,
  Feather,
  Wand2,
  HelpCircle,
  Landmark,
  Gem,
  Coins,
  Award,
  BookMarked,
  Scroll,
} from 'lucide-react';

interface InventoryLockerProps {
  state: GameState;
  onItemAction?: (item: ItemId) => void;
  onToggleLantern: () => void;
  onDrinkWater: () => void;
  onEatFood: () => void;
  onUseCage?: () => void;
  onUseBird?: () => void;
  onUnlockGrate?: () => void;
  onBankTreasure?: (item: ItemId) => void;
  onWaveRod?: () => void;
}

export const InventoryLocker: React.FC<InventoryLockerProps> = ({
  state,
  onToggleLantern,
  onDrinkWater,
  onEatFood,
  onUseCage,
  onUseBird,
  onUnlockGrate,
  onBankTreasure,
  onWaveRod,
}) => {
  const {
    inventory,
    lanternLit,
    birdInCage,
    waterBottleFilled,
    currentRoom,
    grateUnlocked,
    crystalBridgeActive,
    bankedTreasures,
  } = state;

  const [selectedItem, setSelectedItem] = React.useState<ItemId | null>(null);

  const isAtVault = currentRoom === 'INSIDE_BUILDING';

  const getItemIcon = (id: ItemId) => {
    switch (id) {
      case 'KEYS':
        return <Key className="w-4 h-4 text-[#eec170]" />;
      case 'LANTERN':
        return <Flame className={`w-4 h-4 ${lanternLit ? 'text-[#eec170]' : 'text-[#826c5b]'}`} />;
      case 'BOTTLE':
        return <Droplet className="w-4 h-4 text-[#7cb5e8]" />;
      case 'FOOD':
        return <Utensils className="w-4 h-4 text-[#c4ad94]" />;
      case 'CAGE':
        return <Box className="w-4 h-4 text-[#c99a4c]" />;
      case 'BIRD':
        return <Feather className="w-4 h-4 text-[#6ed465]" />;
      case 'GOLD':
        return <Sparkles className="w-4 h-4 text-[#eec170]" />;
      case 'ROD':
        return <Wand2 className="w-4 h-4 text-[#ba88db]" />;
      case 'VASE':
        return <Sparkles className="w-4 h-4 text-[#7cb5e8]" />;
      case 'DIAMOND':
        return <Gem className="w-4 h-4 text-[#7cb5e8]" />;
      case 'PIRATE_CHEST':
        return <Coins className="w-4 h-4 text-[#eec170]" />;
      case 'RUG':
        return <Award className="w-4 h-4 text-[#e06767]" />;
      case 'DRAGON_EGG':
        return <Sparkles className="w-4 h-4 text-[#eec170]" />;
      case 'DWARF_AXE':
        return <Box className="w-4 h-4 text-[#c4ad94]" />;
      default:
        return <HelpCircle className="w-4 h-4 text-[#826c5b]" />;
    }
  };

  const getItemSubtext = (id: ItemId): string => {
    switch (id) {
      case 'LANTERN':
        return lanternLit ? 'Burning Bright (Lit)' : 'Extinguished (Unlit)';
      case 'CAGE':
        return birdInCage ? 'Songbird Contained' : 'Empty Wicker Mesh';
      case 'BOTTLE':
        return waterBottleFilled ? 'Fresh Spring Water' : 'Empty Glass Flagon';
      case 'FOOD':
        return 'Traveler Rations';
      case 'KEYS':
        return '3 Brass Keys';
      case 'GOLD':
        return 'Gold Nugget (+30 pts)';
      case 'BIRD':
        return 'Singing Warbler';
      case 'ROD':
        return crystalBridgeActive ? 'Starlight Bridge Active' : 'Black Star Rod';
      case 'VASE':
        return 'Ming Porcelain (+40 pts)';
      case 'DIAMOND':
        return 'Rough Diamonds (+35 pts)';
      case 'PIRATE_CHEST':
        return 'Treasure Chest (+35 pts)';
      case 'RUG':
        return 'Persian Tapestry (+40 pts)';
      case 'DRAGON_EGG':
        return 'Dragon Relic (+50 pts)';
      case 'DWARF_AXE':
        return 'Iron Throwing Axe';
      default:
        return 'Field Article';
    }
  };

  const selectedItemData = selectedItem ? ITEMS[selectedItem] : null;

  return (
    <div className="bg-[#18120e] border-2 border-[#4d3725] rounded-xl p-3 sm:p-3.5 flex flex-col gap-2.5 shadow-md font-serif text-[#f7f1e5]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-1.5">
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-[#eec170]" />
          <span className="text-xs font-monument font-bold tracking-widest text-[#f7f1e5]">
            TRAVELER'S SATCHEL
          </span>
        </div>

        <div className="flex items-center gap-2">
          {bankedTreasures.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#8b2520] bg-[#291313] text-[#f7a8a8] font-manuscript font-bold flex items-center gap-1">
              <Landmark className="w-3 h-3" />
              VAULTED: {bankedTreasures.length}
            </span>
          )}
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#5c432d] bg-[#221913] text-[#eec170] font-manuscript font-bold">
            HELD: {inventory.length} / 14 SPECIMENS
          </span>
        </div>
      </div>

      {inventory.length === 0 ? (
        <div className="p-4 text-center border border-dashed border-[#3d2b1d] rounded-lg bg-[#130f0c]">
          <p className="text-xs font-manuscript italic text-[#c4ad94]">The canvas satchel is currently empty.</p>
          <p className="text-[11px] font-manuscript text-[#826c5b] mt-0.5">
            Search caverns and rooms to gather historical relics and gear.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 max-h-[145px] overflow-y-auto pr-1 slidebar-retro">
          {inventory.map((itemId) => {
            const item = ITEMS[itemId];
            const isSelected = selectedItem === itemId;

            return (
              <div
                key={itemId}
                onClick={() => setSelectedItem(isSelected ? null : itemId)}
                className={`p-2 rounded-lg border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#291f17] border-[#b3844d] shadow-sm'
                    : 'bg-[#201812] border-[#3d2b1d] hover:border-[#6b4e36] hover:bg-[#261d15]'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="p-1 rounded bg-[#130f0c] border border-[#3d2b1d]">
                    {getItemIcon(itemId)}
                  </div>

                  {/* Contextual Action Buttons */}
                  {itemId === 'LANTERN' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLantern();
                      }}
                      className={`text-[9px] font-manuscript font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        lanternLit
                          ? 'bg-[#b83a3b] text-[#f7f1e5] border-[#912425] hover:bg-[#a12e2f]'
                          : 'bg-[#2c2016] text-[#eec170] border-[#6b4e36] hover:bg-[#382a1d]'
                      }`}
                    >
                      {lanternLit ? 'EXTINGUISH' : 'IGNITE'}
                    </button>
                  )}

                  {itemId === 'KEYS' && currentRoom === 'DEPRESSION' && !grateUnlocked && onUnlockGrate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnlockGrate();
                      }}
                      className="text-[9px] font-manuscript font-bold px-2 py-0.5 rounded bg-[#2a5924] text-[#f7f1e5] border border-[#1b3d17] hover:bg-[#336b2c] cursor-pointer"
                    >
                      UNLOCK
                    </button>
                  )}

                  {itemId === 'CAGE' && currentRoom === 'LOW_CRAWL' && !birdInCage && onUseCage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUseCage();
                      }}
                      className="text-[9px] font-manuscript font-bold px-2 py-0.5 rounded bg-[#2a5924] text-[#f7f1e5] border border-[#1b3d17] hover:bg-[#336b2c] cursor-pointer"
                    >
                      CATCH
                    </button>
                  )}

                  {itemId === 'BIRD' && currentRoom === 'MOUNTAIN_KING' && onUseBird && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUseBird();
                      }}
                      className="text-[9px] font-manuscript font-bold px-2 py-0.5 rounded bg-[#b83a3b] text-[#f7f1e5] border border-[#912425] hover:bg-[#a12e2f] cursor-pointer"
                    >
                      RELEASE
                    </button>
                  )}

                  {itemId === 'BOTTLE' && waterBottleFilled && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDrinkWater();
                      }}
                      className="text-[9px] font-manuscript font-bold px-2 py-0.5 rounded bg-[#1c2c3d] text-[#7cb5e8] border border-[#2b4c6f] hover:bg-[#24394f] cursor-pointer"
                    >
                      DRINK
                    </button>
                  )}

                  {itemId === 'FOOD' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEatFood();
                      }}
                      className="text-[9px] font-manuscript font-bold px-2 py-0.5 rounded bg-[#2c2016] text-[#c4ad94] border border-[#4d3725] hover:bg-[#382a1d] cursor-pointer"
                    >
                      EAT
                    </button>
                  )}

                  {itemId === 'ROD' && onWaveRod && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onWaveRod();
                      }}
                      className="text-[9px] font-manuscript font-bold px-2 py-0.5 rounded bg-[#3d264f] text-[#d6b2f0] border border-[#5d3b78] hover:bg-[#4d3063] cursor-pointer"
                    >
                      WAVE
                    </button>
                  )}

                  {isAtVault && item?.isTreasure && onBankTreasure && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBankTreasure(itemId);
                      }}
                      className="text-[9px] font-manuscript font-bold px-2 py-0.5 rounded bg-[#b83a3b] text-[#f7f1e5] border border-[#912425] hover:bg-[#a12e2f] cursor-pointer"
                    >
                      VAULT
                    </button>
                  )}
                </div>

                <div className="mt-1.5">
                  <div className="text-xs font-bold font-manuscript text-[#f7f1e5] truncate">{item?.name}</div>
                  <div className="text-[10px] font-manuscript text-[#c4ad94] truncate italic">
                    {getItemSubtext(itemId)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Item Field Inscription */}
      {selectedItemData && (
        <div className="mt-1 p-2 rounded-lg bg-[#130f0c] border border-[#4d3725] flex items-start gap-2.5 text-xs text-[#f7f1e5] animate-in fade-in duration-150">
          <Scroll className="w-4 h-4 text-[#eec170] shrink-0 mt-0.5" />
          <div className="flex-1 leading-snug">
            <div className="flex items-center justify-between">
              <span className="font-bold font-manuscript text-[#f7f1e5] text-sm">{selectedItemData.name}</span>
              {selectedItemData.isTreasure && (
                <span className="text-[10px] px-1.5 py-0.2 rounded border border-[#b83a3b] bg-[#291313] text-[#f7a8a8] font-manuscript font-bold">
                  ANCIENT TREASURE (+{selectedItemData.value || 30} PTS)
                </span>
              )}
            </div>
            <p className="text-[11px] font-manuscript text-[#c4ad94] mt-0.5 leading-relaxed">{selectedItemData.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};
