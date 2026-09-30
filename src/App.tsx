import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, ItemId, Direction, RoomId, LogEntry } from './types/game';
import { ROOMS, ITEMS } from './data/gameData';
import { sound } from './utils/audio';
import { voice } from './utils/voice';
import { ViewportSvg } from './components/ViewportSvg';
import { AsciiArt } from './components/AsciiArt';
import { CompassWidget } from './components/CompassWidget';
import { InventoryLocker } from './components/InventoryLocker';
import { ActionControls } from './components/ActionControls';
import { TerminalLog } from './components/TerminalLog';
import { GameStatusModal } from './components/GameStatusModal';
import { CaveMap } from './components/CaveMap';
import { GodModePanel } from './components/GodModePanel';
import { AchievementsModal } from './components/AchievementsModal';
import { MobileNavDock } from './components/MobileNavDock';
import { downloadStandaloneHtml } from './utils/exportHtml';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  HelpCircle,
  Eye,
  Tv,
  Trophy,
  Clock,
  Sparkles,
  Compass,
  MapPin,
  Menu,
  X,
  Flame,
  ArrowRight,
  Gamepad2,
} from 'lucide-react';

const getStoredSoundSetting = (): boolean => {
  try {
    const val = localStorage.getItem('colossal_sound_enabled');
    return val !== null ? val === 'true' : true;
  } catch {
    return true;
  }
};

const SESSION_STORAGE_KEY = 'colossal_cave_session';

const INITIAL_STATE: GameState = {
  currentRoom: 'ROAD_END',
  inventory: [],
  roomItems: {
    ROAD_END: [],
    INSIDE_BUILDING: ['KEYS', 'LANTERN', 'BOTTLE', 'FOOD'],
    FOREST: [],
    VALLEY: [],
    SLIT_IN_ROCK: [],
    DEPRESSION: [],
    BELOW_GRATE: [],
    COBBLE_CRAWL: ['CAGE'],
    TOP_OF_PIT: [],
    FISSURE: ['ROD'],
    DRAGON_DEN: ['RUG', 'DRAGON_EGG'],
    MAZE_1: [],
    MAZE_2: [],
    MAZE_3: [],
    PIRATE_LAIR: ['PIRATE_CHEST', 'VASE', 'DIAMOND'],
    HALL_MISTS: ['GOLD'],
    LOW_CRAWL: ['BIRD'],
    MOUNTAIN_KING: [],
    TREASURY: [],
  },
  lanternLit: false,
  grateUnlocked: false,
  grateOpen: false,
  birdInCage: false,
  snakeFrightened: false,
  waterBottleFilled: true,
  crystalBridgeActive: false,
  dragonSlain: false,
  pirateLooted: false,
  dwarfEncountered: false,
  dwarfAxeThrown: false,
  bankedTreasures: [],
  voiceEnabled: false,
  speedrunMode: true,
  startTime: Date.now(),
  achievements: [],
  turns: 0,
  score: 0,
  status: 'PLAYING',
  deathReason: null,
  visitedRooms: ['ROAD_END'],
  soundEnabled: getStoredSoundSetting(),
  viewMode: 'vector',
  scanlines: true,
  log: [
    {
      id: 'init-1',
      text: 'COLOSSAL CAVE ADVENTURE · GRAPHICAL REMAKE\nOriginal game by Will Crowther & Don Woods (1976/1977).',
      type: 'lore',
      turn: 0,
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 'init-2',
      text: 'Welcome, explorer! Somewhere nearby is Colossal Cave, where others have found fortunes in treasure and gold. Use compass arrows, touch D-Pad, or action buttons to navigate.',
      type: 'narration',
      turn: 0,
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 'init-3',
      text: 'You are standing at the end of a road before a small brick building. Around you is a forest. A small stream flows out of the building and down a gully.',
      type: 'narration',
      turn: 0,
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
};

const getInitialGameState = (): GameState => {
  const soundPref = getStoredSoundSetting();
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.currentRoom && ROOMS[parsed.currentRoom as RoomId]) {
          return {
            ...INITIAL_STATE,
            ...parsed,
            soundEnabled: soundPref,
            startTime: parsed.startTime || Date.now(),
          };
        }
      }
    } catch {
      // ignore parse error
    }
  }
  return {
    ...INITIAL_STATE,
    soundEnabled: soundPref,
    startTime: Date.now(),
  };
};

