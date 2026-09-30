import React from 'react';
import { GameState } from '../types/game';

interface AsciiArtProps {
  state: GameState;
}

export const AsciiArt: React.FC<AsciiArtProps> = ({ state }) => {
  const { currentRoom, lanternLit, grateUnlocked, grateOpen, snakeFrightened } = state;

  const getAscii = () => {
    switch (currentRoom) {
      case 'ROAD_END':
        return `
                     /\\                  /\\
                    /  \\    ___________ /  \\
                   / /\\ \\  /          /\\/ /\\ \\
                  / /  \\ \\/__________/  \\/  \\ \\
                 /_/____\\_\\ |  __  | |  /____\\_\\
                   | || |   | |  | | |   | || |
     ~~~~~~~~~~~~~~| || |___| | .| |_|~~~| || |~~~~~ (STREAM SOUTH)
    ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
        [ WELLHOUSE (EAST) ]       [ ROAD & FOREST ]
`;
      case 'INSIDE_BUILDING':
        return `
    +-----------------------------------------------+
    |  [WINDOW]                   [SPRING WELL]     |
    |  | # # |                    (~~~~~~)          |
    |  | # # |                     \\____/           |
    |                                               |
    |      +=============================+          |
    |      | [LANTERN] [KEYS] [BOTTLE]   |          |
    |      |   (O)      o-o    [~~]      |          |
    |      +----+-------------------+----+          |
    |           | [TASTY FOOD]      |               |
    | <-- EXIT TO ROAD (WEST)      [XYZZY MAGIC]    |
    +-----------------------------------------------+
`;
      case 'FOREST':
        return `
            /\\       /\\            /\\       /\\
           /  \\     /  \\          /  \\     /  \\
          / /\\ \\   / /\\ \\        / /\\ \\   / /\\ \\
         /_/____\\_/_/____\\_    _/_/____\\_/_/____\\_
           | || |   | || |       | || |   | || |
       =============================================
         CONFUSING DEEP WOODS · TREES LOOK IDENTICAL
       =============================================
`;
      case 'VALLEY':
        return `
        \\                                     /
         \\     WOODED VALLEY / CREEK BED     /
          \\_________________________________/
             |                           |
             | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ | (STREAM)
             | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ |
         [UP: ROAD END]          [DOWN: ROCK SLIT]
`;
      case 'SLIT_IN_ROCK':
        return `
       ___________________________________________
      /         MASSIVE LIMESTONE SHELF           \\
     |                                             |
     |   ~~~~~~>   |  SLIT IN ROCK  |              |
     |   STREAM    |     ||||||     |              |
     |  PLUNGES    |     v v  v     |              |
     \\____________/                 \\_____________/
         [UP: VALLEY]          [DOWN: DEPRESSION]
`;
      case 'DEPRESSION':
        return `
    |\\                                             /|
    | \\          20-FOOT DEPRESSION               / |
    |  \\_________________________________________/  |
    |                      |                        |
    |            +===================+              |
    |            | ${!grateUnlocked ? '🔒 LOCKED  ' : grateOpen ? '🟢 OPEN    ' : '🔓 UNLOCKED'}      |              |
    |            | [#][#][#][#][#]   |              |
    |            | [#][#][#][#][#]   |              |
    |            +===================+              |
    |               ↓ (DOWN: BELOW GRATE)           |
`;
      case 'BELOW_GRATE':
        return `
    +===============================================+
    |           [### IRON GRATE ###]                |
    |                 ||||||||                      |
    |          \\  DAYLIGHT BEAMS  /                 |
    |           \\   FROM ABOVE   /                  |
    |            \\              /                   |
    |             \\____________/                    |
    |   <-- WEST: COBBLE CRAWL      UP: DEPRESSION  |
    +===============================================+
`;
      case 'COBBLE_CRAWL':
        return `
    =================================================
    \\\\\\  LOW DAMP CEILING - HANDS AND KNEES      ///
     \\\\\\                                        ///
      ===========================================
      <-- WEST (TOP OF PIT)         EAST (GRATE) -->
      
                     [WICKER CAGE]
                         /\\
                        /  \\
                       | [] |
      ...............................................
      ooo ooo ooo ooo [RIVER COBBLES] ooo ooo ooo ooo
`;
      case 'TOP_OF_PIT':
        return `
    _________________________________________________
    \\     PRECIPICE EDGE OVER SUBTERRANEAN PIT      /
     \\    ( MIST BREATHING FROM THE ABYSS )        /
      \\___________________________________________/
           |                                 |
           |   ROUGH STONE STEPS DESCEND     |
           |         _                       |
           |       _|                        |
           |     _|                          |
           |   _|    ===> DOWN: HALL OF MISTS|
`;
      case 'HALL_MISTS':
        if (!lanternLit) {
          return `
    *************************************************
    *                                               *
    *      PITCH DARKNESS !! CANNOT SEE !!          *
    *                                               *
    *            ( o )     ( o )                    *
    *                                               *
    *   WARNING: MOVING IN THE DARK IS FATAL!       *
    *                                               *
    *************************************************
`;
        }
        return `
    /\\  /\\  /\\  /\\  /\\  /\\  /\\  /\\  /\\  /\\  /\\  /\\  /\\
   /  \\/  \\/  \\/  \\/  \\/  \\/  \\/  \\/  \\/  \\/  \\/  \\/  \\
   ( MIST )     ( MIST )       ( MIST )       ( MIST )
   
    [STAIRS UP]                           [GOLD NUGGET]
       _                                       ***
     _|                                       *****
   _|      =============================       ***
          |                             |
          |       BOTTOMLESS PIT        |
          |         (LETHAL)            |
`;
      case 'LOW_CRAWL':
        return `
       .-------------------------------------------.
      /   ACOUSTIC GROTTO - DROPS CHIME LIKE HARPS  \\
     /                                               \\
    |           ♪ ♫ ♪                                 |
    |                  ( \\                            |
    |                 <(' )>  <-- GREEN BIRD!         |
    |                  (   )                          |
    |                   "-"                           |
    |             [MOSSY BOULDER]                     |
    |                                                 |
     \\  <-- WEST (HALL OF MISTS)                      /
      '---------------------------------------------'
`;
      case 'MOUNTAIN_KING':
        if (!snakeFrightened) {
          return `
    =================================================
    ||       HALL OF THE MOUNTAIN KING             ||
    ||                                             ||
    ||           /\\               /\\               ||
    ||          /  \\  S N A K E  /  \\              ||
    ||         ( o  o )         ( o  o )           ||
    ||          \\ = /            \\ = /             ||
    ||        ===~V~===============~V~===          ||
    ||       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~         ||
    ||   [!!! FIERCE GREEN VIPER BLOCKS ALL EXITS !] ||
    =================================================
`;
        }
        return `
    =================================================
    ||   HALL OF THE MOUNTAIN KING [CLEARED]       ||
    ||                                             ||
    ||        ~ ~ ~ (SNAKE FLED IN TERROR) ~ ~ ~   ||
    ||                                             ||
    ||         +-----------------------+           ||
    ||         |  VAULT OF THE KING   |           ||
    ||         |     ====> WEST        |           ||
    ||         +-----------------------+           ||
    ||                                             ||
    =================================================
`;
      case 'TREASURY':
        return `
    *************************************************
    *      ★ ★ ★  THE INNER TREASURY  ★ ★ ★         *
    *************************************************
    *   [GOLD]       [GEMS]       [ANCIENT RELICS]  *
    *    $$$          <*>              [===]        *
    *   $$$$$        <***>             [___]        *
    *                                               *
    *    VICTORY ACHIEVED! ADVENTURER GRANDMASTER   *
    *************************************************
`;
      default:
        return '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4 font-mono text-emerald-400 select-none overflow-hidden">
      <div className="w-full text-xs text-emerald-600 mb-2 border-b border-emerald-900/50 pb-1 flex justify-between">
        <span>VINTAGE 1976 ASCII TERMINAL VIEW</span>
        <span>VT100 80x24</span>
      </div>
      <pre className="text-xs sm:text-sm leading-tight text-emerald-400 whitespace-pre overflow-x-auto text-center font-mono">
        {getAscii()}
      </pre>
    </div>
  );
};
