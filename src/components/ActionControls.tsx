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
  Unlock,
  Eye,
  ShieldAlert,
  ArrowRight,
  Hand,
  Wand2,
  Bookmark,
  Landmark,
  Sword,
  Feather,
} from 'lucide-react';

interface ActionControlsProps {
  state: GameState;
  onTakeItem: (item: ItemId) => void;
  onTakeAllItems?: () => void;
  onUnlockGrate: () => void;
  onOpenGrate: () => void;
  onToggleLantern: () => void;
  onCatchBirdHands: () => void;
  onCatchBirdCage: () => void;
  onScareSnake: () => void;
  onDrinkWater: () => void;
  onEatFood: () => void;
  onRefillWater: () => void;
  onExamineRoom: () => void;
  onCastXyzzy: () => void;
  onWaveRod?: () => void;
  onKillDragon?: () => void;
  onBankTreasures?: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  state,
  onTakeItem,
  onTakeAllItems,
  onUnlockGrate,
  onOpenGrate,
  onToggleLantern,
  onCatchBirdHands,
  onCatchBirdCage,
  onScareSnake,
  onDrinkWater,
  onEatFood,
  onRefillWater,
  onExamineRoom,
  onCastXyzzy,
  onWaveRod,
  onKillDragon,
  onBankTreasures,
}) => {
  const {
    currentRoom,
    roomItems,
    inventory,
    lanternLit,
    grateUnlocked,
    grateOpen,
    birdInCage,
    snakeFrightened,
    waterBottleFilled,
    crystalBridgeActive,
    dragonSlain,
  } = state;
  const currentItems = roomItems[currentRoom] || [];

  const hasKeys = inventory.includes('KEYS');
  const hasLantern = inventory.includes('LANTERN');
  const hasCage = inventory.includes('CAGE');
  const hasBird = inventory.includes('BIRD') || birdInCage;
  const hasBottle = inventory.includes('BOTTLE');
  const hasFood = inventory.includes('FOOD');
  const hasRod = inventory.includes('ROD');

  const heldTreasures = inventory.filter((i) =>
    ['GOLD', 'VASE', 'DIAMOND', 'PIRATE_CHEST', 'RUG', 'DRAGON_EGG'].includes(i)
  );

  const actions: React.ReactNode[] = [];

  // Magic XYZZY Incantation
  if (currentRoom === 'INSIDE_BUILDING' || currentRoom === 'HALL_MISTS') {
    actions.push(
      <button
        key="cast-xyzzy"
        onClick={onCastXyzzy}
        className="px-3 py-1.5 bg-[#2a1738] hover:bg-[#38204b] border border-[#7d419e] rounded-lg text-[#f2d8ff] text-xs font-manuscript font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:translate-y-0.5"
      >
        <Wand2 className="w-3.5 h-3.5 text-[#d6a1f5]" />
        Utter Magic Incantation "XYZZY"
      </button>
    );
  }

  // Wave Star Rod
  if (hasRod && (currentRoom === 'FISSURE' || currentRoom === 'TOP_OF_PIT') && onWaveRod) {
    actions.push(
      <button
        key="wave-rod"
        onClick={onWaveRod}
        className="px-3 py-1.5 bg-[#172738] hover:bg-[#20364d] border border-[#3b6694] rounded-lg text-[#cae4ff] text-xs font-manuscript font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:translate-y-0.5"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#7cb5e8]" />
        {crystalBridgeActive ? 'Wave Rod: Dissolve Bridge' : 'Wave Rod: Span Crystal Bridge'}
      </button>
    );
  }

  // Slay Dragon
  if (currentRoom === 'DRAGON_DEN' && !dragonSlain && onKillDragon) {
    actions.push(
      <button
        key="slay-dragon"
        onClick={onKillDragon}
        className="px-3 py-1.5 bg-[#381619] hover:bg-[#4a1d22] border-2 border-[#b83a3b] rounded-lg text-[#fcd0d0] text-xs font-manuscript font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:translate-y-0.5"
      >
        <Sword className="w-3.5 h-3.5 text-[#fca5a5]" />
        Slay Fierce Dragon with Bare Hands!
      </button>
    );
  }

  // Vault Treasures at Well-House
  if (currentRoom === 'INSIDE_BUILDING' && heldTreasures.length > 0 && onBankTreasures) {
    actions.push(
      <button
        key="bank-all-treasures"
        onClick={onBankTreasures}
        className="px-3 py-1.5 bg-[#2b1f13] hover:bg-[#382918] border border-[#c99a4c] rounded-lg text-[#fde4b8] text-xs font-manuscript font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:translate-y-0.5"
      >
        <Landmark className="w-3.5 h-3.5 text-[#eec170]" />
        Vault All Relics into Safe (+20 bonus pts)
      </button>
    );
  }

  // Grate Interactions
  if (currentRoom === 'DEPRESSION') {
    if (!grateUnlocked && hasKeys) {
      actions.push(
        <button
          key="unlock-grate"
          onClick={onUnlockGrate}
          className="px-3 py-1.5 bg-[#172e18] hover:bg-[#203d21] border border-[#2a6923] rounded-lg text-[#bbf7ba] text-xs font-manuscript font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:translate-y-0.5"
        >
          <Unlock className="w-3.5 h-3.5 text-[#86efac]" />
          Unlock Iron Grate with Brass Keys
        </button>
      );
    } else if (grateUnlocked && !grateOpen) {
      actions.push(
        <button
          key="open-grate"
          onClick={onOpenGrate}
          className="px-3 py-1.5 bg-[#172e18] hover:bg-[#203d21] border border-[#2a6923] rounded-lg text-[#bbf7ba] text-xs font-manuscript font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:translate-y-0.5"
        >
          <ArrowRight className="w-3.5 h-3.5 text-[#86efac]" />
          Heave Open Iron Grate
        </button>
      );
    }
  }

  // Snake Puzzle
  if (currentRoom === 'MOUNTAIN_KING' && !snakeFrightened) {
    if (hasBird) {
      actions.push(
        <button
          key="scare-snake-bird"
          onClick={onScareSnake}
          className="px-3 py-1.5 bg-[#172e18] hover:bg-[#203d21] border border-[#2a6923] rounded-lg text-[#bbf7ba] text-xs font-manuscript font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:translate-y-0.5"
        >
          <Feather className="w-3.5 h-3.5 text-[#86efac]" />
          Release Songbird to Drive Off Fierce Serpent
        </button>
      );
    } else {
      actions.push(
        <div
          key="snake-warning"
          className="px-3 py-1.5 bg-[#331114] border border-[#8b2520] rounded-lg text-[#fca5a5] text-xs font-manuscript flex items-center gap-1.5 select-none"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#f87171]" />
          Fierce serpent blocks passage West (Needs something to frighten it)
        </div>
      );
    }
  }

  // Bird Sanctuary
  if (currentRoom === 'LOW_CRAWL' && currentItems.includes('BIRD')) {
    if (hasCage && !birdInCage) {
      actions.push(
        <button
          key="catch-bird-cage"
          onClick={onCatchBirdCage}
          className="px-3 py-1.5 bg-[#172e18] hover:bg-[#203d21] border border-[#2a6923] rounded-lg text-[#bbf7ba] text-xs font-manuscript font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:translate-y-0.5"
        >
          <Box className="w-3.5 h-3.5 text-[#86efac]" />
          Entice Songbird into Wicker Cage
        </button>
      );
    } else if (!hasCage) {
      actions.push(
        <button
          key="catch-bird-hands"
          onClick={onCatchBirdHands}
          className="px-3 py-1.5 bg-[#241b14] hover:bg-[#33261c] border border-[#5c432d] rounded-lg text-[#c4ad94] text-xs font-manuscript flex items-center gap-1.5 cursor-pointer"
        >
          <Hand className="w-3.5 h-3.5 text-[#eec170]" />
          Attempt to catch bird with bare hands
        </button>
      );
    }
  }

  // Room Item Pickups: Bulk Take All if multiple
  const collectibleItems = currentItems.filter((id) => id !== 'BIRD');
  if (collectibleItems.length > 1 && onTakeAllItems) {
    actions.push(
      <button
        key="take-all-items"
        onClick={onTakeAllItems}
        className="px-3.5 py-1.5 bg-[#3a2818] hover:bg-[#4d3621] border-2 border-[#d4a259] rounded-lg text-[#fff6e6] text-xs font-manuscript font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:translate-y-0.5"
      >
        <Sparkles className="w-4 h-4 text-[#facc15]" />
        Take All Supplies ({collectibleItems.length} Articles) [Key: T]
      </button>
    );
  }

  collectibleItems.forEach((itemId) => {
    const item = ITEMS[itemId];

    actions.push(
      <button
        key={`take-${itemId}`}
        onClick={() => onTakeItem(itemId)}
        className="px-2.5 py-1.5 bg-[#241b14] hover:bg-[#33261c] border border-[#5c432d] hover:border-[#b3844d] rounded-lg text-[#f7f1e5] text-xs font-manuscript font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:translate-y-0.5"
      >
        <Hand className="w-3.5 h-3.5 text-[#eec170]" />
        Take {item ? item.name : itemId}
      </button>
    );
  });

  // Universal: Lantern Toggle
  if (hasLantern) {
    actions.push(
      <button
        key="toggle-lantern"
        onClick={onToggleLantern}
        className={`px-3 py-1.5 rounded-lg border text-xs font-manuscript font-bold flex items-center gap-1.5 cursor-pointer transition-all active:translate-y-0.5 shadow-sm ${
          lanternLit
            ? 'bg-[#b83a3b] hover:bg-[#a12e2f] text-[#f7f1e5] border-[#912425]'
            : 'bg-[#2b1f13] hover:bg-[#382918] border-[#c99a4c] text-[#eec170]'
        }`}
      >
        <Flame className="w-3.5 h-3.5" />
        {lanternLit ? 'Snuff Brass Lantern Flame' : 'Kindle Brass Lantern Flame'}
      </button>
    );
  }

  // Universal: Drink Water
  if (hasBottle && waterBottleFilled) {
    actions.push(
      <button
        key="drink-water"
        onClick={onDrinkWater}
        className="px-2.5 py-1.5 bg-[#172738] hover:bg-[#20364d] border border-[#3b6694] rounded-lg text-[#cae4ff] text-xs font-manuscript flex items-center gap-1.5 cursor-pointer"
      >
        <Droplet className="w-3.5 h-3.5 text-[#7cb5e8]" />
        Drink Fresh Spring Water
      </button>
    );
  }

  // Universal: Refill Water
  if (hasBottle && !waterBottleFilled && currentRoom === 'INSIDE_BUILDING') {
    actions.push(
      <button
        key="refill-water"
        onClick={onRefillWater}
        className="px-2.5 py-1.5 bg-[#172738] hover:bg-[#20364d] border border-[#3b6694] rounded-lg text-[#cae4ff] text-xs font-manuscript flex items-center gap-1.5 cursor-pointer"
      >
        <Droplet className="w-3.5 h-3.5 text-[#7cb5e8]" />
        Replenish Bottle at Well-House
      </button>
    );
  }

  // Universal: Eat Food
  if (hasFood) {
    actions.push(
      <button
        key="eat-food"
        onClick={onEatFood}
        className="px-2.5 py-1.5 bg-[#241b14] hover:bg-[#33261c] border border-[#5c432d] rounded-lg text-[#f7f1e5] text-xs font-manuscript flex items-center gap-1.5 cursor-pointer"
      >
        <Utensils className="w-3.5 h-3.5 text-[#eec170]" />
        Partake of Rations
      </button>
    );
  }

  // Universal: Survey Room
  actions.push(
    <button
      key="examine-surroundings"
      onClick={onExamineRoom}
      className="px-2.5 py-1.5 bg-[#201812] hover:bg-[#2b2118] border border-[#443021] hover:border-[#6b4e36] rounded-lg text-[#c4ad94] hover:text-[#f7f1e5] text-xs font-manuscript flex items-center gap-1.5 cursor-pointer transition-colors"
    >
      <Eye className="w-3.5 h-3.5 text-[#eec170]" />
      Survey Chamber & Inscriptions
    </button>
  );

  return (
    <div className="bg-[#18120e] border-2 border-[#4d3725] rounded-xl p-2.5 sm:p-3 flex flex-col gap-2 shadow-md font-serif text-[#f7f1e5]">
      <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-1.5">
        <span className="text-xs font-monument font-bold tracking-widest text-[#f7f1e5] flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5 text-[#eec170]" />
          EXPLORATION ACTIONS
        </span>
        <span className="text-[10px] font-manuscript text-[#c4ad94] italic">
          1-Tap Inscriptions
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {actions}
      </div>
    </div>
  );
};
