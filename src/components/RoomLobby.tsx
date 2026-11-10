import React, { useState, useEffect } from 'react';
import {
  Play,
  Users,
  Eye,
  Sparkles,
  Zap,
  Bot,
  Gamepad2,
  Radio,
  Swords,
  Share2,
  ShieldCheck,
  ExternalLink,
  HelpCircle,
  BrainCircuit,
} from 'lucide-react';
import { Translations } from '../utils/translations';
import { generateRoomCode, isValidRoomCode, normalizeRoomCode } from '../game/rules';
import { sounds } from '../utils/sound';
import { liveMatchRegistry, LiveMatchSummary } from '../network/liveLobby';

interface RoomLobbyProps {
  initialRoomCode?: string;
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  onCreateRoom: (code: string, isPublicLive: boolean, smartPlay: boolean) => void;
  onJoinRoom: (code: string, role: 'guest' | 'spectator') => void;
  onStartSolo: (mode: 'bot', smartPlay?: boolean) => void;
  onOpenShareFriend: () => void;
  onOpenTerms: () => void;
  onOpenHowToPlay: () => void;
  t: Translations;
  isDarkMode: boolean;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({
  initialRoomCode = '',
  playerName,
  onUpdatePlayerName,
  onCreateRoom,
  onJoinRoom,
  onStartSolo,
  onOpenShareFriend,
  onOpenTerms,
  onOpenHowToPlay,
  t,
  isDarkMode,
}) => {
  const [inputCode, setInputCode] = useState(initialRoomCode.toUpperCase());
  const [errorMsg, setErrorMsg] = useState('');
  const [isPublicLive, setIsPublicLive] = useState<boolean>(true);
  const [smartPlay, setSmartPlay] = useState<boolean>(false);
  const [liveMatches, setLiveMatches] = useState<LiveMatchSummary[]>([]);

  useEffect(() => {
    if (initialRoomCode) {
      setInputCode(initialRoomCode.toUpperCase());
    }
  }, [initialRoomCode]);

  useEffect(() => {
    const unsubscribe = liveMatchRegistry.subscribe((matches) => {
      setLiveMatches(matches);
    });
    const timer = setInterval(() => {
      setLiveMatches(liveMatchRegistry.getLiveMatches());
    }, 2000);
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const handleCreateNewRoom = () => {
    sounds.playClick();
    const newCode = generateRoomCode();
    onCreateRoom(newCode, isPublicLive, smartPlay);
  };

  const handleJoin = (role: 'guest' | 'spectator') => {
    sounds.playClick();
    const clean = normalizeRoomCode(inputCode);
    if (!isValidRoomCode(clean)) {
      setErrorMsg(t.invalidCode);
      return;
    }
    setErrorMsg('');
    onJoinRoom(clean, role);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 animate-fade-in">
      {/* Two-sided Desktop Layout: Grid on lg, stacked on mobile/tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        {/* Left Side: Brand Hero, Name, and Solo vs Computer */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div
            className={`p-5 sm:p-7 rounded-3xl border space-y-4 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between ${
              isDarkMode
                ? 'bg-slate-900/80 border-slate-800 shadow-xl shadow-indigo-950/30'
                : 'bg-white border-slate-200/90 shadow-xl shadow-indigo-500/5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                    isDarkMode
                      ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                      : 'bg-indigo-50 border-indigo-200/80 text-indigo-700'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{t.heroBadge}</span>
                </div>

                {/* B-I-N-G-O Mini Decorative Badge Row */}
                <div className="hidden sm:flex items-center gap-1">
                  {(['B', 'I', 'N', 'G', 'O'] as const).map((letter, idx) => (
                    <span
                      key={letter}
                      className={`w-6 h-6 rounded-lg font-mono font-black text-xs flex items-center justify-center border ${
                        idx % 2 === 0
                          ? isDarkMode
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isDarkMode
                          ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-normal py-0.5">
                {t.appTitle}
              </h2>
              <p
                className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {t.appSubtitle}
              </p>
            </div>

            {/* Name Input */}
            <div className="pt-1">
              <label
                htmlFor="lobby-player-name"
                className={`block text-xs font-semibold mb-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {t.yourName}
              </label>
              <input
                id="lobby-player-name"
                type="text"
                value={playerName}
                onChange={(e) => onUpdatePlayerName(e.target.value)}
                placeholder={t.namePlaceholder}
                maxLength={20}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:bg-white'
                }`}
              />
            </div>

            {/* Solo vs Computer Mode Section */}
            <div
              className={`pt-3 border-t space-y-2.5 ${
                isDarkMode ? 'border-slate-800/60' : 'border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold uppercase ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{t.playSolo}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenHowToPlay();
                  }}
                  className={`text-[11px] font-bold hover:underline inline-flex items-center gap-1 ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t.howToPlayTitle}</span>
                </button>
              </div>

              {/* Smart Play Checkbox for Solo vs Computer */}
              <label
                className={`flex items-start gap-2.5 p-2.5 rounded-2xl border cursor-pointer transition-colors ${
                  smartPlay
                    ? isDarkMode
                      ? 'bg-indigo-500/15 border-indigo-500/40'
                      : 'bg-indigo-50/90 border-indigo-300'
                    : isDarkMode
                    ? 'bg-slate-800/50 border-slate-700/70'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <input
                  id="solo-smart-play-checkbox"
                  type="checkbox"
                  checked={smartPlay}
                  onChange={(e) => {
                    sounds.playClick();
                    setSmartPlay(e.target.checked);
                  }}
                  className="mt-0.5 h-4 w-4 rounded accent-indigo-600"
                />
                <div className="text-left">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <BrainCircuit
                      className={`w-3.5 h-3.5 ${
                        smartPlay
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400'
                      }`}
                    />
                    {t.smartPlayLabel}
                  </span>
                  <span
                    className={`text-[10px] block leading-snug mt-0.5 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {t.smartPlayDesc}
                  </span>
                </div>
              </label>

              <button
                type="button"
                data-start="true"
                onClick={() => {
                  sounds.playClick();
                  onStartSolo('bot', smartPlay);
                }}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-between gap-3 ${
                  isDarkMode
                    ? 'bg-slate-800/80 border-slate-700 hover:border-emerald-500 hover:bg-slate-800'
                    : 'bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-indigo-50/70 border-emerald-200/90 hover:border-emerald-500 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isDarkMode
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    }`}
                  >
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`font-extrabold text-sm truncate ${
                        isDarkMode ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      {t.vsComputer}
                    </div>
                    <p
                      className={`text-xs truncate ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {t.vsComputerDesc}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 ${
                    isDarkMode
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </button>

              {/* Share with a Friend Button */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenShareFriend();
                }}
                className={`w-full mt-1 py-2.5 px-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  isDarkMode
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
                    : 'bg-indigo-50/90 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>{t.shareWithFriend}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Online WebRTC Multiplayer (Create & Join) */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          {/* Create Room Box */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border space-y-3 transition-all ${
              isDarkMode
                ? 'bg-slate-900/75 border-slate-800 shadow-lg'
                : 'bg-white border-slate-200/90 shadow-xl shadow-indigo-500/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  isDarkMode
                    ? 'bg-indigo-500/15 text-indigo-400'
                    : 'bg-indigo-100 text-indigo-600'
                }`}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">{t.createRoom}</h3>
                <p
                  className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {t.createRoomDesc}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {/* Creator Toggle 1: Make Room Public / Show in Live Matches */}
              <label
                className={`flex items-start gap-2.5 p-2.5 rounded-2xl border cursor-pointer transition-colors ${
                  isPublicLive
                    ? isDarkMode
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-emerald-50/80 border-emerald-300'
                    : isDarkMode
                    ? 'bg-slate-800/50 border-slate-700/70'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isPublicLive}
                  onChange={(e) => {
                    sounds.playClick();
                    setIsPublicLive(e.target.checked);
                  }}
                  className="mt-0.5 h-4 w-4 rounded accent-emerald-600"
                />
                <div className="text-left">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Radio
                      className={`w-3.5 h-3.5 ${
                        isPublicLive
                          ? 'text-emerald-600 dark:text-emerald-400 animate-pulse'
                          : 'text-slate-400'
                      }`}
                    />
                    {t.makeRoomLiveLabel}
                  </span>
                  <span
                    className={`text-[10px] block leading-snug mt-0.5 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {t.makeRoomLiveDesc}
                  </span>
                </div>
              </label>

              {/* Creator Toggle 2: Smart Play Checkbox (Off by default) */}
              <label
                className={`flex items-start gap-2.5 p-2.5 rounded-2xl border cursor-pointer transition-colors ${
                  smartPlay
                    ? isDarkMode
                      ? 'bg-indigo-500/15 border-indigo-500/40'
                      : 'bg-indigo-50/90 border-indigo-300'
                    : isDarkMode
                    ? 'bg-slate-800/50 border-slate-700/70'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <input
                  id="smart-play-checkbox"
                  type="checkbox"
                  checked={smartPlay}
                  onChange={(e) => {
                    sounds.playClick();
                    setSmartPlay(e.target.checked);
                  }}
                  className="mt-0.5 h-4 w-4 rounded accent-indigo-600"
                />
                <div className="text-left">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <BrainCircuit
                      className={`w-3.5 h-3.5 ${
                        smartPlay
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400'
                      }`}
                    />
                    {t.smartPlayLabel}
                  </span>
                  <span
                    className={`text-[10px] block leading-snug mt-0.5 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {t.smartPlayDesc}
                  </span>
                </div>
              </label>
            </div>

            <button
              type="button"
              onClick={handleCreateNewRoom}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-md shadow-indigo-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t.createRoom}</span>
            </button>
          </div>

          {/* Join Room Box */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border space-y-3 transition-all ${
              isDarkMode
                ? 'bg-slate-900/75 border-slate-800 shadow-lg'
                : 'bg-white border-slate-200/90 shadow-xl shadow-indigo-500/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  isDarkMode
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">{t.joinRoom}</h3>
                <p
                  className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {t.joinRoomDesc}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3.5 py-2.5 rounded-xl border font-mono font-black text-sm select-none ${
                    isDarkMode
                      ? 'bg-slate-800/90 border-slate-700 text-amber-400'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  }`}
                >
                  SB
                </span>
                <input
                  type="text"
                  aria-label={t.enterRoomCode}
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.toUpperCase());
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder={t.codePlaceholder}
                  maxLength={6}
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-center font-mono font-bold tracking-widest text-base outline-none uppercase transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600 focus:bg-white'
                  }`}
                />
              </div>

              {errorMsg && (
                <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold text-center">
                  {errorMsg}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleJoin('guest')}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{t.joinRoom}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleJoin('spectator')}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
                    isDarkMode
                      ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                      : 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.spectator}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEE LIVE MATCHES SECTION */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border transition-all ${
          isDarkMode
            ? 'bg-slate-900/75 border-slate-800 shadow-lg'
            : 'bg-white border-slate-200/90 shadow-xl shadow-indigo-500/5'
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b ${
            isDarkMode ? 'border-slate-800/60' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-2xl ${
                isDarkMode
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2">
                <span>{t.liveMatchesTitle}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isDarkMode
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {liveMatches.length}
                </span>
              </h3>
              <p
                className={`text-[11px] ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {t.liveMatchesSubtitle}
              </p>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-bold self-start sm:self-auto ${
              isDarkMode
                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>{t.phoneCacheBadge}</span>
          </div>
        </div>

        {liveMatches.length === 0 ? (
          <div
            className={`py-5 text-center text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {t.noLiveMatches}
          </div>
        ) : (
          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {liveMatches.map((match) => {
              const isSlotOpen = !match.guestName;
              return (
                <div
                  key={match.roomCode}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                    isDarkMode
                      ? 'bg-slate-800/70 border-slate-700 hover:border-indigo-500/60'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono font-black text-sm px-2.5 py-0.5 rounded-lg tracking-wider ${
                          isDarkMode
                            ? 'bg-indigo-500/15 text-indigo-400'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {match.roomCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSlotOpen
                            ? isDarkMode
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-emerald-100 text-emerald-700'
                            : isDarkMode
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isSlotOpen ? t.openForPlayer : t.matchInProgress}
                      </span>
                    </div>

                    <div className="text-xs font-bold truncate pt-0.5">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        P1: {match.hostName}
                      </span>
                      <span className="mx-1.5 text-slate-400">vs</span>
                      <span className="text-rose-600 dark:text-rose-400">
                        P2: {match.guestName || t.openForPlayer}
                      </span>
                    </div>

                    <div
                      className={`flex items-center justify-between text-[11px] pt-0.5 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Swords className="w-3 h-3 text-indigo-500" />
                        {t.round} {match.round} • {match.scores.X} - {match.scores.O}
                      </span>
                      {match.spectatorCount > 0 && (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <Eye className="w-3 h-3" />
                          {match.spectatorCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {isSlotOpen && (
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onJoinRoom(match.roomCode, 'guest');
                        }}
                        className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span className="truncate">{t.joinRoom}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onJoinRoom(match.roomCode, 'spectator');
                      }}
                      className={`${
                        isSlotOpen ? '' : 'col-span-2'
                      } py-2 px-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                        isDarkMode
                          ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                          : 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="truncate">{t.joinAsSpectator}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ABOUT THE GAME & HOW SMART PLAY WORKS SECTION */}
      <section
        id="game-info-guide"
        aria-labelledby="game-guide-heading"
        className={`p-5 sm:p-6 rounded-3xl border space-y-4 transition-all ${
          isDarkMode
            ? 'bg-slate-900/75 border-slate-800 shadow-lg'
            : 'bg-white border-slate-200/90 shadow-xl shadow-indigo-500/5'
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b ${
            isDarkMode ? 'border-slate-800/60' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-2xl ${
                isDarkMode
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="game-guide-heading"
                className="font-extrabold text-sm sm:text-base tracking-tight"
              >
                {t.gameGuideTitle}
              </h3>
              <p
                className={`text-[11px] ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {t.gameGuideSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 self-start sm:self-auto">
            {(['B', 'I', 'N', 'G', 'O'] as const).map((letter) => (
              <span
                key={letter}
                className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-mono font-black text-xs flex items-center justify-center shadow-xs"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs leading-relaxed">
          {/* Card 1: 5x5 Setup & Calling */}
          <div
            className={`p-4 rounded-2xl border space-y-1.5 ${
              isDarkMode
                ? 'bg-slate-800/60 border-slate-700/80'
                : 'bg-slate-50/90 border-slate-200/90'
            }`}
          >
            <h4 className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 shrink-0" />
              <span>{t.guideHowItWorksTitle}</span>
            </h4>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              {t.guideHowItWorksDesc}
            </p>
          </div>

          {/* Card 2: Smart Play ON vs Secret Mode OFF */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              isDarkMode
                ? 'bg-slate-800/60 border-slate-700/80'
                : 'bg-indigo-50/50 border-indigo-200/80'
            }`}
          >
            <h4 className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 shrink-0" />
              <span>{t.guideSmartPlayTitle}</span>
            </h4>
            <div className="space-y-1.5">
              <div className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  • {t.guideSmartPlayOffTitle}:{' '}
                </span>
                <span>{t.guideSmartPlayOffDesc}</span>
              </div>
              <div className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  • {t.guideSmartPlayOnTitle}:{' '}
                </span>
                <span>{t.guideSmartPlayOnDesc}</span>
              </div>
            </div>
          </div>

          {/* Card 3: 2-Color Player Numbers & Red/Green Boxes */}
          <div
            className={`p-4 rounded-2xl border space-y-1.5 ${
              isDarkMode
                ? 'bg-slate-800/60 border-slate-700/80'
                : 'bg-slate-50/90 border-slate-200/90'
            }`}
          >
            <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{t.guideColorsTitle}</span>
            </h4>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              {t.guideColorsDesc}
            </p>
          </div>

          {/* Card 4: Live Spectator Mode & Vertical Emoji Reactions */}
          <div
            className={`p-4 rounded-2xl border space-y-1.5 ${
              isDarkMode
                ? 'bg-slate-800/60 border-slate-700/80'
                : 'bg-slate-50/90 border-slate-200/90'
            }`}
          >
            <h4 className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 shrink-0" />
              <span>{t.guideSpectatorTitle}</span>
            </h4>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              {t.guideSpectatorDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Footer Links: Terms & Conditions, Play Tic Tac Toe (Chhaki Suna) & More Apps */}
      <div
        className={`flex flex-wrap items-center justify-center gap-4 pt-1 text-xs font-semibold ${
          isDarkMode ? 'text-slate-400' : 'text-slate-600'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onOpenTerms();
          }}
          className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t.termsAndPrivacy}</span>
        </button>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <a
          href={t.playTicTacToeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sounds.playClick()}
          className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-emerald-400 hover:underline font-bold transition-colors"
        >
          <span>{t.playTicTacToeLabel}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <a
          href="https://play.google.com/store/apps/dev?id=6501689567504406715"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sounds.playClick()}
          className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <span>{t.downloadMoreAppsBtn}</span>
          <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
        </a>
      </div>
    </div>
  );
};
