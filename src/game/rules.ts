/**
 * Pure Game Rules and Logic for 1-25 Bingo (ବିଙ୍ଗୋ) & WebRTC Room Management
 * Author: Sandeep Biswal G
 */

export type PlayerMark = 'X' | 'O';
export type BingoGrid = number[]; // 25 numbers (1..25)
export type GameStatus = 'setting_up' | 'playing' | 'won' | 'draw';

export const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'] as const;
export type BingoLetter = (typeof BINGO_LETTERS)[number];

export interface BingoPattern {
  id: string;
  indices: [number, number, number, number, number];
  type: 'row' | 'col' | 'diag';
}

export const BINGO_WIN_PATTERNS: BingoPattern[] = [
  // 5 Rows
  { id: 'row-0', indices: [0, 1, 2, 3, 4], type: 'row' },
  { id: 'row-1', indices: [5, 6, 7, 8, 9], type: 'row' },
  { id: 'row-2', indices: [10, 11, 12, 13, 14], type: 'row' },
  { id: 'row-3', indices: [15, 16, 17, 18, 19], type: 'row' },
  { id: 'row-4', indices: [20, 21, 22, 23, 24], type: 'row' },
  // 5 Columns
  { id: 'col-0', indices: [0, 5, 10, 15, 20], type: 'col' },
  { id: 'col-1', indices: [1, 6, 11, 16, 21], type: 'col' },
  { id: 'col-2', indices: [2, 7, 12, 17, 22], type: 'col' },
  { id: 'col-3', indices: [3, 8, 13, 18, 23], type: 'col' },
  { id: 'col-4', indices: [4, 9, 14, 19, 24], type: 'col' },
  // 2 Diagonals
  { id: 'diag-main', indices: [0, 6, 12, 18, 24], type: 'diag' },
  { id: 'diag-anti', indices: [4, 8, 12, 16, 20], type: 'diag' },
];

export interface PlayerBingoProgress {
  letters: BingoLetter[];
  completedPatternIds: string[];
  completedLineCount: number;
  completedCellIndices: number[];
}

export interface WinInfo {
  winner: PlayerMark;
  winningNumber: number;
  linesX: number;
  linesO: number;
}

export interface MoveRecord {
  moveNumber: number;
  player: PlayerMark;
  playerName: string;
  calledNumber: number;
  elapsedSeconds: number;
  linesAfterMove: { X: number; O: number };
}

export interface RoundRecord {
  round: number;
  winner: PlayerMark | 'draw';
  winnerName: string;
  durationSeconds: number;
  moves: MoveRecord[];
  finalMove: MoveRecord | null;
  calledNumbers: number[];
  grids: { X: BingoGrid; O: BingoGrid };
  progress: { X: PlayerBingoProgress; O: PlayerBingoProgress };
  completedAt: number;
}

const ODIA_NUMERALS = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];

/**
 * Converts an integer or string of digits into Odia numerals (୦-୯)
 */
export function toOdiaNumber(num: number | string): string {
  return String(num)
    .split('')
    .map((ch) => {
      const d = parseInt(ch, 10);
      return !isNaN(d) && d >= 0 && d <= 9 ? ODIA_NUMERALS[d] : ch;
    })
    .join('');
}

/**
 * Formats a number according to the active language ('or' -> Odia digits, 'en' -> standard)
 */
export function formatLocalNumber(num: number | string, lang: 'en' | 'or'): string {
  return lang === 'or' ? toOdiaNumber(num) : String(num);
}

/**
 * Generates an ordered 1..25 Bingo grid
 */
export function createSequentialGrid(): BingoGrid {
  return Array.from({ length: 25 }, (_, i) => i + 1);
}

/**
 * Generates an empty 25-cell setup grid (filled with 0s representing empty slots)
 */
export function createEmptySetupGrid(): BingoGrid {
  return Array(25).fill(0);
}

