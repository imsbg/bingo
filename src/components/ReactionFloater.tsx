import React from 'react';
import { Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';
import { Translations } from '../utils/translations';

export interface FloatingItem {
  id: string;
  emoji: string;
  sender: string;
  leftPercent: number;
}

interface ReactionFloaterProps {
  onSendReaction: (emoji: string) => void;
  activeReactions?: FloatingItem[];
  vertical?: boolean;
  t: Translations;
  isDarkMode: boolean;
}

export const REACTION_EMOJIS = ['👏', '🔥', '😂', '😭', '😮', '❤️', '🏆', '💯'];

/**
 * Floating emoji overlay rendered directly inside the Game Board side container
 */
export const BoardReactionOverlay: React.FC<{ activeReactions: FloatingItem[] }> = ({
  activeReactions,
}) => {
  if (activeReactions.length === 0) return null;
  return (
    <div
      id="board-reaction-overlay"
      className="absolute inset-0 pointer-events-none z-40 overflow-hidden rounded-3xl"
    >
      {activeReactions.map((item) => (
        <div
          key={item.id}
          style={{ left: `${item.leftPercent}%`, bottom: '18%' }}
          className="absolute flex flex-col items-center animate-float-up pointer-events-none"
        >
          <span className="text-3xl sm:text-4xl filter drop-shadow-lg select-none">
            {item.emoji}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-white shadow-md mt-0.5 whitespace-nowrap">
            {item.sender}
          </span>
        </div>
      ))}
    </div>
  );
};

export const ReactionFloater: React.FC<ReactionFloaterProps> = ({
  onSendReaction,
  vertical = false,
  t,
  isDarkMode,
}) => {
  if (vertical) {
    return (
      <div
        id="send-reaction-bar-vertical"
        className={`flex flex-row lg:flex-col items-center justify-center gap-1.5 p-2.5 rounded-2xl border transition-colors shrink-0 ${
          isDarkMode
            ? 'bg-slate-900/85 border-slate-800 shadow-lg'
            : 'bg-white border-slate-200/90 shadow-md shadow-indigo-500/5'
        }`}
      >
        <div
          title={t.sendReaction}
          className={`flex items-center justify-center gap-1 px-1.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
            isDarkMode
              ? 'bg-indigo-500/15 text-indigo-300'
              : 'bg-indigo-50 text-indigo-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="lg:hidden">{t.sendReaction}</span>
        </div>

        <div className="flex flex-row lg:flex-col flex-wrap items-center justify-center gap-1">
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                sounds.playReaction();
                onSendReaction(emoji);
              }}
              aria-label={`Send reaction ${emoji}`}
              className="w-9 h-9 rounded-xl text-lg flex items-center justify-center hover:scale-125 active:scale-95 transition-all duration-150 hover:bg-indigo-500/10"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      id="send-reaction-bar"
      className={`w-full flex flex-wrap items-center justify-between gap-1.5 p-2.5 rounded-2xl border transition-colors ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800 shadow-md'
          : 'bg-white border-slate-200/90 shadow-xs'
      }`}
    >
      <span
        className={`text-[11px] font-bold px-1.5 flex items-center gap-1 ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        {t.sendReaction}:
      </span>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {REACTION_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => {
              sounds.playReaction();
              onSendReaction(emoji);
            }}
            aria-label={`Send reaction ${emoji}`}
            className="p-1.5 rounded-xl text-base sm:text-lg hover:scale-125 active:scale-95 transition-all duration-150 hover:bg-indigo-500/10"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

