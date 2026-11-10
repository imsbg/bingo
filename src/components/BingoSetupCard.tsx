import React, { useState, useEffect } from 'react';
import {
  Shuffle,
  CheckCircle2,
  Eraser,
  Sparkles,
  Users,
  Eye,
  Clock,
} from 'lucide-react';
import {
  BingoGrid,
  generateRandomGrid,
  createEmptySetupGrid,
  isValidBingoGrid,
  formatLocalNumber,
} from '../game/rules';
import { Translations, Language } from '../utils/translations';
import { sounds } from '../utils/sound';

interface BingoSetupCardProps {
  initialGrid: BingoGrid;
  isReady: boolean;
  opponentReady: boolean;
  opponentJoined: boolean;
  myPlayerLabel: string;
  opponentPlayerLabel: string;
  isSpectator: boolean;
  onConfirmGrid: (grid: BingoGrid) => void;
  currentLanguage: Language;
  isDarkMode: boolean;
  t: Translations;
}

export const BingoSetupCard: React.FC<BingoSetupCardProps> = ({
  initialGrid,
  isReady,
  opponentReady,
  opponentJoined,
  myPlayerLabel,
  opponentPlayerLabel,
  isSpectator,
  onConfirmGrid,
  currentLanguage,
  isDarkMode,
  t,
}) => {
  const [draftGrid, setDraftGrid] = useState<BingoGrid>(() =>
    isValidBingoGrid(initialGrid) ? [...initialGrid] : generateRandomGrid()
  );
  const [focusedCellIndex, setFocusedCellIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isValidBingoGrid(initialGrid)) {
      setDraftGrid([...initialGrid]);
    }
  }, [initialGrid]);

  // Find the smallest number 1..25 not yet present in draftGrid for 1-tap sequential placement
  const getNextMissingNumber = (grid: BingoGrid): number | null => {
    const present = new Set(grid.filter((n) => n >= 1 && n <= 25));
    for (let i = 1; i <= 25; i++) {
      if (!present.has(i)) return i;
    }
    return null;
  };

  const nextMissing = getNextMissingNumber(draftGrid);

  const handleCellTap = (index: number) => {
    if (isReady || isSpectator) return;
    setErrorMsg(null);
    sounds.playClick();

    // If cell is empty (0), fill with nextMissing
    if (draftGrid[index] === 0 && nextMissing !== null) {
      const next = [...draftGrid];
      next[index] = nextMissing;
      setDraftGrid(next);
    } else if (draftGrid[index] !== 0 && nextMissing !== null) {
      // Clear that cell so user can re-tap
      const next = [...draftGrid];
      next[index] = 0;
      setDraftGrid(next);
    }
  };

  const normalizeDigits = (str: string): string => {
    const odiaDigits = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];
    let out = str;
    odiaDigits.forEach((od, i) => {
      out = out.split(od).join(String(i));
    });
    return out.replace(/[^0-9]/g, '');
  };

  const handleCellInputChange = (index: number, rawValue: string) => {
    if (isReady || isSpectator) return;
    setErrorMsg(null);
    const cleaned = normalizeDigits(rawValue);
    if (!cleaned) {
      const next = [...draftGrid];
      next[index] = 0;
      setDraftGrid(next);
      return;
    }
    const val = parseInt(cleaned, 10);
    if (val >= 1 && val <= 25) {
      const next = [...draftGrid];
      next[index] = val;
      setDraftGrid(next);
    }
  };

  const handleRandomize = () => {
    if (isReady || isSpectator) return;
    sounds.playRematch();
    setErrorMsg(null);
    setDraftGrid(generateRandomGrid());
  };

  const handleClear = () => {
    if (isReady || isSpectator) return;
    sounds.playClick();
    setErrorMsg(null);
    setDraftGrid(createEmptySetupGrid());
  };

  const handleDone = () => {
    if (isReady || isSpectator) return;
    if (!isValidBingoGrid(draftGrid)) {
      setErrorMsg(t.invalidGridAlert);
      sounds.playDraw();
      return;
    }
    setErrorMsg(null);
    sounds.playLineComplete();
    onConfirmGrid(draftGrid);
  };

  // Detect duplicate numbers to highlight errors clearly
  const counts = new Map<number, number>();
  draftGrid.forEach((n) => {
    if (n >= 1 && n <= 25) {
      counts.set(n, (counts.get(n) || 0) + 1);
    }
  });

  return (
    <div
      className={`w-full max-w-[440px] mx-auto p-4 sm:p-6 rounded-3xl border shadow-2xl space-y-4 transition-all animate-fade-in ${
        isDarkMode
          ? 'bg-slate-900/85 border-slate-800 shadow-indigo-950/40'
          : 'bg-white/95 border-slate-200 shadow-slate-300/60'
      }`}
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{myPlayerLabel}</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight pt-1">
          {t.writeNumbers}
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
          {t.setupSubtitle}
        </p>
      </div>

      {/* Live Readiness Status Bar for Both Players */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className={`p-2.5 rounded-2xl border flex items-center gap-2 ${
            isReady
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : isDarkMode
              ? 'bg-slate-800/70 border-slate-700 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <CheckCircle2
            className={`w-4 h-4 shrink-0 ${
              isReady ? 'text-emerald-500' : 'text-slate-500'
            }`}
          />
          <div className="min-w-0">
            <div className="font-bold truncate">{myPlayerLabel}</div>
            <div className="text-[10px] opacity-80">
              {isReady ? t.readyStatus : t.settingUpStatus}
            </div>
          </div>
        </div>

        <div
          className={`p-2.5 rounded-2xl border flex items-center gap-2 ${
            opponentReady
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : isDarkMode
              ? 'bg-slate-800/70 border-slate-700 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {opponentReady ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          ) : (
            <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
          )}
          <div className="min-w-0">
            <div className="font-bold truncate">{opponentPlayerLabel}</div>
            <div className="text-[10px] opacity-80">
              {!opponentJoined
                ? t.waitingForOpponent
                : opponentReady
                ? t.readyStatus
                : t.settingUpStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Next Number Hint when Tap-Filling */}
      {!isReady && !isSpectator && nextMissing !== null && (
        <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <span>{t.tapToFillHint}</span>
          <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-mono font-black text-sm">
            {formatLocalNumber(nextMissing, currentLanguage)}
          </span>
        </div>
      )}

      {/* 5x5 Setup Grid */}
      {isSpectator ? (
        <div className="py-10 px-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center space-y-2">
          <Eye className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
          <p className="text-sm font-bold text-amber-400">{t.spectatorModeNotice}</p>
          <p className="text-xs text-slate-400">{t.waitingForOtherSetup}</p>
        </div>
      ) : (
        <div
          id="player-grid-setup"
          className="grid grid-cols-5 gap-2 sm:gap-2.5 aspect-square w-full max-w-[360px] mx-auto"
        >
          {draftGrid.map((val, idx) => {
            const isDuplicate = val > 0 && (counts.get(val) || 0) > 1;
            const isEmpty = val === 0;

            return (
              <div key={idx} className="relative w-full h-full">
                {isEmpty ? (
                  <button
                    type="button"
                    disabled={isReady}
                    onClick={() => handleCellTap(idx)}
                    aria-label={`Empty setup cell ${idx + 1}, tap to place ${nextMissing ?? ''}`}
                    className={`w-full h-full rounded-xl border-2 border-dashed flex items-center justify-center font-mono font-bold text-sm transition-all active:scale-95 ${
                      isDarkMode
                        ? 'border-slate-700 bg-slate-800/40 text-slate-500 hover:border-indigo-500 hover:text-indigo-400'
                        : 'border-slate-300 bg-slate-50 text-slate-400 hover:border-indigo-500 hover:text-indigo-600'
                    }`}
                  >
                    +
                  </button>
                ) : (
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={isReady}
                    aria-label={`Bingo setup cell ${idx + 1}`}
                    value={
                      focusedCellIndex === idx && !isReady
                        ? String(val)
                        : formatLocalNumber(val, currentLanguage)
                    }
                    onFocus={() => setFocusedCellIndex(idx)}
                    onBlur={() => setFocusedCellIndex((prev) => (prev === idx ? null : prev))}
                    onClick={() => {
                      if (nextMissing !== null && !isReady) {
                        handleCellTap(idx);
                      }
                    }}
                    onChange={(e) => handleCellInputChange(idx, e.target.value)}
                    className={`w-full h-full rounded-xl border text-center font-extrabold text-base sm:text-lg outline-none transition-all tabular-nums ${
                      isDuplicate
                        ? 'border-rose-500 bg-rose-500/20 text-rose-400 ring-2 ring-rose-500/40'
                        : isReady
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 cursor-default'
                        : isDarkMode
                        ? 'border-slate-700 bg-slate-800/90 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                        : 'border-slate-200 bg-slate-100/90 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {errorMsg && (
        <p role="alert" className="text-xs font-bold text-rose-500 text-center">
          {errorMsg}
        </p>
      )}

      {/* Action Buttons: Randomize, Clear, and Done & Ready */}
      {!isSpectator && (
        <div className="space-y-2.5 pt-1">
          {!isReady ? (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="randomize-btn"
                  onClick={handleRandomize}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700'
                      : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
                  }`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>{t.randomize}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>{t.clearBoard}</span>
                </button>
              </div>

              <button
                type="button"
                id="done-setup-btn"
                data-setup-done="true"
                onClick={handleDone}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.doneSetup}</span>
              </button>
            </>
          ) : (
            <div
              id="waiting-for-player-msg"
              className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1 animate-pulse"
            >
              <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{t.waitingForOtherSetup}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