/**
 * Generates a randomized 1..25 Bingo grid using Fisher-Yates shuffle
 */
export function generateRandomGrid(): BingoGrid {
  const numbers = createSequentialGrid();
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

/**
 * Validates that a 25-cell array contains all unique integers from 1 to 25
 */
export function isValidBingoGrid(grid: number[]): boolean {
  if (!Array.isArray(grid) || grid.length !== 25) return false;
  const seen = new Set<number>();
  for (const val of grid) {
    if (typeof val !== 'number' || !Number.isInteger(val) || val < 1 || val > 25 || seen.has(val)) {
      return false;
    }
    seen.add(val);
  }
  return seen.size === 25;
}

/**
 * Evaluates a player's 5x5 Bingo grid against the list of called numbers.
 * Returns claimed B-I-N-G-O letters, completed pattern IDs, line count, and highlighted cell indices.
 */
export function evaluatePlayerBingo(
  grid: BingoGrid,
  calledNumbers: number[]
): PlayerBingoProgress {
  if (!isValidBingoGrid(grid)) {
    return {
      letters: [],
      completedPatternIds: [],
      completedLineCount: 0,
      completedCellIndices: [],
    };
  }

  const calledSet = new Set(calledNumbers);
  const completedPatternIds: string[] = [];
  const completedCellsSet = new Set<number>();

  for (const pattern of BINGO_WIN_PATTERNS) {
    const isComplete = pattern.indices.every((idx) => calledSet.has(grid[idx]));
    if (isComplete) {
      completedPatternIds.push(pattern.id);
      pattern.indices.forEach((idx) => completedCellsSet.add(idx));
    }
  }

  const completedLineCount = completedPatternIds.length;
  const letters = BINGO_LETTERS.slice(0, Math.min(5, completedLineCount)) as BingoLetter[];

  return {
    letters,
    completedPatternIds,
    completedLineCount,
    completedCellIndices: Array.from(completedCellsSet),
  };
}

/**
 * Applies a number call (1..25) by the active player, updates progress for both players,
 * and determines if B-I-N-G-O (5 lines) has been achieved.
 * Preserves the original rule: if the turn caller reaches >= 5 lines, the turn caller wins immediately.
 */
export function applyNumberCall(
  grids: { X: BingoGrid; O: BingoGrid },
  calledNumbers: number[],
  numberToCall: number,
  caller: PlayerMark,
  currentTurn: PlayerMark,
  status: GameStatus
): {
  nextCalledNumbers: number[];
  nextTurn: PlayerMark;
  progress: { X: PlayerBingoProgress; O: PlayerBingoProgress };
  winInfo: WinInfo | null;
  newStatus: GameStatus;
} | null {
  if (status !== 'playing') return null;
  if (caller !== currentTurn) return null;
  if (!Number.isInteger(numberToCall) || numberToCall < 1 || numberToCall > 25) return null;
  if (calledNumbers.includes(numberToCall)) return null;
  if (!isValidBingoGrid(grids.X) || !isValidBingoGrid(grids.O)) return null;

  const nextCalledNumbers = [...calledNumbers, numberToCall];
  const progressX = evaluatePlayerBingo(grids.X, nextCalledNumbers);
  const progressO = evaluatePlayerBingo(grids.O, nextCalledNumbers);

  const callerLines = caller === 'X' ? progressX.completedLineCount : progressO.completedLineCount;
  const opponentMark: PlayerMark = caller === 'X' ? 'O' : 'X';
  const opponentLines =
    opponentMark === 'X' ? progressX.completedLineCount : progressO.completedLineCount;

  // Caller priority on simultaneous 5-line completion (matches original Odia Bingo logic)
  if (callerLines >= 5) {
    return {
      nextCalledNumbers,
      nextTurn: currentTurn,
      progress: { X: progressX, O: progressO },
      winInfo: {
        winner: caller,
        winningNumber: numberToCall,
        linesX: progressX.completedLineCount,
        linesO: progressO.completedLineCount,
      },
      newStatus: 'won',
    };
  }

  if (opponentLines >= 5) {
    return {
      nextCalledNumbers,
      nextTurn: currentTurn,
      progress: { X: progressX, O: progressO },
      winInfo: {
        winner: opponentMark,
        winningNumber: numberToCall,
        linesX: progressX.completedLineCount,
        linesO: progressO.completedLineCount,
      },
      newStatus: 'won',
    };
  }

  return {
    nextCalledNumbers,
    nextTurn: opponentMark,
    progress: { X: progressX, O: progressO },
    winInfo: null,
    newStatus: 'playing',
  };
}

/**
 * Smart AI Bot move selector for 1-25 Bingo.
 * Chooses the uncalled number that maximizes line completion and intersections on the bot's grid.
 */
export function getBestBotBingoCall(botGrid: BingoGrid, calledNumbers: number[]): number {
  const calledSet = new Set(calledNumbers);
  const availableNumbers: number[] = [];
  for (let n = 1; n <= 25; n++) {
    if (!calledSet.has(n)) availableNumbers.push(n);
  }
  if (availableNumbers.length === 0) return -1;
  if (!isValidBingoGrid(botGrid)) return availableNumbers[0];

  // If center cell (index 12) is not called yet, high strategic value (belongs to 4 patterns: row-2, col-2, diag-main, diag-anti)
  let bestNum = availableNumbers[0];
  let bestScore = -Infinity;

  for (const candidate of availableNumbers) {
    const cellIdx = botGrid.indexOf(candidate);
    if (cellIdx === -1) continue;

    let score = 0;
    // Evaluate all patterns containing this cell
    for (const pattern of BINGO_WIN_PATTERNS) {
      if (!pattern.indices.includes(cellIdx)) continue;

      let alreadyCalledInLine = 0;
      for (const idx of pattern.indices) {
        if (calledSet.has(botGrid[idx])) {
          alreadyCalledInLine++;
        }
      }

      // Exponentially reward lines close to completion
      if (alreadyCalledInLine === 4) {
        score += 1000; // Immediately completes a line!
      } else if (alreadyCalledInLine === 3) {
        score += 120;
      } else if (alreadyCalledInLine === 2) {
        score += 30;
      } else if (alreadyCalledInLine === 1) {
        score += 8;
      } else {
        score += 2;
      }
    }

    // Center & diagonal intersections bonus
    if (cellIdx === 12) score += 15;
    else if (cellIdx % 6 === 0 || cellIdx % 4 === 0) score += 6;

    if (score > bestScore) {
      bestScore = score;
      bestNum = candidate;
    }
  }

  return bestNum;
}

/**
 * Generates an SBXXXX room code (e.g. SB4829 or SB7A9K)
 */
export function generateRoomCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    suffix += chars[randomIndex];
  }
  return `SB${suffix}`;
}

/**
 * Validates room code format (SBXXXX - case insensitive, supports digits and letters)
 */
export function isValidRoomCode(code: string): boolean {
  if (!code) return false;
  const clean = code.trim().toUpperCase();
  return /^SB[A-Z0-9]{4}$/.test(clean);
}

/**
 * Normalizes room code to uppercase SBXXXX (also prepends SB if user typed 4 digits/chars)
 */
export function normalizeRoomCode(code: string): string {
  const trimmed = code.trim().toUpperCase();
  if (/^[A-Z0-9]{4}$/.test(trimmed)) {
    return `SB${trimmed}`;
  }
  return trimmed;
}

/**
 * Formats seconds into MM:SS
 */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats a 0..24 cell index into 1-indexed Row/Col
 */
export function formatCellPosition(cellIndex: number): { row: number; col: number; label: string } {
  const row = Math.floor(cellIndex / 5) + 1;
  const col = (cellIndex % 5) + 1;
  return { row, col, label: `R${row}C${col}` };
}
