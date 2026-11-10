import React, { useState } from 'react';
import {
  Eye,
  Grid,
  Sparkles,
  Check,
  Lock,
  ShieldAlert,
  BrainCircuit,
} from 'lucide-react';
import {
  BingoGrid,
  PlayerBingoProgress,
  PlayerMark,
  MoveRecord,
  BINGO_LETTERS,
  formatLocalNumber,
} from '../game/rules';
import { Translations, Language } from '../utils/translations';
import { sounds } from '../utils/sound';

interface GameBoardProps {
  grids: { X: BingoGrid; O: BingoGrid };
  calledNumbers: number[];
  currentRoundMoves: MoveRecord[];
  progress: { X: PlayerBingoProgress; O: PlayerBingoProgress };
  currentTurn: PlayerMark;
  myMark: PlayerMark | null;
  isMyTurn: boolean;
  canMove: boolean;
  status: 'setting_up' | 'playing' | 'won' | 'draw';
  smartPlay: boolean;
  playerNames: { X: string; O: string };
  onCallNumber: (num: number) => void;
  currentLanguage: Language;
  isDarkMode: boolean;
  t: Translations;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grids,
  calledNumbers,
  currentRoundMoves,
  progress,
  currentTurn,
  myMark,
  canMove,
  status,
  smartPlay,
  playerNames,
  onCallNumber,
  currentLanguage,
  isDarkMode,
  t,
}) => {
  const [showCallerPad, setShowCallerPad] = useState<boolean>(false);

  const isSpectator = myMark === null;
  const isGameOver = status === 'won' || status === 'draw';

  const primaryMark: PlayerMark = myMark || 'X';
  const secondaryMark: PlayerMark = primaryMark === 'X' ? 'O' : 'X';

  const myGrid = grids[primaryMark];
  const oppGrid = grids[secondaryMark];
  const myProgress = progress[primaryMark];
  const oppProgress = progress[secondaryMark];

  const calledSet = new Set(calledNumbers);

  // Map each called number to the player ('X' or 'O') who called it
  const calledByMap = new Map<number, PlayerMark>();
  currentRoundMoves.forEach((m) => {
    calledByMap.set(m.calledNumber, m.player);
  });

  const lastMove =
    currentRoundMoves.length > 0
      ? currentRoundMoves[currentRoundMoves.length - 1]
      : null;
  const lastCalledNumber =
    calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : null;
  const lastCallerName = lastMove
    ? playerNames[lastMove.player]
    : null;

  const handleSelectNumber = (num: number) => {
    if (!canMove || calledSet.has(num)) return;
    sounds.playMove(currentTurn);
    onCallNumber(num);
  };

  // Number text color class for Player 1 ('X') vs Player 2 ('O') inside Green/Red called boxes
  // In Dark Mode: Sky Blue (P1) vs Amber Yellow (P2)
  // In Light Mode: Electric Royal Blue (P1) vs Vivid Orange-Amber (P2) on crisp inner contrast badge
  const getCallerNumberColorClass = (caller: PlayerMark | undefined) => {
    if (caller === 'O') {
      return isDarkMode
        ? 'text-amber-300'
        : 'text-orange-600 drop-shadow-[0_1px_0_rgba(255,255,255,0.95)]';
    }
    return isDarkMode
      ? 'text-sky-300'
      : 'text-blue-700 drop-shadow-[0_1px_0_rgba(255,255,255,0.95)]';
  };

  const getCallerUnderlineBarClass = (caller: PlayerMark | undefined) => {
    if (caller === 'O') {
      return isDarkMode ? 'bg-amber-300' : 'bg-orange-500';
    }
    return isDarkMode ? 'bg-sky-300' : 'bg-blue-600';
  };

  // Render B-I-N-G-O progress bar (or Secret bar when smartPlay is OFF during active play)
  const renderBingoLettersRow = (
    label: string,
    prog: PlayerBingoProgress,
    accent: 'emerald' | 'rose',
    isSecret: boolean = false
  ) => {
    return (
      <div
        className={`p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between gap-2 transition-colors ${
          isDarkMode
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white border-slate-200/90 shadow-xs'
        }`}
      >
        <div className="min-w-0">
          <div className="text-[11px] sm:text-xs font-extrabold truncate">{label}</div>
          <div
            className={`text-[10px] font-semibold tabular-nums flex items-center gap-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {isSecret ? (
              <>
                <Lock className="w-3 h-3 text-amber-500 shrink-0" />
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
            const isClaimed = !isSecret && prog.letters.includes(letter);
            return (
              <span
                key={letter}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg font-mono font-black text-xs sm:text-sm flex items-center justify-center transition-all duration-200 ${
                  isSecret
                    ? isDarkMode
                      ? 'bg-slate-800/80 text-slate-500 border border-slate-700'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                    : isClaimed
                    ? accent === 'emerald'
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30 scale-105'
                      : 'bg-rose-600 text-white shadow-sm shadow-rose-500/30 scale-105'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-500 border border-slate-700/60'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isSecret ? '?' : letter}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  // Render a full 5x5 Bingo Grid (used for My Board, Post-Win Revealed Boards, and Spectator Side-by-Side Boards)
  const renderFull5x5Grid = (
    grid: BingoGrid,
    prog: PlayerBingoProgress,
    interactive: boolean,
    gridId: string
  ) => {
    const completedCellSet = new Set(prog.completedCellIndices);

    return (
      <div
        id={gridId}
        className="grid grid-cols-5 gap-1.5 sm:gap-2 aspect-square w-full max-w-[325px] mx-auto"
      >
        {grid.map((num, idx) => {
          const isCalled = calledSet.has(num);
          const isInCompletedLine = completedCellSet.has(idx);
          const isLastCalled = lastCalledNumber === num;
          const caller = calledByMap.get(num);
          const canClickCell = interactive && canMove && !isCalled;

          // Box is Green when part of a completed line, Red when called, Neutral when uncalled
          const boxColorClass = isCalled
            ? isInCompletedLine
              ? isDarkMode
                ? 'crossed-out bg-emerald-950/90 border-2 border-emerald-500 shadow-sm shadow-emerald-500/20'
                : 'crossed-out bg-emerald-100/95 border-2 border-emerald-500 shadow-sm shadow-emerald-500/15'
              : isDarkMode
              ? 'crossed-out bg-rose-950/85 border-2 border-rose-500 shadow-sm shadow-rose-500/20'
              : 'crossed-out bg-rose-100/95 border-2 border-rose-400 shadow-sm shadow-rose-500/10'
            : isDarkMode
            ? 'bg-slate-800/85 border border-slate-700/80 hover:border-indigo-400 hover:bg-slate-800'
            : 'bg-slate-50/95 border border-slate-200/90 hover:border-indigo-500 hover:bg-indigo-50/60';

          // Number color: 2-color player differentiation on called numbers
          const numberColorClass = isCalled
            ? getCallerNumberColorClass(caller)
            : isDarkMode
            ? 'text-slate-100'
            : 'text-slate-800';

          return (
            <button
              key={idx}
              type="button"
              data-number={num}
              disabled={!canClickCell}
              onClick={() => handleSelectNumber(num)}
              aria-label={`Bingo cell ${num}, ${isCalled ? 'called' : 'uncalled'}`}
              className={`grid-cell relative rounded-xl sm:rounded-2xl font-mono font-extrabold text-sm sm:text-lg flex flex-col items-center justify-center transition-all duration-150 tabular-nums ${boxColorClass} ${
                isLastCalled
                  ? 'ring-3 ring-amber-400 dark:ring-amber-300 scale-[1.05] z-10 shadow-lg shadow-amber-500/30'
                  : ''
              } ${
                canClickCell ? 'cursor-pointer active:scale-95' : 'cursor-default'
              }`}
            >
              <span
                className={`${numberColorClass} ${
                  isCalled && !isDarkMode
                    ? 'px-1.5 py-0.2 rounded-md bg-white/85 shadow-2xs font-black'
                    : ''
                }`}
              >
                {formatLocalNumber(num, currentLanguage)}
              </span>

              {/* Subtle 2-color player indicator bar underneath called numbers */}
              {isCalled && (
                <span
                  className={`mt-0.5 w-4 h-1 rounded-full ${getCallerUnderlineBarClass(
                    caller
                  )}`}
                />
              )}

              {/* Distinct Last Called Badge on Board */}
              {isLastCalled && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[8px] font-black uppercase tracking-tight shadow-xs whitespace-nowrap">
                  {currentLanguage === 'or' ? 'ଶେଷ' : 'LAST'}
                </span>
              )}

              {isCalled && !isLastCalled && (
                <span
                  className={`absolute top-0.5 right-0.5 w-3 h-3 rounded-full flex items-center justify-center ${
                    isInCompletedLine
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  <Check className="w-2 h-2" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // Render 2-Color Number & Box Legend
  const renderColorLegend = () => (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold ${
        isDarkMode
          ? 'bg-slate-950/60 border-slate-800 text-slate-300'
          : 'bg-slate-50 border-slate-200/90 text-slate-600'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isDarkMode ? 'bg-sky-300' : 'bg-blue-600'
            }`}
          />
          <span className={isDarkMode ? 'text-sky-300' : 'text-blue-700 font-extrabold'}>
            {playerNames.X} ({t.calledByP1})
          </span>
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isDarkMode ? 'bg-amber-300' : 'bg-orange-500'
            }`}
          />
          <span className={isDarkMode ? 'text-amber-300' : 'text-orange-600 font-extrabold'}>
            {playerNames.O} ({t.calledByP2})
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-rose-400 border border-rose-500" />
          <span>{t.numbersCalled}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 border border-emerald-600" />
          <span>B-I-N-G-O</span>
        </span>
      </div>
    </div>
  );

  // ============================================================================
  // CASE 1: SPECTATOR VIEW — Side-by-Side (Left: Player 1, Right: Player 2)
  // ============================================================================
  if (isSpectator) {
    const warningText = t.spectatorAntiCheatWarning
      .replace('{p1}', playerNames.X)
      .replace('{p2}', playerNames.O);

    return (
      <div className="w-full space-y-4 select-none">
        {/* Spectator Anti-Cheating Warning (Only shown when Smart Play is OFF) */}
        {!smartPlay && (
          <div
            id="spectator-anticheat-warning"
            role="alert"
            className={`p-3.5 sm:p-4 rounded-2xl border flex items-start gap-3 shadow-sm ${
              isDarkMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-bold leading-relaxed">
              {warningText}
            </div>
          </div>
        )}

        {/* Top Bar: Last Called Number & Color Legend */}
        <div
          className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2 ${
            isDarkMode
              ? 'bg-slate-900/85 border-slate-800'
              : 'bg-white border-slate-200/90 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Eye className="w-3.5 h-3.5" />
              <span>{t.spectator}</span>
            </span>
            {lastCalledNumber !== null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-700 dark:text-amber-300 font-mono text-xs font-black tabular-nums">
                {t.lastCalled}: {formatLocalNumber(lastCalledNumber, currentLanguage)}
                {lastCallerName ? ` (${lastCallerName})` : ''}
              </span>
            )}
          </div>
          {renderColorLegend()}
        </div>

        {/* Side-by-Side Boards: Left = Player 1 (X), Right = Player 2 (O) */}
        <div
          id="spectator-side-by-side-boards"
          className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start"
        >
          {/* Left: Player 1 Board */}
          <div
            className={`p-4 rounded-3xl border space-y-3 ${
              isDarkMode
                ? 'bg-slate-900/85 border-slate-800 shadow-xl'
                : 'bg-white border-slate-200/90 shadow-lg shadow-indigo-500/5'
            }`}
          >
            {renderBingoLettersRow(
              `P1 • ${playerNames.X}`,
              progress.X,
              'emerald',
              false
            )}
            {renderFull5x5Grid(grids.X, progress.X, false, 'spectator-p1-grid')}
          </div>

          {/* Right: Player 2 Board */}
          <div
            className={`p-4 rounded-3xl border space-y-3 ${
              isDarkMode
                ? 'bg-slate-900/85 border-slate-800 shadow-xl'
                : 'bg-white border-slate-200/90 shadow-lg shadow-indigo-500/5'
            }`}
          >
            {renderBingoLettersRow(
              `P2 • ${playerNames.O}`,
              progress.O,
              'rose',
              false
            )}
            {renderFull5x5Grid(grids.O, progress.O, false, 'spectator-p2-grid')}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // CASE 2: PLAYER VIEW
  // ============================================================================
  const hideOpponentProgress = !smartPlay && !isGameOver;
  const oppCompletedCellSet = new Set(oppProgress.completedCellIndices);

  return (
    <div className="w-full space-y-3.5 select-none">
      {/* 1. B-I-N-G-O Progress Tracker for Both Players */}
      <div
        id="bingo-progress-tracker"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
      >
        {renderBingoLettersRow(
          `${t.myBoard} (${playerNames[primaryMark]})`,
          myProgress,
          'emerald',
          false
        )}
        {renderBingoLettersRow(
          `${t.opponentBoard} (${playerNames[secondaryMark]})`,
          oppProgress,
          'rose',
          hideOpponentProgress
        )}
      </div>

      {/* 2. Main Board Container */}
      <div
        className={`p-3.5 sm:p-4 rounded-3xl border space-y-3 transition-colors ${
          isDarkMode
            ? 'bg-slate-900/85 border-slate-800 shadow-2xl shadow-indigo-950/40'
            : 'bg-white border-slate-200/90 shadow-xl shadow-indigo-500/5'
        }`}
      >
        {/* Top Bar inside Board Card: Mode Badge + Last Called Badge + Caller Pad Toggle */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {t.myBoard}
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                smartPlay
                  ? isDarkMode
                    ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-400'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {smartPlay ? (
                <BrainCircuit className="w-3 h-3 text-indigo-500" />
              ) : (
                <Lock className="w-3 h-3 text-amber-500" />
              )}
              <span>{smartPlay ? t.smartPlayBadgeOn : t.smartPlayBadgeOff}</span>
            </span>

            {lastCalledNumber !== null && (
              <span
                id="last-called-badge"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-400/20 border border-amber-400/50 text-amber-800 dark:text-amber-300 font-mono text-xs font-black tabular-nums animate-pop-in"
              >
                {t.lastCalled}: {formatLocalNumber(lastCalledNumber, currentLanguage)}
                {lastCallerName ? ` (${lastCallerName})` : ''}
              </span>
            )}
          </div>

          {!isGameOver && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowCallerPad((prev) => !prev);
              }}
              className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                showCallerPad
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                  : isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{showCallerPad ? t.myBoard : t.callNumber}</span>
            </button>
          )}
        </div>

        {/* 2-Color Player Number & Green/Red Box Legend */}
        {renderColorLegend()}

        {/* Post-Win / Post-Draw: Reveal BOTH Players' Full 5x5 Boards Side-by-Side! */}
        {isGameOver ? (
          <div
            id="post-win-revealed-boards"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1"
          >
            <div className="space-y-1.5">
              <div className="text-xs font-extrabold text-center text-emerald-600 dark:text-emerald-400">
                {t.myBoard} ({playerNames[primaryMark]})
              </div>
              {renderFull5x5Grid(myGrid, myProgress, false, 'my-bingo-grid')}
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-extrabold text-center text-rose-600 dark:text-rose-400">
                {t.opponentBoard} ({playerNames[secondaryMark]})
              </div>
              {renderFull5x5Grid(oppGrid, oppProgress, false, 'opponent-revealed-grid')}
            </div>
          </div>
        ) : !showCallerPad ? (
          /* MY 5x5 BINGO GRID (Interactive: click any uncalled number to call it!) */
          renderFull5x5Grid(myGrid, myProgress, true, 'my-bingo-grid')
        ) : (
          /* 1-25 ORDERED CALLER BOARD PAD (#caller-board) */
          <div className="space-y-2">
            <p
              className={`text-[11px] text-center font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {t.callNumberHint}
            </p>
            <div
              id="caller-board"
              className="grid grid-cols-5 gap-1.5 sm:gap-2 aspect-square w-full max-w-[325px] mx-auto"
            >
              {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => {
                const isCalled = calledSet.has(num);
                const isInteractive = canMove && !isCalled;
                const caller = calledByMap.get(num);
                return (
                  <button
                    key={num}
                    type="button"
                    data-number={num}
                    disabled={!isInteractive}
                    onClick={() => handleSelectNumber(num)}
                    aria-label={`Call number ${num}`}
                    className={`caller-number rounded-xl sm:rounded-2xl font-mono font-extrabold text-sm sm:text-lg flex items-center justify-center transition-all border tabular-nums ${
                      isCalled
                        ? isDarkMode
                          ? `called bg-slate-800/50 border-slate-700 opacity-60 cursor-not-allowed line-through ${getCallerNumberColorClass(
                              caller
                            )}`
                          : `called bg-slate-100 border-slate-200 opacity-65 cursor-not-allowed line-through ${getCallerNumberColorClass(
                              caller
                            )}`
                        : isDarkMode
                        ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500 hover:text-white'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                    } ${isInteractive ? 'cursor-pointer active:scale-95' : ''}`}
                  >
                    {formatLocalNumber(num, currentLanguage)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Section of Board Card: Smart Play Mini-Map (without numbers) OR Secret Mode Notice */}
        {!isGameOver && (
          <div
            className={`pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isDarkMode ? 'border-slate-800/80' : 'border-slate-200/80'
            }`}
          >
            {smartPlay ? (
              /* Smart Play ON: Show Opponent 5x5 Mini-Map WITHOUT numbers (Green & Red boxes) */
              <div className="w-full flex items-center gap-3">
                <div
                  id="opponent-bingo-grid"
                  className={`grid grid-cols-5 gap-1 p-1.5 rounded-xl border shrink-0 ${
                    isDarkMode
                      ? 'bg-slate-950/60 border-slate-800'
                      : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  {oppGrid.map((num, idx) => {
                    const isCalled = calledSet.has(num);
                    const isInLine = oppCompletedCellSet.has(idx);
                    const isLast = lastCalledNumber === num;
                    return (
                      <div
                        key={idx}
                        className={`grid-cell w-5 h-5 sm:w-6 sm:h-6 rounded-[4px] flex items-center justify-center font-mono text-[9px] font-bold transition-colors ${
                          isCalled
                            ? isInLine
                              ? 'crossed-out bg-emerald-500 text-white'
                              : 'crossed-out bg-rose-500 text-white'
                            : isDarkMode
                            ? 'bg-slate-800/80'
                            : 'bg-white border border-slate-200'
                        } ${isLast ? 'ring-2 ring-amber-400' : ''}`}
                      />
                    );
                  })}
                </div>

                <div className="min-w-0 text-left space-y-0.5">
                  <div className="text-xs font-bold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                    <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {t.opponentBoard} ({playerNames[secondaryMark]})
                    </span>
                  </div>
                  <p
                    className={`text-[10px] leading-snug ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {t.hiddenOpponentBoardNote}
                  </p>
                  <div
                    className={`text-[10px] font-mono font-bold ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {t.numbersCalled}: {calledNumbers.length}/25
                  </div>
                </div>
              </div>
            ) : (
              /* Smart Play OFF (Default): Opponent Board & B-I-N-G-O are Secret until win */
              <div
                id="secret-mode-banner"
                className={`w-full p-2.5 rounded-2xl border flex items-center gap-2.5 ${
                  isDarkMode
                    ? 'bg-slate-950/50 border-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isDarkMode
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-semibold leading-snug">
                  {t.secretOpponentNote}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
