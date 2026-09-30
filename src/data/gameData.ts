import { ItemDef, ItemId, RoomId, RoomExit, Achievement } from '../types/game';

export const ITEMS: Record<ItemId, ItemDef> = {
  KEYS: {
    id: 'KEYS',
    name: 'Set of Keys',
    shortName: 'Set of Keys',
    description: 'A heavy brass keyring holding three antique skeleton keys.',
    icon: 'Key',
    value: 10,
  },
  LANTERN: {
    id: 'LANTERN',
    name: 'Brass Lantern',
    shortName: 'Brass Lantern',
    description: 'A polished brass miner’s lantern with a sturdy bail handle and glass chimney.',
    icon: 'Flame',
    value: 10,
  },
  BOTTLE: {
    id: 'BOTTLE',
    name: 'Water Bottle',
    shortName: 'Water Bottle',
    description: 'A clear glass bottle filled with cold, refreshing spring water.',
    icon: 'Droplet',
    value: 10,
  },
  FOOD: {
    id: 'FOOD',
    name: 'Tasty Food',
    shortName: 'Tasty Food',
    description: 'A wrapped parcel of delicious traveler’s rations (jerked beef and dried fruit).',
    icon: 'Utensils',
    value: 10,
  },
  CAGE: {
    id: 'CAGE',
    name: 'Wicker Cage',
    shortName: 'Wicker Cage',
    description: 'A small hand-woven wicker birdcage with a spring latch door.',
    icon: 'Box',
    value: 10,
  },
  BIRD: {
    id: 'BIRD',
    name: 'Little Green Bird',
    shortName: 'Caged Bird',
    description: 'A cheerful little green songbird inside the wicker cage. It chirps fiercely at serpents!',
    icon: 'Feather',
    value: 20,
  },
  GOLD: {
    id: 'GOLD',
    name: 'Large Gold Nugget',
    shortName: 'Gold Nugget',
    description: 'A sparkling, heavy lump of solid subterranean gold. High ancient treasure value!',
    icon: 'Sparkles',
    value: 30,
    isTreasure: true,
  },
  ROD: {
    id: 'ROD',
    name: 'Black Rod',
    shortName: 'Black Rod',
    description: 'A 3-foot black rod with a rusty star on one end. Vibrates intensely near bottomless fissures.',
    icon: 'Wand',
    value: 20,
  },
  VASE: {
    id: 'VASE',
    name: 'Ming Dynasty Vase',
    shortName: 'Ming Vase',
    description: 'A delicate, priceless antique porcelain vase. Extremely fragile: handle with extreme care!',
    icon: 'Sparkles',
    value: 40,
    isTreasure: true,
  },
  DIAMOND: {
    id: 'DIAMOND',
    name: 'Flawless Diamonds',
    shortName: 'Diamonds',
    description: 'A velvet pouch filled with uncut subterranean diamonds of extraordinary brilliance.',
    icon: 'Sparkles',
    value: 35,
    isTreasure: true,
  },
  PIRATE_CHEST: {
    id: 'PIRATE_CHEST',
    name: 'Treasure Chest',
    shortName: 'Pirate Chest',
    description: 'A brass-bound ironwood pirate chest overflowing with silver doubloons and gemstones.',
    icon: 'Box',
    value: 35,
    isTreasure: true,
  },
  RUG: {
    id: 'RUG',
    name: 'Jeweled Persian Rug',
    shortName: 'Persian Rug',
    description: 'An ancient, silk-woven royal rug embroidered with emeralds and solid gold thread.',
    icon: 'Sparkles',
    value: 40,
    isTreasure: true,
  },
  DRAGON_EGG: {
    id: 'DRAGON_EGG',
    name: 'Golden Dragon Egg',
    shortName: 'Dragon Egg',
    description: 'A warm, gleaming egg of solid dragon gold. The ultimate crowning treasure of the cavern.',
    icon: 'Sparkles',
    value: 50,
    isTreasure: true,
  },
  DWARF_AXE: {
    id: 'DWARF_AXE',
    name: 'Dwarf’s Iron Axe',
    shortName: 'Iron Axe',
    description: 'A balanced dwarven bearded throwing axe. Embedded into the stone wall.',
    icon: 'Axe',
    value: 20,
  },
};

