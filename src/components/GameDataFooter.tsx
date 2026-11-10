import React from 'react';
import { Clock, Trophy, Handshake, History, Sparkles, ArrowRight, Lock } from 'lucide-react';
import {
  RoundRecord,
  MoveRecord,
  PlayerBingoProgress,
  PlayerMark,
  BingoGrid,
  formatDuration,
  formatLocalNumber,
  BINGO_LETTERS,
} from '../game/rules';
import { Translations, Language } from '../utils/translations';

interface GameDataFooterProps {
  totalElapsedSeconds: number;
  currentRoundSeconds: number;
  currentRoundMoves: MoveRecord[];
  roundHistory: RoundRecord[];
  playerNames?: { X: string; O: string };
  currentProgress?: { X: PlayerBingoProgress; O: PlayerBingoProgress };
  myMark?: PlayerMark | null;
  smartPlay?: boolean;
  isGameOver?: boolean;
  isSpectator?: boolean;
  currentLanguage: Language;
  t: Translations;
  isDarkMode: boolean;
}

export const GameDataFooter: React.FC<GameDataFooterProps> = ({
  totalElapsedSeconds,
  currentRoundSeconds,
  currentRoundMoves,
  roundHistory,
  playerNames = { X: 'Player 1', O: 'Player 2' },
  currentProgress,
  myMark = 'X',
  smartPlay = false,
  isGameOver = false,
  isSpectator = false,
  currentLanguage,
  t,
  isDarkMode,
}) => {
  const showBothLiveProgress = smartPlay || isGameOver || isSpectator;

  const renderPlayerProgressBar = (
    name: string,
    prog: PlayerBingoProgress,
    accent: 'emerald' | 'rose',
    isHidden: boolean = false
  ) => {
    return (
      <div
        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
          isDarkMode
            ? 'bg-slate-900/75 border-slate-700/80'
            : 'bg-white border-slate-200/90 shadow-2xs'
        }`}
      >
        <div className="min-w-0">
          <div
            className={`text-[11px] font-extrabold truncate ${
              accent === 'emerald'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {name}
          </div>
          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums flex items-center gap-1">
            {isHidden ? (
              <>
                <Lock className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                <span>{t.smartPlayBadgeOff}</span>
              </>
            ) : (
              <span>
                {prog.completedLineCount}/5 {t.linesCompleted}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {BINGO_LETTERS.map((letter) => {
            const isClaimed = !isHidden && prog.letters.includes(letter);
            return (
              <span
                key={letter}
                className={`w-5 h-5 rounded-md font-mono font-black text-[10px] flex items-center justify-center ${
                  isHidden
                    ? isDarkMode
                      ? 'bg-slate-800 text-slate-500 border border-slate-700'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                    : isClaimed
                    ? accent === 'emerald'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-rose-600 text-white shadow-2xs'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-500 border border-slate-700/60'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isHidden ? '?' : letter}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMiniSnapshotGrid = (
    grid: BingoGrid,
    prog: PlayerBingoProgress,
    calledSet: Set<number>
  ) => {
    const completedCells = new Set(prog.completedCellIndices);
    return (
      <div
        className={`grid grid-cols-5 gap-0.5 p-1 rounded-lg border shrink-0 ${
          isDarkMode
            ? 'bg-slate-950/50 border-slate-700/70'
            : 'bg-slate-100 border-slate-200'
        }`}
      >
        {grid.map((num, cIdx) => {
          const isCalled = calledSet.has(num);
          const isInLine = completedCells.has(cIdx);
          return (
            <div
              key={cIdx}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[2px] flex items-center justify-center text-[7px] font-mono font-bold tabular-nums ${
                isCalled
                  ? isInLine
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-500 text-white'
                  : isDarkMode
                  ? 'bg-slate-800/80 text-slate-400'
                  : 'bg-white text-slate-600'
              }`}
            >
              {formatLocalNumber(num, currentLanguage)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section
      aria-label={t.gameDataTitle}
      className={`w-full mt-5 rounded-3xl border shadow-lg p-4 sm:p-6 transition-all ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800 text-slate-100'
          : 'bg-white/90 border-slate-200 text-slate-900'
      }`}
    >
      {/* Header & Live Timers */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
          isDarkMode ? 'border-slate-800/60' : 'border-slate-200/80'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
              {t.gameDataTitle}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.gameDataSubtitle}</p>
          </div>
        </div>

        {/* Live Timers Bar */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold tabular-nums ${
              isDarkMode
                ? 'bg-slate-800/90 border-slate-700 text-indigo-400'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              {t.totalPlayTime}:
            </span>
            <span className="font-mono text-xs sm:text-sm">{formatDuration(totalElapsedSeconds)}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold tabular-nums ${
              isDarkMode
                ? 'bg-slate-800/90 border-slate-700 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              {t.roundTime}:
            </span>
            <span className="font-mono text-xs sm:text-sm">{formatDuration(currentRoundSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Live Current Round Called Numbers Sequence & Both Players B-I-N-G-O Progress */}
      {currentRoundMoves.length > 0 && (
        <div
          className={`mt-3 p-3.5 rounded-2xl border text-xs space-y-3 ${
            isDarkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200/80'
          }`}
        >
          {/* Current Round Both Users B-I-N-G-O Progress */}
          {currentProgress && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t.bothPlayersBingoProgress}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {renderPlayerProgressBar(
                  `P1 • ${playerNames.X}`,
                  currentProgress.X,
                  'emerald',
                  !showBothLiveProgress && myMark === 'O'
                )}
                {renderPlayerProgressBar(
                  `P2 • ${playerNames.O}`,
                  currentProgress.O,
                  'rose',
                  !showBothLiveProgress && myMark === 'X'
                )}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {t.moveSequenceLabel} ({currentRoundMoves.length})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {currentRoundMoves.map((m, idx) => {
                const isLast = idx === currentRoundMoves.length - 1;
                return (
                  <React.Fragment key={m.moveNumber}>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-mono text-[11px] font-semibold border tabular-nums ${
                        m.player === 'X'
                          ? isDarkMode
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                            : 'bg-blue-50 border-blue-200 text-blue-700'
                          : isDarkMode
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : 'bg-orange-50 border-orange-200 text-orange-800'
                      } ${isLast ? 'ring-2 ring-amber-400' : ''}`}
                    >
                      <span>#{m.moveNumber}</span>
                      <strong>{m.playerName}</strong>
                      <span
                        className={`px-1.5 py-0.2 rounded font-black ${
                          isDarkMode ? 'bg-black/30' : 'bg-white border border-slate-200'
                        }`}
                      >
                        {formatLocalNumber(m.calledNumber, currentLanguage)}
                      </span>
                      {showBothLiveProgress && (
                        <span className="text-[9px] opacity-85 pl-0.5">
                          (P1:{m.linesAfterMove.X}/5•P2:{m.linesAfterMove.O}/5)
                        </span>
                      )}
                    </span>
                    {!isLast && <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Completed Rounds History List (Always shows BOTH users' B-I-N-G-O progress & boards) */}
      {roundHistory.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400">
          {t.noRoundsYet}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {roundHistory.map((item) => {
            const calledSet = new Set(item.calledNumbers);
            const p1Name =
              item.moves.find((m) => m.player === 'X')?.playerName || playerNames.X;
            const p2Name =
              item.moves.find((m) => m.player === 'O')?.playerName || playerNames.O;

            return (
              <div
                key={item.round}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/50 border-slate-700/80'
                    : 'bg-slate-50/90 border-slate-200'
                }`}
              >
                {/* Round Header & Winner Info */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                      {t.round} {item.round}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold">
                      {item.winner === 'draw' ? (
                        <span className="text-amber-500 flex items-center gap-1">
                          <Handshake className="w-3.5 h-3.5" />
                          {t.ties}
                        </span>
                      ) : (
                        <span
                          className={`flex items-center gap-1 ${
                            item.winner === 'X'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          {item.winnerName}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>
                      {t.timeTakenLabel}{' '}
                      <strong className="font-mono text-slate-700 dark:text-slate-200">
                        {formatDuration(item.durationSeconds)}
                      </strong>
                    </span>
                    <span>
                      {t.totalMovesLabel}: <strong>{item.moves.length}</strong>
                    </span>
                  </div>
                </div>

                {item.finalMove && (
                  <div className="text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">{t.finalMoveLabel}: </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {item.finalMove.playerName} → {t.cellLabel}{' '}
                      {formatLocalNumber(item.finalMove.calledNumber, currentLanguage)} @{' '}
                      {formatDuration(item.finalMove.elapsedSeconds)}
                    </span>
                  </div>
                )}

                {/* Both Users' B-I-N-G-O Progress & Mini 5x5 Boards */}
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t.bothPlayersBingoProgress}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Player 1 (X) Progress & Mini Board */}
                    <div
                      className={`p-2.5 rounded-xl border space-y-2 ${
                        isDarkMode
                          ? 'bg-slate-900/60 border-slate-700/70'
                          : 'bg-white border-slate-200/90'
                      }`}
                    >
                      {renderPlayerProgressBar(`P1 • ${p1Name}`, item.progress.X, 'emerald', false)}
                      <div className="flex justify-center">
                        {renderMiniSnapshotGrid(item.grids.X, item.progress.X, calledSet)}
                      </div>
                    </div>

                    {/* Player 2 (O) Progress & Mini Board */}
                    <div
                      className={`p-2.5 rounded-xl border space-y-2 ${
                        isDarkMode
                          ? 'bg-slate-900/60 border-slate-700/70'
                          : 'bg-white border-slate-200/90'
                      }`}
                    >
                      {renderPlayerProgressBar(`P2 • ${p2Name}`, item.progress.O, 'rose', false)}
                      <div className="flex justify-center">
                        {renderMiniSnapshotGrid(item.grids.O, item.progress.O, calledSet)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Called Numbers Trail with Both Players Line Counts */}
                <div
                  className={`pt-2 border-t flex flex-wrap items-center gap-1 ${
                    isDarkMode ? 'border-slate-700/50' : 'border-slate-200'
                  }`}
                >
                  {item.moves.map((mv, mIdx) => {
                    const isFinal = mIdx === item.moves.length - 1;
                    return (
                      <React.Fragment key={mv.moveNumber}>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                            isFinal
                              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/40'
                              : mv.player === 'X'
                              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                          title={`${mv.playerName}: ${mv.calledNumber} (P1: ${mv.linesAfterMove.X}/5, P2: ${mv.linesAfterMove.O}/5)`}
                        >
                          #{mv.moveNumber}:{formatLocalNumber(mv.calledNumber, currentLanguage)}{' '}
                          <span className="opacity-75 text-[9px]">
                            ({mv.linesAfterMove.X}-{mv.linesAfterMove.O})
                          </span>
                        </span>
                        {!isFinal && <span className="text-[9px] text-slate-400">→</span>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
