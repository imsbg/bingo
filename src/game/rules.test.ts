import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSequentialGrid,
  generateRandomGrid,
  isValidBingoGrid,
  evaluatePlayerBingo,
  applyNumberCall,
  getBestBotBingoCall,
  toOdiaNumber,
  generateRoomCode,
  isValidRoomCode,
  normalizeRoomCode,
} from './rules';

test('createSequentialGrid and generateRandomGrid produce valid 1-25 Bingo grids', () => {
  const seq = createSequentialGrid();
  assert.equal(seq.length, 25);
  assert.equal(isValidBingoGrid(seq), true);

  const rand = generateRandomGrid();
  assert.equal(rand.length, 25);
  assert.equal(isValidBingoGrid(rand), true);

  // Invalid grids fail validation
  const duplicate = [...seq];
  duplicate[0] = duplicate[1];
  assert.equal(isValidBingoGrid(duplicate), false);
  assert.equal(isValidBingoGrid([1, 2, 3]), false);
});

test('toOdiaNumber converts digits to Odia numerals accurately', () => {
  assert.equal(toOdiaNumber(1), '୧');
  assert.equal(toOdiaNumber(25), '୨୫');
  assert.equal(toOdiaNumber(10), '୧୦');
});

test('evaluatePlayerBingo counts completed rows, columns, and diagonals', () => {
  const grid = createSequentialGrid();
  // Row 0 is [1, 2, 3, 4, 5], Row 1 is [6, 7, 8, 9, 10]
  const p1 = evaluatePlayerBingo(grid, [1, 2, 3, 4, 5]);
  assert.equal(p1.completedLineCount, 1);
  assert.deepEqual(p1.letters, ['B']);

  const p2 = evaluatePlayerBingo(grid, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(p2.completedLineCount, 2);
  assert.deepEqual(p2.letters, ['B', 'I']);
});

test('applyNumberCall triggers win when 5 lines (B-I-N-G-O) are completed', () => {
  const gridX = createSequentialGrid();
  const gridO = createSequentialGrid();
  // Calling 1..20 completes 4 rows (Row 0, Row 1, Row 2, Row 3)
  const called = Array.from({ length: 20 }, (_, i) => i + 1);
  // Also call 21, 22, 23, 24 -> that completes Col 0, Col 1, Col 2, Col 3, Diag-Main, Diag-Anti!
  // Let's test calling 1..19 plus 21, 22, 23, 24 first:
  const initialCalled = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  const preEval = evaluatePlayerBingo(gridX, initialCalled);
  assert.equal(preEval.completedLineCount, 3); // Rows 0, 1, 2

  // Calling 20 completes Row 3 (4th line) and Col 4? No, 25 isn't called yet, Diag-Anti (5, 9, 13, 17, 21) needs 21.
  const step1 = applyNumberCall(
    { X: gridX, O: gridO },
    initialCalled,
    20,
    'X',
    'X',
    'playing'
  );
  assert.ok(step1);
  assert.equal(step1.newStatus, 'playing');
  assert.equal(step1.nextTurn, 'O');
  assert.equal(step1.progress.X.completedLineCount, 4);

  // Now O calls 21, which completes Col 0 (1,6,11,16,21) AND Diag-Anti (5,9,13,17,21) -> total 6 lines (>= 5)!
  const step2 = applyNumberCall(
    { X: gridX, O: gridO },
    step1.nextCalledNumbers,
    21,
    'O',
    'O',
    'playing'
  );
  assert.ok(step2);
  assert.equal(step2.newStatus, 'won');
  assert.equal(step2.winInfo?.winner, 'O');
  assert.deepEqual(step2.progress.O.letters, ['B', 'I', 'N', 'G', 'O']);
});

test('getBestBotBingoCall prioritizes completing a 4-of-5 line', () => {
  const grid = createSequentialGrid();
  // Row 0 has 1, 2, 3, 4 called; 5 will complete Row 0 immediately
  const move = getBestBotBingoCall(grid, [1, 2, 3, 4]);
  assert.equal(move, 5);
});

test('room code helpers validate and normalize SBXXXX codes', () => {
  const code = generateRoomCode();
  assert.equal(isValidRoomCode(code), true);
  assert.equal(normalizeRoomCode('4829'), 'SB4829');
  assert.equal(isValidRoomCode(normalizeRoomCode('4829')), true);
});

import { isGithubBlogView, getCanonicalUrlForView } from '../utils/urlLang';

test('isGithubBlogView and getCanonicalUrlForView route imsbg.github.io/bingo/ to blog and desibingo.netlify.app to game', () => {
  assert.equal(isGithubBlogView('imsbg.github.io', '/bingo/', ''), true);
  assert.equal(isGithubBlogView('imsbg.github.io', '/bingo', ''), true);
  assert.equal(isGithubBlogView('localhost', '/bingo/', ''), true);
  assert.equal(isGithubBlogView('localhost', '/', '?view=blog'), true);
  assert.equal(isGithubBlogView('desibingo.netlify.app', '/', ''), false);
  assert.equal(isGithubBlogView('desibingo.netlify.app', '/odia', ''), false);
  assert.equal(isGithubBlogView('localhost', '/', ''), false);
  assert.equal(getCanonicalUrlForView(true), 'https://imsbg.github.io/bingo/');
  assert.equal(getCanonicalUrlForView(false), 'https://desibingo.netlify.app/');
});