export interface RoomDef {
  id: RoomId;
  title: string;
  subtitle: string;
  initialDescription: string;
  shortDescription: string;
  exits: RoomExit[];
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_STEPS',
    title: 'Subterranean Entrance',
    description: 'Unlocked and opened the iron grate into Colossal Cave.',
    icon: 'Key',
  },
  {
    id: 'CRYSTAL_ARCHITECT',
    title: 'Crystal Architect',
    description: 'Waved the black star rod to span the bottomless fissure with a shimmering crystal bridge.',
    icon: 'Sparkles',
  },
  {
    id: 'SNAKE_CHARMER',
    title: 'Snake Charmer',
    description: 'Frightened the fierce serpent in the Hall of the Mountain King using the caged songbird.',
    icon: 'Feather',
  },
  {
    id: 'DRAGON_SLAYER',
    title: 'Bare-Handed Slayer',
    description: 'Confronted the slumbering green beast and conquered it with your bare hands.',
    icon: 'Flame',
  },
  {
    id: 'MAZE_NAVIGATOR',
    title: 'Labyrinth Cartographer',
    description: 'Navigated the Maze of Twisty Little Passages to uncover the Pirate’s hidden cache.',
    icon: 'Compass',
  },
  {
    id: 'VELVET_HANDS',
    title: 'Velvet Hands',
    description: 'Recovered the fragile Ming Vase and banked it safely at the surface.',
    icon: 'Shield',
  },
  {
    id: 'MAGIC_WORDSMITH',
    title: 'Magic Wordsmith',
    description: 'Invoked the ancient incantations XYZZY or PLUGH.',
    icon: 'Wand2',
  },
  {
    id: 'GRANDMASTER',
    title: 'Grandmaster Explorer',
    description: 'Achieved the maximum 350/350 explorer score and banked all treasures at the Well-House.',
    icon: 'Trophy',
  },
];

export const getExplorerRank = (score: number): { rank: string; color: string } => {
  if (score >= 350) return { rank: 'Grandmaster Cave Legend (Rank 5)', color: 'text-amber-300' };
  if (score >= 260) return { rank: 'Master Explorer (Rank 4)', color: 'text-purple-300' };
  if (score >= 170) return { rank: 'Subterranean Adventurer (Rank 3)', color: 'text-sky-300' };
  if (score >= 90) return { rank: 'Junior Spelunker (Rank 2)', color: 'text-emerald-300' };
  return { rank: 'Novice Cave Wanderer (Rank 1)', color: 'text-slate-400' };
};

