/**
 * WebRTC Peer-to-Peer & Broadcast Networking Engine for SBXXXX Rooms
 * Game: ବିଙ୍ଗୋ | Bingo (1-25 Online Multiplayer)
 * Author: Sandeep Biswal G
 */

import Peer, { DataConnection } from 'peerjs';
import {
  BingoGrid,
  GameStatus,
  WinInfo,
  MoveRecord,
  RoundRecord,
  PlayerBingoProgress,
  PlayerMark,
  generateRandomGrid,
  isValidBingoGrid,
  evaluatePlayerBingo,
  applyNumberCall,
} from '../game/rules';
import { liveMatchRegistry, INACTIVITY_TIMEOUT_MS } from './liveLobby';

export type UserRole = 'host' | 'guest' | 'spectator';

export interface PlayerInfo {
  name: string;
  role: UserRole;
  mark: PlayerMark | null;
  id: string;
}

export interface GameState {
  grids: {
    X: BingoGrid;
    O: BingoGrid;
  };
  gridReady: {
    X: boolean;
    O: boolean;
  };
  calledNumbers: number[];
  progress: {
    X: PlayerBingoProgress;
    O: PlayerBingoProgress;
  };
  currentTurn: PlayerMark;
  status: GameStatus;
  winInfo: WinInfo | null;
  round: number;
  scores: {
    X: number;
    O: number;
    ties: number;
  };
  players: {
    X: PlayerInfo | null;
    O: PlayerInfo | null;
  };
  spectators: Array<{ id: string; name: string }>;
  rematchRequestedBy: PlayerMark | null;
  matchStartTime: number;
  roundStartTime: number;
  currentRoundMoves: MoveRecord[];
  roundHistory: RoundRecord[];
  isPublicLive?: boolean;
  smartPlay: boolean;
}

export type NetworkMessage =
  | { type: 'STATE_SYNC'; payload: GameState }
  | { type: 'JOIN_REQUEST'; role: 'player' | 'guest' | 'spectator'; name: string; peerId: string }
  | { type: 'JOIN_ACCEPTED'; role: UserRole; mark: PlayerMark | null; state: GameState; targetPeerId?: string }
  | { type: 'SUBMIT_GRID'; player: PlayerMark; grid: BingoGrid; round: number }
  | { type: 'CALL_NUMBER'; number: number; player: PlayerMark; round: number }
  | { type: 'REMATCH_REQ'; player: PlayerMark; round: number }
  | { type: 'REMATCH_ACCEPT'; round: number }
  | { type: 'REACTION'; emoji: string; sender: string }
  | { type: 'PLAYER_LEAVE'; peerId: string }
  | { type: 'HOST_LEFT'; roomCode: string }
  | { type: 'PING' };

export interface NetworkCallbacks {
  onStateChange: (state: GameState) => void;
  onRoleChange?: (role: UserRole) => void;
  onConnectionStatusChange: (status: 'connected' | 'connecting' | 'disconnected', error?: string) => void;
  onReactionReceived: (emoji: string, sender: string) => void;
  onNotification?: (message: string) => void;
  onHostLeft?: () => void;
}

export function createInitialGameState(
  role: UserRole,
  myName: string,
  myId: string,
  isPublicLive: boolean = true,
  smartPlay: boolean = false
): GameState {
  const now = Date.now();
  const gridX = generateRandomGrid();
  const gridO = generateRandomGrid();
  return {
    grids: {
      X: gridX,
      O: gridO,
    },
    gridReady: {
      X: false,
      O: false,
    },
    calledNumbers: [],
    progress: {
      X: evaluatePlayerBingo(gridX, []),
      O: evaluatePlayerBingo(gridO, []),
    },
    currentTurn: 'X',
    status: 'setting_up',
    winInfo: null,
    round: 1,
    scores: { X: 0, O: 0, ties: 0 },
    players: {
      X: role === 'host' ? { name: myName, role: 'host', mark: 'X', id: myId } : null,
      O: role === 'guest' ? { name: myName, role: 'guest', mark: 'O', id: myId } : null,
    },
    spectators: role === 'spectator' ? [{ id: myId, name: myName }] : [],
    rematchRequestedBy: null,
    matchStartTime: now,
    roundStartTime: now,
    currentRoundMoves: [],
    roundHistory: [],
    isPublicLive,
    smartPlay,
  };
}