const getTacticalObjective = (state: GameState): { quest: string; hint: string; icon: string } => {
  const { currentRoom, inventory, roomItems, grateUnlocked, grateOpen, lanternLit, snakeFrightened } = state;
  const insideItems = (roomItems['INSIDE_BUILDING'] || []).filter((id) => id !== 'BIRD');
  const hasSupplies = inventory.includes('KEYS') && inventory.includes('LANTERN');

  if (currentRoom === 'ROAD_END' && !hasSupplies) {
    return {
      quest: 'Enter the Well-House and secure essential exploration supplies',
      hint: 'Move West (Click "Enter Building" or press [A]) to equip Keys, Lantern, Bottle, and Food.',
      icon: '🎒',
    };
  }

  if (currentRoom === 'INSIDE_BUILDING' && insideItems.length > 0) {
    return {
      quest: 'Take all supplies from the oak workbench',
      hint: 'Click "Take All Supplies" (or press key [T]) to grab Keys, Lantern, Water Bottle, and Food.',
      icon: '🔑',
    };
  }

  if (hasSupplies && !grateUnlocked && currentRoom !== 'DEPRESSION') {
    return {
      quest: 'Locate the subterranean cavern entrance in the valley',
      hint: 'Follow the stream South [S] to the Valley, then continue to the Depression to find the iron grate.',
      icon: '🗺️',
    };
  }

  if (currentRoom === 'DEPRESSION') {
    if (!grateUnlocked) {
      return {
        quest: 'Unlock the iron grate using your brass keys',
        hint: 'Click "Unlock Iron Grate" or press Spacebar.',
        icon: '🔓',
      };
    }
    if (!grateOpen) {
      return {
        quest: 'Heave open the unlocked iron grate',
        hint: 'Click "Heave Open Grate" to reveal the stone steps descending into the cavern.',
        icon: '🚪',
      };
    }
    return {
      quest: 'Descend into the subterranean cave',
      hint: 'Step DOWN (key [J]) into the chamber below.',
      icon: '⬇️',
    };
  }

  if (!lanternLit && currentRoom !== 'ROAD_END' && currentRoom !== 'INSIDE_BUILDING' && currentRoom !== 'FOREST' && currentRoom !== 'VALLEY') {
    return {
      quest: 'DANGER: Light your miner\'s lantern immediately!',
      hint: 'Underground darkness is lethal! Click "LANTERN: OFF" or press [L] to ignite the wick flame!',
      icon: '⚠️',
    };
  }

  if (!inventory.includes('CAGE') && !inventory.includes('BIRD') && !state.birdInCage) {
    return {
      quest: 'Retrieve the wicker birdcage from Cobble Crawl',
      hint: 'Crawl West [A] from Below Grate into Cobble Crawl to take the wicker cage.',
      icon: '🪤',
    };
  }

  if (inventory.includes('CAGE') && !inventory.includes('BIRD') && !state.birdInCage) {
    return {
      quest: 'Safely capture the singing green songbird in Low Crawl',
      hint: 'Locate the green bird in the grotto and use the cage to carry it safely.',
      icon: '🐦',
    };
  }

  if (!snakeFrightened) {
    return {
      quest: 'Bypass the fierce serpent blocking the royal halls',
      hint: 'Release the singing bird in the Hall of the Mountain King to scare the viper away!',
      icon: '🐍',
    };
  }

  const heldTreasures = inventory.filter((i) =>
    ['GOLD', 'VASE', 'DIAMOND', 'PIRATE_CHEST', 'RUG', 'DRAGON_EGG'].includes(i)
  );

  if (heldTreasures.length > 0) {
    return {
      quest: `Deposit ${heldTreasures.length} ancient relics in the Well-House Safe`,
      hint: 'Return to the surface building (or chant "XYZZY") and click "Vault All Relics" for maximum bonus points!',
      icon: '🏆',
    };
  }

  return {
    quest: 'Explore the depths, solve ancient mysteries, and unearth all 8 treasures!',
    hint: 'Wave the magic crystal rod at the fissure, slay the dragon, and attain Grandmaster Spelunker rank.',
    icon: '💎',
  };
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showGodMode, setShowGodMode] = useState<boolean>(false);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [showMobileTools, setShowMobileTools] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showControlsModal, setShowControlsModal] = useState<boolean>(false);
  const [achievementToast, setAchievementToast] = useState<string | null>(null);

  // Mobile navigation active tab
  type MobileTab = 'nav' | 'log' | 'map' | 'inventory';
  const [mobileTab, setMobileTab] = useState<MobileTab>('nav');

  // Elapsed real-time speedrun timer (seconds)
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const updateElapsed = () => {
      const start = gameState.startTime || Date.now();
      const diff = Math.max(0, Math.floor((Date.now() - start) / 1000));
      setElapsedTime(diff);
    };
    updateElapsed();
    const timer = setInterval(updateElapsed, 1000);
    return () => clearInterval(timer);
  }, [gameState.startTime]);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(elapsedTime / 60);
    const secs = elapsedTime % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [elapsedTime]);

  // Auto-persist game session state
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(gameState));
    } catch {
      // ignore storage quota errors
    }
  }, [gameState]);

  // Sync sound mute setting with audio engine
  useEffect(() => {
    sound.setEnabled(gameState.soundEnabled);
  }, [gameState.soundEnabled]);

  // Helper to trigger achievement unlock
  const unlockAchievement = useCallback((id: string, title: string) => {
    setGameState((prev) => {
      if (prev.achievements.includes(id)) return prev;
      sound.playVictoryFanfare();
      setAchievementToast(`🏆 TROPHY UNLOCKED: ${title}!`);
      setTimeout(() => setAchievementToast(null), 4500);
      return {
        ...prev,
        achievements: [...prev.achievements, id],
        score: prev.score + 15,
      };
    });
  }, []);

  // Append a message to narrative command log
  const addLog = useCallback(
    (text: string, type: LogEntry['type'] = 'narration') => {
      setGameState((prev) => {
        const nextTurn = type === 'action' ? prev.turns + 1 : prev.turns;
        const newEntry: LogEntry = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          text,
          type,
          turn: nextTurn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        return {
          ...prev,
          turns: nextTurn,
          log: [...prev.log, newEntry],
        };
      });

      // Voice synthesizer integration: speak narration lines if voice is enabled
      if (gameState.voiceEnabled && (type === 'narration' || type === 'lore' || type === 'success')) {
        voice.speak(text);
      }
    },
    [gameState.voiceEnabled]
  );

  // Toggle persistent sound
  const toggleSound = useCallback(() => {
    setGameState((prev) => {
      const nextSound = !prev.soundEnabled;
      try {
        localStorage.setItem('colossal_sound_enabled', String(nextSound));
      } catch {
        // ignore storage errors
      }
      sound.setEnabled(nextSound);
      return {
        ...prev,
        soundEnabled: nextSound,
      };
    });

    const willBeEnabled = !gameState.soundEnabled;
    addLog(
      willBeEnabled
        ? 'Subterranean ambient noise enabled (low-frequency wind & stone rumble loop active).'
        : 'Subterranean ambient noise and audio effects muted.',
      'system'
    );
  }, [gameState.soundEnabled, addLog]);

  // Toggle Voice Synthesizer
  const toggleVoice = useCallback(() => {
    const nextVoice = voice.toggle();
    setGameState((prev) => ({ ...prev, voiceEnabled: nextVoice }));
    addLog(
      nextVoice
        ? 'Mainframe Voice Synthesizer ONLINE. Room descriptions will be voiced.'
        : 'Mainframe Voice Synthesizer MUTED.',
      'system'
    );
    if (nextVoice) {
      voice.speak('Voice synthesizer online. Colossal Cave expedition active.');
    }
  }, [addLog]);

  // Directional Movement Handler
  const handleMove = useCallback(
    (dir: Direction) => {
      if (gameState.status !== 'PLAYING') return;

      const currentDef = ROOMS[gameState.currentRoom];
      const exit = currentDef.exits.find((e) => e.direction === dir);

      if (!exit) {
        sound.playKeyBlip();
        addLog(`You cannot travel ${dir} from here. There is no passage in that direction.`, 'warning');
        return;
      }

      // Check exit condition
      if (exit.condition) {
        const check = exit.condition(gameState);
        if (!check.allowed) {
          sound.playKeyBlip();
          addLog(check.reason || 'You cannot pass through there.', 'warning');
          return;
        }
      }

      // Resolve destination (Forest randomness mechanic)
      let targetRoom: RoomId;
      if (exit.targetRoom === 'FOREST_RANDOM') {
        const roll = Math.random();
        if (roll < 0.5) targetRoom = 'FOREST';
        else if (roll < 0.75) targetRoom = 'ROAD_END';
        else targetRoom = 'VALLEY';
      } else {
        targetRoom = exit.targetRoom as RoomId;
      }

      // SPECIAL RULE 1: Hall of the Mountain King Snake Strike
      if (gameState.currentRoom === 'MOUNTAIN_KING' && (dir === 'W' || dir === 'N' || dir === 'S')) {
        if (!gameState.snakeFrightened && targetRoom === 'TREASURY') {
          sound.playSnakeHiss();
          sound.playDeathChord();
          setGameState((prev) => ({
            ...prev,
            status: 'GAME_OVER',
            deathReason:
              'The ferocious green viper strikes with lightning speed! Its venom courses through your veins before you can take another breath.',
          }));
          addLog(
            '*** YOU HAVE DIED *** - The ferocious green viper strikes with lightning speed! Its deadly venom kills you instantly.',
            'danger'
          );
          return;
        }
      }

      // SPECIAL RULE 2: Hall of Mists darkness check
      if (targetRoom === 'HALL_MISTS' && !gameState.lanternLit) {
        sound.playFootstep();
        sound.playDeathChord();
        setGameState((prev) => ({
          ...prev,
          currentRoom: 'HALL_MISTS',
          status: 'GAME_OVER',
          deathReason: 'You fell into a pit in the dark and broke your neck!',
        }));
        addLog('*** GAME OVER *** You fell into a pit in the dark and broke your neck!', 'danger');
        return;
      }

      // Successful move
      sound.playFootstep();
      const targetDef = ROOMS[targetRoom];

      setGameState((prev) => {
        const isNewRoom = !prev.visitedRooms.includes(targetRoom);
        const newVisited = isNewRoom ? [...prev.visitedRooms, targetRoom] : prev.visitedRooms;
        const addedScore = isNewRoom ? 5 : 0;

        let nextStatus: GameState['status'] = prev.status;
        if (targetRoom === 'TREASURY' && prev.status === 'PLAYING') {
          nextStatus = 'VICTORY';
          sound.playVictoryFanfare();
        }

        return {
          ...prev,
          currentRoom: targetRoom,
          visitedRooms: newVisited,
          score: prev.score + addedScore,
          status: nextStatus,
        };
      });

      addLog(`You travel ${exit.label.toUpperCase()}.`, 'action');
      addLog(targetDef.initialDescription, 'narration');

      // Check Wandering Dwarf random encounter in deep cavern
      if (
        !gameState.dwarfEncountered &&
        gameState.turns > 6 &&
        ['COBBLE_CRAWL', 'TOP_OF_PIT', 'HALL_MISTS', 'LOW_CRAWL'].includes(targetRoom) &&
        Math.random() < 0.4
      ) {
        sound.playKeyBlip();
        setGameState((prev) => {
          const updatedItems = { ...prev.roomItems };
          updatedItems[targetRoom] = [...(updatedItems[targetRoom] || []), 'DWARF_AXE'];
          return {
            ...prev,
            dwarfEncountered: true,
            dwarfAxeThrown: true,
            roomItems: updatedItems,
          };
        });
        addLog(
          '⚡ CLANG! A little bearded dwarf darts out of the gloom! He hurls a heavy iron axe at you, which thuds deeply into the limestone wall, before scuttling into a dark crevice! The iron axe is embedded in the stone.',
          'lore'
        );
      }

      if (targetRoom === 'TREASURY') {
        unlockAchievement('GRANDMASTER', 'Conqueror of the Mountain King');
        if (gameState.turns < 60) {
          unlockAchievement('SPEEDRUNNER', 'Lightning Spelunker');
        }
        addLog('★ VICTORY ACHIEVED! You have found the secret Treasury of Colossal Cave! (+100 pts)', 'success');
      }
    },
    [gameState, addLog, unlockAchievement]
  );

  // Take item from room
  const handleTakeItem = useCallback(
    (item: ItemId) => {
      const room = gameState.currentRoom;
      const available = gameState.roomItems[room] || [];
      if (!available.includes(item)) return;

      const itemDef = ITEMS[item];
      sound.playItemGet();

      setGameState((prev) => {
        const updatedRoomItems = { ...prev.roomItems };
        updatedRoomItems[room] = updatedRoomItems[room].filter((i) => i !== item);

        return {
          ...prev,
          inventory: [...prev.inventory, item],
          roomItems: updatedRoomItems,
          score: prev.score + itemDef.value,
        };
      });

      addLog(`You picked up the ${itemDef.name}. (+${itemDef.value} pts)`, 'action');
    },
    [gameState, addLog]
  );

  // Bulk Take All available supplies in current room
  const handleTakeAllItems = useCallback(() => {
    const room = gameState.currentRoom;
    const available = (gameState.roomItems[room] || []).filter((id) => id !== 'BIRD');
    if (available.length === 0) return;

    sound.playItemGet();
    let totalScoreAdd = 0;
    const itemNames: string[] = [];

    available.forEach((item) => {
      const def = ITEMS[item];
      if (def) {
        totalScoreAdd += def.value;
        itemNames.push(def.name);
      }
    });

    setGameState((prev) => {
      const updatedRoomItems = { ...prev.roomItems };
      const currentInRoom = updatedRoomItems[room] || [];
      updatedRoomItems[room] = currentInRoom.filter((id) => id === 'BIRD');

      return {
        ...prev,
        inventory: [...prev.inventory, ...available],
        roomItems: updatedRoomItems,
        score: prev.score + totalScoreAdd,
      };
    });

    addLog(`🎒 You collected all articles in this chamber: ${itemNames.join(', ')}! (+${totalScoreAdd} pts)`, 'action');
  }, [gameState.currentRoom, gameState.roomItems, addLog]);

  // Unlock Grate
  const handleUnlockGrate = useCallback(() => {
    if (!gameState.inventory.includes('KEYS')) {
      addLog('You do not possess the keys to unlock the iron grate.', 'warning');
      return;
    }
    sound.playUnlock();
    setGameState((prev) => ({
      ...prev,
      grateUnlocked: true,
      score: prev.score + 15,
    }));
    unlockAchievement('FIRST_STEPS', 'Subterranean Entrance');
    addLog(
      'You fit the antique brass key into the heavy padlock and turn it. CLACK! The lock opens smoothly! (+15 pts)',
      'success'
    );
  }, [gameState.inventory, addLog, unlockAchievement]);

  // Open Grate
  const handleOpenGrate = useCallback(() => {
    if (!gameState.grateUnlocked) {
      addLog('The grate is locked tight with a heavy padlock.', 'warning');
      return;
    }
    sound.playFootstep();
    setGameState((prev) => ({
      ...prev,
      grateOpen: true,
    }));
    addLog(
      'With a heave, you pull the heavy wrought-iron grate open! Stone steps descend straight down into subterranean darkness.',
      'action'
    );
  }, [gameState.grateUnlocked, addLog]);

  // Toggle Lantern Light
  const handleToggleLantern = useCallback(() => {
    if (!gameState.inventory.includes('LANTERN')) {
      addLog('You do not have a lantern.', 'warning');
      return;
    }
    sound.playLanternLight();
    const willBeLit = !gameState.lanternLit;
    setGameState((prev) => ({
      ...prev,
      lanternLit: willBeLit,
    }));

    if (willBeLit) {
      addLog(
        'You strike a match and light the brass lantern. A warm, golden aura floods your surroundings, driving away the gloom!',
        'action'
      );
    } else {
      addLog('You extinguish the lantern flame. Darkness presses in closely around you.', 'action');
      if (gameState.currentRoom === 'HALL_MISTS') {
        addLog('WARNING: You are in the Hall of Mists without light! Moving here will be fatal!', 'warning');
      }
    }
  }, [gameState.inventory, gameState.lanternLit, gameState.currentRoom, addLog]);

  // Catch Bird with Hands (fails)
  const handleCatchBirdHands = useCallback(() => {
    sound.playBirdSong();
    addLog(
      'You reach forward with your bare hands, but the swift little green bird flutters gracefully up to a high limestone drapery, chirping mockingly! You cannot catch it without a proper enclosure.',
      'warning'
    );
  }, [addLog]);

  // Catch Bird with Cage (succeeds)
  const handleCatchBirdCage = useCallback(() => {
    if (!gameState.inventory.includes('CAGE')) {
      addLog('You need a wicker cage or enclosure to catch the agile songbird.', 'warning');
      return;
    }

    sound.playBirdSong();
    setGameState((prev) => {
      const updatedRoomItems = { ...prev.roomItems };
      updatedRoomItems.LOW_CRAWL = (updatedRoomItems.LOW_CRAWL || []).filter((i) => i !== 'BIRD');

      return {
        ...prev,
        birdInCage: true,
        inventory: [...prev.inventory, 'BIRD'],
        roomItems: updatedRoomItems,
        score: prev.score + 25,
      };
    });

    addLog(
      'You gently set down the open wicker cage. The curious little green bird hops inside! You slip the latch closed. The bird sings a sweet, peaceful trill. (+25 pts)',
      'success'
    );
  }, [gameState.inventory, addLog]);

  // Scare Snake with Bird
  const handleScareSnake = useCallback(() => {
    const hasBird = gameState.inventory.includes('BIRD') || gameState.birdInCage;
    if (!hasBird) {
      addLog('You have nothing to frighten away the fierce serpent!', 'warning');
      return;
    }

    sound.playBirdSong();
    sound.playSnakeHiss();
    setGameState((prev) => ({
      ...prev,
      snakeFrightened: true,
      score: prev.score + 40,
    }));

    unlockAchievement('SNAKE_CHARMER', 'Snake Charmer');

    addLog(
      'You uncover the wicker cage. The little bird lets out a piercing, triumphant battle trill! The giant green serpent recoils in primal terror, frantically hissing as it slithers into a crevice and disappears forever! The passages West into the Mountain King’s Vault are clear! (+40 pts)',
      'success'
    );
  }, [gameState.inventory, gameState.birdInCage, addLog, unlockAchievement]);

  // Wave Black Star Rod at Fissure
  const handleWaveRod = useCallback(() => {
    if (!gameState.inventory.includes('ROD')) {
      addLog('You do not possess the black star rod.', 'warning');
      return;
    }
    if (gameState.currentRoom !== 'FISSURE' && gameState.currentRoom !== 'TOP_OF_PIT') {
      addLog('You wave the rod, but nothing happens here. Its energy vibrates intensely near bottomless fissures.', 'narration');
      return;
    }
    sound.playMagicChime();
    setGameState((prev) => ({
      ...prev,
      crystalBridgeActive: true,
      score: prev.score + 25,
    }));
    unlockAchievement('CRYSTAL_ARCHITECT', 'Crystal Architect');
    addLog(
      '★ You wave the black rod! A brilliant spark jumps from the rusty star, bridging the bottomless abyss with a shimmering crystalline arch! The way East into the Dragon’s Canyon is open! (+25 pts)',
      'success'
    );
  }, [gameState.inventory, gameState.currentRoom, addLog, unlockAchievement]);

  // Slay Green Dragon with Bare Hands
  const handleKillDragon = useCallback(() => {
    if (gameState.currentRoom !== 'DRAGON_DEN') {
      addLog('There is no dragon here.', 'warning');
      return;
    }
    if (gameState.dragonSlain) {
      addLog('The dragon is already slain.', 'narration');
      return;
    }
    sound.playSnakeHiss();
    sound.playVictoryFanfare();
    setGameState((prev) => {
      const updatedRoomItems = { ...prev.roomItems };
      const currentInDen = updatedRoomItems.DRAGON_DEN || [];
      if (!currentInDen.includes('DRAGON_EGG')) currentInDen.push('DRAGON_EGG');
      if (!currentInDen.includes('RUG')) currentInDen.push('RUG');
      updatedRoomItems.DRAGON_DEN = currentInDen;

      return {
        ...prev,
        dragonSlain: true,
        score: prev.score + 40,
        roomItems: updatedRoomItems,
      };
    });
    unlockAchievement('DRAGON_SLAYER', 'Dragon Slayer');
    addLog(
      '★ With what? With your bare hands! In an incredible display of mythological valor, you vanquish the ferocious green dragon! The golden dragon egg and jeweled Persian rug are yours to claim! (+40 pts)',
      'success'
    );
  }, [gameState.currentRoom, gameState.dragonSlain, addLog, unlockAchievement]);

  // Bank Treasures in Well-House Depository Vault
  const handleBankTreasures = useCallback(() => {
    if (gameState.currentRoom !== 'INSIDE_BUILDING') {
      addLog('You can only deposit ancient treasures in the Well-House depository vault.', 'warning');
      return;
    }
    const treasureIds: ItemId[] = ['GOLD', 'VASE', 'DIAMOND', 'PIRATE_CHEST', 'RUG', 'DRAGON_EGG'];
    const held = gameState.inventory.filter((i) => treasureIds.includes(i));
    if (held.length === 0) {
      addLog('You have no ancient treasures to deposit into the vault.', 'warning');
      return;
    }
    sound.playItemGet();
    sound.playVictoryFanfare();
    const bonus = held.length * 20;
    setGameState((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((i) => !treasureIds.includes(i)),
      bankedTreasures: [...prev.bankedTreasures, ...held],
      score: prev.score + bonus,
    }));
    unlockAchievement('TREASURE_VAULT', 'Royal Vault Guardian');
    addLog(
      `★ You securely deposit ${held.length} royal treasure(s) into the Well-House depository vault! Safely stored for eternity! (+${bonus} bonus pts)`,
      'success'
    );
  }, [gameState.currentRoom, gameState.inventory, addLog, unlockAchievement]);

  // Drink water
  const handleDrinkWater = useCallback(() => {
    sound.playItemGet();
    setGameState((prev) => ({ ...prev, waterBottleFilled: false }));
    addLog('You uncork the bottle and drink the cold, refreshing mountain water. You feel reinvigorated!', 'action');
  }, [addLog]);

  // Refill water
  const handleRefillWater = useCallback(() => {
    sound.playItemGet();
    setGameState((prev) => ({ ...prev, waterBottleFilled: true }));
    addLog('You submerge your glass bottle into the crystal-clear stream and fill it to the brim.', 'action');
  }, [addLog]);

  // Eat Food
  const handleEatFood = useCallback(() => {
    if (!gameState.inventory.includes('FOOD')) {
      addLog('You have no food to eat.', 'warning');
      return;
    }
    sound.playItemGet();
    setGameState((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((item) => item !== 'FOOD'),
      score: prev.score + 5,
    }));
    addLog('You eat the delicious traveler’s rations. Tasty and invigorating! (+5 pts)', 'success');
  }, [gameState.inventory, addLog]);

  // XYZZY Magic
  const handleCastXyzzy = useCallback(() => {
    sound.playMagicChime();
    if (gameState.currentRoom === 'INSIDE_BUILDING') {
      sound.playWarpSound();
      setGameState((prev) => {
        const isNewRoom = !prev.visitedRooms.includes('HALL_MISTS');
        const newVisited: RoomId[] = isNewRoom ? [...prev.visitedRooms, 'HALL_MISTS'] : prev.visitedRooms;
        const addedScore = isNewRoom ? 10 : 0;

        if (!prev.lanternLit) {
          sound.playDeathChord();
          return {
            ...prev,
            currentRoom: 'HALL_MISTS',
            visitedRooms: newVisited,
            status: 'GAME_OVER',
            deathReason: 'You fell into a pit in the dark and broke your neck!',
          };
        }

        return {
          ...prev,
          currentRoom: 'HALL_MISTS',
          visitedRooms: newVisited,
          score: prev.score + addedScore,
        };
      });

      unlockAchievement('XYZZY_TRAVELER', 'A Hollow Voice Says XYZZY');

      if (!gameState.lanternLit) {
        addLog(
          '*** GAME OVER *** You teleported into the pitch-black Hall of Mists and fell into a pit in the dark and broke your neck!',
          'danger'
        );
      } else {
        addLog(
          'A hollow voice echoes "XYZZY!" Everything spins in a sparkling violet vortex... You instantly materialize in the magnificent Hall of Mists!',
          'lore'
        );
      }
    } else if (gameState.currentRoom === 'HALL_MISTS') {
      sound.playWarpSound();
      setGameState((prev) => ({
        ...prev,
        currentRoom: 'INSIDE_BUILDING',
      }));
      addLog(
        'A hollow voice echoes "XYZZY!" The mist dissolves around you in a swirl of starlight... You reappear inside the well-house!',
        'lore'
      );
    } else {
      addLog('Nothing happens.', 'narration');
    }
  }, [gameState.currentRoom, gameState.lanternLit, addLog, unlockAchievement]);

  // Look around
  const handleExamineRoom = useCallback(() => {
    sound.playKeyBlip();
    const roomDef = ROOMS[gameState.currentRoom];
    addLog(roomDef.initialDescription, 'narration');
  }, [gameState.currentRoom, addLog]);

  // Reset Session
  const handleResetSession = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    sound.playItemChime();
    setGameState({
      ...INITIAL_STATE,
      soundEnabled: sound.isEnabled(),
      startTime: Date.now(),
    });
    addLog('Session checkpoint reset. A new expedition begins!', 'lore');
  }, [addLog]);

  // CLI Command submission
  const handleCommandSubmit = useCallback(
    (cmd: string) => {
      const c = cmd.trim().toUpperCase();
      if (!c) return;

      addLog(`> ${cmd}`, 'action');

      if (c === 'N' || c === 'NORTH') handleMove('N');
      else if (c === 'S' || c === 'SOUTH') handleMove('S');
      else if (c === 'E' || c === 'EAST') handleMove('E');
      else if (c === 'W' || c === 'WEST') handleMove('W');
      else if (c === 'U' || c === 'UP') handleMove('UP');
      else if (c === 'D' || c === 'DOWN') handleMove('DOWN');
      else if (c === 'LOOK' || c === 'L') handleExamineRoom();
      else if (c === 'LIGHT' || c === 'LIGHT LANTERN' || c === 'LAMP ON') handleToggleLantern();
      else if (c === 'UNLOCK' || c === 'UNLOCK GRATE') handleUnlockGrate();
      else if (c === 'OPEN' || c === 'OPEN GRATE') handleOpenGrate();
      else if (c === 'XYZZY') handleCastXyzzy();
      else if (c === 'WAVE' || c === 'WAVE ROD') handleWaveRod();
      else if (c === 'KILL DRAGON' || c === 'SLAY DRAGON') handleKillDragon();
      else if (c === 'BANK' || c === 'DEPOSIT') handleBankTreasures();
      else if (c === 'EAT' || c === 'EAT FOOD' || c === 'TASTE FOOD') handleEatFood();
      else if (c === 'CATCH BIRD' || c === 'GET BIRD' || c === 'TAKE BIRD') {
        if (gameState.currentRoom === 'LOW_CRAWL') {
          if (gameState.inventory.includes('CAGE')) handleCatchBirdCage();
          else handleCatchBirdHands();
        } else {
          addLog('There is no bird here.', 'warning');
        }
      } else if (c.includes('SNAKE') || c.includes('SCARE')) {
        if (gameState.currentRoom === 'MOUNTAIN_KING') handleScareSnake();
        else addLog('There is no snake here.', 'warning');
      } else if (c.startsWith('GET ') || c.startsWith('TAKE ')) {
        const target = c.replace('GET ', '').replace('TAKE ', '').trim();
        if (target.includes('KEY')) handleTakeItem('KEYS');
        else if (target.includes('LANTERN') || target.includes('LAMP')) handleTakeItem('LANTERN');
        else if (target.includes('BOTTLE') || target.includes('WATER')) handleTakeItem('BOTTLE');
        else if (target.includes('FOOD')) handleTakeItem('FOOD');
        else if (target.includes('CAGE')) handleTakeItem('CAGE');
        else if (target.includes('GOLD') || target.includes('NUGGET')) handleTakeItem('GOLD');
        else if (target.includes('ROD')) handleTakeItem('ROD');
        else if (target.includes('VASE')) handleTakeItem('VASE');
        else if (target.includes('DIAMOND')) handleTakeItem('DIAMOND');
        else if (target.includes('CHEST')) handleTakeItem('PIRATE_CHEST');
        else if (target.includes('RUG')) handleTakeItem('RUG');
        else if (target.includes('EGG')) handleTakeItem('DRAGON_EGG');
        else if (target.includes('AXE')) handleTakeItem('DWARF_AXE');
        else addLog(`You see no ${target} here.`, 'warning');
      } else if (c.toLowerCase().replace(/\s+/g, ' ') === 'activate super powers') {
        sound.playVictoryFanfare();
        setShowGodMode(true);
        addLog('⚡ [ANCIENT ARTIFACT RESONANCE] Super powers unlocked! Quantum spatial matrix activated...', 'lore');
      } else if (c === 'PLUGH') {
        sound.playItemGet();
        addLog("A hollow voice says 'Nothing happens.'", 'lore');
      } else if (c === 'HELP') {
        addLog(
          'COMMANDS: NORTH, SOUTH, EAST, WEST, UP, DOWN, LOOK, XYZZY, WAVE ROD, SLAY DRAGON, BANK, GET <item>, EAT, LIGHT LANTERN, UNLOCK GRATE, CATCH BIRD, SCARE SNAKE. Or click buttons!',
          'system'
        );
      } else {
        addLog(`I don't understand how to "${cmd}". (Type HELP for instructions or click buttons)`, 'warning');
      }
    },
    [
      handleMove,
      handleExamineRoom,
      handleToggleLantern,
      handleUnlockGrate,
      handleOpenGrate,
      handleCastXyzzy,
      handleWaveRod,
      handleKillDragon,
      handleBankTreasures,
      handleEatFood,
      gameState.currentRoom,
      gameState.inventory,
      handleCatchBirdCage,
      handleCatchBirdHands,
      handleScareSnake,
      handleTakeItem,
      addLog,
    ]
  );

  // Pro-Gamer Keyboard Navigation (WASD, Arrows, Hotkeys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea or if modifier keys are down
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toUpperCase();

      if (key === 'W' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleMove('N');
      } else if (key === 'S' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleMove('S');
      } else if (key === 'A' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleMove('W');
      } else if (key === 'D' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleMove('E');
      } else if (key === 'U' || e.key === 'PageUp') {
        e.preventDefault();
        handleMove('UP');
      } else if (key === 'J' || e.key === 'PageDown') {
        e.preventDefault();
        handleMove('DOWN');
      } else if (key === 'L') {
        e.preventDefault();
        handleToggleLantern();
      } else if (key === 'T') {
        e.preventDefault();
        handleTakeAllItems();
      } else if (key === 'R') {
        e.preventDefault();
        setShowResetConfirm(true);
      } else if (key === '?' || (e.shiftKey && key === '/')) {
        e.preventDefault();
        setShowControlsModal(true);
      } else if (e.key === 'Escape') {
        setShowResetConfirm(false);
        setShowControlsModal(false);
        setShowHelpModal(false);
        setShowAchievements(false);
        setShowMobileTools(false);
      } else if (e.key === ' ' || e.key === 'Enter') {
        // Space / Enter contextual action
        const items = (gameState.roomItems[gameState.currentRoom] || []).filter((i) => i !== 'BIRD');
        if (items.length > 0) {
          e.preventDefault();
          handleTakeAllItems();
        } else if (gameState.currentRoom === 'ROAD_END') {
          e.preventDefault();
          handleMove('W'); // Enter building
        } else if (gameState.currentRoom === 'DEPRESSION') {
          e.preventDefault();
          if (!gameState.grateUnlocked && gameState.inventory.includes('KEYS')) {
            handleUnlockGrate();
          } else if (gameState.grateUnlocked && !gameState.grateOpen) {
            handleOpenGrate();
          } else if (gameState.grateOpen) {
            handleMove('DOWN');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleMove,
    handleToggleLantern,
    handleTakeAllItems,
    gameState.currentRoom,
    gameState.roomItems,
    gameState.grateUnlocked,
    gameState.grateOpen,
    gameState.inventory,
    handleUnlockGrate,
    handleOpenGrate,
  ]);

  // GOD MODE Cheats Handlers
  const handleGodTeleport = useCallback(
    (roomId: RoomId) => {
      sound.playWarpSound();
      setGameState((prev) => {
        const isNew = !prev.visitedRooms.includes(roomId);
        return {
          ...prev,
          currentRoom: roomId,
          visitedRooms: isNew ? [...prev.visitedRooms, roomId] : prev.visitedRooms,
          lanternLit: true, // God mode auto-lights lantern so you never die in dark
        };
      });
      addLog(`⚡ QUANTUM WARP: You phase through solid limestone and materialize in ${ROOMS[roomId].title}!`, 'lore');
    },
    [addLog]
  );

  const handleGodToggleItem = useCallback((itemId: ItemId) => {
    sound.playItemGet();
    setGameState((prev) => {
      const exists = prev.inventory.includes(itemId);
      const nextInv = exists ? prev.inventory.filter((i) => i !== itemId) : [...prev.inventory, itemId];
      return { ...prev, inventory: nextInv };
    });
  }, []);

  const handleGodGiveAllItems = useCallback(() => {
    sound.playVictoryFanfare();
    const allItems: ItemId[] = [
      'KEYS',
      'LANTERN',
      'BOTTLE',
      'FOOD',
      'CAGE',
      'BIRD',
      'GOLD',
      'ROD',
      'VASE',
      'DIAMOND',
      'PIRATE_CHEST',
      'RUG',
      'DRAGON_EGG',
      'DWARF_AXE',
    ];
    setGameState((prev) => ({
      ...prev,
      inventory: allItems,
      lanternLit: true,
      birdInCage: true,
    }));
    addLog('⚡ REPLICATOR MATRIX: All 14 ancient items replicated in backpack! Lantern ignited!', 'success');
  }, [addLog]);

  const handleGodClearItems = useCallback(() => {
    sound.playKeyBlip();
    setGameState((prev) => ({ ...prev, inventory: [] }));
    addLog('⚡ BACKPACK PURGED: All carried items cleared.', 'system');
  }, [addLog]);

  const handleGodToggleLantern = useCallback(() => {
    sound.playLanternLight();
    setGameState((prev) => ({ ...prev, lanternLit: !prev.lanternLit }));
  }, []);

  const handleGodUnlockAll = useCallback(() => {
    sound.playUnlock();
    setGameState((prev) => ({ ...prev, grateUnlocked: true, grateOpen: true }));
    addLog('⚡ DIVINE UNLOCK: The iron grate swings open freely!', 'success');
  }, [addLog]);

  const handleGodFrightenSnake = useCallback(() => {
    sound.playSnakeHiss();
    setGameState((prev) => ({ ...prev, snakeFrightened: !prev.snakeFrightened }));
    addLog('⚡ SERPENT TAMED: The fierce viper retreats into stone.', 'success');
  }, [addLog]);

  const handleGodToggleBridge = useCallback(() => {
    sound.playMagicChime();
    setGameState((prev) => ({ ...prev, crystalBridgeActive: !prev.crystalBridgeActive }));
    addLog('⚡ SPATIAL BRIDGE: The shimmering crystal arch spans the fissure!', 'success');
  }, [addLog]);

  const handleGodSlayDragon = useCallback(() => {
    sound.playVictoryFanfare();
    setGameState((prev) => ({ ...prev, dragonSlain: !prev.dragonSlain }));
    addLog('⚡ WYRM SLAIN: The volcanic dragon is vanquished.', 'success');
  }, [addLog]);

  const handleGodRevealAllMap = useCallback(() => {
    sound.playVictoryFanfare();
    const allRooms = Object.keys(ROOMS) as RoomId[];
    setGameState((prev) => ({ ...prev, visitedRooms: allRooms }));
    addLog('⚡ OMNISCIENT RADAR: Fog of War completely lifted! All 18 rooms surveyed!', 'success');
  }, [addLog]);

  const handleGodMaxScore = useCallback(() => {
    sound.playVictoryFanfare();
    setGameState((prev) => ({ ...prev, score: 350 }));
    addLog('⚡ MAX SCORE: Granted 350 / 350 Points (Grandmaster Spelunker Rank)!', 'success');
  }, [addLog]);

  const currentRoomDef = ROOMS[gameState.currentRoom];
  const latestNarration = useMemo(() => {
    for (let i = gameState.log.length - 1; i >= 0; i--) {
      if (gameState.log[i].type === 'narration' || gameState.log[i].type === 'action') {
        return gameState.log[i].text;
      }
    }
    return currentRoomDef.initialDescription;
  }, [gameState.log, currentRoomDef]);

  const currentObjective = useMemo(() => getTacticalObjective(gameState), [gameState]);

  return (
    <div
      className="h-dvh w-screen bg-[#1c150f] text-[#ede2d1] flex flex-col font-serif select-none overflow-hidden"
    >
      {/* Achievement Unlocked Floating Book Ribbon Banner */}
      {achievementToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 py-2.5 px-5 rounded-lg bg-[#fbf8f2] border-2 border-[#8b2520] text-[#8b2520] font-manuscript font-bold text-sm shadow-xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <Trophy className="w-4 h-4 text-[#8b2520]" />
          <span>{achievementToast}</span>
        </div>
      )}

      {/* TOP STATUS BAR: Classical Antiquarian Bookplate Header */}
      <header className="h-12 sm:h-14 shrink-0 bg-[#261910] border-b-2 border-[#473020] px-3 sm:px-6 flex items-center justify-between z-30 shadow-md text-[#fbf8f2]">
        {/* Brand Title */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-extrabold text-sm sm:text-base tracking-widest font-monument text-[#fbf8f2]">
            ADVENTURE
          </span>
          <span className="text-[11px] text-[#cfc0ae] font-manuscript italic hidden md:inline border-l border-[#543b24] pl-2">
            The Colossal Cave Chronicle · Anno 1976
          </span>
        </div>

        {/* Chronology & Score Ribbon Counters */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 font-serif text-xs shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1a110a] border border-[#473020] text-[#fbf8f2]">
            <span className="text-[#a89582] text-[10px] font-monument hidden sm:inline">FOLIO:</span>
            <span className="text-[#a89582] text-[10px] font-monument sm:hidden">F:</span>
            <span className="font-bold font-manuscript text-amber-200">{gameState.turns}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1a110a] border border-[#473020] text-[#fbf8f2]">
            <span className="text-[#a89582] text-[10px] font-monument hidden sm:inline">GOLD:</span>
            <span className="text-[#a89582] text-[10px] font-monument sm:hidden">G:</span>
            <span className="font-bold font-manuscript text-amber-200">{gameState.score}</span>
            <span className="text-[#8a7562] text-[10px] hidden md:inline">/ 350 pts</span>
          </div>

          {/* Speedrun Clock */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1a110a] border border-[#473020] text-[#fbf8f2]">
            <Clock className="w-3.5 h-3.5 text-[#cfc0ae]" />
            <span className="text-[#fbf8f2] text-[11px] font-manuscript font-bold">{formattedTime}</span>
          </div>
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* PROMINENT RESTART / RESET BUTTON (Up in Header) */}
          <button
            onClick={() => {
              if (gameState.turns > 1 || gameState.score > 0) {
                setShowResetConfirm(true);
              } else {
                handleResetSession();
              }
            }}
            title="Restart expedition from the beginning (End of Road) [Key: R]"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#5e221d] hover:bg-[#782c25] active:translate-y-0.5 border border-[#943830] text-[#fff5f5] text-xs font-manuscript font-bold shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#fca5a5]" />
            <span className="font-monument tracking-wider text-[10px] sm:text-xs">RESTART</span>
          </button>

          {/* Pro Gamer Controls Button */}
          <button
            onClick={() => setShowControlsModal(true)}
            title="Pro Gamer Controls & Shortcuts (WASD / Arrows / Hotkeys)"
            className="hidden sm:flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#2b1f14] hover:bg-[#3d2c1d] border border-[#5c432d] text-[#eec170] text-xs font-manuscript font-bold transition-all cursor-pointer active:translate-y-0.5"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-[#eec170]" />
            <span className="text-[10px] sm:text-[11px]">CONTROLS</span>
          </button>

          {/* Trophy Room Modal Trigger */}
          <button
            onClick={() => setShowAchievements(true)}
            title="Open Certificate of Merit"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#38261b] hover:bg-[#4d3525] border border-[#543b24] text-[#fbf8f2] text-xs font-manuscript font-bold transition-all cursor-pointer active:translate-y-0.5"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-manuscript">{gameState.achievements.length}/8 Merit</span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            title={gameState.soundEnabled ? 'Mute Atmosphere Audio' : 'Play Atmosphere Audio'}
            className={`p-1.5 rounded border text-xs cursor-pointer transition-all active:translate-y-0.5 ${
              gameState.soundEnabled
                ? 'bg-[#38261b] border-amber-500/80 text-amber-200'
                : 'bg-[#1a110a] border-[#473020] text-[#8a7562] hover:text-[#fbf8f2]'
            }`}
          >
            {gameState.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* View Mode Toggle */}
          <button
            onClick={() =>
              setGameState((prev) => ({
                ...prev,
                viewMode: prev.viewMode === 'vector' ? 'ascii' : 'vector',
              }))
            }
            title={`Switch to ${gameState.viewMode === 'vector' ? 'Woodcut ASCII Plate' : 'Engraved Illustration'}`}
            className="hidden md:flex p-1.5 rounded bg-[#38261b] hover:bg-[#4d3525] text-[#fbf8f2] border border-[#543b24] cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Standalone HTML Export */}
          <button
            onClick={downloadStandaloneHtml}
            title="Download Standalone Single-File Manuscript"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-manuscript font-bold rounded bg-[#fbf8f2] hover:bg-[#ede5d5] text-[#2c1a10] border border-[#cfc0ae] transition-all cursor-pointer active:translate-y-0.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT FOLIO</span>
          </button>

          {/* Help Lore Dialog */}
          <button
            onClick={() => setShowHelpModal(true)}
            title="Expedition Guide & Historical Lore"
            className="p-1.5 rounded bg-[#38261b] hover:bg-[#4d3525] text-[#fbf8f2] border border-[#543b24] cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Tools Menu Toggle */}
          <button
            onClick={() => setShowMobileTools(true)}
            title="Open Quick Folio Menu"
            className="sm:hidden p-1.5 rounded bg-[#38261b] hover:bg-[#4d3525] text-[#fbf8f2] border border-[#543b24] cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* TACTICAL OBJECTIVE & ACTIVE QUEST BAR (Pro Gamer Guide) */}
      <div className="shrink-0 bg-[#211710] border-b border-[#3d2b1d] px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 shadow-sm text-xs font-serif">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm shrink-0">{currentObjective.icon}</span>
          <span className="font-bold font-monument text-[#eec170] shrink-0 text-[10px] sm:text-[11px] uppercase tracking-wider">
            MISSION:
          </span>
          <span className="text-[#f7f1e5] font-manuscript font-bold truncate text-xs sm:text-sm">
            {currentObjective.quest}
          </span>
          <span className="hidden md:inline text-[#c4ad94] text-xs font-manuscript italic border-l border-[#4a3523] pl-2 truncate">
            💡 {currentObjective.hint}
          </span>
        </div>

        {/* Quick Lantern Toggle in Objective Bar */}
        {gameState.inventory.includes('LANTERN') && (
          <button
            onClick={handleToggleLantern}
            title={gameState.lanternLit ? 'Lantern is Lit (Press L to extinguish)' : 'Lantern is Unlit (Press L to ignite)'}
            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-manuscript font-bold cursor-pointer transition-all active:translate-y-0.5 ${
              gameState.lanternLit
                ? 'bg-[#3d2814] border-[#d4a259] text-[#fef08a] shadow-[0_0_8px_rgba(234,179,8,0.25)]'
                : 'bg-[#18110b] border-[#4a3523] text-[#8c7661] hover:text-[#f7f1e5]'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${gameState.lanternLit ? 'text-[#facc15]' : 'text-[#8c7661]'}`} />
            <span>{gameState.lanternLit ? 'LANTERN: LIT [L]' : 'LANTERN: OFF [L]'}</span>
          </button>
        )}
      </div>

      {/* MAIN CONTAINER: Optimized per screen size */}
      <main className="flex-1 min-h-0 w-full max-w-[1700px] mx-auto p-2 sm:p-3 lg:p-4 overflow-hidden relative flex flex-col md:grid md:grid-cols-12 gap-2.5 sm:gap-3 lg:gap-4">
        {/* =========================================================================
            SCREEN ADAPTATION: MOBILE (< 768px)
            Single-thumb console layout with Live Story Narration & Tactical Deck
            ========================================================================= */}
        <div className="flex-1 min-h-0 flex flex-col md:hidden overflow-y-auto slidebar-retro gap-2">
          {/* Viewport Card */}
          <div className="relative w-full aspect-[16/9] max-h-[24vh] shrink-0 bg-[#120e0b] border-2 border-[#4d3725] rounded-xl overflow-hidden shadow-md flex items-center justify-center">
            {gameState.viewMode === 'vector' ? (
              <ViewportSvg
                state={gameState}
                onTakeItem={handleTakeItem}
                onToggleLantern={handleToggleLantern}
                onUnlockGrate={handleUnlockGrate}
                onOpenGrate={handleOpenGrate}
                onCatchBird={gameState.inventory.includes('CAGE') ? handleCatchBirdCage : handleCatchBirdHands}
              />
            ) : (
              <AsciiArt state={gameState} />
            )}

            {/* Quick Graphic/ASCII switch toggle inside Viewport */}
            <button
              onClick={() =>
                setGameState((prev) => ({
                  ...prev,
                  viewMode: prev.viewMode === 'vector' ? 'ascii' : 'vector',
                }))
              }
              className="absolute top-2 right-2 px-2.5 py-0.5 rounded bg-[#18120e]/90 border border-[#5c432d] text-[9px] text-[#eec170] font-manuscript font-bold cursor-pointer"
            >
              PLATE: {gameState.viewMode.toUpperCase()}
            </button>
          </div>

          {/* LIVE STORY NARRATION & LOCATION HUD */}
          <div className="bg-[#18120e] border-2 border-[#4d3725] rounded-xl p-3 shrink-0 flex flex-col gap-2 shadow-md text-[#f7f1e5]">
            <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[#eec170] shrink-0" />
                <span className="font-bold text-xs text-[#f7f1e5] truncate font-monument">
                  {currentRoomDef.title}
                </span>
              </div>
              <span className="text-[10px] font-manuscript text-[#eec170] font-bold shrink-0 px-2.5 py-0.5 rounded-full bg-[#241a13] border border-[#5c432d]">
                {gameState.currentRoom.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Live narrative snippet */}
            <p className="text-xs text-[#ede2d1] leading-relaxed font-manuscript line-clamp-2">
              {latestNarration}
            </p>

            {/* Interactive Available Passages / Exits Deck */}
            <div className="pt-1.5 border-t border-[#3d2b1d] flex flex-wrap items-center gap-1">
              <span className="text-[10px] font-monument uppercase tracking-wider text-[#a89582] mr-0.5">
                Passages:
              </span>
              {currentRoomDef.exits.map((exit, idx) => {
                const isAllowed = !exit.condition || exit.condition(gameState).allowed;
                const reason = exit.condition && !isAllowed ? exit.condition(gameState).reason : null;

                let arrowIcon = '→';
                if (exit.direction === 'N') arrowIcon = '↑';
                else if (exit.direction === 'S') arrowIcon = '↓';
                else if (exit.direction === 'E') arrowIcon = '→';
                else if (exit.direction === 'W') arrowIcon = '←';
                else if (exit.direction === 'UP') arrowIcon = '⮥';
                else if (exit.direction === 'DOWN') arrowIcon = '⮧';

                return (
                  <button
                    key={`mob-exit-${exit.direction}-${idx}`}
                    onClick={() => {
                      if (isAllowed) handleMove(exit.direction);
                      else if (reason) addLog(reason, 'warning');
                    }}
                    disabled={!isAllowed}
                    title={reason || `Move ${exit.direction}: ${exit.label}`}
                    className={`px-2 py-1 rounded-md text-[11px] font-manuscript font-bold flex items-center gap-1 transition-all select-none ${
                      isAllowed
                        ? 'bg-[#291e15] hover:bg-[#3d2c1d] active:translate-y-0.5 border border-[#8a6843] text-[#fbf6ea] cursor-pointer'
                        : 'bg-[#15100c] border border-[#2b1f15] text-[#5e4b3c] cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="text-[#eec170] font-bold">{arrowIcon}</span>
                    <span>{exit.label || exit.direction}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Room Items Pickup Bar */}
            {((gameState.roomItems[gameState.currentRoom] || []).filter((id) => id !== 'BIRD')).length > 0 && (
              <div className="pt-1.5 border-t border-[#3d2b1d] flex flex-wrap items-center gap-1">
                {((gameState.roomItems[gameState.currentRoom] || []).filter((id) => id !== 'BIRD')).length > 1 && (
                  <button
                    onClick={handleTakeAllItems}
                    className="px-2 py-0.5 rounded bg-[#3d2816] hover:bg-[#543820] border-2 border-[#eec170] text-[#fff8ea] text-[11px] font-manuscript font-bold flex items-center gap-1 cursor-pointer active:translate-y-0.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#facc15]" />
                    <span>Take All</span>
                  </button>
                )}
                {((gameState.roomItems[gameState.currentRoom] || []).filter((id) => id !== 'BIRD')).map((itemId) => (
                  <button
                    key={`mob-item-${itemId}`}
                    onClick={() => handleTakeItem(itemId)}
                    className="px-2 py-0.5 rounded bg-[#221811] hover:bg-[#33241a] border border-[#5c432d] text-[#f7f1e5] text-[11px] font-manuscript font-bold cursor-pointer"
                  >
                    <span>+ {ITEMS[itemId]?.name || itemId}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE MOBILE TAB CONTENT */}
          <div className="flex-1 min-h-0 flex flex-col pb-2">
            {mobileTab === 'nav' && (
              <div className="flex flex-col gap-2">
                {/* Contextual Actions Strip */}
                <ActionControls
                  state={gameState}
                  onTakeItem={handleTakeItem}
                  onTakeAllItems={handleTakeAllItems}
                  onUnlockGrate={handleUnlockGrate}
                  onOpenGrate={handleOpenGrate}
                  onToggleLantern={handleToggleLantern}
                  onCatchBirdHands={handleCatchBirdHands}
                  onCatchBirdCage={handleCatchBirdCage}
                  onScareSnake={handleScareSnake}
                  onDrinkWater={handleDrinkWater}
                  onEatFood={handleEatFood}
                  onRefillWater={handleRefillWater}
                  onExamineRoom={handleExamineRoom}
                  onCastXyzzy={handleCastXyzzy}
                  onWaveRod={handleWaveRod}
                  onKillDragon={handleKillDragon}
                  onBankTreasures={handleBankTreasures}
                />

                {/* Compass & Inventory */}
                <CompassWidget state={gameState} onMove={handleMove} />
                <InventoryLocker
                  state={gameState}
                  onToggleLantern={handleToggleLantern}
                  onDrinkWater={handleDrinkWater}
                  onEatFood={handleEatFood}
                  onUseCage={handleCatchBirdCage}
                  onUseBird={handleScareSnake}
                  onUnlockGrate={handleUnlockGrate}
                  onBankTreasure={handleBankTreasures}
                  onWaveRod={handleWaveRod}
                />
              </div>
            )}

            {mobileTab === 'log' && (
              <div className="h-[360px] flex flex-col">
                <TerminalLog
                  logs={gameState.log}
                  onCommandSubmit={handleCommandSubmit}
                  onClearLogs={() => setGameState((prev) => ({ ...prev, log: [] }))}
                />
              </div>
            )}

            {mobileTab === 'map' && (
              <div className="flex flex-col gap-2">
                <CaveMap state={gameState} onMove={handleMove} />
              </div>
            )}

            {mobileTab === 'inventory' && (
              <div className="flex flex-col gap-2">
                <InventoryLocker
                  state={gameState}
                  onToggleLantern={handleToggleLantern}
                  onDrinkWater={handleDrinkWater}
                  onEatFood={handleEatFood}
                  onUseCage={handleCatchBirdCage}
                  onUseBird={handleScareSnake}
                  onUnlockGrate={handleUnlockGrate}
                  onBankTreasure={handleBankTreasures}
                  onWaveRod={handleWaveRod}
                />
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            SCREEN ADAPTATION: TABLET & DESKTOP (>= 768px)
            Dual-leaf open folio presentation on library desk
            ========================================================================= */}
        {/* Left Column: Visual Engraving, Location Heading, & Cave Cartography */}
        <section
          id="section-viewport"
          className="hidden md:flex md:col-span-5 flex-col gap-2.5 md:h-full min-h-0 md:overflow-y-auto slidebar-retro"
        >
          {/* Viewport SVG / ASCII Art */}
          <div className="relative w-full aspect-[16/10] max-h-[36vh] shrink-0 bg-[#120e0b] border-2 border-[#4d3725] rounded-xl overflow-hidden shadow-md flex items-center justify-center">
            <div key={gameState.currentRoom} className="w-full h-full room-fade-in relative flex items-center justify-center">
              {gameState.viewMode === 'vector' ? (
                <ViewportSvg
                  state={gameState}
                  onTakeItem={handleTakeItem}
                  onToggleLantern={handleToggleLantern}
                  onUnlockGrate={handleUnlockGrate}
                  onOpenGrate={handleOpenGrate}
                  onCatchBird={gameState.inventory.includes('CAGE') ? handleCatchBirdCage : handleCatchBirdHands}
                />
              ) : (
                <AsciiArt state={gameState} />
              )}
            </div>

            <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded bg-[#18120e]/90 border border-[#5c432d] text-[9px] text-[#eec170] font-manuscript font-bold pointer-events-none">
              PLATE: {gameState.viewMode.toUpperCase()}
            </div>
          </div>

          {/* Location Title & Subtitle Card with Quick Passages Deck */}
          <div
            key={`loc-${gameState.currentRoom}`}
            className="shrink-0 bg-[#18120e] border-2 border-[#4d3725] rounded-xl p-3 sm:p-3.5 flex flex-col gap-2.5 shadow-md text-[#f7f1e5]"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <h1 className="text-sm sm:text-base font-bold font-monument text-[#f7f1e5] truncate">
                  {currentRoomDef.title}
                </h1>
                <p className="text-xs font-manuscript italic text-[#c4ad94] mt-0.5 truncate">
                  {currentRoomDef.subtitle}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-manuscript font-bold text-[#eec170] px-2.5 py-1 rounded-full bg-[#241a13] border border-[#5c432d]">
                  {gameState.currentRoom.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Quick Interactive Passages / Exits Deck */}
            <div className="pt-2 border-t border-[#3d2b1d] flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] sm:text-[11px] font-monument uppercase tracking-wider text-[#a89582] mr-0.5">
                Passages:
              </span>
              {currentRoomDef.exits.map((exit, idx) => {
                const isAllowed = !exit.condition || exit.condition(gameState).allowed;
                const reason = exit.condition && !isAllowed ? exit.condition(gameState).reason : null;

                let arrowIcon = '→';
                let keyHint = '';
                if (exit.direction === 'N') { arrowIcon = '↑'; keyHint = 'W / ↑'; }
                else if (exit.direction === 'S') { arrowIcon = '↓'; keyHint = 'S / ↓'; }
                else if (exit.direction === 'E') { arrowIcon = '→'; keyHint = 'D / →'; }
                else if (exit.direction === 'W') { arrowIcon = '←'; keyHint = 'A / ←'; }
                else if (exit.direction === 'UP') { arrowIcon = '⮥'; keyHint = 'U'; }
                else if (exit.direction === 'DOWN') { arrowIcon = '⮧'; keyHint = 'J'; }

                return (
                  <button
                    key={`desk-exit-${exit.direction}-${idx}`}
                    onClick={() => {
                      if (isAllowed) handleMove(exit.direction);
                      else if (reason) addLog(reason, 'warning');
                    }}
                    disabled={!isAllowed}
                    title={reason || `Move ${exit.direction}: ${exit.label} [Key: ${keyHint}]`}
                    className={`px-2.5 py-1 rounded-lg text-xs font-manuscript font-bold flex items-center gap-1.5 transition-all select-none shadow-sm ${
                      isAllowed
                        ? 'bg-[#291e15] hover:bg-[#3d2c1d] active:translate-y-0.5 border border-[#8a6843] hover:border-[#dfb05d] text-[#fbf6ea] cursor-pointer'
                        : 'bg-[#15100c] border border-[#2b1f15] text-[#5e4b3c] cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="text-[#eec170] font-bold text-sm">{arrowIcon}</span>
                    <span>{exit.label || exit.direction}</span>
                    {keyHint && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[#16100b] text-[#c4ad94] border border-[#4a3625]">
                        {keyHint}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Room Items Pickup Bar */}
            {((gameState.roomItems[gameState.currentRoom] || []).filter((id) => id !== 'BIRD')).length > 0 && (
              <div className="pt-2 border-t border-[#3d2b1d] flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-monument uppercase tracking-wider text-[#eec170] mr-0.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
                  Articles:
                </span>
                {((gameState.roomItems[gameState.currentRoom] || []).filter((id) => id !== 'BIRD')).length > 1 && (
                  <button
                    onClick={handleTakeAllItems}
                    className="px-2.5 py-1 rounded-lg bg-[#3d2816] hover:bg-[#543820] border-2 border-[#eec170] text-[#fff8ea] text-xs font-manuscript font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:translate-y-0.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
                    <span>Take All [T]</span>
                  </button>
                )}
                {((gameState.roomItems[gameState.currentRoom] || []).filter((id) => id !== 'BIRD')).map((itemId) => (
                  <button
                    key={`desk-item-${itemId}`}
                    onClick={() => handleTakeItem(itemId)}
                    className="px-2.5 py-1 rounded-lg bg-[#221811] hover:bg-[#33241a] border border-[#5c432d] hover:border-[#dfb05d] text-[#f7f1e5] text-xs font-manuscript font-bold flex items-center gap-1 cursor-pointer transition-all active:translate-y-0.5"
                  >
                    <span>+ Take {ITEMS[itemId]?.name || itemId}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Master Cave Cartography Map */}
          <div id="section-map" className="shrink-0">
            <CaveMap state={gameState} onMove={handleMove} />
          </div>
        </section>

        {/* Right Column: Actions, Compass, Inventory, and Terminal Log */}
        <section
          id="section-controls"
          className="hidden md:flex md:col-span-7 flex-col gap-2.5 md:h-full min-h-0 md:overflow-y-auto slidebar-retro"
        >
          {/* Contextual Smart Action Buttons */}
          <div id="section-actions" className="shrink-0">
            <ActionControls
              state={gameState}
              onTakeItem={handleTakeItem}
              onTakeAllItems={handleTakeAllItems}
              onUnlockGrate={handleUnlockGrate}
              onOpenGrate={handleOpenGrate}
              onToggleLantern={handleToggleLantern}
              onCatchBirdHands={handleCatchBirdHands}
              onCatchBirdCage={handleCatchBirdCage}
              onScareSnake={handleScareSnake}
              onDrinkWater={handleDrinkWater}
              onEatFood={handleEatFood}
              onRefillWater={handleRefillWater}
              onExamineRoom={handleExamineRoom}
              onCastXyzzy={handleCastXyzzy}
              onWaveRod={handleWaveRod}
              onKillDragon={handleKillDragon}
              onBankTreasures={handleBankTreasures}
            />
          </div>

          {/* Controls Grid: Compass Widget + Inventory Locker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 shrink-0">
            <CompassWidget state={gameState} onMove={handleMove} />
            <InventoryLocker
              state={gameState}
              onToggleLantern={handleToggleLantern}
              onDrinkWater={handleDrinkWater}
              onEatFood={handleEatFood}
              onUseCage={handleCatchBirdCage}
              onUseBird={handleScareSnake}
              onUnlockGrate={handleUnlockGrate}
              onBankTreasure={handleBankTreasures}
              onWaveRod={handleWaveRod}
            />
          </div>

          {/* Narrative Terminal Log CLI Window */}
          <div id="section-terminal" className="flex-1 min-h-[260px] flex flex-col overflow-hidden">
            <TerminalLog
              logs={gameState.log}
              onCommandSubmit={handleCommandSubmit}
              onClearLogs={() => setGameState((prev) => ({ ...prev, log: [] }))}
            />
          </div>
        </section>
      </main>

      {/* MOBILE TACTICAL BOTTOM DOCK: Always 1-tap reachable under thumbs */}
      <MobileNavDock
        state={gameState}
        activeTab={mobileTab}
        onSelectTab={setMobileTab}
        onMove={handleMove}
      />

      {/* GOD MODE MODAL PANEL */}
      <GodModePanel
        state={gameState}
        isOpen={showGodMode}
        onClose={() => setShowGodMode(false)}
        onTeleport={handleGodTeleport}
        onToggleItem={handleGodToggleItem}
        onGiveAllItems={handleGodGiveAllItems}
        onClearItems={handleGodClearItems}
        onToggleLantern={handleGodToggleLantern}
        onUnlockAll={handleGodUnlockAll}
        onFrightenSnake={handleGodFrightenSnake}
        onToggleBridge={handleGodToggleBridge}
        onSlayDragon={handleGodSlayDragon}
        onRevealAllMap={handleGodRevealAllMap}
        onMaxScore={handleGodMaxScore}
        onResetGame={handleResetSession}
      />

      {/* ACHIEVEMENTS EXPEDITION TROPHY ROOM */}
      {showAchievements && (
        <AchievementsModal
          unlockedIds={gameState.achievements}
          score={gameState.score}
          turns={gameState.turns}
          startTime={gameState.startTime}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* MOBILE QUICK TOOLS DRAWER */}
      {showMobileTools && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-[#18120e] border-2 border-[#4d3725] rounded-xl max-w-sm w-full p-4 font-serif text-xs shadow-2xl flex flex-col gap-3 text-[#f7f1e5]">
            <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-2">
              <span className="font-bold text-[#f7f1e5] flex items-center gap-1.5 font-monument">
                <Menu className="w-4 h-4 text-[#eec170]" />
                EXPEDITION FOLIO MENU
              </span>
              <button
                onClick={() => setShowMobileTools(false)}
                className="p-1 rounded text-[#a89582] hover:text-[#f7f1e5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setShowMobileTools(false);
                  setShowAchievements(true);
                }}
                className="p-2.5 rounded-lg bg-[#241a12] border border-[#5c432d] text-[#eec170] font-manuscript font-bold flex items-center gap-2 hover:border-[#b3844d] cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-[#eec170]" />
                <span>MERIT ({gameState.achievements.length}/8)</span>
              </button>

              <button
                onClick={downloadStandaloneHtml}
                className="p-2.5 rounded-lg bg-[#eec170] hover:bg-[#dfb05d] text-[#1a120c] font-manuscript font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>EXPORT FOLIO</span>
              </button>

              <button
                onClick={() => {
                  setShowMobileTools(false);
                  handleResetSession();
                }}
                className="p-2.5 rounded-lg bg-[#331114] border border-[#8b2520] text-[#fca5a5] font-manuscript font-bold flex items-center gap-2 hover:bg-[#44171a] cursor-pointer col-span-2 justify-center"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RESET EXPEDITION RUN</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER / VICTORY MODAL */}
      {gameState.status !== 'PLAYING' && (
        <GameStatusModal
          status={gameState.status}
          deathReason={gameState.deathReason}
          score={gameState.score}
          turns={gameState.turns}
          onRestart={handleResetSession}
        />
      )}

      {/* LORE & HELP DIALOG */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-[#18120e] border-2 border-[#4d3725] rounded-xl max-w-lg w-full p-6 font-serif text-xs sm:text-sm text-[#f7f1e5] shadow-2xl">
            <h2 className="text-base font-bold font-monument text-[#eec170] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#eec170]" />
              COLOSSAL CAVE EXPEDITION GUIDE
            </h2>
            <div className="space-y-2.5 text-[#ede2d1] font-manuscript text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2 slidebar-retro">
              <p>
                In 1976, Will Crowther, an avid caver and ARPANET programmer, created
                the world’s first text adventure game based on Kentucky’s real Mammoth
                Cave system. In 1977, Don Woods expanded it into a grand fantasy
                adventure.
              </p>
              <p className="text-[#eec170] font-bold font-monument text-xs uppercase tracking-wider">Survival & Cavern Tactics:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#ede2d1]">
                <li>
                  <b>Ergonomic Touch Controls:</b> On mobile, use the sticky bottom D-Pad to move in 1-tap.
                </li>
                <li>
                  <b>The Brass Lantern:</b> Caves are pitch black! You MUST kindle your brass
                  lantern before stepping into the Hall of Mists, or you will fall and break your neck!
                </li>
                <li>
                  <b>Bottomless Fissure:</b> Find the black star rod and wave it at the fissure to span a shimmering crystal bridge!
                </li>
                <li>
                  <b>Volcanic Dragon:</b> Confront the green beast in its canyon lair and slay it with your bare hands to seize the golden dragon egg!
                </li>
                <li>
                  <b>Depository Vault:</b> Bring treasures back to the Well-House to bank them in the safe vault for maximum Spelunker score!
                </li>
                <li>
                  <b>Magic Words:</b> The word <code>XYZZY</code> teleports between the Well-House and the Hall of Mists.
                </li>
                <li>
                  <b>Fierce Serpent:</b> Use the wicker cage to catch the songbird, then release it to scare the snake!
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-5 w-full py-2.5 rounded-lg bg-[#eec170] hover:bg-[#dfb05d] font-bold text-[#1a120c] font-manuscript uppercase tracking-wider transition-all cursor-pointer shadow-md active:translate-y-0.5"
            >
              Close & Resume Expedition
            </button>
          </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#1e1610] border-2 border-[#8b352e] rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4 font-serif text-[#f7f1e5]">
            <div className="flex items-center gap-3 border-b border-[#4d2822] pb-3">
              <div className="p-2.5 rounded-full bg-[#3d1815] text-[#fca5a5] border border-[#8b352e]">
                <RotateCcw className="w-5 h-5 text-[#fca5a5]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-monument text-[#f7f1e5]">
                  Restart Expedition?
                </h2>
                <p className="text-xs text-[#c4ad94] font-manuscript">
                  Return to the start of the adventure at the Road End
                </p>
              </div>
            </div>

            <p className="text-sm font-manuscript text-[#ede2d1] leading-relaxed">
              This will reset your turns (currently {gameState.turns}), score ({gameState.score} pts), empty your backpack, and place you back at the <b>End of the Road</b> before the brick building.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-[#2b1f15] hover:bg-[#3d2c1d] border border-[#5c432d] text-[#c4ad94] hover:text-[#f7f1e5] font-manuscript font-bold text-xs cursor-pointer transition-all"
              >
                Cancel (Keep Playing)
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  handleResetSession();
                }}
                className="px-4 py-2 rounded-lg bg-[#8b2e27] hover:bg-[#a6362e] border border-[#cc443b] text-[#ffffff] font-manuscript font-bold text-xs shadow-md cursor-pointer transition-all active:translate-y-0.5 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm Restart [R]</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRO-GAMER KEYBOARD CONTROLS MODAL */}
      {showControlsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#1e1610] border-2 border-[#5c432d] rounded-2xl max-w-lg w-full p-5 shadow-2xl flex flex-col gap-4 font-serif text-[#f7f1e5]">
            <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-3">
              <div className="flex items-center gap-2.5">
                <Gamepad2 className="w-5 h-5 text-[#eec170]" />
                <h2 className="text-base sm:text-lg font-bold font-monument text-[#f7f1e5]">
                  Pro Gamer Controls & Shortcuts
                </h2>
              </div>
              <button
                onClick={() => setShowControlsModal(false)}
                className="p-1 rounded bg-[#2b1f15] hover:bg-[#3d2c1d] text-[#c4ad94] hover:text-[#f7f1e5] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-manuscript">
              <div className="bg-[#16100b] p-3 rounded-xl border border-[#3d2b1d] flex flex-col gap-2">
                <span className="font-bold text-[#eec170] font-monument text-[11px]">🧭 MOVEMENT</span>
                <div className="flex items-center justify-between"><span className="text-[#c4ad94]">North / South:</span><span className="font-mono bg-[#2b1f14] px-1.5 py-0.5 rounded text-[#f7f1e5] border border-[#5c432d]">W / S or ↑ / ↓</span></div>
                <div className="flex items-center justify-between"><span className="text-[#c4ad94]">West / East:</span><span className="font-mono bg-[#2b1f14] px-1.5 py-0.5 rounded text-[#f7f1e5] border border-[#5c432d]">A / D or ← / →</span></div>
                <div className="flex items-center justify-between"><span className="text-[#c4ad94]">Climb Up / Down:</span><span className="font-mono bg-[#2b1f14] px-1.5 py-0.5 rounded text-[#f7f1e5] border border-[#5c432d]">U / J</span></div>
                <div className="flex items-center justify-between"><span className="text-[#c4ad94]">NW / NE Diagonals:</span><span className="font-mono bg-[#2b1f14] px-1.5 py-0.5 rounded text-[#f7f1e5] border border-[#5c432d]">Q / E</span></div>
                <div className="flex items-center justify-between"><span className="text-[#c4ad94]">SW / SE Diagonals:</span><span className="font-mono bg-[#2b1f14] px-1.5 py-0.5 rounded text-[#f7f1e5] border border-[#5c432d]">Z / C</span></div>
              </div>

              <div className="bg-[#16100b] p-3 rounded-xl border border-[#3d2b1d] flex flex-col gap-2">
                <span className="font-bold text-[#eec170] font-monument text-[11px]">⚡ QUICK ACTIONS</span>
                <div className="flex items-center justify-between"><span className="text-[#c4ad94]">Primary Action:</span><span className="font-mono bg-[#2b1f14] px-1.5 py-0.5 rounded text-[#f7f1e5] border border-[#5c432d]">Space / Enter</span></div>
                <div className="flex items-center justify-between"><span className="text-[#c4ad94]">Take All Items:</span><span className="font-mono bg-[#2b1f14] px-1.5 py-0.5 rounded text-[#f7f1e5] border border-[#5c432d]">T</span></div>
                <div className="flex items-center justify-between"><span className="text-[#c4ad94]">Toggle Lantern:</span><span className="font-mono bg-[#2b1f14] px-1.5 py-0.5 rounded text-[#f7f1e5] border border-[#5c432d]">L</span></div>
                <div className="flex items-center justify-between"><span className="text-[#c4ad94]">Restart Run:</span><span className="font-mono bg-[#2b1f14] px-1.5 py-0.5 rounded text-[#f7f1e5] border border-[#5c432d]">R</span></div>
                <div className="flex items-center justify-between"><span className="text-[#c4ad94]">Controls Help:</span><span className="font-mono bg-[#2b1f14] px-1.5 py-0.5 rounded text-[#f7f1e5] border border-[#5c432d]">?</span></div>
              </div>
            </div>

            <div className="bg-[#241a12] p-3 rounded-xl border border-[#5c432d] text-xs font-manuscript text-[#c4ad94] leading-relaxed">
              💡 <b className="text-[#f7f1e5]">Pro Tip:</b> You can also click directly on any of the <b>Available Passages</b> buttons or adjacent chambers in the <b>Cartography Map</b> to move with one tap!
            </div>

            <button
              onClick={() => setShowControlsModal(false)}
              className="w-full py-2.5 rounded-lg bg-[#eec170] hover:bg-[#dfb05d] text-[#1a120c] font-manuscript font-bold text-xs cursor-pointer shadow-md transition-all active:translate-y-0.5"
            >
              Got It, Let's Play!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