export const ROOMS: Record<RoomId, RoomDef> = {
  ROAD_END: {
    id: 'ROAD_END',
    title: 'End of the Road',
    subtitle: 'Surface Woods · Outside Brick Building',
    initialDescription:
      'You are standing at the end of a road before a small brick building. Around you is a forest. A small stream flows out of the building and down a gully.',
    shortDescription: 'You are at the end of the road before the brick building. A stream flows into a gully.',
    exits: [
      {
        direction: 'E',
        targetRoom: 'INSIDE_BUILDING',
        label: 'Enter Well-House (East)',
      },
      {
        direction: 'DOWN',
        targetRoom: 'SLIT_IN_ROCK',
        label: 'Down Gully / Stream (Down)',
      },
      {
        direction: 'S',
        targetRoom: 'SLIT_IN_ROCK',
        label: 'Follow Stream South (South)',
      },
      {
        direction: 'W',
        targetRoom: 'FOREST',
        label: 'Enter Dense Forest (West)',
      },
      {
        direction: 'N',
        targetRoom: 'FOREST',
        label: 'Enter Dense Forest (North)',
      },
    ],
  },

  INSIDE_BUILDING: {
    id: 'INSIDE_BUILDING',
    title: 'Inside Brick Building',
    subtitle: 'The Well-House · Fresh Spring Shelter & Treasure Vault',
    initialDescription:
      'You are inside a sturdy brick well-house. A cool spring pools in a basin. Storing treasures here permanently banks your points into the surface vault!',
    shortDescription: 'You are inside the brick well-house by the fresh spring basin. Vault safety depository.',
    exits: [
      {
        direction: 'W',
        targetRoom: 'ROAD_END',
        label: 'Leave Building (West)',
      },
    ],
  },

  FOREST: {
    id: 'FOREST',
    title: 'Deep Forest',
    subtitle: 'Trackless Woods · Tangled Canopy',
    initialDescription:
      'You are in open forest, with a deep valley to one side. The trees are dense and the paths are confusing.',
    shortDescription: 'You are in the deep forest. The trees murmur softly in the mountain wind.',
    exits: [
      {
        direction: 'E',
        targetRoom: 'ROAD_END',
        label: 'Emerge onto Road (East)',
      },
      {
        direction: 'N',
        targetRoom: 'FOREST',
        label: 'Wander Forest (North)',
      },
      {
        direction: 'S',
        targetRoom: 'FOREST',
        label: 'Wander Forest (South)',
      },
      {
        direction: 'W',
        targetRoom: 'FOREST',
        label: 'Wander Forest (West)',
      },
      {
        direction: 'DOWN',
        targetRoom: 'VALLEY',
        label: 'Climb Down into Valley Gully',
      },
    ],
  },

  VALLEY: {
    id: 'VALLEY',
    title: 'Valley by Stream',
    subtitle: 'Steep Gully · Stream Bed',
    initialDescription:
      'You are in a valley in the forest beside a stream tumbling along over rocks. The stream flows down toward a rock slit.',
    shortDescription: 'You are in the valley beside the stream.',
    exits: [
      {
        direction: 'UP',
        targetRoom: 'FOREST',
        label: 'Climb Bank into Forest (Up)',
      },
      {
        direction: 'N',
        targetRoom: 'ROAD_END',
        label: 'Follow Stream North toward Road',
      },
      {
        direction: 'S',
        targetRoom: 'SLIT_IN_ROCK',
        label: 'Follow Stream South to Rock Slit',
      },
      {
        direction: 'DOWN',
        targetRoom: 'SLIT_IN_ROCK',
        label: 'Descend to Rock Slit (Down)',
      },
    ],
  },

  SLIT_IN_ROCK: {
    id: 'SLIT_IN_ROCK',
    title: 'At Slit in Streambed',
    subtitle: 'Streambed Infiltration · The Rock Aperture',
    initialDescription:
      'At your feet, the stream plunges through a 2-inch slit in the rock. 20 feet away is a 20-foot depression in the ground.',
    shortDescription: 'You are at the slit in the streambed. A depression lies nearby.',
    exits: [
      {
        direction: 'UP',
        targetRoom: 'VALLEY',
        label: 'Ascend Stream toward Valley (Up)',
      },
      {
        direction: 'N',
        targetRoom: 'ROAD_END',
        label: 'Return North toward Road',
      },
      {
        direction: 'DOWN',
        targetRoom: 'DEPRESSION',
        label: 'Step Down into Depression (Down)',
      },
      {
        direction: 'E',
        targetRoom: 'DEPRESSION',
        label: 'Walk East into Depression',
      },
    ],
  },

  DEPRESSION: {
    id: 'DEPRESSION',
    title: 'Outside Grate in Depression',
    subtitle: 'Limestone Sinkhole · The Iron Threshold',
    initialDescription:
      'You are in a 20-foot depression whose sides are steep rock. Before you is a heavy, locked iron grate set flush into the floor of the depression.',
    shortDescription: 'You are in the 20-foot depression before the iron grate.',
    exits: [
      {
        direction: 'UP',
        targetRoom: 'SLIT_IN_ROCK',
        label: 'Scramble Up out of Depression (Up)',
      },
      {
        direction: 'W',
        targetRoom: 'SLIT_IN_ROCK',
        label: 'Climb West to Rock Slit',
      },
      {
        direction: 'DOWN',
        targetRoom: 'BELOW_GRATE',
        label: 'Descend through Grate into Darkness (Down)',
        condition: (state) => {
          if (!state.grateUnlocked || !state.grateOpen) {
            return {
              allowed: false,
              reason: 'The iron grate is securely locked and shut. You must unlock and open it.',
            };
          }
          return { allowed: true };
        },
      },
    ],
  },

  BELOW_GRATE: {
    id: 'BELOW_GRATE',
    title: 'Below the Iron Grate',
    subtitle: 'Subterranean Chamber · The Entrance Shaft',
    initialDescription:
      'You are in a small subterranean chamber beneath the 20-foot grate. A steel ladder leads up to the surface. A low crawlway heads West into the deep earth.',
    shortDescription: 'You are beneath the grate. Ladder leads UP; crawlway leads WEST.',
    exits: [
      {
        direction: 'UP',
        targetRoom: 'DEPRESSION',
        label: 'Climb Steel Ladder to Surface (Up)',
      },
      {
        direction: 'W',
        targetRoom: 'COBBLE_CRAWL',
        label: 'Crawl West into the Cobble Passage',
      },
    ],
  },

  COBBLE_CRAWL: {
    id: 'COBBLE_CRAWL',
    title: 'Cobble Crawlway',
    subtitle: 'Low Limestone Tunnel · Subterranean Corridor',
    initialDescription:
      'You are crawling on your knees through a low tunnel whose floor is paved with smooth round cobbles. An iron axe is embedded in the stone wall!',
    shortDescription: 'You are in the cobble crawlway. Passages run West and East.',
    exits: [
      {
        direction: 'E',
        targetRoom: 'BELOW_GRATE',
        label: 'Crawl East to Below Grate',
      },
      {
        direction: 'W',
        targetRoom: 'TOP_OF_PIT',
        label: 'Crawl West to Top of Small Pit',
      },
    ],
  },

  TOP_OF_PIT: {
    id: 'TOP_OF_PIT',
    title: 'At Top of Small Pit',
    subtitle: 'Cavern Verge · Overlook of the Depths',
    initialDescription:
      'You are at the top of a steep pit. A misty breeze rises from the abyss below. To the East yawns a bottomless fissure.',
    shortDescription: 'You are at the top of the pit. Rough steps lead down into the mists; East leads to the fissure.',
    exits: [
      {
        direction: 'E',
        targetRoom: 'FISSURE',
        label: 'Approach the Bottomless Fissure (East)',
      },
      {
        direction: 'UP',
        targetRoom: 'COBBLE_CRAWL',
        label: 'Ascend to Cobble Crawl (Up)',
      },
      {
        direction: 'DOWN',
        targetRoom: 'HALL_MISTS',
        label: 'Descend Rough Steps into Hall of Mists (Down)',
      },
    ],
  },

  FISSURE: {
    id: 'FISSURE',
    title: 'At Edge of Bottomless Fissure',
    subtitle: 'Chasm Abyss · The Crystal Bridge Gateway',
    initialDescription:
      'You stand at the brink of a vast, bottomless fissure. A cold subterranean gale roars up from the void. There is no natural path across!',
    shortDescription: 'You stand at the edge of the fissure.',
    exits: [
      {
        direction: 'W',
        targetRoom: 'TOP_OF_PIT',
        label: 'Retreat West to Top of Pit',
      },
      {
        direction: 'E',
        targetRoom: 'DRAGON_DEN',
        label: 'Cross Shimmering Crystal Bridge (East)',
        condition: (state) => {
          if (!state.crystalBridgeActive) {
            return {
              allowed: false,
              reason: 'A bottomless abyss blocks your path! Perhaps an ancient artifact can bridge the void.',
            };
          }
          return { allowed: true };
        },
      },
    ],
  },

  DRAGON_DEN: {
    id: 'DRAGON_DEN',
    title: 'Secret Canyon & Dragon’s Lair',
    subtitle: 'Volcanic Rift · The Golden Roost',
    initialDescription:
      'A ferocious emerald-scaled green dragon lies curled upon a fabulous Persian rug, guarding a massive golden egg! Smoke curls lazily from its nostrils.',
    shortDescription: 'You are in the Dragon’s Lair canyon.',
    exits: [
      {
        direction: 'W',
        targetRoom: 'FISSURE',
        label: 'Cross Crystal Bridge West to Fissure',
      },
      {
        direction: 'N',
        targetRoom: 'MAZE_1',
        label: 'Enter Twisty Passages (North)',
      },
    ],
  },

  MAZE_1: {
    id: 'MAZE_1',
    title: 'Maze of Twisty Passages',
    subtitle: 'Labyrinthine Catacombs · Passages All Different',
    initialDescription:
      'You are in a maze of twisty little passages, all different. The rock walls bend and twist in disorienting loops. Dropping items can help mark your path.',
    shortDescription: 'You are in a maze of twisty little passages, all different.',
    exits: [
      {
        direction: 'S',
        targetRoom: 'DRAGON_DEN',
        label: 'South to Dragon Canyon',
      },
      {
        direction: 'E',
        targetRoom: 'MAZE_2',
        label: 'East into Twisting Corridor',
      },
      {
        direction: 'N',
        targetRoom: 'MAZE_3',
        label: 'North into Narrow Crevice',
      },
      {
        direction: 'W',
        targetRoom: 'MAZE_1',
        label: 'West (Loops into Maze)',
      },
    ],
  },

  MAZE_2: {
    id: 'MAZE_2',
    title: 'Maze of Twisting Passages',
    subtitle: 'Confounding Catacombs · Passages All Alike',
    initialDescription:
      'You are in a little maze of twisting passages, all alike. Cold stone arches lead in every direction with identical mossy carvings.',
    shortDescription: 'You are in a little maze of twisting passages, all alike.',
    exits: [
      {
        direction: 'W',
        targetRoom: 'MAZE_1',
        label: 'West to Different Passages',
      },
      {
        direction: 'E',
        targetRoom: 'PIRATE_LAIR',
        label: 'East toward Secluded Alcove',
      },
      {
        direction: 'S',
        targetRoom: 'MAZE_2',
        label: 'South (Loops back)',
      },
      {
        direction: 'N',
        targetRoom: 'MAZE_3',
        label: 'North into Dank Crawl',
      },
    ],
  },

  MAZE_3: {
    id: 'MAZE_3',
    title: 'Maze of Twisty Passages',
    subtitle: 'Echoing Junction · Passages All Different',
    initialDescription:
      'You are in a maze of twisty little passages, all different. A distant salty sea breeze whispers through a hidden fissure to the East.',
    shortDescription: 'You are in a maze of twisty little passages, all different.',
    exits: [
      {
        direction: 'S',
        targetRoom: 'MAZE_1',
        label: 'South to Entrance Labyrinth',
      },
      {
        direction: 'E',
        targetRoom: 'PIRATE_LAIR',
        label: 'East toward Hidden Dead End',
      },
      {
        direction: 'W',
        targetRoom: 'MAZE_2',
        label: 'West into Identical Passages',
      },
      {
        direction: 'N',
        targetRoom: 'MAZE_3',
        label: 'North (Loops in place)',
      },
    ],
  },

  PIRATE_LAIR: {
    id: 'PIRATE_LAIR',
    title: 'Pirate’s Dead-End Cache',
    subtitle: 'Hidden Subterranean Grotto · The Pirate’s Booty',
    initialDescription:
      'You stand in a hidden dead-end cave! A weathered skull-and-crossbones chest sits upon a stone dais surrounded by glittering diamonds and a fragile Ming vase!',
    shortDescription: 'You are in the Pirate’s secret dead-end cache.',
    exits: [
      {
        direction: 'W',
        targetRoom: 'MAZE_2',
        label: 'Retreat West into Maze',
      },
    ],
  },

  HALL_MISTS: {
    id: 'HALL_MISTS',
    title: 'Hall of Mists',
    subtitle: 'Vast Cavern · Subterranean Lake Overlook',
    initialDescription:
      'You are in the awe-inspiring Hall of Mists! Huge stalactites hang hundreds of feet above. A vast subterranean lake shimmers in the gloom.',
    shortDescription: 'You are in the Hall of Mists. High vaulted ceiling and damp cold mist.',
    exits: [
      {
        direction: 'UP',
        targetRoom: 'TOP_OF_PIT',
        label: 'Climb Rough Steps to Top of Pit',
      },
      {
        direction: 'E',
        targetRoom: 'LOW_CRAWL',
        label: 'Creep East into Low Crawl (Bird Sanctuary)',
      },
      {
        direction: 'W',
        targetRoom: 'MOUNTAIN_KING',
        label: 'Advance West to Mountain King',
      },
    ],
  },

  LOW_CRAWL: {
    id: 'LOW_CRAWL',
    title: 'Low Crawl (Bird Sanctuary)',
    subtitle: 'Green-Tinged Grotto · Acoustic Chamber',
    initialDescription:
      'You are in a low, green-tinged stone chamber. A small, beautiful green bird hops around, singing a cheerful song.',
    shortDescription: 'You are in the bird sanctuary grotto. A passage leads West to the Hall of Mists.',
    exits: [
      {
        direction: 'W',
        targetRoom: 'HALL_MISTS',
        label: 'Passage West to Hall of Mists',
      },
    ],
  },

  MOUNTAIN_KING: {
    id: 'MOUNTAIN_KING',
    title: 'Hall of the Mountain King',
    subtitle: 'Grand Boss Cavern · The Serpent’s Lair',
    initialDescription:
      'You stand in the grand Hall of the Mountain King! Tunnels branch off in all directions.',
    shortDescription: 'You stand in the grand Hall of the Mountain King.',
    exits: [
      {
        direction: 'E',
        targetRoom: 'HALL_MISTS',
        label: 'Retreat East to Hall of Mists',
        condition: (state) => {
          if (!state.snakeFrightened) {
            return {
              allowed: false,
              reason: 'The snake strikes! You cannot pass.',
            };
          }
          return { allowed: true };
        },
      },
      {
        direction: 'W',
        targetRoom: 'TREASURY',
        label: 'Advance West into Treasury',
        condition: (state) => {
          if (!state.snakeFrightened) {
            return {
              allowed: false,
              reason: 'The snake strikes! You cannot pass.',
            };
          }
          return { allowed: true };
        },
      },
      {
        direction: 'N',
        targetRoom: 'TREASURY',
        label: 'North Archway to Vault',
        condition: (state) => {
          if (!state.snakeFrightened) {
            return {
              allowed: false,
              reason: 'The snake strikes! You cannot pass.',
            };
          }
          return { allowed: true };
        },
      },
      {
        direction: 'S',
        targetRoom: 'TREASURY',
        label: 'South Archway into Sanctuary',
        condition: (state) => {
          if (!state.snakeFrightened) {
            return {
              allowed: false,
              reason: 'The snake strikes! You cannot pass.',
            };
          }
          return { allowed: true };
        },
      },
    ],
  },

  TREASURY: {
    id: 'TREASURY',
    title: 'The Inner Treasury',
    subtitle: 'Sacred Vault of Colossal Cave · Victory Chamber',
    initialDescription:
      'Spectacular heaps of ancient gold doubloons, diamond crystals, and jeweled chalices sparkle under celestial subterranean light! You have conquered the cave and claimed the royal treasure of the Mountain King!',
    shortDescription: 'You stand triumphant in the Inner Treasury of the Mountain King.',
    exits: [
      {
        direction: 'E',
        targetRoom: 'MOUNTAIN_KING',
        label: 'Return East to Great Hall',
      },
    ],
  },
};