export class WebRTCNetworkRoom {
  public roomCode: string;
  public myRole: UserRole;
  public myName: string;
  public myId: string;
  public isPublicLive: boolean;
  public smartPlay: boolean;

  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private broadcastChannel: BroadcastChannel | null = null;
  private callbacks: NetworkCallbacks;
  private state: GameState;
  private isDestroyed: boolean = false;
  private hostConnection: DataConnection | null = null;
  private joinAccepted: boolean = false;
  private hostLeftNotified: boolean = false;
  private joinRetryInterval: ReturnType<typeof setInterval> | null = null;
  private liveAnnounceInterval: ReturnType<typeof setInterval> | null = null;
  private lastActivityAt: number = Date.now();
  private handlePageUnload: () => void;

  constructor(
    roomCode: string,
    role: UserRole,
    name: string,
    callbacks: NetworkCallbacks,
    isPublicLive: boolean = true,
    smartPlay: boolean = false
  ) {
    this.roomCode = roomCode.toUpperCase();
    this.myRole = role;
    this.myName = name || (role === 'host' ? 'Player 1' : role === 'guest' ? 'Player 2' : 'Spectator');
    this.callbacks = callbacks;
    this.isPublicLive = isPublicLive;
    this.smartPlay = smartPlay;
    this.myId = `sb-bingo-${this.roomCode.toLowerCase()}-${this.myRole}-${Math.random().toString(36).substring(2, 7)}`;

    this.lastActivityAt = Date.now();
    this.state = createInitialGameState(role, this.myName, this.myId, this.isPublicLive, this.smartPlay);

    this.handlePageUnload = () => {
      this.destroy();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.handlePageUnload);
      window.addEventListener('pagehide', this.handlePageUnload);
    }

