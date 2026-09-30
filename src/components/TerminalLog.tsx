import React, { useEffect, useRef, useState } from 'react';
import { LogEntry } from '../types/game';
import { sound } from '../utils/audio';
import { BookOpen, Send, Trash2, ArrowDown, Feather } from 'lucide-react';

interface TerminalLogProps {
  logs: LogEntry[];
  onCommandSubmit: (cmd: string) => void;
  onClearLogs?: () => void;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({
  logs,
  onCommandSubmit,
  onClearLogs,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [history, setHistory] = useState<string[]>([]);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Typewriter effect state
  const [activeTypingId, setActiveTypingId] = useState<string | null>(null);
  const [typedCharCount, setTypedCharCount] = useState<number>(0);
  const completedIdsRef = useRef<Set<string>>(new Set());

  // Inked letterpress loop printing at 18ms per character
  useEffect(() => {
    if (logs.length === 0) return;
    const latest = logs[logs.length - 1];

    if (completedIdsRef.current.has(latest.id)) {
      return;
    }

    const shouldTypewrite =
      latest.type === 'narration' || latest.type === 'lore' || latest.type === 'action';
    if (!shouldTypewrite) {
      completedIdsRef.current.add(latest.id);
      return;
    }

    setActiveTypingId(latest.id);
    setTypedCharCount(0);

    const fullText = latest.text;
    let currentIdx = 0;

    const timer = setInterval(() => {
      currentIdx += 1;
      setTypedCharCount(currentIdx);

      if (currentIdx % 9 === 0) {
        sound.playKeyBlip();
      }

      if (scrollRef.current && !isScrolledUp) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }

      if (currentIdx >= fullText.length) {
        clearInterval(timer);
        completedIdsRef.current.add(latest.id);
        setActiveTypingId(null);
      }
    }, 18);

    return () => {
      clearInterval(timer);
      completedIdsRef.current.add(latest.id);
    };
  }, [logs, isScrolledUp]);

  const handleFastForwardTyping = () => {
    if (activeTypingId && logs.length > 0) {
      const latest = logs[logs.length - 1];
      completedIdsRef.current.add(latest.id);
      setActiveTypingId(null);
      setTypedCharCount(latest.text.length);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsScrolledUp(distanceFromBottom > 40);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setIsScrolledUp(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setIsScrolledUp(false);
    handleFastForwardTyping();
    onCommandSubmit(trimmed);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= history.length) {
          setHistoryIndex(-1);
          setInputVal('');
        } else {
          setHistoryIndex(nextIndex);
          setInputVal(history[nextIndex]);
        }
      }
    }
  };

  const getLogStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'narration':
        return 'text-[#f7f1e5] font-manuscript text-sm sm:text-base leading-relaxed';
      case 'action':
        return 'text-[#eec170] font-manuscript font-bold text-sm sm:text-base';
      case 'warning':
        return 'text-[#fcd34d] font-manuscript italic bg-[#2d2212] p-2 rounded-lg border border-[#785923]';
      case 'danger':
        return 'text-[#fca5a5] font-manuscript font-bold bg-[#331114] p-2 rounded-lg border border-[#8b2520]';
      case 'success':
        return 'text-[#86efac] font-manuscript font-semibold bg-[#122b17] p-2 rounded-lg border border-[#2b6638]';
      case 'lore':
        return 'text-[#eec170]/90 font-manuscript italic text-sm';
      case 'system':
      default:
        return 'text-[#c4ad94] font-manuscript text-xs';
    }
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col bg-[#140f0c] border-2 border-[#4d3725] rounded-xl overflow-hidden shadow-md font-serif text-[#f7f1e5]">
      {/* Chapter Header */}
      <div className="shrink-0 flex items-center justify-between px-3.5 py-2 bg-[#1f1711] border-b border-[#3d2b1d] select-none">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#eec170]" />
          <span className="text-xs font-monument font-bold tracking-widest text-[#f7f1e5]">
            THE EXPEDITION CHRONICLE
          </span>
          <span className="text-[10px] font-manuscript px-2.5 py-0.5 rounded-full border border-[#5c432d] bg-[#140f0c] text-[#c4ad94] italic hidden sm:inline">
            Mammoth Cave Folio · 1976
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              title="Clear Chronicle Entries"
              className="text-[#a89582] hover:text-[#f7f1e5] transition-colors p-1 rounded hover:bg-[#2c2016] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Chronicle Output Window with Parchment Ivory Typography */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onClick={handleFastForwardTyping}
        title={activeTypingId ? 'Click to instantly print entry' : undefined}
        className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 space-y-3 scroll-smooth cursor-text select-text slidebar-retro bg-[#140f0c]"
      >
        {logs.map((entry) => {
          const isCurrentlyTyping = activeTypingId === entry.id;
          const textToRender = isCurrentlyTyping
            ? entry.text.slice(0, typedCharCount)
            : entry.text;

          return (
            <div
              key={entry.id}
              className={`transition-opacity duration-150 ${getLogStyle(entry.type)}`}
            >
              <div className="flex items-baseline gap-2.5">
                <span className="text-[11px] text-[#eec170] select-none shrink-0 font-manuscript font-bold">
                  §{entry.turn.toString().padStart(2, '0')}
                </span>
                <div className="flex-1 whitespace-pre-wrap leading-relaxed">
                  {textToRender}
                  {isCurrentlyTyping && <span className="quill-cursor">|</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Scroll-to-Bottom Button */}
      {isScrolledUp && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-16 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#291f16] border border-[#b3844d] hover:bg-[#382a1e] text-[#f7f1e5] font-manuscript font-bold text-xs shadow-xl cursor-pointer transition-all active:translate-y-0.5"
        >
          <ArrowDown className="w-3.5 h-3.5 text-[#eec170]" />
          <span>Latest Inscription</span>
        </button>
      )}

      {/* Chronicle Inscription Command Bar */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 p-2 sm:p-2.5 bg-[#1a130e] border-t border-[#3d2b1d] flex items-center gap-2"
      >
        <div className="flex items-center gap-1.5 text-xs font-manuscript font-bold text-[#eec170] pl-1 shrink-0 select-none">
          <Feather className="w-4 h-4" />
          <span className="hidden sm:inline">INSCRIPTION &gt;&gt;</span>
          <span className="sm:hidden">&gt;&gt;</span>
        </div>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Inscribe action (e.g., LOOK, NORTH, LIGHT LANTERN, XYZZY)..."
          className="flex-1 bg-[#0f0c09] border border-[#4d3725] focus:border-[#c99a4c] focus:outline-none rounded-lg px-3 py-2 text-xs sm:text-sm font-manuscript text-[#f7f1e5] placeholder-[#7d6857] transition-colors"
        />

        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="px-3 sm:px-4 py-2 rounded-lg bg-[#eec170] hover:bg-[#dfb05d] disabled:opacity-30 disabled:pointer-events-none text-[#1a120c] font-manuscript font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 shrink-0 shadow-sm"
        >
          <span className="hidden sm:inline">INSCRIBE</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
