export type RoomId =
  | 'ROAD_END'
  | 'INSIDE_BUILDING'
  | 'FOREST'
  | 'VALLEY'
  | 'SLIT_IN_ROCK'
  | 'DEPRESSION'
  | 'BELOW_GRATE'
  | 'COBBLE_CRAWL'
  | 'TOP_OF_PIT'
  | 'FISSURE'
  | 'HALL_MISTS'
  | 'LOW_CRAWL'
  | 'MOUNTAIN_KING'
  | 'MAZE_1'
  | 'MAZE_2'
  | 'MAZE_3'
  | 'DRAGON_DEN'
  | 'PIRATE_LAIR'
  | 'TREASURY';

export type ItemId =
  | 'KEYS'
  | 'LANTERN'
  | 'BOTTLE'
  | 'FOOD'
  | 'CAGE'
  | 'BIRD'
  | 'GOLD'
  | 'ROD'
  | 'VASE'
  | 'DIAMOND'
  | 'PIRATE_CHEST'
  | 'RUG'
  | 'DRAGON_EGG'
  | 'DWARF_AXE';

export type Direction = 'N' | 'S' | 'E' | 'W' | 'UP' | 'DOWN';

export interface ItemDef {
  id: ItemId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  value: number;
  isTreasure?: boolean;
}

export interface RoomExit {
  direction: Direction;
  targetRoom: RoomId | 'FOREST_RANDOM';
  label: string;
  condition?: (state: GameState) => { allowed: boolean; reason?: string };
}

export interface LogEntry {
  id: string;
  text: string;
  type: 'narration' | 'action' | 'warning' | 'success' | 'danger' | 'system' | 'lore';
  turn: number;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface GameState {
  currentRoom: RoomId;
  inventory: ItemId[];
  roomItems: Record<RoomId, ItemId[]>;
  lanternLit: boolean;
  grateUnlocked: boolean;
  grateOpen: boolean;
  birdInCage: boolean;
  snakeFrightened: boolean;
  waterBottleFilled: boolean;
  crystalBridgeActive: boolean;
  dragonSlain: boolean;
  pirateLooted: boolean;
  dwarfEncountered: boolean;
  dwarfAxeThrown: boolean;
  bankedTreasures: ItemId[];
  voiceEnabled: boolean;
  speedrunMode: boolean;
  startTime: number;
  achievements: string[];
  turns: number;
  score: number;
  status: 'PLAYING' | 'GAME_OVER' | 'VICTORY';
  deathReason: string | null;
  log: LogEntry[];
  visitedRooms: RoomId[];
  soundEnabled: boolean;
  viewMode: 'vector' | 'ascii';
  scanlines: boolean;
}
