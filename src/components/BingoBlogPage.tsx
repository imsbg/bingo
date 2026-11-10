import React from 'react';
import {
  BookOpen,
  Play,
  Sparkles,
  Users,
  Eye,
  EyeOff,
  Grid,
  Volume2,
  Bot,
  Trophy,
  Sun,
  Moon,
  Languages,
  ExternalLink,
  CheckCircle2,
  ShieldAlert,
  Radio,
  Smile,
  UserCheck,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { Language, Translations } from '../utils/translations';
import { BINGO_LETTERS } from '../game/rules';

interface BingoBlogPageProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSwitchToGameView?: () => void;
  t: Translations;
}

export const BingoBlogPage: React.FC<BingoBlogPageProps> = ({
  currentLanguage,
  onSelectLanguage,
  isDarkMode,
  onToggleTheme,
  onSwitchToGameView,
}) => {
  const isOdia = currentLanguage === 'or';

  // Sample 5x5 showcase cells to visually demonstrate Green line, Red called cells, P1/P2 2-color badges, and Yellow Last-Called ring
  const demoCells = [
    { num: 7, state: 'green', caller: 'P1', isLast: false },
    { num: 19, state: 'green', caller: 'P2', isLast: false },
    { num: 3, state: 'green', caller: 'P1', isLast: false },
    { num: 24, state: 'green', caller: 'P2', isLast: false },
    { num: 12, state: 'green', caller: 'P1', isLast: true },
    { num: 15, state: 'red', caller: 'P2', isLast: false },
    { num: 1, state: 'uncalled', caller: null, isLast: false },
    { num: 22, state: 'red', caller: 'P1', isLast: false },
    { num: 9, state: 'uncalled', caller: null, isLast: false },
    { num: 18, state: 'uncalled', caller: null, isLast: false },
  ];

  return (
    <div
      id="github-bingo-blog"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-gradient-to-br from-slate-50 via-indigo-50/40 to-teal-50/30 text-slate-900'
      }`}
    >
      {/* Sticky Blog Header */}
      <header
        className={`w-full border-b sticky top-0 z-30 backdrop-blur-md transition-colors ${
          isDarkMode
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-xs'
        }`}
      >
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Brand & Blog Badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <a
              href="https://imsbg.github.io/bingo/"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0"
              aria-label="Bingo Game - Popular Indian 1 to 25 Bingo"
            >
              <div className="grid grid-cols-2 gap-0.5 p-1.5 w-full h-full">
                <span className="bg-white rounded-xs flex items-center justify-center text-[8px] font-black text-indigo-700 leading-none">
                  B
                </span>
                <span className="bg-amber-300 rounded-xs flex items-center justify-center text-[8px] font-black text-slate-900 leading-none">
                  I
                </span>
                <span className="bg-emerald-300 rounded-xs flex items-center justify-center text-[8px] font-black text-slate-900 leading-none">
                  N
                </span>
                <span className="bg-rose-300 rounded-xs flex items-center justify-center text-[8px] font-black text-slate-900 leading-none">
                  G
                </span>
              </div>
            </a>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight truncate">
                  {isOdia ? 'ବିଙ୍ଗୋ ୧–୨୫ ବ୍ଲଗ୍ (Bingo Blog)' : 'Bingo 1–25 Official Blog'}
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  imsbg.github.io/bingo
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                {isOdia
                  ? 'ଲେଖକ: Sandeep Biswal G • ଭାରତର ଲୋକପ୍ରିୟ ୧ ରୁ ୨୫ ବିଙ୍ଗୋ ଖେଳ'
                  : 'By Sandeep Biswal G • Popular Indian 1 to 25 Bingo Guide'}
              </p>
            </div>
          </div>

          {/* Right Controls: Language, Theme & Play Now CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSelectLanguage(isOdia ? 'en' : 'or')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              }`}
              title="Switch Language (Odia / English)"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isOdia ? 'English' : 'ଓଡ଼ିଆ'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle Theme"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="https://desibingo.netlify.app/"
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isOdia ? 'ଖେଳନ୍ତୁ (Play Live)' : 'Play Bingo Live'}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Article Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <article
          itemScope
          itemType="https://schema.org/BlogPosting"
          className="space-y-8 sm:space-y-10"
        >
          {/* Hidden Schema Metadata */}
          <meta itemProp="mainEntityOfPage" content="https://imsbg.github.io/bingo/" />
          <meta itemProp="author" content="Sandeep Biswal G" />
          <meta itemProp="publisher" content="Sandeep Biswal G" />

          {/* Hero Article Banner */}
          <section
            className={`rounded-3xl border p-6 sm:p-9 shadow-xl relative overflow-hidden ${
              isDarkMode
                ? 'bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border-slate-800'
                : 'bg-gradient-to-br from-white via-indigo-50/70 to-emerald-50/50 border-slate-200/90'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  {isOdia
                    ? 'ଅଫିସିଆଲ୍ ଗେମ୍ ଗାଇଡ୍ ଏବଂ ଫିଚର୍ ବ୍ଲଗ୍'
                    : 'Official Game Guide & Feature Blog'}
                </span>
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  isDarkMode
                    ? 'bg-slate-800/90 border-slate-700 text-emerald-400'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Author: Sandeep Biswal G</span>
              </span>
            </div>

            {/* Primary H1 Title (Exact match requested for SEO) */}
            <h1
              itemProp="headline"
              className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3"
            >
              Bingo Game - Popular Indian 1 to 25 Bingo
            </h1>

            {isOdia ? (
              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mb-6">
                ଭାରତର ସବୁଠାରୁ ଲୋକପ୍ରିୟ ୧ ରୁ ୨୫ ବିଙ୍ଗୋ (Bingo 1–25) ଖେଳର ସମ୍ପୂର୍ଣ୍ଣ ନିୟମ,{' '}
                <strong>Smart Play Mini-Map</strong>, <strong>Secret Mode</strong>, ୨-ରଙ୍ଗର ଖେଳାଳି
                ନମ୍ବର, <strong>WebRTC ଅନଲାଇନ୍ ରୁମ୍ (SBXXXX)</strong> ଏବଂ{' '}
                <strong>Spectator Mode</strong> ବିଷୟରେ ଏଠାରେ ପଢ଼ନ୍ତୁ । ଏହି ଖେଳଟି{' '}
                <strong>Sandeep Biswal G</strong> ଙ୍କ ଦ୍ୱାରା ନିର୍ମିତ ଏବଂ ଆପଣ ଏହାକୁ{' '}
                <a
                  href="https://desibingo.netlify.app/"
                  className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                >
                  desibingo.netlify.app
                </a>{' '}
                ରେ ମାଗଣାରେ ଖେଳିପାରିବେ ।
              </p>
            ) : (
              <p
                itemProp="description"
                className="text-sm sm:text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mb-6"
              >
                Welcome to the official documentation and strategy blog for{' '}
                <strong>Bingo Game - Popular Indian 1 to 25 Bingo (ବିଙ୍ଗୋ)</strong> created by{' '}
                <strong>Sandeep Biswal G</strong>. Discover how classic school-notebook 5×5 Bingo
                works online with peer-to-peer WebRTC rooms (<code className="font-mono">SBXXXX</code>
                ), Smart Play Mini-Map vs. Secret Mode, 2-color player numbers, English voice
                callouts, and live side-by-side Spectator mode.
              </p>
            )}

            {/* CTA Buttons to desibingo.netlify.app */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://desibingo.netlify.app/"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {isOdia
                    ? 'DesiBingo ରେ ଲାଇଭ୍ ଖେଳନ୍ତୁ (desibingo.netlify.app)'
                    : 'Play Live on DesiBingo (desibingo.netlify.app)'}
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <a
                href="https://desibingo.netlify.app/odia"
                className={`px-4 py-3 rounded-2xl border font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/90 border-slate-700 text-emerald-400 hover:bg-slate-800'
                    : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-50 shadow-xs'
                }`}
              >
                <span>ଓଡ଼ିଆରେ ଖେଳନ୍ତୁ (/odia)</span>
              </a>

              <a
                href="https://desibingo.netlify.app/en"
                className={`px-4 py-3 rounded-2xl border font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/90 border-slate-700 text-indigo-400 hover:bg-slate-800'
                    : 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-xs'
                }`}
              >
                <span>Play in English (/en)</span>
              </a>

              {onSwitchToGameView && (
                <button
                  type="button"
                  onClick={onSwitchToGameView}
                  className={`px-4 py-3 rounded-2xl border font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Compass className="w-4 h-4 text-indigo-500" />
                  <span>{isOdia ? 'ଏଠାରେ ଗେମ୍ ଦେଖନ୍ତୁ' : 'Preview Game Here'}</span>
                </button>
              )}
            </div>

            {/* Metadata Bar */}
            <div
              className={`mt-6 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${
                isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
              }`}
            >
              <div>
                <span className="font-bold uppercase text-[10px] block opacity-75">Author</span>
                <strong className="text-slate-900 dark:text-white">Sandeep Biswal G</strong>
              </div>
              <div>
                <span className="font-bold uppercase text-[10px] block opacity-75">
                  Blog Canonical
                </span>
                <a
                  href="https://imsbg.github.io/bingo/"
                  className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                >
                  https://imsbg.github.io/bingo/
                </a>
              </div>
              <div>
                <span className="font-bold uppercase text-[10px] block opacity-75">
                  Game App URL
                </span>
                <a
                  href="https://desibingo.netlify.app/"
                  className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline break-all"
                >
                  https://desibingo.netlify.app/
                </a>
              </div>
              <div>
                <span className="font-bold uppercase text-[10px] block opacity-75">
                  Supported Modes
                </span>
                <strong className="text-slate-900 dark:text-white">
                  WebRTC P2P, Spectator & AI
                </strong>
              </div>
            </div>
          </section>

          {/* Visual Interactive Board & Color Legend Showcase */}
          <section
            aria-labelledby="visual-board-preview"
            className={`rounded-3xl border p-5 sm:p-7 ${
              isDarkMode
                ? 'bg-slate-900/75 border-slate-800'
                : 'bg-white border-slate-200/90 shadow-md shadow-indigo-500/5'
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <Grid className="w-4 h-4" />
                  <span>
                    {isOdia
                      ? '୫×୫ ବିଙ୍ଗୋ ବୋର୍ଡ ଏବଂ ରଙ୍ଗର ଅର୍ଥ'
                      : 'Interactive Visual Guide: How the 5×5 Board Works'}
                  </span>
                </div>
                <h2
                  id="visual-board-preview"
                  className="text-xl sm:text-2xl font-black tracking-tight"
                >
                  {isOdia
                    ? 'ସବୁଜ ବକ୍ସ, ଲାଲ୍ ବକ୍ସ, ୨-ରଙ୍ଗର ନମ୍ବର ଏବଂ ହଳଦିଆ ରିଙ୍ଗ୍'
                    : 'Green & Red Boxes, 2-Color Player Numbers & Yellow Ring'}
                </h2>
                {isOdia ? (
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    ଖେଳ ସମୟରେ ଯେତେବେଳେ କୌଣସି ନମ୍ବର ଡକାଯାଏ, ବକ୍ସଟି <strong>ଲାଲ୍ (Red)</strong> ହୋଇଯାଏ
                    ଏବଂ ସମ୍ପୂର୍ଣ୍ଣ ୫ଟି ଘରର ଲାଇନ୍ ପୂରଣ ହେଲେ ବକ୍ସଟି <strong>ସବୁଜ (Green)</strong>{' '}
                    ହୋଇଯାଏ । ଖେଳାଳି ୧ (P1) ଡାକିଥିବା ନମ୍ବର <strong>ନୀଳ (Blue)</strong> ରଙ୍ଗରେ ଏବଂ
                    ଖେଳାଳି ୨ (P2) ଡାକିଥିବା ନମ୍ବର <strong>କମଳା (Orange)</strong> ରଙ୍ଗରେ ଦେଖାଯାଏ ।
                    ସବୁଠାରୁ ଶେଷରେ ଡକାଯାଇଥିବା ନମ୍ବର ଚାରିପାଶରେ ହଳଦିଆ ରିଙ୍ଗ୍ ଦେଖାଯାଏ ।
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Every cell on the 5×5 board gives instant visual feedback: called numbers turn{' '}
                    <strong>Red</strong>, completed 5-cell lines turn <strong>Green</strong>, Player
                    1’s called numbers display in <strong>Blue</strong>, Player 2’s called numbers
                    display in <strong>Orange</strong>, and the most recently called number glows
                    with a bright <strong>Yellow Ring (LAST)</strong>.
                  </p>
                )}

                {/* Legend Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                  <div
                    className={`p-3 rounded-2xl border flex items-center gap-3 ${
                      isDarkMode
                        ? 'bg-slate-800/70 border-slate-700'
                        : 'bg-emerald-50/70 border-emerald-200'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 shadow-xs">
                      7
                    </span>
                    <div>
                      <strong className="block text-emerald-700 dark:text-emerald-400">
                        {isOdia ? 'ସବୁଜ ବକ୍ସ (Green Box)' : 'Green Box (Completed Line)'}
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isOdia
                          ? 'ପୂରଣ ହୋଇଥିବା B-I-N-G-O ଲାଇନର ନମ୍ବର ।'
                          : 'Part of a completed 5-cell B-I-N-G-O line.'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border flex items-center gap-3 ${
                      isDarkMode
                        ? 'bg-slate-800/70 border-slate-700'
                        : 'bg-rose-50/70 border-rose-200'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center shrink-0 shadow-xs">
                      15
                    </span>
                    <div>
                      <strong className="block text-rose-700 dark:text-rose-400">
                        {isOdia ? 'ଲାଲ୍ ବକ୍ସ (Red Box)' : 'Red Box (Called Number)'}
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isOdia
                          ? 'ଡକାଯାଇଥିବା ନମ୍ବର (ଲାଇନ୍ ବାକି ଅଛି) ।'
                          : 'Number has been called, line not yet complete.'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border flex items-center gap-3 ${
                      isDarkMode
                        ? 'bg-slate-800/70 border-slate-700'
                        : 'bg-blue-50/70 border-blue-200'
                    }`}
                  >
                    <span className="px-2 py-1 rounded-lg bg-white text-blue-700 border border-blue-300 font-mono font-black text-xs shrink-0 shadow-xs">
                      P1 • Blue
                    </span>
                    <div>
                      <strong className="block text-blue-700 dark:text-sky-400">
                        {isOdia ? 'ଖେଳାଳି ୧ ଓ ୨ ନମ୍ବର ରଙ୍ଗ' : '2-Color Player Numbers'}
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isOdia
                          ? 'P1 ପାଇଁ ନୀଳ ଏବଂ P2 ପାଇଁ କମଳା ନମ୍ବର ।'
                          : 'Blue number for Player 1, Orange for Player 2.'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-2xl border flex items-center gap-3 ${
                      isDarkMode
                        ? 'bg-slate-800/70 border-slate-700'
                        : 'bg-amber-50/80 border-amber-200'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 ring-3 ring-yellow-400 text-white font-black flex items-center justify-center shrink-0 shadow-xs">
                      12
                    </span>
                    <div>
                      <strong className="block text-amber-700 dark:text-yellow-400">
                        {isOdia ? 'ହଳଦିଆ ରିଙ୍ଗ୍ (Last Called)' : 'Yellow Ring (Last Called)'}
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isOdia
                          ? 'ଶେଷ ଡକାଯାଇଥିବା ନମ୍ବର ଚାରିପାଶରେ ହଳଦିଆ ରିଙ୍ଗ୍ ଦେଖାଯାଏ ।'
                          : 'Highlights the most recently called number on the board.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Visual Sample Card */}
              <div
                className={`w-full lg:w-72 p-4 rounded-2xl border shrink-0 space-y-3 ${
                  isDarkMode
                    ? 'bg-slate-950/90 border-slate-800'
                    : 'bg-slate-50 border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    {isOdia ? 'ଲାଇଭ୍ ବୋର୍ଡ ଉଦାହରଣ' : 'Live Board Sample'}
                  </span>
                  <div className="flex items-center gap-1">
                    {BINGO_LETTERS.map((l, idx) => (
                      <span
                        key={l}
                        className={`w-5 h-5 rounded-md font-mono font-black text-[10px] flex items-center justify-center ${
                          idx < 2
                            ? 'bg-emerald-500 text-white'
                            : isDarkMode
                            ? 'bg-slate-800 text-slate-500'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {demoCells.map((cell) => (
                    <div
                      key={cell.num}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center relative border font-mono ${
                        cell.state === 'green'
                          ? 'bg-emerald-600 border-emerald-400'
                          : cell.state === 'red'
                          ? 'bg-rose-600 border-rose-400'
                          : isDarkMode
                          ? 'bg-slate-900 border-slate-800 text-slate-200'
                          : 'bg-white border-slate-200 text-slate-800'
                      } ${cell.isLast ? 'ring-3 ring-yellow-400 z-10' : ''}`}
                    >
                      {cell.caller ? (
                        <span
                          className={`px-1.5 py-0.5 rounded-md bg-white text-xs font-black leading-none shadow-xs ${
                            cell.caller === 'P1' ? 'text-blue-700' : 'text-orange-600'
                          }`}
                        >
                          {cell.num}
                        </span>
                      ) : (
                        <span className="text-xs font-extrabold">{cell.num}</span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                  {isOdia
                    ? '୫ଟି ଲାଇନ୍ (B-I-N-G-O) ପ୍ରଥମେ ପୂରଣ କଲେ ବିଜୟୀ!'
                    : 'Complete 5 lines (B-I-N-G-O) first to win the round!'}
                </p>
              </div>
            </div>
          </section>

          {/* Detailed Feature Sections (2-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 1: How to Play 1 to 25 Bingo */}
            <section
              className={`rounded-3xl border p-6 space-y-3 ${
                isDarkMode
                  ? 'bg-slate-900/75 border-slate-800'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {isOdia
                  ? '୧. ୧ ରୁ ୨୫ ବିଙ୍ଗୋ ଖେଳର ନିୟମ (How to Play)'
                  : '1. How to Play Indian 1 to 25 Bingo Online'}
              </h2>
              {isOdia ? (
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>
                    ପ୍ରত্যେକ ଖେଳାଳିଙ୍କୁ ୫×୫ ବୋର୍ଡରେ ୧ ରୁ ୨୫ ପର୍ଯ୍ୟନ୍ତ ନମ୍ବର ସଜାଇବାକୁ ମିଳେ । ଆପଣ{' '}
                    <strong>Auto Shuffle</strong> କିମ୍ବା <strong>Fill Manually (1→25)</strong>{' '}
                    ବ୍ୟବହାର କରି ନିଜ ପସନ୍ଦରେ ନମ୍ବର ରଖିପାରିବେ ।
                  </li>
                  <li>
                    ଦୁଇ ଖେଳାଳି ପାଳି କରି ଗୋଟିଏ ଲେଖାଏଁ ନମ୍ବର ଡାକନ୍ତି ଏବଂ ସେହି ନମ୍ବରଟି ଉଭୟ ଖେଳାଳିଙ୍କ
                    ବୋର୍ଡରେ କଟିଯାଏ ।
                  </li>
                  <li>
                    ଗୋଟିଏ ଧାଡ଼ି (Horizontal, Vertical କିମ୍ବା Diagonal) ର ୫ଟି ନମ୍ବର କଟିଗଲେ ଗୋଟିଏ ଅକ୍ଷର
                    (B → I → N → G → O) ପୂରଣ ହୁଏ ।
                  </li>
                  <li>ଯିଏ ପ୍ରଥମେ ୫ଟି ଲାଇନ୍ (B-I-N-G-O) ସମ୍ପୂର୍ଣ୍ଣ କରେ, ସେ ବିଜୟୀ ହୁଏ ।</li>
                </ul>
              ) : (
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>
                    Each player receives a <strong>5×5 grid</strong> containing the numbers{' '}
                    <strong>1 to 25</strong>. Use <strong>Auto Shuffle</strong> for instant setup or{' '}
                    <strong>Fill Manually (1→25)</strong> to tap cells in your own secret order.
                  </li>
                  <li>
                    Players alternate turns calling one uncalled number. That number is immediately
                    marked on <strong>both players’ boards</strong> at the same time.
                  </li>
                  <li>
                    Completing any full row, column, or diagonal of 5 called numbers unlocks one
                    letter of <strong>B - I - N - G - O</strong>.
                  </li>
                  <li>
                    The first player to complete <strong>5 lines (B-I-N-G-O)</strong> wins the
                    match!
                  </li>
                </ul>
              )}
            </section>

            {/* Section 2: Smart Play Mode ON vs Secret Mode OFF */}
            <section
              className={`rounded-3xl border p-6 space-y-3 ${
                isDarkMode
                  ? 'bg-slate-900/75 border-slate-800'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {isOdia
                  ? '୨. Smart Play ON ବନାମ Secret Mode OFF'
                  : '2. Smart Play Mode ON vs. Secret Mode OFF'}
              </h2>
              {isOdia ? (
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-indigo-600 dark:text-indigo-400">
                      Secret Mode (Smart Play OFF - ଡିଫଲ୍ଟ):
                    </strong>{' '}
                    ଖେଳ ଚାଲିଥିବା ସମୟରେ ପ୍ରତିପକ୍ଷଙ୍କ ବୋର୍ଡ ଏବଂ B-I-N-G-O ଲାଇନ୍ ସମ୍ପୂର୍ଣ୍ଣ ଗୋପନ ରହେ ।
                    ଖେଳ ଶେଷ ହେବା ପରେ ଉଭୟ ଖେଳାଳିଙ୍କ ବୋର୍ଡ ପାଖାପାଖି ଦେଖାଯାଏ ।
                  </p>
                  <p>
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      Smart Play Mode (Smart Play ON):
                    </strong>{' '}
                    ରୁମ୍ ତିଆରି କରିବା ସମୟରେ Smart Play ଚେକ୍-ବକ୍ସ ଅନ୍ କଲେ, ପ୍ରତିପକ୍ଷଙ୍କ ୫×୫ ମିନି-ମ୍ୟାପ୍
                    (ବିନା ନମ୍ବରରେ କେବଳ ଲାଲ୍ ଓ ସବୁଜ ବକ୍ସ) ଏବଂ B-I-N-G-O ଅକ୍ଷରର ସ୍ଥିତି ଲାଇଭ୍ ଦେଖାଯାଏ ।
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-indigo-600 dark:text-indigo-400">
                      Secret Mode (Smart Play OFF — Default):
                    </strong>{' '}
                    Your opponent’s 5×5 board layout and B-I-N-G-O letter progress remain completely
                    hidden during gameplay. As soon as a player wins, both boards are revealed
                    side-by-side so everyone can verify the winning lines.
                  </p>
                  <p>
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      Smart Play Mode (Smart Play ON):
                    </strong>{' '}
                    When enabled while creating a room or starting a solo match, players see a live{' '}
                    <strong>5×5 Opponent Mini-Map without numbers</strong> (showing only Red called
                    cells and Green completed-line cells) plus live B-I-N-G-O letter progress.
                  </p>
                </div>
              )}
            </section>

            {/* Section 3: WebRTC Rooms & Spectator Mode */}
            <section
              className={`rounded-3xl border p-6 space-y-3 ${
                isDarkMode
                  ? 'bg-slate-900/75 border-slate-800'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {isOdia
                  ? '୩. WebRTC ଅନଲାଇନ୍ ରୁମ୍ ଏବଂ ଦର୍ଶକ ମୋଡ୍ (Spectator Mode)'
                  : '3. WebRTC Multiplayer Rooms & Side-by-Side Spectator View'}
              </h2>
              {isOdia ? (
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    କୌଣସି ଲଗଇନ୍ ବିନା <strong>SBXXXX</strong> ରୁମ୍ କୋଡ୍ ତିଆରି କରି ସାଙ୍ଗମାନଙ୍କ ସହିତ
                    ମୋବାଇଲ୍, ଟାବଲେଟ୍ କିମ୍ବା କମ୍ପ୍ୟୁଟରରେ ଖେଳନ୍ତୁ ।
                  </p>
                  <p>
                    <strong>Spectator Mode (ଦର୍ଶକ):</strong> ଦର୍ଶକମାନେ ଉଭୟ ଖେଳାଳିଙ୍କ ବୋର୍ଡ ପାଖାପାଖି
                    (ବାମ ପଟେ Player 1 ଏବଂ ଡାହାଣ ପଟେ Player 2) ଦେଖିପାରିବେ ଏବଂ ଡାହାଣ ପଟେ ଥିବା ଭର୍ଟିକାଲ୍
                    ଇମୋଜି ପ୍ୟାନେଲରୁ ରିଆକ୍ସନ୍ ପଠାଇପାରିବେ । Smart Play ବନ୍ଦ ଥିଲେ ଦର୍ଶକମାନଙ୍କୁ ବୋର୍ଡ
                    ସୂଚନା ସେୟାର ନକରିବା ପାଇଁ ସତର୍କ ସୂଚନା ଦେଖାଯାଏ ।
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Create instant peer-to-peer rooms (<code className="font-mono">SBXXXX</code>) and
                    invite friends via WhatsApp link or QR code across mobile, tablet, and PC.
                  </p>
                  <p>
                    <strong>Side-by-Side Spectator Mode:</strong> Spectators watch Player 1’s board
                    on the left and Player 2’s board on the right in real time, with a dedicated
                    vertical emoji reaction bar on the right side and an anti-cheating fair-play
                    notice whenever Smart Play is OFF.
                  </p>
                </div>
              )}
            </section>

            {/* Section 4: English Voice Announcements & Smart AI */}
            <section
              className={`rounded-3xl border p-6 space-y-3 ${
                isDarkMode
                  ? 'bg-slate-900/75 border-slate-800'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {isOdia
                  ? '୪. ଇଂରାଜୀ ଭଏସ୍ ଘୋଷଣା ଏବଂ ସ୍ମାର୍ଟ କମ୍ପ୍ୟୁଟର AI'
                  : '4. Spoken English Number Callouts & Smart Computer AI'}
              </h2>
              {isOdia ? (
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong>Spoken English Voice Callouts:</strong> ଯେତେବେଳେ କୌଣସି ଖେଳାଳି ଏକ ନମ୍ବରରେ
                    କ୍ଲିକ୍ କରନ୍ତି, ଉଭୟ ଓଡ଼ିଆ ଏବଂ ଇଂରାଜୀ ମୋଡ୍ ରେ ସେହି ନମ୍ବରଟି ସ୍ପଷ୍ଟ ଇଂରାଜୀ ସ୍ୱରରେ
                    ଶୁଣାଯାଏ ।
                  </p>
                  <p>
                    <strong>Play vs Computer AI:</strong> ସାଙ୍ଗ ଅନଲାଇନ୍ ନଥିଲେ ଆପଣ ଆମର ସ୍ମାର୍ଟ
                    କମ୍ପ୍ୟୁଟର AI ସହିତ ଏକାକୀ ଖେଳି ଅଭ୍ୟାସ କରିପାରିବେ ।
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong>Spoken English Voice Callouts:</strong> Every time a player taps a
                    number from 1 to 25, the game speaks the number aloud in clear English (even
                    when browsing in Odia mode) so neither player misses a call.
                  </p>
                  <p>
                    <strong>Solo vs. Smart Computer AI:</strong> Practice anytime against an
                    intelligent bot that calculates multi-line intersections on its own 5×5 board.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Comparison Table: Smart Play vs Secret Mode */}
          <section
            className={`rounded-3xl border p-6 sm:p-8 space-y-4 ${
              isDarkMode
                ? 'bg-slate-900/75 border-slate-800'
                : 'bg-white border-slate-200/90 shadow-sm'
            }`}
          >
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {isOdia
                ? 'Smart Play Mode ବନାମ Secret Mode ତୁଳନା'
                : 'Feature Comparison: Secret Mode (Default) vs. Smart Play Mode'}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr
                    className={`border-b ${
                      isDarkMode
                        ? 'border-slate-800 text-slate-300'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <th className="py-3 pr-4 font-extrabold">
                      {isOdia ? 'ବୈଶିଷ୍ଟ୍ୟ (Feature)' : 'Feature'}
                    </th>
                    <th className="py-3 px-4 font-extrabold text-indigo-600 dark:text-indigo-400">
                      <span className="inline-flex items-center gap-1">
                        <EyeOff className="w-3.5 h-3.5" />
                        {isOdia ? 'Secret Mode (Smart Play OFF)' : 'Secret Mode (Smart Play OFF)'}
                      </span>
                    </th>
                    <th className="py-3 pl-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {isOdia ? 'Smart Play Mode (ON)' : 'Smart Play Mode (ON)'}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDarkMode
                      ? 'divide-slate-800 text-slate-300'
                      : 'divide-slate-200 text-slate-600'
                  }`}
                >
                  <tr>
                    <td className="py-3 pr-4 font-bold">
                      {isOdia ? 'ପ୍ରତିପକ୍ଷଙ୍କ ୫×୫ ମିନି-ମ୍ୟାପ୍' : 'Opponent 5×5 Mini-Map'}
                    </td>
                    <td className="py-3 px-4">
                      {isOdia
                        ? 'ଖେଳ ସମୟରେ ଗୋପନ ରହେ ।'
                        : 'Hidden during active match for maximum suspense.'}
                    </td>
                    <td className="py-3 pl-4">
                      {isOdia
                        ? 'ବିନା ନମ୍ବରରେ ଲାଲ୍ ଓ ସବୁଜ ବକ୍ସ ସହିତ ଲାଇଭ୍ ଦେଖାଯାଏ ।'
                        : 'Shown live without numbers (Red & Green boxes only).'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold">
                      {isOdia ? 'ପ୍ରତିପକ୍ଷଙ୍କ B-I-N-G-O ଅକ୍ଷର' : 'Opponent B-I-N-G-O Letters'}
                    </td>
                    <td className="py-3 px-4">
                      {isOdia ? 'ଖେଳ ସମୟରେ ଲୁଚି ରହେ ।' : 'Kept secret until a player wins.'}
                    </td>
                    <td className="py-3 pl-4">
                      {isOdia
                        ? 'B, I, N, G, O କେଉଁଟି ପୂରଣ ହେଲା ଲାଇଭ୍ ଦେଖାଯାଏ ।'
                        : 'Live letter progress (B, I, N, G, O) visible to both players.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold">
                      {isOdia ? 'ଖେଳ ଶେଷ ହେବା ପରେ ବୋର୍ଡ' : 'Post-Win Board Reveal'}
                    </td>
                    <td className="py-3 px-4">
                      {isOdia
                        ? 'ବିଜୟ ପରେ ଉଭୟ ଖେଳାଳିଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ବୋର୍ଡ ଦେଖାଯାଏ ।'
                        : 'Both full boards + numbers revealed side-by-side after win!'}
                    </td>
                    <td className="py-3 pl-4">
                      {isOdia
                        ? 'ବିଜୟ ପରେ ଉଭୟ ଖେଳାଳିଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ବୋର୍ଡ ଦେଖାଯାଏ ।'
                        : 'Both full boards + numbers revealed side-by-side after win!'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold">
                      {isOdia ? 'ଦର୍ଶକ ସତର୍କ ସୂଚନା (Spectator Warning)' : 'Spectator Anti-Cheat Notice'}
                    </td>
                    <td className="py-3 px-4">
                      {isOdia
                        ? 'ଦର୍ଶକମାନଙ୍କୁ ବୋର୍ଡ ସେୟାର ନକରିବା ପାଇଁ ସତର୍କ ସୂଚନା ଦେଖାଯାଏ ।'
                        : 'Displays anti-cheat warning not to share board details.'}
                    </td>
                    <td className="py-3 pl-4">
                      {isOdia
                        ? 'ଆବଶ୍ୟକ ନାହିଁ (କାରଣ ମିନି-ମ୍ୟାପ୍ ପୂର୍ବରୁ ଖୋଲା ଅଛି) ।'
                        : 'Warning hidden since progress is already open in Smart Play.'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Section for SEO */}
          <section
            aria-labelledby="blog-faq-heading"
            className={`rounded-3xl border p-6 sm:p-8 space-y-5 ${
              isDarkMode
                ? 'bg-slate-900/75 border-slate-800'
                : 'bg-white border-slate-200/90 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 id="blog-faq-heading" className="text-xl sm:text-2xl font-black tracking-tight">
                {isOdia
                  ? 'ବାରମ୍ବାର ପଚରାଯାଉଥିବା ପ୍ରଶ୍ନ (FAQ)'
                  : 'Frequently Asked Questions (FAQ)'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-2xl border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h3 className="font-extrabold text-sm">
                  {isOdia
                    ? '୧. ଏହି ୧ ରୁ ୨୫ ବିଙ୍ଗୋ ଖେଳ କେଉଁଠାରେ ଖେଳିପାରିବି?'
                    : '1. Where can I play the Indian 1 to 25 Bingo Game live?'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isOdia ? (
                    <>
                      ଆପଣ{' '}
                      <a
                        href="https://desibingo.netlify.app/"
                        className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                      >
                        https://desibingo.netlify.app/
                      </a>{' '}
                      କୁ ଯାଇ ମାଗଣାରେ ଅନଲାଇନ୍ ମଲ୍ଟିପ୍ଲେୟାର କିମ୍ବା କମ୍ପ୍ୟୁଟର ସହିତ ଖେଳିପାରିବେ ।
                    </>
                  ) : (
                    <>
                      You can play the full interactive game right now at{' '}
                      <a
                        href="https://desibingo.netlify.app/"
                        className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                      >
                        https://desibingo.netlify.app/
                      </a>{' '}
                      for free on mobile, tablet, or desktop.
                    </>
                  )}
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h3 className="font-extrabold text-sm">
                  {isOdia
                    ? '୨. ଶେଷ ଡକାଯାଇଥିବା ନମ୍ବର କିପରି ଚିହ୍ନିବି?'
                    : '2. How do I know which number my opponent called last?'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isOdia
                    ? 'ସବୁଠାରୁ ଶେଷରେ ଡକାଯାଇଥିବା ନମ୍ବର ଚାରିପାଶରେ ହଳଦିଆ ରିଙ୍ଗ୍ ଦେଖାଯାଏ ଏବଂ ତାହା ଉପରେ LAST ବ୍ୟାଜ୍ ଥାଏ ।'
                    : 'The last called number is highlighted with a glowing Yellow Ring and a LAST badge on the 5×5 board, plus a live badge in the board header.'}
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h3 className="font-extrabold text-sm">
                  {isOdia
                    ? '୩. ଏହି ଖେଳର ନିର୍ମାତା (Author) କିଏ?'
                    : '3. Who is the author and developer of this Bingo game?'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isOdia
                    ? 'ଏହି ବିଙ୍ଗୋ ଖେଳ ଏବଂ ଅଫିସିଆଲ୍ ବ୍ଲଗ୍ Sandeep Biswal G ଙ୍କ ଦ୍ୱାରା ଡିଜାଇନ୍ ଏବଂ ବିକଶିତ କରାଯାଇଛି ।'
                    : 'Bingo Game - Popular Indian 1 to 25 Bingo is designed and developed by Sandeep Biswal G.'}
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h3 className="font-extrabold text-sm">
                  {isOdia
                    ? '୪. ମୁଁ ଛକି ଶୂନ (Tic Tac Toe) ମଧ୍ୟ ଖେଳିପାରିବି କି?'
                    : '4. Can I also play Odia Chhaki Suna (Tic Tac Toe) online?'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isOdia ? (
                    <>
                      ହଁ! ଛକି ଶୂନ ଖେଳିବା ପାଇଁ{' '}
                      <a
                        href="https://chhakisuna.netlify.app/odia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                      >
                        chhakisuna.netlify.app/odia
                      </a>{' '}
                      କୁ ଯାଆନ୍ତୁ ।
                    </>
                  ) : (
                    <>
                      Yes! You can play Chhaki Suna (Tic Tac Toe) online at{' '}
                      <a
                        href="https://chhakisuna.netlify.app/en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                      >
                        chhakisuna.netlify.app/en
                      </a>{' '}
                      or{' '}
                      <a
                        href="https://chhakisuna.netlify.app/odia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                      >
                        /odia
                      </a>
                      .
                    </>
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Author & More Games Footer Card */}
          <footer
            className={`rounded-3xl border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
              isDarkMode
                ? 'bg-slate-900/90 border-slate-800'
                : 'bg-gradient-to-r from-indigo-50 via-white to-emerald-50 border-slate-200'
            }`}
          >
            <div className="space-y-1.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {isOdia ? 'ଲେଖକ ଏବଂ ଡେଭଲପର୍' : 'About the Author & Developer'}
              </div>
              <h2 className="text-lg sm:text-xl font-black">Sandeep Biswal G</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                {isOdia
                  ? 'Bingo Game - Popular Indian 1 to 25 Bingo ର ଅଫିସିଆଲ୍ ଗାଇଡ୍ (imsbg.github.io/bingo) ଏବଂ ଲାଇଭ୍ ଖେଳ ପୋର୍ଟାଲ୍ (desibingo.netlify.app) ।'
                  : 'Creator of Bingo Game - Popular Indian 1 to 25 Bingo (desibingo.netlify.app) and Chhaki Suna Online Tic Tac Toe (chhakisuna.netlify.app).'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold">
                <a
                  href="https://desibingo.netlify.app/"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Play Bingo (desibingo.netlify.app)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span>•</span>
                <a
                  href={
                    isOdia
                      ? 'https://chhakisuna.netlify.app/odia'
                      : 'https://chhakisuna.netlify.app/en'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>
                    {isOdia
                      ? 'ଛକି ଶୂନ ଖେଳନ୍ତୁ (Chhaki Suna Khelantu)'
                      : 'Play Tic Tac Toe (chhakisuna.netlify.app)'}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span>•</span>
                <a
                  href="https://play.google.com/store/apps/dev?id=6501689567504406715"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:underline flex items-center gap-1"
                >
                  <span>Google Play Store</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <a
              href="https://desibingo.netlify.app/"
              className="px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 shrink-0 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isOdia ? 'ବର୍ତ୍ତମାନ ବିଙ୍ଗୋ ଖେଳନ୍ତୁ' : 'Launch Game Now'}</span>
            </a>
          </footer>
        </article>
      </main>
    </div>
  );
};
