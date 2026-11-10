import React, { useState } from 'react';
import { Eye, Play, Sparkles, UserCheck } from 'lucide-react';
import { Translations } from '../utils/translations';
import { sounds } from '../utils/sound';

interface JoinInviteModalProps {
  isOpen: boolean;
  roomCode: string;
  defaultName: string;
  onJoin: (name: string, role: 'guest' | 'spectator') => void;
  onCancel: () => void;
  t: Translations;
  isDarkMode: boolean;
}

export const JoinInviteModal: React.FC<JoinInviteModalProps> = ({
  isOpen,
  roomCode,
  defaultName,
  onJoin,
  onCancel,
  t,
  isDarkMode,
}) => {
  const [name, setName] = useState(defaultName);

  if (!isOpen) return null;

  const handleJoinAction = (role: 'guest' | 'spectator') => {
    sounds.playClick();
    const finalName = name.trim() || defaultName || (role === 'guest' ? 'Player 2' : 'Spectator');
    onJoin(finalName, role);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-invite-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
    >
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-7 text-center space-y-5 transition-all ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-indigo-950/40'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/70'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        <div>
          <h3 id="join-invite-heading" className="text-xl sm:text-2xl font-black tracking-tight">
            {t.joinRoom}
          </h3>
          <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.appTitle}
          </p>
          <div className="inline-block mt-2 px-4 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-mono text-2xl font-black tracking-widest">
            {roomCode}
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
            {t.yourName}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            maxLength={20}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
            }`}
          />
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => handleJoinAction('guest')}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>
              {t.joinRoom} • {t.joinAsPlayer}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleJoinAction('spectator')}
            className="w-full py-3 px-4 rounded-2xl border border-amber-500/30 hover:bg-amber-500/10 text-amber-500 font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>{t.joinAsSpectator}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onCancel();
          }}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors pt-1"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
