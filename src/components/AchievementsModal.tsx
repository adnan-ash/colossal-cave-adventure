import React from 'react';
import { ACHIEVEMENTS, getExplorerRank } from '../data/gameData';
import { Trophy, CheckCircle2, Circle, Clock, Award, X } from 'lucide-react';

interface AchievementsModalProps {
  unlockedIds: string[];
  score: number;
  turns: number;
  startTime: number;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  unlockedIds,
  score,
  turns,
  startTime,
  onClose,
}) => {
  const rankInfo = getExplorerRank(score);
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fbf8f2] border-4 border-double border-[#8b2520] rounded-xl max-w-lg w-full p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-serif text-[#2c1a10]">
        {/* Certificate Header */}
        <div className="flex items-center justify-between border-b border-[#cfc0ae] pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#8b2520]" />
            <h2 className="text-base sm:text-lg font-monument font-bold tracking-wider text-[#2c1a10]">
              EXPEDITION CERTIFICATE OF MERIT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#826c5b] hover:text-[#2c1a10] hover:bg-[#ede5d5] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Explorer Rank Scroll */}
        <div className="bg-[#f5efe4] border border-[#cfc0ae] rounded-lg p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#826c5b] uppercase tracking-widest block font-monument font-bold">
              Official Spelunker Rank
            </span>
            <span className="text-sm sm:text-base font-monument font-bold text-[#8b2520]">
              {rankInfo.rank}
            </span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs text-[#2c1a10] font-manuscript font-bold">
              <Award className="w-4 h-4 text-[#8b2520]" />
              <span>{score} / 350 Gold Points</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-manuscript text-[#5f4534] mt-0.5">
              <Clock className="w-3 h-3 text-[#5f4534]" />
              <span>{timeFormatted} ({turns} turns elapsed)</span>
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1.5 slidebar-retro">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-[#fcfaf6] border-[#8b2520] shadow-sm'
                    : 'bg-[#ede5d5]/50 border-[#cfc0ae] opacity-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-[#8b2520] shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#b5a18a] shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-manuscript text-[#2c1a10]">{ach.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#cfc0ae] bg-[#fbf8f2] text-[#8b2520] font-manuscript font-bold">
                        ORDER OF MERIT
                      </span>
                    </div>
                    <p className="text-[11px] font-manuscript text-[#5f4534] mt-0.5 leading-snug">
                      {ach.description}
                    </p>
                  </div>
                </div>
                <div className="text-xl select-none shrink-0">{ach.icon}</div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-1 w-full py-2.5 rounded-lg bg-[#2c1a10] hover:bg-[#4a2e1d] text-[#fbf8f2] font-manuscript font-bold text-xs uppercase tracking-wider transition-all cursor-pointer active:translate-y-0.5"
        >
          Return to Expedition Chronicle
        </button>
      </div>
    </div>
  );
};
