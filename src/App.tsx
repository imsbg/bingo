/**
 * ବିଙ୍ଗୋ | Bingo (1–25 Online Multiplayer & Solo Game)
 * Author: Sandeep Biswal G
 * Powered by WebRTC Peer-to-Peer Rooms (SBXXXX), Live Spectators & Emoji Reactions
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Share2,
  Eye,
  Users,
  Sparkles,
  Copy,
  Handshake,
  Play,
  Bot,
  Smartphone,
  Swords,
  Check,
  LogOut,
  Radio,
  Clock,
  AlertTriangle,
} from 'lucide-react';

import { translations, Language } from './utils/translations';
import {
  detectLanguageFromUrl,
  detectPageFromUrl,
  getPathWithLang,
  buildUrlWithLang,
  isGithubBlogView,
  getCanonicalUrlForView,
  AppPage,
} from './utils/urlLang';
import { sounds } from './utils/sound';
import { GameBoard } from './components/GameBoard';
import { BingoSetupCard } from './components/BingoSetupCard';
import { RoomHeader } from './components/RoomHeader';
import { RoomLobby } from './components/RoomLobby';
import { BingoBlogPage } from './components/BingoBlogPage';
import { SettingsModal } from './components/SettingsModal';
import { PromoBanner } from './components/PromoBanner';
import { QrModal } from './components/QrModal';
import { JoinInviteModal } from './components/JoinInviteModal';
import { ShareFriendModal } from './components/ShareFriendModal';
import { TermsPage } from './components/TermsPage';
import { HowToPlayModal } from './components/HowToPlayModal';
import {
  ReactionFloater,
  BoardReactionOverlay,
  FloatingItem,
} from './components/ReactionFloater';
import { GameDataFooter } from './components/GameDataFooter';
import {
  WebRTCNetworkRoom,
  GameState,
  UserRole,
  createInitialGameState,
} from './network/webrtc';
import { liveMatchRegistry } from './network/liveLobby';
import {
  BingoGrid,
  PlayerMark,
  BINGO_LETTERS,
  isValidRoomCode,
  normalizeRoomCode,
  generateRandomGrid,
  evaluatePlayerBingo,
  applyNumberCall,
  getBestBotBingoCall,
  formatDuration,
  formatLocalNumber,
  MoveRecord,
  RoundRecord,
} from './game/rules';

export type GameMode = 'multiplayer' | 'solo-pass' | 'solo-bot';

export default function App() {
  // Localization & Theme Preferences (Default language: Odia 'or', synced with /odia and /en in URL)
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    try {
      const urlLang = detectLanguageFromUrl(window.location.pathname, window.location.search);
      if (urlLang) {
        localStorage.setItem('sb_bingo_lang', urlLang);
        return urlLang;
      }
      const stored = localStorage.getItem('sb_bingo_lang') || localStorage.getItem('bingoLang');
      return (stored === 'en' ? 'en' : 'or') as Language;
    } catch {
      return 'or';
    }
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('sb_bingo_theme_v2');
      return stored ? stored === 'dark' : false;
    } catch {
      return false;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sounds.isEnabled());

  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('sb_bingo_player_name') ||
        localStorage.getItem('bingoPlayerName') ||
        `sb-user${Math.floor(100 + Math.random() * 900)}`
      );
    } catch {
      return 'Player 1';
    }
  });

  // Current Route Page: 'home' (/odia or /en) or 'terms' (/odia/terms or /en/terms)
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    try {
      return detectPageFromUrl(window.location.pathname);
    } catch {
      return 'home';
    }
  });

  // Whether the user is visiting the GitHub Pages SEO Blog (http://imsbg.github.io/bingo/) vs DesiBingo Game UI
  const [isBlogView, setIsBlogView] = useState<boolean>(() => {
    try {
      return isGithubBlogView(
        window.location.hostname,
        window.location.pathname,
        window.location.search
      );
    } catch {
      return false;
    }
  });

  // Game Mode State: null = Lobby, 'multiplayer', 'solo-pass', 'solo-bot'
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  // WebRTC Multiplayer State
  const [currentRoomCode, setCurrentRoomCode] = useState<string | null>(null);
  const [myRole, setMyRole] = useState<UserRole>('host');
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'connecting' | 'disconnected'
  >('disconnected');
  const [hostLeftRoom, setHostLeftRoom] = useState<boolean>(false);

  // Shared Link Invite Modal State
  const [inviteRoomCode, setInviteRoomCode] = useState<string | null>(null);

  // Core Game State (shared across Multiplayer and Solo)
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState('host', 'Player 1', 'p1', true, false)
  );

  // Live Timers (in seconds)
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);
  const [currentRoundSeconds, setCurrentRoundSeconds] = useState(0);

  // Modals & Floating Reactions
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isShareFriendOpen, setIsShareFriendOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeReactions, setActiveReactions] = useState<FloatingItem[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const networkRoomRef = useRef<WebRTCNetworkRoom | null>(null);
  const langRef = useRef<Language>(currentLanguage);
  langRef.current = currentLanguage;
  const prevCalledRef = useRef<{ round: number; count: number }>({ round: 1, count: 0 });
  const t = translations[currentLanguage];

  // Sync document.body.dataset.state for testability & game state inspection
  useEffect(() => {
    if (!gameMode) {
      document.body.dataset.state = 'title';
    } else if (gameState.status === 'won' || gameState.status === 'draw') {
      document.body.dataset.state = 'gameover';
    } else {
      document.body.dataset.state = 'playing';
    }
  }, [gameMode, gameState.status]);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('sb_bingo_theme_v2', isDarkMode ? 'dark' : 'light');
    } catch {}
  }, [isDarkMode]);

  // Live 1-second timer for total match time and current round time
  useEffect(() => {
    if (!gameMode) {
      setTotalElapsedSeconds(0);
      setCurrentRoundSeconds(0);
      return;
    }

    const updateClocks = () => {
      const now = Date.now();
      setTotalElapsedSeconds(Math.max(0, Math.floor((now - gameState.matchStartTime) / 1000)));
      if (gameState.status === 'playing') {
        setCurrentRoundSeconds(Math.max(0, Math.floor((now - gameState.roundStartTime) / 1000)));
      } else if (gameState.status === 'setting_up') {
        setCurrentRoundSeconds(0);
      } else {
        const completedRound = gameState.roundHistory.find((r) => r.round === gameState.round);
        if (completedRound) {
          setCurrentRoundSeconds(completedRound.durationSeconds);
        }
      }
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, [
    gameMode,
    gameState.matchStartTime,
    gameState.roundStartTime,
    gameState.status,
    gameState.round,
    gameState.roundHistory,
  ]);

  // Keep HTML lang, canonical URL, and document.title in sync for Google Search Console
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    try {
      const canonicalHref = getCanonicalUrlForView(isBlogView);
      const canonicalEl = document.getElementById('canonical-link');
      if (canonicalEl) {
        canonicalEl.setAttribute('href', canonicalHref);
      }

      if (!isBlogView) {
        const cleanPath = window.location.pathname.replace(/\/+$/, '');
        const isRootHome = (cleanPath === '' || cleanPath === '/') && currentPage === 'home';

        if (!isRootHome) {
          const targetPath = getPathWithLang(window.location.pathname, currentLanguage, currentPage);
          if (window.location.pathname !== targetPath) {
            const nextUrl = buildUrlWithLang(
              window.location.pathname,
              currentPage === 'terms' ? '' : window.location.search,
              window.location.hash,
              currentLanguage,
              currentPage
            );
            window.history.replaceState({}, '', nextUrl);
          }
        }
      }

      document.title = 'Bingo Game - Popular Indian 1 to 25 Bingo';
    } catch {}
  }, [currentLanguage, currentPage, isBlogView]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlLang = detectLanguageFromUrl(window.location.pathname, window.location.search);
      const urlPage = detectPageFromUrl(window.location.pathname);
      setCurrentPage(urlPage);
      setIsBlogView(
        isGithubBlogView(
          window.location.hostname,
          window.location.pathname,
          window.location.search
        )
      );
      if (urlLang) {
        setCurrentLanguage(urlLang);
        try {
          localStorage.setItem('sb_bingo_lang', urlLang);
        } catch {}
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Prevent accidental page refresh during an active match
  useEffect(() => {
    if (!gameMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isF5 = e.key === 'F5';
      const isCtrlOrCmdR = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r';
      if (isF5 || isCtrlOrCmdR) {
        e.preventDefault();
        e.stopPropagation();
        const msg = translations[langRef.current].refreshDisabledNotice;
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3200);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const msg = translations[langRef.current].refreshDisabledNotice;
      e.preventDefault();
      e.returnValue = msg;
      return msg;
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameMode]);

  const handleSelectLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('sb_bingo_lang', lang);
      localStorage.setItem('bingoLang', lang);
      if (!isBlogView) {
        const nextUrl = buildUrlWithLang(
          window.location.pathname,
          currentPage === 'terms' ? '' : window.location.search,
          window.location.hash,
          lang,
          currentPage
        );
        if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) {
          window.history.pushState({}, '', nextUrl);
        }
      }
    } catch {}
  };

  const handleNavigatePage = (page: AppPage) => {
    setCurrentPage(page);
    try {
      const nextUrl = buildUrlWithLang(
        window.location.pathname,
        page === 'terms' ? '' : window.location.search,
        '',
        currentLanguage,
        page
      );
      if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
        window.history.pushState({}, '', nextUrl);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
  };

  const handleUpdatePlayerName = (name: string) => {
    setPlayerName(name);
    try {
      localStorage.setItem('sb_bingo_player_name', name);
      localStorage.setItem('bingoPlayerName', name);
    } catch {}
    if (networkRoomRef.current) {
      networkRoomRef.current.myName = name;
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Start Solo vs Computer Game
  const handleStartSolo = useCallback(
    (mode: 'pass' | 'bot', smartPlay: boolean = false, skipSetup: boolean = false) => {
      networkRoomRef.current?.destroy();
      networkRoomRef.current = null;
      setCurrentPage('home');
      setHostLeftRoom(false);
      setCurrentRoomCode(null);
      setGameMode(mode === 'pass' ? 'solo-pass' : 'solo-bot');
      setMyRole('host');

      const p2DisplayName = translations[langRef.current].computer;

      const now = Date.now();
      const gridX = generateRandomGrid();
      const gridO = generateRandomGrid();

      prevCalledRef.current = { round: 1, count: 0 };

      setGameState({
        grids: { X: gridX, O: gridO },
        gridReady: {
          X: skipSetup,
          O: true,
        },
        calledNumbers: [],
        progress: {
          X: evaluatePlayerBingo(gridX, []),
          O: evaluatePlayerBingo(gridO, []),
        },
        currentTurn: 'X',
        status: skipSetup ? 'playing' : 'setting_up',
        winInfo: null,
        round: 1,
        scores: { X: 0, O: 0, ties: 0 },
        players: {
          X: { name: playerName.trim() || 'Player 1', role: 'host', mark: 'X', id: 'p1' },
          O: { name: p2DisplayName, role: 'guest', mark: 'O', id: 'p2' },
        },
        spectators: [],
        rematchRequestedBy: null,
        matchStartTime: now,
        roundStartTime: now,
        currentRoundMoves: [],
        roundHistory: [],
        isPublicLive: false,
        smartPlay,
      });
    },
    [playerName]
  );

  // Check URL query parameters for shared room links or ?autostart=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    const autostart = params.get('autostart');

    if (roomParam) {
      const normalized = normalizeRoomCode(roomParam);
      if (isValidRoomCode(normalized)) {
        setInviteRoomCode(normalized);
      }
    } else if (autostart === '1') {
      handleStartSolo('bot', false, true);
    }
  }, [handleStartSolo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      networkRoomRef.current?.destroy();
    };
  }, []);

  // Speak called number out loud in Odia ('or') or English ('en') whenever a new number is called
  useEffect(() => {
    if (!gameMode) {
      prevCalledRef.current = { round: 1, count: 0 };
      return;
    }
    if (gameState.round !== prevCalledRef.current.round) {
      prevCalledRef.current = {
        round: gameState.round,
        count: gameState.calledNumbers.length,
      };
      return;
    }
    if (gameState.calledNumbers.length > prevCalledRef.current.count) {
      const latestNum =
        gameState.calledNumbers[gameState.calledNumbers.length - 1];
      prevCalledRef.current.count = gameState.calledNumbers.length;
      if (latestNum) {
        sounds.speakNumber(latestNum, langRef.current);
      }
    }
  }, [gameMode, gameState.round, gameState.calledNumbers]);

  // Win and Draw audio/confetti triggers
  useEffect(() => {
    if (gameState.status === 'won') {
      sounds.playWin();
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#10B981', '#6366F1', '#F43F5E', '#F59E0B'],
      });
    } else if (gameState.status === 'draw') {
      sounds.playDraw();
    }
  }, [gameState.status, gameState.winInfo]);

  // Execute local number call (for Solo modes)
  const executeLocalNumberCall = useCallback(
    (numberToCall: number, caller: PlayerMark) => {
      setGameState((prev) => {
        const result = applyNumberCall(
          prev.grids,
          prev.calledNumbers,
          numberToCall,
          caller,
          prev.currentTurn,
          prev.status
        );
        if (!result) return prev;

        // Play chime if either player gained a new B-I-N-G-O line
        if (
          result.progress.X.completedLineCount > prev.progress.X.completedLineCount ||
          result.progress.O.completedLineCount > prev.progress.O.completedLineCount
        ) {
          sounds.playLineComplete();
        }

        const now = Date.now();
        const elapsedSeconds = Math.max(0, Math.round((now - prev.roundStartTime) / 1000));
        const movePlayerName =
          caller === 'X'
            ? prev.players.X?.name || 'Player 1'
            : prev.players.O?.name || 'Player 2';

        const moveRecord: MoveRecord = {
          moveNumber: prev.currentRoundMoves.length + 1,
          player: caller,
          playerName: movePlayerName,
          calledNumber: numberToCall,
          elapsedSeconds,
          linesAfterMove: {
            X: result.progress.X.completedLineCount,
            O: result.progress.O.completedLineCount,
          },
        };

        const nextMoves = [...prev.currentRoundMoves, moveRecord];
        const nextScores = { ...prev.scores };
        let nextHistory = prev.roundHistory;

        if (result.newStatus === 'won' && result.winInfo) {
          if (result.winInfo.winner === 'X') nextScores.X += 1;
          else nextScores.O += 1;

          const winnerMark = result.winInfo.winner;
          const winnerName =
            winnerMark === 'X'
              ? prev.players.X?.name || 'Player 1'
              : prev.players.O?.name || 'Player 2';

          const roundRec: RoundRecord = {
            round: prev.round,
            winner: winnerMark,
            winnerName,
            durationSeconds: Math.max(1, elapsedSeconds),
            moves: nextMoves,
            finalMove: moveRecord,
            calledNumbers: [...result.nextCalledNumbers],
            grids: {
              X: [...prev.grids.X],
              O: [...prev.grids.O],
            },
            progress: {
              X: { ...result.progress.X },
              O: { ...result.progress.O },
            },
            completedAt: now,
          };
          if (!prev.roundHistory.some((r) => r.round === prev.round)) {
            nextHistory = [...prev.roundHistory, roundRec];
          }
        }

        return {
          ...prev,
          calledNumbers: result.nextCalledNumbers,
          currentTurn: result.nextTurn,
          status: result.newStatus,
          winInfo: result.winInfo,
          progress: result.progress,
          scores: nextScores,
          currentRoundMoves: nextMoves,
          roundHistory: nextHistory,
        };
      });
    },
    []
  );

  // Solo Bot automatic number call handler
  useEffect(() => {
    if (
      gameMode === 'solo-bot' &&
      gameState.status === 'playing' &&
      gameState.currentTurn === 'O'
    ) {
      const timer = setTimeout(() => {
        const botCall = getBestBotBingoCall(gameState.grids.O, gameState.calledNumbers);
        if (botCall !== -1) {
          sounds.playMove('O');
          executeLocalNumberCall(botCall, 'O');
        }
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [
    gameMode,
    gameState.status,
    gameState.currentTurn,
    gameState.grids.O,
    gameState.calledNumbers,
    executeLocalNumberCall,
  ]);

  // Create Multiplayer Room (Host)
  const createRoom = useCallback(
    (code: string, isPublicLive: boolean = true, smartPlay: boolean = false) => {
      networkRoomRef.current?.destroy();
      setCurrentPage('home');
      setHostLeftRoom(false);
      setGameMode('multiplayer');
      setCurrentRoomCode(code);
      setMyRole('host');
      prevCalledRef.current = { round: 1, count: 0 };

      const room = new WebRTCNetworkRoom(
        code,
        'host',
        playerName,
        {
          onStateChange: (newState) => setGameState({ ...newState }),
          onRoleChange: (newRole) => setMyRole(newRole),
          onConnectionStatusChange: (status) => setConnectionStatus(status),
          onReactionReceived: (emoji, sender) => triggerFloatingReaction(emoji, sender),
          onNotification: (msg) => showToast(msg),
        },
        isPublicLive,
        smartPlay
      );

      networkRoomRef.current = room;
      setGameState(room.getState());
    },
    [playerName]
  );

  // Join Multiplayer Room (Guest or Spectator)
  const joinRoom = useCallback(
    (code: string, role: 'guest' | 'spectator', customName?: string) => {
      networkRoomRef.current?.destroy();
      const finalName =
        (customName ?? playerName).trim() || (role === 'guest' ? 'Player 2' : 'Spectator');
      if (customName) {
        handleUpdatePlayerName(finalName);
      }
      setCurrentPage('home');
      setHostLeftRoom(false);
      setGameMode('multiplayer');
      setCurrentRoomCode(code);
      setMyRole(role);

      const room = new WebRTCNetworkRoom(code, role, finalName, {
        onStateChange: (newState) => setGameState({ ...newState }),
        onRoleChange: (newRole) => setMyRole(newRole),
        onConnectionStatusChange: (status) => setConnectionStatus(status),
        onReactionReceived: (emoji, sender) => triggerFloatingReaction(emoji, sender),
        onNotification: (msg) => showToast(msg),
        onHostLeft: () => {
          setHostLeftRoom(true);
          sounds.playDraw();
          showToast(translations[langRef.current].hostLeftNotice);
        },
      });

      networkRoomRef.current = room;
      setGameState(room.getState());
    },
    [playerName]
  );

  // Request confirmation before leaving active game
  const handleRequestLeaveGame = () => {
    sounds.playClick();
    setIsLeaveConfirmOpen(true);
  };

  // Leave active game & return to lobby
  const handleLeaveGame = () => {
    setIsLeaveConfirmOpen(false);
    if (currentRoomCode && myRole === 'host') {
      liveMatchRegistry.removeRoom(currentRoomCode);
    }
    networkRoomRef.current?.destroy();
    networkRoomRef.current = null;
    setCurrentRoomCode(null);
    setGameMode(null);
    setHostLeftRoom(false);
    setConnectionStatus('disconnected');
    const cleanUrl = getPathWithLang(window.location.pathname, currentLanguage, 'home');
    window.history.replaceState({}, '', cleanUrl);
  };

  // Confirm 5x5 Setup Grid
  const handleConfirmSetupGrid = (grid: BingoGrid) => {
    if (gameMode === 'multiplayer') {
      const mark: PlayerMark | null =
        myRole === 'host' ? 'X' : myRole === 'guest' ? 'O' : null;
      if (!mark) return;
      networkRoomRef.current?.submitGrid(mark, grid);
    } else if (gameMode === 'solo-bot') {
      setGameState((prev) => {
        const nextGrids = { ...prev.grids, X: [...grid] };
        return {
          ...prev,
          grids: nextGrids,
          gridReady: { X: true, O: true },
          status: 'playing',
          roundStartTime: Date.now(),
          progress: {
            X: evaluatePlayerBingo(nextGrids.X, []),
            O: evaluatePlayerBingo(nextGrids.O, []),
          },
        };
      });
    } else if (gameMode === 'solo-pass') {
      setGameState((prev) => {
        if (!prev.gridReady.X) {
          // Player 1 finished setup -> now let Player 2 set up
          const nextGrids = { ...prev.grids, X: [...grid] };
          return {
            ...prev,
            grids: nextGrids,
            gridReady: { X: true, O: false },
          };
        } else {
          // Player 2 finished setup -> start playing!
          const nextGrids = { ...prev.grids, O: [...grid] };
          return {
            ...prev,
            grids: nextGrids,
            gridReady: { X: true, O: true },
            status: 'playing',
            roundStartTime: Date.now(),
            progress: {
              X: evaluatePlayerBingo(nextGrids.X, []),
              O: evaluatePlayerBingo(nextGrids.O, []),
            },
          };
        }
      });
    }
  };

  // Handle calling a number (1..25)
  const handleCallNumber = (num: number) => {
    if (gameMode === 'multiplayer') {
      const mark: PlayerMark | null =
        myRole === 'host' ? 'X' : myRole === 'guest' ? 'O' : null;
      if (!mark) return;
      networkRoomRef.current?.callNumber(num, mark);
    } else if (gameMode === 'solo-pass') {
      executeLocalNumberCall(num, gameState.currentTurn);
    } else if (gameMode === 'solo-bot') {
      if (gameState.currentTurn === 'X' && gameState.status === 'playing') {
        executeLocalNumberCall(num, 'X');
      }
    }
  };

  // Rematch / Replay
  const handleReplay = () => {
    if (gameState.status === 'playing' || gameState.status === 'setting_up') return;
    sounds.playRematch();
    if (gameMode === 'multiplayer') {
      const mark: PlayerMark = myRole === 'host' ? 'X' : myRole === 'guest' ? 'O' : 'X';
      networkRoomRef.current?.requestRematch(mark);
    } else {
      setGameState((prev) => {
        if (prev.status === 'playing' || prev.status === 'setting_up') return prev;
        const nextRound = prev.round + 1;
        const nextGridX = generateRandomGrid();
        const nextGridO = generateRandomGrid();
        return {
          ...prev,
          grids: { X: nextGridX, O: nextGridO },
          gridReady: {
            X: false,
            O: gameMode === 'solo-bot',
          },
          calledNumbers: [],
          progress: {
            X: evaluatePlayerBingo(nextGridX, []),
            O: evaluatePlayerBingo(nextGridO, []),
          },
          status: 'setting_up',
          winInfo: null,
          round: nextRound,
          roundStartTime: Date.now(),
          currentRoundMoves: [],
          currentTurn: nextRound % 2 === 1 ? 'X' : 'O',
        };
      });
    }
  };

  const handleAcceptRematch = () => {
    if (gameState.status === 'playing' || gameState.status === 'setting_up') return;
    sounds.playRematch();
    networkRoomRef.current?.acceptRematch();
  };

  // Copy share invite link
  const handleCopyLink = () => {
    if (!currentRoomCode) return;
    const langPath = getPathWithLang(window.location.pathname, currentLanguage);
    const url = `${window.location.origin}${langPath}?room=${currentRoomCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      sounds.playClick();
      showToast(t.linkCopied);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  // Floating cheering reactions
  const triggerFloatingReaction = (emoji: string, sender: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const leftPercent = 20 + Math.random() * 60;
    setActiveReactions((prev) => [...prev, { id, emoji, sender, leftPercent }]);
    setTimeout(() => {
      setActiveReactions((prev) => prev.filter((item) => item.id !== id));
    }, 1800);
  };

  const handleSendReaction = (emoji: string) => {
    if (gameMode === 'multiplayer') {
      networkRoomRef.current?.sendReaction(emoji);
    } else {
      triggerFloatingReaction(emoji, playerName);
    }
  };

  // Permissions & turn logic
  const myMark: PlayerMark | null =
    gameMode === 'solo-pass'
      ? gameState.status === 'setting_up'
        ? !gameState.gridReady.X
          ? 'X'
          : 'O'
        : gameState.currentTurn
      : gameMode === 'solo-bot'
      ? 'X'
      : myRole === 'host'
      ? 'X'
      : myRole === 'guest'
      ? 'O'
      : null;

  const isMyTurn =
    gameState.status === 'playing' &&
    (gameMode === 'solo-pass'
      ? true
      : gameMode === 'solo-bot'
      ? gameState.currentTurn === 'X'
      : myRole !== 'spectator' && gameState.currentTurn === myMark);

  const canMove = isMyTurn;

  const playerNames = {
    X: gameState.players.X?.name || playerName,
    O:
      gameState.players.O?.name ||
      (gameMode === 'solo-bot'
        ? t.computer
        : gameMode === 'solo-pass'
        ? 'Player 2'
        : t.waitingForOpponent),
  };

  const setupMark: PlayerMark = myMark || 'X';
  const opponentMark: PlayerMark = setupMark === 'X' ? 'O' : 'X';

  // If the user visits http://imsbg.github.io/bingo/ (or /bingo/ or ?view=blog), render the SEO Blog Page
  if (isBlogView && !gameMode) {
    return (
      <BingoBlogPage
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onSwitchToGameView={() => setIsBlogView(false)}
        t={t}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-indigo-500 selection:text-white pb-24 sm:pb-20 ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-gradient-to-br from-slate-50 via-indigo-50/40 to-teal-50/30 text-slate-900'
      }`}
    >
      {/* Header */}
      <RoomHeader
        roomCode={currentRoomCode}
        connectionStatus={connectionStatus}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        currentLanguage={currentLanguage}
        onToggleLanguage={() => handleSelectLanguage(currentLanguage === 'en' ? 'or' : 'en')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenQr={() => setIsQrOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenShareFriend={() => setIsShareFriendOpen(true)}
        onOpenTerms={() => handleNavigatePage('terms')}
        onLogoClick={() => {
          if (currentPage === 'terms') {
            handleNavigatePage('home');
          }
        }}
        onLeaveRoom={gameMode !== null ? handleRequestLeaveGame : undefined}
        t={t}
      />

      {/* Main Container */}
      <main
        className={`flex-1 flex flex-col ${
          currentPage === 'terms' || gameMode !== null ? 'justify-start pt-3 sm:pt-5' : 'justify-center'
        } items-center px-4 sm:px-6 py-4 w-full max-w-6xl mx-auto`}
      >
        {currentPage === 'terms' ? (
          <TermsPage
            t={t}
            isDarkMode={isDarkMode}
            onBackToGame={() => handleNavigatePage('home')}
          />
        ) : !gameMode ? (
          /* Lobby: Choose Solo vs Computer, Create/Join Room, or See Live Matches */
          <RoomLobby
            playerName={playerName}
            onUpdatePlayerName={handleUpdatePlayerName}
            onCreateRoom={createRoom}
            onJoinRoom={(code, role) => joinRoom(code, role)}
            onStartSolo={(mode, smartPlayFlag) => handleStartSolo(mode, Boolean(smartPlayFlag), false)}
            onOpenShareFriend={() => setIsShareFriendOpen(true)}
            onOpenTerms={() => handleNavigatePage('terms')}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            t={t}
            isDarkMode={isDarkMode}
          />
        ) : (
          /* Active Game View:
             - For Players: Two-sided Desktop Layout (Left: Board, Right: Scoreboard + Send Reaction + Controls)
             - For Spectators: Side-by-Side Boards on Top (Left: Player 1, Right: Player 2) + All Details Below */
          <div className="w-full animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
              {/* BOARD / SETUP SECTION:
                  - Floating reactions overlay renders right over the Game Board container
                  - Spectators get side-by-side boards with a vertical right-side Reaction Panel */}
              <div
                id="game-board-column"
                className={`${
                  myRole === 'spectator'
                    ? 'order-1 lg:col-span-12'
                    : 'order-2 lg:order-1 lg:col-span-7'
                } relative flex flex-col items-center justify-center space-y-3.5 w-full`}
              >
                <BoardReactionOverlay activeReactions={activeReactions} />

                {gameState.status === 'setting_up' && myRole !== 'spectator' ? (
                  <BingoSetupCard
                    key={`${gameState.round}-${setupMark}`}
                    initialGrid={gameState.grids[setupMark]}
                    isReady={gameState.gridReady[setupMark]}
                    opponentReady={gameState.gridReady[opponentMark]}
                    opponentJoined={Boolean(gameState.players.O)}
                    myPlayerLabel={playerNames[setupMark]}
                    opponentPlayerLabel={playerNames[opponentMark]}
                    isSpectator={false}
                    onConfirmGrid={handleConfirmSetupGrid}
                    currentLanguage={currentLanguage}
                    isDarkMode={isDarkMode}
                    t={t}
                  />
                ) : myRole === 'spectator' ? (
                  <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <GameBoard
                        grids={gameState.grids}
                        calledNumbers={gameState.calledNumbers}
                        currentRoundMoves={gameState.currentRoundMoves}
                        progress={gameState.progress}
                        currentTurn={gameState.currentTurn}
                        myMark={myMark}
                        isMyTurn={isMyTurn}
                        canMove={canMove}
                        status={gameState.status}
                        smartPlay={Boolean(gameState.smartPlay)}
                        playerNames={playerNames}
                        onCallNumber={handleCallNumber}
                        currentLanguage={currentLanguage}
                        isDarkMode={isDarkMode}
                        t={t}
                      />
                    </div>

                    {/* Right-Side Vertical Reaction Panel for Spectators */}
                    <div className="flex justify-center lg:sticky lg:top-20 self-center lg:self-start">
                      <ReactionFloater
                        onSendReaction={handleSendReaction}
                        vertical={true}
                        t={t}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  </div>
                ) : (
                  <GameBoard
                    grids={gameState.grids}
                    calledNumbers={gameState.calledNumbers}
                    currentRoundMoves={gameState.currentRoundMoves}
                    progress={gameState.progress}
                    currentTurn={gameState.currentTurn}
                    myMark={myMark}
                    isMyTurn={isMyTurn}
                    canMove={canMove}
                    status={gameState.status}
                    smartPlay={Boolean(gameState.smartPlay)}
                    playerNames={playerNames}
                    onCallNumber={handleCallNumber}
                    currentLanguage={currentLanguage}
                    isDarkMode={isDarkMode}
                    t={t}
                  />
                )}
              </div>

              {/* DETAILS, SCOREBOARD & SEND REACTION SECTION:
                  - For Players: Right side column (lg:col-span-5)
                  - For Spectators: Full width underneath the side-by-side boards (order-2 lg:col-span-12) */}
              <div
                className={`${
                  myRole === 'spectator'
                    ? 'order-2 lg:col-span-12 max-w-3xl mx-auto'
                    : 'order-1 lg:order-2 lg:col-span-5'
                } space-y-3.5 w-full`}
              >
                {/* Room Creator Left Notification Banner */}
                {gameMode === 'multiplayer' && hostLeftRoom && (
                  <div
                    role="alert"
                    className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/15 text-rose-600 dark:text-rose-400 shadow-lg space-y-2 animate-pop-in"
                  >
                    <div className="flex items-center gap-2 font-extrabold text-sm">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{t.hostLeftBannerTitle}</span>
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed">
                      {t.hostLeftBannerDesc}
                    </p>
                  </div>
                )}

                {/* Top Info Banner: Room Code / Solo Badge */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between ${
                    isDarkMode
                      ? 'bg-slate-900/80 border-slate-800 shadow-md'
                      : 'bg-white border-slate-200/90 shadow-md shadow-indigo-500/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl ${
                        isDarkMode
                          ? 'bg-indigo-500/10 text-indigo-400'
                          : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      {gameMode === 'multiplayer' ? (
                        <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                      ) : gameMode === 'solo-bot' ? (
                        <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <span
                        className={`text-[10px] uppercase font-bold block ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {gameMode === 'multiplayer' ? t.p2pRoomSubtitle : t.playSolo}
                      </span>
                      <h3
                        className={`font-extrabold text-base text-indigo-600 dark:text-indigo-400 ${
                          gameMode === 'multiplayer'
                            ? 'font-mono tracking-wider'
                            : 'font-sans tracking-normal'
                        }`}
                      >
                        {gameMode === 'multiplayer'
                          ? currentRoomCode
                          : gameMode === 'solo-bot'
                          ? t.vsComputer
                          : t.passAndPlay}
                      </h3>
                    </div>
                  </div>

                  {/* Share controls if Multiplayer */}
                  {gameMode === 'multiplayer' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setIsShareFriendOpen(true);
                        }}
                        title={t.shareWithFriend}
                        aria-label={t.shareWithFriend}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{t.shareWithFriend}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyLink}
                        title={t.copyLink}
                        aria-label={t.copyLink}
                        className={`p-2 rounded-xl border transition-colors ${
                          isDarkMode
                            ? 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10'
                            : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        {copiedLink ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Scoreboard & Live Clock Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold px-1 flex-wrap gap-2">
                    <span
                      className={`flex items-center gap-1 font-bold ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      <Swords className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      {t.round} {gameState.round}
                    </span>

                    <div className="flex items-center gap-2 tabular-nums">
                      <span
                        id="game-timer"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold ${
                          isDarkMode
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : 'bg-indigo-100/80 text-indigo-700'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {t.roundTime}: {formatDuration(currentRoundSeconds)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold ${
                          isDarkMode
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-emerald-100/80 text-emerald-700'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {formatDuration(totalElapsedSeconds)}
                      </span>
                    </div>

                    {gameState.spectators.length > 0 && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                        <Eye className="w-3.5 h-3.5" />
                        {gameState.spectators.length} {t.spectators} {t.spectatorWatching}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Player 1 (X) */}
                    <div
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        gameState.status === 'playing' && gameState.currentTurn === 'X'
                          ? isDarkMode
                            ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-500/10 shadow-md'
                            : 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/90 shadow-md'
                          : isDarkMode
                          ? 'bg-slate-900/60 border-slate-800'
                          : 'bg-white border-slate-200/90 shadow-xs'
                      }`}
                    >
                      <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 truncate mb-0.5">
                        P1 • {playerNames.X}
                      </div>
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {gameState.scores.X}
                      </div>
                      <div
                        className={`text-[9px] uppercase tracking-wider font-semibold ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {t.wins}
                      </div>
                    </div>

                    {/* Called Numbers Count */}
                    <div
                      className={`p-3 rounded-2xl border text-center ${
                        isDarkMode
                          ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                          : 'bg-white border-slate-200/90 text-slate-700 shadow-xs'
                      }`}
                    >
                      <div
                        className={`text-[11px] font-bold truncate mb-0.5 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {t.numbersCalled}
                      </div>
                      <div className="text-2xl font-black font-mono tabular-nums">
                        {gameState.calledNumbers.length}/25
                      </div>
                      <div
                        className={`text-[9px] uppercase tracking-wider font-semibold ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        1–25 BINGO
                      </div>
                    </div>

                    {/* Player 2 (O) */}
                    <div
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        gameState.status === 'playing' && gameState.currentTurn === 'O'
                          ? isDarkMode
                            ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-500/10 shadow-md'
                            : 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/90 shadow-md'
                          : isDarkMode
                          ? 'bg-slate-900/60 border-slate-800'
                          : 'bg-white border-slate-200/90 shadow-xs'
                      }`}
                    >
                      <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 truncate mb-0.5">
                        P2 • {playerNames.O}
                      </div>
                      <div className="text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums">
                        {gameState.scores.O}
                      </div>
                      <div
                        className={`text-[9px] uppercase tracking-wider font-semibold ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {t.wins}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Waiting Banner or Turn Status */}
                {gameMode === 'multiplayer' && !gameState.players.O && myRole === 'host' ? (
                  <div
                    className={`p-4 rounded-2xl border text-center space-y-2 ${
                      isDarkMode
                        ? 'bg-indigo-500/10 border-indigo-500/20'
                        : 'bg-indigo-50/90 border-indigo-200'
                    }`}
                  >
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5 animate-pulse">
                      <Users className="w-4 h-4" />
                      <span>{t.waitingForOpponent}</span>
                    </p>
                    <p
                      className={`text-[11px] ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {t.shareLinkPrompt}
                    </p>
                  </div>
                ) : myRole === 'spectator' ? (
                  <div
                    className={`p-3.5 rounded-2xl border text-center text-xs font-semibold flex items-center justify-center gap-2 ${
                      isDarkMode
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>
                      {t.spectatorModeNotice}{' '}
                      {gameState.status === 'playing' && (
                        <strong className="ml-1">
                          ({t.spectatorTurnNotice}{' '}
                          {gameState.currentTurn === 'X' ? playerNames.X : playerNames.O})
                        </strong>
                      )}
                    </span>
                  </div>
                ) : gameState.status === 'setting_up' ? (
                  <div
                    className={`p-3.5 rounded-2xl border text-center text-xs font-bold ${
                      isDarkMode
                        ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    }`}
                  >
                    {t.writeNumbers}
                  </div>
                ) : (
                  <div
                    id="turn-display"
                    className={`p-3.5 rounded-2xl border text-center text-xs sm:text-sm font-extrabold transition-colors ${
                      isMyTurn
                        ? isDarkMode
                          ? 'my-turn bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : 'my-turn bg-emerald-50 border-emerald-300 text-emerald-800'
                        : isDarkMode
                        ? 'bg-slate-900/70 border-slate-800 text-slate-300'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {isMyTurn ? (
                      <span>{t.yourTurn}</span>
                    ) : (
                      <span>
                        <span
                          className={
                            gameState.currentTurn === 'X'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }
                        >
                          {gameState.currentTurn === 'X' ? playerNames.X : playerNames.O}
                        </span>
                        {t.opponentTurn}
                      </span>
                    )}
                  </div>
                )}

                {/* Game Result & Replay Box (#winner-modal) */}
                {(gameState.status === 'won' || gameState.status === 'draw') && (
                  <div
                    id="winner-modal"
                    className={`p-5 rounded-3xl border shadow-xl text-center space-y-3.5 animate-pop-in ${
                      gameState.winInfo?.winner === myMark
                        ? isDarkMode
                          ? 'bg-gradient-to-br from-emerald-500/20 via-slate-900 to-indigo-950 border-emerald-500/50'
                          : 'bg-gradient-to-br from-emerald-50 via-white to-indigo-50 border-emerald-300 text-slate-900'
                        : isDarkMode
                        ? 'bg-gradient-to-br from-rose-500/20 via-slate-900 to-slate-950 border-rose-500/50'
                        : 'bg-gradient-to-br from-rose-50 via-white to-amber-50 border-rose-300 text-slate-900'
                    }`}
                  >
                    {gameState.status === 'won' && gameState.winInfo ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          {BINGO_LETTERS.map((l) => (
                            <span
                              key={l}
                              className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-mono font-black text-sm flex items-center justify-center shadow-md"
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                        <Trophy className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
                        <h4
                          id="winner-name-display"
                          className="text-lg sm:text-xl font-black tracking-tight"
                        >
                          {myRole !== 'spectator'
                            ? gameState.winInfo.winner === myMark
                              ? t.youWonMessage
                              : t.youLostMessage.replace(
                                  '{winnerName}',
                                  playerNames[gameState.winInfo.winner]
                                )
                            : `${playerNames[gameState.winInfo.winner]} ${t.gameOverWin}`}
                        </h4>
                        <p
                          id="winner-time-display"
                          className={`text-xs font-mono tabular-nums ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {t.timeTakenLabel} {formatDuration(currentRoundSeconds)} •{' '}
                          {t.finalMoveLabel}:{' '}
                          {formatLocalNumber(gameState.winInfo.winningNumber, currentLanguage)}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Handshake className="w-7 h-7 text-slate-400 mx-auto" />
                        <h4 className="text-lg font-bold tracking-tight">{t.gameOverDraw}</h4>
                      </div>
                    )}

                    {/* Replay Controls */}
                    {myRole !== 'spectator' ? (
                      <div>
                        {gameMode === 'multiplayer' &&
                        gameState.rematchRequestedBy &&
                        gameState.rematchRequestedBy !== myMark ? (
                          <button
                            type="button"
                            onClick={handleAcceptRematch}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <Play className="w-4 h-4 fill-white" />
                            <span>{t.acceptRematch}</span>
                          </button>
                        ) : gameMode === 'multiplayer' &&
                          gameState.rematchRequestedBy === myMark ? (
                          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold animate-pulse">
                            {t.rematchRequested}
                          </div>
                        ) : (
                          <button
                            type="button"
                            id="modal-play-again-btn"
                            data-start="true"
                            onClick={handleReplay}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>{t.playAgain}</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">{t.waitingForReplay}</p>
                    )}
                  </div>
                )}

                {/* Send Reaction Section (Placed in the Right Side Column for Players; Spectators use the vertical right-side reaction panel) */}
                {myRole !== 'spectator' && (
                  <div className="flex justify-center w-full">
                    <ReactionFloater
                      onSendReaction={handleSendReaction}
                      t={t}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                )}

                {/* Back to Lobby Button */}
                <button
                  type="button"
                  onClick={handleRequestLeaveGame}
                  className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isDarkMode
                      ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      : 'border-slate-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 hover:border-rose-200 shadow-xs'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.leaveRoom}</span>
                </button>
              </div>
            </div>

            {/* Game Data & Round History Footer */}
            <GameDataFooter
              totalElapsedSeconds={totalElapsedSeconds}
              currentRoundSeconds={currentRoundSeconds}
              currentRoundMoves={gameState.currentRoundMoves}
              roundHistory={gameState.roundHistory}
              currentLanguage={currentLanguage}
              t={t}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </main>

      {/* Floating Sticky Sponsored App Card */}
      <PromoBanner t={t} isDarkMode={isDarkMode} />

      {/* Shared Link Invite Modal */}
      {inviteRoomCode && (
        <JoinInviteModal
          isOpen={true}
          roomCode={inviteRoomCode}
          defaultName={playerName}
          onJoin={(name, role) => {
            const code = inviteRoomCode;
            setInviteRoomCode(null);
            joinRoom(code, role, name);
          }}
          onCancel={() => {
            setInviteRoomCode(null);
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
          }}
          t={t}
          isDarkMode={isDarkMode}
        />
      )}

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        isDarkMode={isDarkMode}
        t={t}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        playerName={playerName}
        onUpdatePlayerName={handleUpdatePlayerName}
        t={t}
      />

      {/* QR Code Modal */}
      {currentRoomCode && (
        <QrModal
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          roomCode={currentRoomCode}
          isDarkMode={isDarkMode}
          t={t}
        />
      )}

      {/* Share with a Friend Modal */}
      <ShareFriendModal
        isOpen={isShareFriendOpen}
        onClose={() => setIsShareFriendOpen(false)}
        currentLanguage={currentLanguage}
        roomCode={currentRoomCode}
        isDarkMode={isDarkMode}
        t={t}
        onCopiedToast={(msg) => showToast(msg)}
      />

      {/* Leave Room Confirmation Modal */}
      {isLeaveConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="leave-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
        >
          <div
            className={`w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4 transition-all animate-pop-in ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 id="leave-confirm-title" className="text-lg font-extrabold tracking-tight">
                {t.leaveConfirmTitle}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.leaveConfirmDesc}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsLeaveConfirmOpen(false);
                }}
                className={`py-2.5 px-4 rounded-xl border font-bold text-xs transition-all active:scale-95 ${
                  isDarkMode
                    ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.leaveConfirmCancel}
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  handleLeaveGame();
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.leaveConfirmYes}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl text-xs font-semibold animate-pop-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