    this.initBroadcastChannel();
    this.initPeer();
    this.startJoinHandshakeIfGuest();
    this.startLiveBroadcastIfHost();
  }

  private recordActivity() {
    this.lastActivityAt = Date.now();
  }

  public getState(): GameState {
    return this.state;
  }

  public setPublicLive(enabled: boolean) {
    this.isPublicLive = enabled;
    this.state.isPublicLive = enabled;
    if (this.myRole === 'host') {
      if (enabled) {
        this.recordActivity();
        this.publishLiveStatus();
      } else {
        liveMatchRegistry.removeRoom(this.roomCode);
      }
      this.broadcastState();
    }
  }

  private startLiveBroadcastIfHost() {
    if (this.myRole === 'host' && this.isPublicLive) {
      this.publishLiveStatus();
    }
    this.liveAnnounceInterval = setInterval(() => {
      if (this.isDestroyed) return;
      if (this.myRole === 'host' && this.isPublicLive) {
        this.publishLiveStatus();
      }
    }, 3500);
  }

  private publishLiveStatus() {
    if (this.myRole !== 'host' || !this.isPublicLive || this.isDestroyed) return;
    if (Date.now() - this.lastActivityAt > INACTIVITY_TIMEOUT_MS) {
      liveMatchRegistry.removeRoom(this.roomCode);
      return;
    }
    liveMatchRegistry.announceRoom({
      roomCode: this.roomCode,
      hostName: this.state.players.X?.name || this.myName,
      guestName: this.state.players.O?.name || null,
      round: this.state.round,
      scores: { ...this.state.scores },
      spectatorCount: this.state.spectators.length,
      status: this.state.status,
      updatedAt: this.lastActivityAt,
    });
  }

  private startJoinHandshakeIfGuest() {
    if (this.myRole === 'host') return;

    this.sendJoinRequest();

    this.joinRetryInterval = setInterval(() => {
      if (this.isDestroyed || this.myRole === 'host' || this.joinAccepted) {
        if (this.joinRetryInterval) {
          clearInterval(this.joinRetryInterval);
          this.joinRetryInterval = null;
        }
        return;
      }
      this.sendJoinRequest();
    }, 1200);
  }

  private sendToHost(msg: NetworkMessage) {
    if (this.isDestroyed) return;
    if (this.hostConnection && this.hostConnection.open) {
      try {
        this.hostConnection.send(msg);
      } catch {}
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch {}
    }
  }

  private sendJoinRequest() {
    if (this.isDestroyed || this.myRole === 'host') return;
    const joinMsg: NetworkMessage = {
      type: 'JOIN_REQUEST',
      role: this.myRole === 'spectator' ? 'spectator' : 'guest',
      name: this.myName,
      peerId: this.myId,
    };
    this.sendToHost(joinMsg);
  }

  private initBroadcastChannel() {
    if (typeof window === 'undefined' || !window.BroadcastChannel) return;
    try {
      this.broadcastChannel = new BroadcastChannel(`sb_bingo_channel_${this.roomCode}`);
      this.broadcastChannel.onmessage = (event) => {
        if (this.isDestroyed) return;
        this.handleMessage(event.data);
      };
    } catch {}
  }

  private broadcast(msg: NetworkMessage) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch {}
    }
    this.connections.forEach((conn) => {
      if (conn.open) {
        try {
          conn.send(msg);
        } catch {}
      }
    });
  }

  private initPeer() {
    this.callbacks.onConnectionStatusChange('connecting');

    const peerId =
      this.myRole === 'host'
        ? `sb-bingo-room-${this.roomCode}-host`
        : `sb-bingo-room-${this.roomCode}-${this.myRole}-${Math.random().toString(36).substring(2, 7)}`;

    this.peer = new Peer(peerId, {
      debug: 0,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
      },
    });

    this.peer.on('open', (id) => {
      const oldId = this.myId;
      this.myId = id;
      if (this.myRole === 'host') {
        if (this.state.players.X && this.state.players.X.id === oldId) {
          this.state.players.X.id = id;
        }
        this.callbacks.onConnectionStatusChange('connected');
        this.callbacks.onStateChange({ ...this.state });
        this.publishLiveStatus();
      } else {
        if (this.myRole === 'guest' && this.state.players.O && this.state.players.O.id === oldId) {
          this.state.players.O.id = id;
        }
        this.connectToHost();
      }
    });

    this.peer.on('connection', (conn) => {
      this.handleIncomingConnection(conn);
    });

    this.peer.on('error', (err) => {
      if (err.type === 'unavailable-id') {
        if (this.myRole === 'host') {
          this.myRole = 'guest';
          this.callbacks.onRoleChange?.('guest');
          this.state.players.O = { name: this.myName, role: 'guest', mark: 'O', id: this.myId };
          this.peer?.destroy();
          setTimeout(() => {
            this.initPeer();
            this.startJoinHandshakeIfGuest();
          }, 250);
          return;
        }
      } else if (err.type === 'peer-unavailable') {
        if (this.myRole !== 'host') {
          this.notifyHostLeft();
          return;
        }
      }
      this.callbacks.onConnectionStatusChange('connecting', err.message);
    });

    this.peer.on('disconnected', () => {
      if (!this.isDestroyed) {
        this.peer?.reconnect();
      }
    });
  }

  private notifyHostLeft() {
    if (this.myRole === 'host' || this.isDestroyed) return;
    liveMatchRegistry.removeRoom(this.roomCode);
    if (this.joinRetryInterval) {
      clearInterval(this.joinRetryInterval);
      this.joinRetryInterval = null;
    }
    this.callbacks.onConnectionStatusChange('disconnected', 'Host left the room');
    if (!this.hostLeftNotified) {
      this.hostLeftNotified = true;
      this.callbacks.onHostLeft?.();
    }
  }

  private connectToHost() {
    if (!this.peer) return;
    const hostPeerId = `sb-bingo-room-${this.roomCode}-host`;
    const conn = this.peer.connect(hostPeerId, { reliable: true });

    conn.on('open', () => {
      this.hostConnection = conn;
      this.connections.set(conn.peer, conn);
      this.callbacks.onConnectionStatusChange('connected');
      this.sendJoinRequest();
    });

    conn.on('data', (data) => {
      this.handleMessage(data as NetworkMessage);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.notifyHostLeft();
    });

    conn.on('error', () => {
      this.callbacks.onConnectionStatusChange('connecting');
    });
  }

  private handleIncomingConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);
      this.callbacks.onConnectionStatusChange('connected');
      if (this.myRole === 'host') {
        conn.send({
          type: 'STATE_SYNC',
          payload: this.state,
        });
      }
    });

    conn.on('data', (data) => {
      this.handleMessage(data as NetworkMessage, conn);
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
      this.removeDisconnectedPeer(conn.peer);
    });
  }

  private removeDisconnectedPeer(peerId: string) {
    if (this.myRole !== 'host') return;
    const remainingSpecs = this.state.spectators.filter((s) => s.id !== peerId);
    let updated = false;
    if (remainingSpecs.length !== this.state.spectators.length) {
      this.state.spectators = remainingSpecs;
      updated = true;
    }
    if (this.state.players.O && this.state.players.O.id === peerId) {
      this.state.players.O = null;
      this.state.gridReady.O = false;
      updated = true;
    }
    if (updated) {
      this.broadcastState();
    }
  }

  private checkAndStartPlayingIfBothReady() {
    if (
      this.state.status === 'setting_up' &&
      this.state.players.X &&
      this.state.players.O &&
      this.state.gridReady.X &&
      this.state.gridReady.O &&
      isValidBingoGrid(this.state.grids.X) &&
      isValidBingoGrid(this.state.grids.O)
    ) {
      this.state.status = 'playing';
      this.state.roundStartTime = Date.now();
      this.state.calledNumbers = [];
      this.state.progress = {
        X: evaluatePlayerBingo(this.state.grids.X, []),
        O: evaluatePlayerBingo(this.state.grids.O, []),
      };
      this.state.currentTurn = this.state.round % 2 === 1 ? 'X' : 'O';
    }
  }

  private handleMessage(msg: NetworkMessage, sourceConn?: DataConnection) {
    switch (msg.type) {
      case 'STATE_SYNC': {
        this.state = msg.payload;
        if (this.myRole === 'guest' && !this.state.players.O) {
          this.state.players.O = {
            name: this.myName,
            role: 'guest',
            mark: 'O',
            id: this.myId,
          };
          this.sendJoinRequest();
        }
        if (this.myRole === 'guest' && this.state.players.O?.id === this.myId) {
          this.joinAccepted = true;
          this.callbacks.onConnectionStatusChange('connected');
        }
        this.callbacks.onStateChange({ ...this.state });
        break;
      }

      case 'JOIN_REQUEST': {
        if (this.myRole === 'host') {
          let assignedRole: UserRole = 'spectator';
          let assignedMark: PlayerMark | null = null;

          const wantsToPlay = msg.role === 'player' || msg.role === 'guest';
          const currentO = this.state.players.O;
          const isCurrentOConnOpen = currentO ? (this.connections.get(currentO.id)?.open ?? false) : false;
          const isSlotOAvailable =
            !currentO ||
            currentO.id === msg.peerId ||
            currentO.name === msg.name ||
            !isCurrentOConnOpen;

          if (wantsToPlay && isSlotOAvailable) {
            assignedRole = 'guest';
            assignedMark = 'O';
            this.recordActivity();
            this.state.players.O = {
              name: msg.name,
              role: 'guest',
              mark: 'O',
              id: msg.peerId,
            };
            this.state.spectators = this.state.spectators.filter((s) => s.id !== msg.peerId);
            this.checkAndStartPlayingIfBothReady();
          } else {
            assignedRole = 'spectator';
            assignedMark = null;
            if (!this.state.spectators.some((s) => s.id === msg.peerId)) {
              this.state.spectators.push({ id: msg.peerId, name: msg.name });
            }
          }

          const acceptedMsg: NetworkMessage = {
            type: 'JOIN_ACCEPTED',
            role: assignedRole,
            mark: assignedMark,
            state: this.state,
            targetPeerId: msg.peerId,
          };

          if (sourceConn && sourceConn.open) {
            try {
              sourceConn.send(acceptedMsg);
            } catch {}
          }
          this.broadcast(acceptedMsg);
          this.broadcastState();
        }
        break;
      }

      case 'JOIN_ACCEPTED': {
        if (msg.targetPeerId && msg.targetPeerId !== this.myId) {
          break;
        }
        this.joinAccepted = true;
        this.myRole = msg.role;
        this.callbacks.onRoleChange?.(msg.role);
        this.state = msg.state;
        this.callbacks.onStateChange({ ...this.state });
        this.callbacks.onConnectionStatusChange('connected');
        break;
      }

      case 'PLAYER_LEAVE': {
        this.removeDisconnectedPeer(msg.peerId);
        break;
      }

      case 'HOST_LEFT': {
        if (msg.roomCode === this.roomCode && this.myRole !== 'host') {
          this.notifyHostLeft();
        }
        break;
      }

      case 'SUBMIT_GRID': {
        if (this.myRole === 'host') {
          if (msg.round !== undefined && msg.round !== this.state.round) break;
          this.processSubmitGrid(msg.player, msg.grid);
        }
        break;
      }

      case 'CALL_NUMBER': {
        if (this.myRole === 'host') {
          if (msg.round !== undefined && msg.round !== this.state.round) {
            break;
          }
          this.processNumberCall(msg.number, msg.player);
        }
        break;
      }

      case 'REMATCH_REQ': {
        if (this.myRole === 'host') {
          if (this.state.status === 'playing' || this.state.status === 'setting_up') break;
          if (msg.round !== undefined && msg.round !== this.state.round) break;
          this.recordActivity();

          if (this.state.rematchRequestedBy && this.state.rematchRequestedBy !== msg.player) {
            this.executeRematch(msg.round);
          } else if (this.state.rematchRequestedBy !== msg.player) {
            this.state.rematchRequestedBy = msg.player;
            this.broadcastState();
          }
        }
        break;
      }

      case 'REMATCH_ACCEPT': {
        if (this.myRole === 'host') {
          this.recordActivity();
          this.executeRematch(msg.round);
        }
        break;
      }

      case 'REACTION': {
        this.recordActivity();
        this.callbacks.onReactionReceived(msg.emoji, msg.sender);
        if (this.myRole === 'host') {
          this.connections.forEach((conn) => {
            if (conn !== sourceConn && conn.open) {
              conn.send(msg);
            }
          });
          if (this.isPublicLive) {
            this.publishLiveStatus();
          }
        }
        break;
      }

      case 'PING':
        break;
    }
  }

  public submitGrid(player: PlayerMark, grid: BingoGrid) {
    if (!isValidBingoGrid(grid)) return;
    if (this.myRole === 'host') {
      this.processSubmitGrid(player, grid);
    } else {
      const msg: NetworkMessage = {
        type: 'SUBMIT_GRID',
        player,
        grid,
        round: this.state.round,
      };
      this.sendToHost(msg);
    }
  }

  private processSubmitGrid(player: PlayerMark, grid: BingoGrid) {
    if (this.state.status !== 'setting_up') return;
    if (!isValidBingoGrid(grid)) return;

    this.recordActivity();
    this.state.grids = {
      ...this.state.grids,
      [player]: [...grid],
    };
    this.state.gridReady = {
      ...this.state.gridReady,
      [player]: true,
    };

    this.checkAndStartPlayingIfBothReady();
    this.broadcastState();
  }

  public callNumber(numberToCall: number, player: PlayerMark) {
    if (this.state.status !== 'playing') return;
    if (this.state.currentTurn !== player) return;

    if (this.myRole === 'host') {
      this.processNumberCall(numberToCall, player);
    } else {
      const moveMsg: NetworkMessage = {
        type: 'CALL_NUMBER',
        number: numberToCall,
        player,
        round: this.state.round,
      };
      this.sendToHost(moveMsg);
    }
  }

  private processNumberCall(numberToCall: number, player: PlayerMark) {
    const result = applyNumberCall(
      this.state.grids,
      this.state.calledNumbers,
      numberToCall,
      player,
      this.state.currentTurn,
      this.state.status
    );

    if (!result) return;

    this.recordActivity();
    const now = Date.now();
    const elapsedSeconds = Math.max(0, Math.round((now - this.state.roundStartTime) / 1000));
    const playerName =
      player === 'X'
        ? this.state.players.X?.name || 'Player 1'
        : this.state.players.O?.name || 'Player 2';

    const moveRecord: MoveRecord = {
      moveNumber: this.state.currentRoundMoves.length + 1,
      player,
      playerName,
      calledNumber: numberToCall,
      elapsedSeconds,
      linesAfterMove: {
        X: result.progress.X.completedLineCount,
        O: result.progress.O.completedLineCount,
      },
    };

    const nextMoves = [...this.state.currentRoundMoves, moveRecord];

    this.state.calledNumbers = result.nextCalledNumbers;
    this.state.currentTurn = result.nextTurn;
    this.state.status = result.newStatus;
    this.state.winInfo = result.winInfo;
    this.state.progress = result.progress;
    this.state.currentRoundMoves = nextMoves;

    if (result.newStatus === 'won' && result.winInfo) {
      if (result.winInfo.winner === 'X') {
        this.state.scores.X += 1;
      } else {
        this.state.scores.O += 1;
      }
      const winnerMark = result.winInfo.winner;
      const winnerName =
        winnerMark === 'X'
          ? this.state.players.X?.name || 'Player 1'
          : this.state.players.O?.name || 'Player 2';

      const roundRecord: RoundRecord = {
        round: this.state.round,
        winner: winnerMark,
        winnerName,
        durationSeconds: Math.max(1, elapsedSeconds),
        moves: nextMoves,
        finalMove: moveRecord,
        calledNumbers: [...result.nextCalledNumbers],
        grids: {
          X: [...this.state.grids.X],
          O: [...this.state.grids.O],
        },
        progress: {
          X: { ...result.progress.X },
          O: { ...result.progress.O },
        },
        completedAt: now,
      };
      if (!this.state.roundHistory.some((r) => r.round === this.state.round)) {
        this.state.roundHistory = [...this.state.roundHistory, roundRecord];
      }
    }

    this.broadcastState();
  }

  public requestRematch(player: PlayerMark) {
    if (this.state.status === 'playing' || this.state.status === 'setting_up') return;
    this.recordActivity();

    if (this.myRole === 'host') {
      if (this.state.rematchRequestedBy && this.state.rematchRequestedBy !== player) {
        this.executeRematch(this.state.round);
      } else if (this.state.rematchRequestedBy !== player) {
        this.state.rematchRequestedBy = player;
        this.broadcastState();
      }
    } else {
      const msg: NetworkMessage = {
        type: 'REMATCH_REQ',
        player,
        round: this.state.round,
      };
      this.sendToHost(msg);
    }
  }

  public acceptRematch() {
    if (this.state.status === 'playing' || this.state.status === 'setting_up') return;
    this.recordActivity();

    if (this.myRole === 'host') {
      this.executeRematch(this.state.round);
    } else {
      const msg: NetworkMessage = {
        type: 'REMATCH_ACCEPT',
        round: this.state.round,
      };
      this.sendToHost(msg);
    }
  }

  private executeRematch(expectedRound?: number) {
    if (this.state.status === 'playing' || this.state.status === 'setting_up') return;
    if (expectedRound !== undefined && expectedRound !== this.state.round) return;

    this.recordActivity();
    const nextRound = this.state.round + 1;
    const nextGridX = generateRandomGrid();
    const nextGridO = generateRandomGrid();

    this.state.grids = { X: nextGridX, O: nextGridO };
    this.state.gridReady = { X: false, O: false };
    this.state.calledNumbers = [];
    this.state.progress = {
      X: evaluatePlayerBingo(nextGridX, []),
      O: evaluatePlayerBingo(nextGridO, []),
    };
    this.state.status = 'setting_up';
    this.state.winInfo = null;
    this.state.rematchRequestedBy = null;
    this.state.round = nextRound;
    this.state.roundStartTime = Date.now();
    this.state.currentRoundMoves = [];
    this.state.currentTurn = nextRound % 2 === 1 ? 'X' : 'O';
    this.broadcastState();
  }

  public sendReaction(emoji: string) {
    this.recordActivity();
    const msg: NetworkMessage = {
      type: 'REACTION',
      emoji,
      sender: this.myName,
    };
    this.callbacks.onReactionReceived(emoji, this.myName);
    this.broadcast(msg);
    if (this.myRole === 'host' && this.isPublicLive) {
      this.publishLiveStatus();
    }
  }

  private broadcastState() {
    const syncMsg: NetworkMessage = {
      type: 'STATE_SYNC',
      payload: { ...this.state },
    };
    this.callbacks.onStateChange({ ...this.state });
    this.broadcast(syncMsg);
    if (this.myRole === 'host' && this.isPublicLive) {
      this.publishLiveStatus();
    }
  }

  public destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    if (typeof window !== 'undefined' && this.handlePageUnload) {
      window.removeEventListener('beforeunload', this.handlePageUnload);
      window.removeEventListener('pagehide', this.handlePageUnload);
    }
    if (this.joinRetryInterval) {
      clearInterval(this.joinRetryInterval);
      this.joinRetryInterval = null;
    }
    if (this.liveAnnounceInterval) {
      clearInterval(this.liveAnnounceInterval);
      this.liveAnnounceInterval = null;
    }
    if (this.myRole === 'host') {
      liveMatchRegistry.removeRoom(this.roomCode);
      this.broadcast({ type: 'HOST_LEFT', roomCode: this.roomCode });
    } else {
      this.sendToHost({ type: 'PLAYER_LEAVE', peerId: this.myId });
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.close();
      } catch {}
    }
    this.connections.forEach((conn) => {
      try {
        conn.close();
      } catch {}
    });
    this.connections.clear();
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }
  }
}
