import React, { useState, useEffect } from 'react';
import type { WeekMetadata } from '../types/question';
import { Zap, X, ArrowRight, Check, Play, Sparkles } from 'lucide-react';
import { getMemeSoundEnabled, setMemeSoundEnabled, subscribeMemeSoundState } from '../utils/sound';

interface RapidLabSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLab: (week: number | 'all' | number[]) => void;
  weeks: WeekMetadata[];
  totalQuestions: number;
}

export const RapidLabSelectModal: React.FC<RapidLabSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectLab,
  weeks,
  totalQuestions,
}) => {
  // Default selected weeks: Week 1 or Week 0 & 1
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([1]);
  const [isMemeSoundOn, setIsMemeSoundOn] = useState<boolean>(getMemeSoundEnabled);

  useEffect(() => {
    return subscribeMemeSoundState((enabled) => {
      setIsMemeSoundOn(enabled);
    });
  }, []);

  const handleToggleMemeSound = () => {
    const next = !isMemeSoundOn;
    setIsMemeSoundOn(next);
    setMemeSoundEnabled(next);
  };

  const toggleWeek = (weekNum: number) => {
    setSelectedWeeks((prev) =>
      prev.includes(weekNum) ? prev.filter((w) => w !== weekNum) : [...prev, weekNum]
    );
  };

  const handleSelectAll = () => {
    setSelectedWeeks(weeks.filter((w) => w.isLoaded).map((w) => w.week));
  };

  const handleClearSelection = () => {
    setSelectedWeeks([]);
  };

  const handleSelectFirstHalf = () => {
    setSelectedWeeks([0, 1, 2, 3, 4, 5, 6]);
  };

  const handleSelectSecondHalf = () => {
    setSelectedWeeks([7, 8, 9, 10, 11, 12]);
  };

  const selectedTotalQuestions = weeks
    .filter((w) => selectedWeeks.includes(w.week) && w.isLoaded)
    .reduce((sum, w) => sum + w.totalQuestions, 0);

  const handleStartSelected = () => {
    if (selectedWeeks.length === 0) return;
    if (selectedWeeks.length === weeks.length) {
      onSelectLab('all');
    } else {
      onSelectLab(selectedWeeks);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/75 backdrop-blur-xs overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 sm:p-7 shadow-2xl transition-all my-4 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                <span>Rapid Quiz ⚡</span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  Multiple Labs Supported
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Select one or multiple labs to practice together with instant answer reveals & meme sounds!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meme Audio / Data Saver Preference Banner */}
        <div className={`p-3 rounded-2xl border mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shrink-0 transition-colors ${
          isMemeSoundOn
            ? 'bg-amber-500/10 border-amber-300 dark:border-amber-700/60'
            : 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-700/60'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg shrink-0">🎭</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {isMemeSoundOn ? 'Telugu Meme Audio ON' : 'Data Saver Mode Active'}
                </span>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                  isMemeSoundOn
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {isMemeSoundOn ? 'Audio Loaded' : 'Zero Audio Data'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug">
                {isMemeSoundOn
                  ? 'Hilarious Telugu meme clips will play instantly on every answer.'
                  : 'Meme audio files will NOT be loaded or downloaded, saving your mobile data.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleMemeSound}
            className={`w-full sm:w-auto px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 border transition-all cursor-pointer active:scale-95 text-center ${
              isMemeSoundOn
                ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                : 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-zinc-950 shadow-xs'
            }`}
          >
            {isMemeSoundOn ? 'Turn OFF (Save Data)' : 'Enable Audio'}
          </button>
        </div>

        {/* Scrollable Selection Area */}
        <div className="space-y-3.5 overflow-y-auto pr-1 flex-1">
          
          {/* Quick Mega Option: All Labs Combined */}
          <button
            type="button"
            onClick={() => onSelectLab('all')}
            className="w-full flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-400 dark:border-amber-600/80 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent hover:bg-amber-500/20 text-left transition-all group cursor-pointer active:scale-[0.99] shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                    All 13 Labs Combined (Weeks 0–12)
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {totalQuestions} Questions
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                  1-Click start across all 13 course assignments
                </p>
              </div>
            </div>

            <div className="shrink-0 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Multi-Selection Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Tap to Select Multiple Labs:
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                ({selectedWeeks.length} selected)
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer transition-colors"
              >
                All (13)
              </button>
              <button
                type="button"
                onClick={handleSelectFirstHalf}
                className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer transition-colors"
              >
                Weeks 0–6
              </button>
              <button
                type="button"
                onClick={handleSelectSecondHalf}
                className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer transition-colors"
              >
                Weeks 7–12
              </button>
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-2 py-0.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold cursor-pointer transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Interactive Lab Grid with Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {weeks.map((w) => {
              const isDisabled = !w.isLoaded;
              const isSelected = selectedWeeks.includes(w.week);

              return (
                <div
                  key={w.week}
                  onClick={() => !isDisabled && toggleWeek(w.week)}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer group active:scale-[0.99] ${
                    isDisabled
                      ? 'border-zinc-200 dark:border-zinc-800 opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-500/60 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Visual Checkbox */}
                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-md bg-amber-500 text-zinc-950 flex items-center justify-center font-bold shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-md border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 group-hover:border-amber-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded transition-colors ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                        }`}>
                          Lab {w.week}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {w.totalQuestions} Qs
                        </span>
                      </div>
                      <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-snug line-clamp-1">
                        {w.title}
                      </p>
                    </div>
                  </div>

                  {/* Quick Start single button on the side if user only wants this one lab immediately */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLab(w.week);
                    }}
                    title={`Instantly start only Lab ${w.week}`}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition-colors cursor-pointer shrink-0"
                    aria-label={`Start only Lab ${w.week}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-3 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 min-w-0">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedWeeks.length}</span> {selectedWeeks.length === 1 ? 'Lab' : 'Labs'} selected • <span className="font-bold text-amber-600 dark:text-amber-400">{selectedTotalQuestions}</span> Questions
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleStartSelected}
              disabled={selectedWeeks.length === 0}
              className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-md shadow-amber-500/25 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Start Rapid Quiz ({selectedTotalQuestions} Qs)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
