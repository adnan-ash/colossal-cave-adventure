import React from 'react';
import { Skull, Trophy, RotateCcw, Award } from 'lucide-react';

interface GameStatusModalProps {
  status: 'GAME_OVER' | 'VICTORY';
  deathReason: string | null;
  score: number;
  turns: number;
  onRestart: () => void;
}

export const GameStatusModal: React.FC<GameStatusModalProps> = ({
  status,
  deathReason,
  score,
  turns,
  onRestart,
}) => {
  const isVictory = status === 'VICTORY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300 font-mono">
      <div
        className={`max-w-md w-full rounded-2xl p-6 border-2 shadow-2xl ${
          isVictory
            ? 'bg-[#171310] border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
            : 'bg-[#171010] border-rose-700 shadow-[0_0_30px_rgba(225,29,72,0.2)]'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border ${
              isVictory
                ? 'bg-[#2b1f13] border-amber-500 text-amber-400'
                : 'bg-[#2b1315] border-rose-600 text-rose-400'
            }`}
          >
            {isVictory ? (
              <Trophy className="w-8 h-8 animate-bounce" />
            ) : (
              <Skull className="w-8 h-8 animate-pulse" />
            )}
          </div>

          <h2
            className={`text-xl sm:text-2xl font-bold tracking-wider mb-2 ${
              isVictory ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {isVictory ? 'CONGRATULATIONS, ADVENTURER!' : 'EXPEDITION FAILED: YOU HAVE PERISHED'}
          </h2>

          <p className="text-xs sm:text-sm text-[#d6c4b2] mb-6 leading-relaxed">
            {isVictory
              ? 'You have successfully conquered the legendary perils of Colossal Cave, frightened away the dreadful serpent, and laid claim to the ancient treasures of the Mountain King!'
              : deathReason ||
                'Your intrepid adventure into Colossal Cave has met an untimely and tragic end.'}
          </p>

          {/* Stats Breakdown */}
          <div className="w-full bg-[#120e0b] border border-[#44301d] rounded-xl p-3.5 mb-6 text-xs grid grid-cols-2 gap-3 text-left shadow-inner">
            <div>
              <span className="text-[#8a7562] block text-[11px] font-bold">FINAL SCORE</span>
              <span className="text-base font-bold text-amber-400">{score} POINTS</span>
            </div>
            <div>
              <span className="text-[#8a7562] block text-[11px] font-bold">TURNS ELAPSED</span>
              <span className="text-base font-bold text-[#f5e6d3]">{turns} TURNS</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-[#3b2918] flex items-center justify-between">
              <span className="text-[#8a7562] text-[11px] font-bold">OFFICIAL RANK</span>
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                {isVictory
                  ? 'GRANDMASTER SPELUNKER'
                  : score > 50
                  ? 'MASTER CAVER'
                  : score > 20
                  ? 'NOVICE EXPLORER'
                  : 'GREENHORN SPELUNKER'}
              </span>
            </div>
          </div>

          {/* Play Again Restart Button */}
          <button
            onClick={onRestart}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg ${
              isVictory
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950'
                : 'bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN / RESTART EXPEDITION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
