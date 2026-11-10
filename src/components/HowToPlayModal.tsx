import React from 'react';
import {
  HelpCircle,
  X,
  Trophy,
  Grid,
  Users,
  Heart,
  BrainCircuit,
  Lock,
  Palette,
  Eye,
} from 'lucide-react';
import { Translations } from '../utils/translations';
import { sounds } from '../utils/sound';
import { BINGO_LETTERS } from '../game/rules';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  t: Translations;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  t,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
    >
      <div
        className={`w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-3xl border shadow-2xl p-5 sm:p-6 space-y-4 transition-all ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="how-to-play-heading" className="font-extrabold text-base sm:text-lg">
                {t.gameGuideTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.gameGuideSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            aria-label={t.close}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BINGO Letters Showcase */}
        <div className="flex items-center justify-center gap-2 py-1">
          {BINGO_LETTERS.map((l) => (
            <span
              key={l}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 text-white font-mono font-black text-sm sm:text-base flex items-center justify-center shadow-md shadow-emerald-600/20"
            >
              {l}
            </span>
          ))}
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          {/* Quick 3 Steps */}
          <div
            className={`p-3.5 rounded-2xl border space-y-2 ${
              isDarkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Grid className="w-4 h-4 shrink-0" />
              <span>{t.guideHowItWorksTitle}</span>
            </div>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              {t.guideHowItWorksDesc}
            </p>
          </div>

          {/* Smart Play ON vs Secret Mode OFF */}
          <div
            className={`p-3.5 rounded-2xl border space-y-2.5 ${
              isDarkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-indigo-50/50 border-indigo-200/80'
            }`}
          >
            <div className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 shrink-0" />
              <span>{t.guideSmartPlayTitle}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                className={`p-2.5 rounded-xl border ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-amber-500/30'
                    : 'bg-white border-amber-200'
                }`}
              >
                <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.guideSmartPlayOffTitle}</span>
                </div>
                <p className={`text-[11px] ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {t.guideSmartPlayOffDesc}
                </p>
              </div>

              <div
                className={`p-2.5 rounded-xl border ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-indigo-500/30'
                    : 'bg-white border-indigo-200'
                }`}
              >
                <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-1">
                  <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.guideSmartPlayOnTitle}</span>
                </div>
                <p className={`text-[11px] ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {t.guideSmartPlayOnDesc}
                </p>
              </div>
            </div>
          </div>

          {/* 2-Color Numbers & Green/Red Boxes */}
          <div
            className={`p-3.5 rounded-2xl border space-y-1.5 ${
              isDarkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Palette className="w-4 h-4 shrink-0" />
              <span>{t.guideColorsTitle}</span>
            </div>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              {t.guideColorsDesc}
            </p>
          </div>

          {/* Spectator Mode & Reactions */}
          <div
            className={`p-3.5 rounded-2xl border space-y-1.5 ${
              isDarkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <Eye className="w-4 h-4 shrink-0" />
              <span>{t.guideSpectatorTitle}</span>
            </div>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              {t.guideSpectatorDesc}
            </p>
          </div>
        </div>

        <div
          className={`pt-3 border-t flex items-center justify-between ${
            isDarkMode ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            {t.madeByCredit}
          </span>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all active:scale-95"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

