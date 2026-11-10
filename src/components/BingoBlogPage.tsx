import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  Sparkles,
  Users,
  Eye,
  EyeOff,
  Grid,
  Volume2,
  Trophy,
  Sun,
  Moon,
  Languages,
  ExternalLink,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { Language, Translations } from '../utils/translations';
import { BINGO_LETTERS } from '../game/rules';
import { sounds } from '../utils/sound';

interface BingoBlogPageProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSwitchToGameView?: () => void;
  t: Translations;
}

interface DemoCell {
  num: number;
  state: 'green' | 'red' | 'uncalled';
  caller: 'P1' | 'P2' | null;
}

const INITIAL_25_DEMO_CELLS: DemoCell[] = [
  // Row 1 (Completed Green Line)
  { num: 7, state: 'green', caller: 'P1' },
  { num: 19, state: 'green', caller: 'P2' },
  { num: 3, state: 'green', caller: 'P1' },
  { num: 24, state: 'green', caller: 'P2' },
  { num: 12, state: 'green', caller: 'P1' },
  // Row 2
  { num: 15, state: 'red', caller: 'P2' },
  { num: 1, state: 'uncalled', caller: null },
  { num: 22, state: 'red', caller: 'P1' },
  { num: 9, state: 'uncalled', caller: null },
  { num: 18, state: 'uncalled', caller: null },
  // Row 3
  { num: 5, state: 'uncalled', caller: null },
  { num: 14, state: 'red', caller: 'P2' },
  { num: 25, state: 'uncalled', caller: null },
  { num: 11, state: 'uncalled', caller: null },
  { num: 2, state: 'uncalled', caller: null },
  // Row 4
  { num: 20, state: 'uncalled', caller: null },
  { num: 8, state: 'uncalled', caller: null },
  { num: 16, state: 'red', caller: 'P1' },
  { num: 4, state: 'uncalled', caller: null },
  { num: 23, state: 'uncalled', caller: null },
  // Row 5
  { num: 13, state: 'uncalled', caller: null },
  { num: 21, state: 'uncalled', caller: null },
  { num: 6, state: 'uncalled', caller: null },
  { num: 17, state: 'red', caller: 'P2' },
  { num: 10, state: 'uncalled', caller: null },
];

export const BingoBlogPage: React.FC<BingoBlogPageProps> = ({
  currentLanguage,
  onSelectLanguage,
  isDarkMode,
  onToggleTheme,
  onSwitchToGameView,
}) => {
  const isOdia = currentLanguage === 'or';
  const [demoCells, setDemoCells] = useState<DemoCell[]>(INITIAL_25_DEMO_CELLS);
  const [lastCalledNum, setLastCalledNum] = useState<number>(12);

  const handleTapDemoCell = (num: number) => {
    setLastCalledNum(num);
    setDemoCells((prev) =>
      prev.map((c) =>
        c.num === num && c.state === 'uncalled'
          ? { ...c, state: 'red', caller: 'P1' }
          : c
      )
    );
    sounds.speakNumber(num, currentLanguage);
  };

  return (
    <div
      id="github-bingo-blog"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-gradient-to-br from-slate-50 via-indigo-50/40 to-teal-50/30 text-slate-900'
      }`}
    >
      {/* Floating Rounded Liquid Glass Header */}
      <header className="w-full sticky top-2.5 sm:top-4 z-40 px-3 sm:px-6 pt-2">
        <div
          className={`max-w-5xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 rounded-2xl sm:rounded-3xl border backdrop-blur-2xl backdrop-saturate-150 flex items-center justify-between gap-2 transition-all ${
            isDarkMode
              ? 'bg-slate-900/75 border-white/15 text-slate-100 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.12)]'
              : 'bg-white/75 border-white/85 text-slate-900 shadow-[0_14px_34px_-8px_rgba(79,70,229,0.14),0_4px_12px_-2px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)]'
          }`}
        >
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
                  {isOdia ? 'ବିଙ୍ଗୋ ୧–୨୫ ବ୍ଲଗ୍' : 'Bingo 1–25 Official Blog'}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                {isOdia
                  ? 'ଭାରତର ଲୋକପ୍ରିୟ ୧ ରୁ ୨୫ ବିଙ୍ଗୋ ଖେଳ'
                  : 'Popular Indian 1 to 25 Bingo Guide'}
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
                  ? 'bg-slate-800/80 border-slate-700 text-indigo-400 hover:bg-slate-700'
                  : 'bg-indigo-50/90 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              }`}
              title="Switch Language"
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
                  ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700'
                  : 'bg-slate-100/90 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="https://desibingo.netlify.app/"
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isOdia ? 'ଲାଇଭ୍ ଖେଳନ୍ତୁ' : 'Play Bingo Live'}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Article Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <article className="space-y-8 sm:space-y-10">
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
                    ? 'ବିଙ୍ଗୋ ୧–୨୫ ସମ୍ପୂର୍ଣ୍ଣ ନିୟମ ଏବଂ ସୂଚନା'
                    : 'Official Game Guide & Feature Blog'}
                </span>
              </span>
            </div>

            {/* Primary H1 Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
              Bingo Game - Popular Indian 1 to 25 Bingo
            </h1>

            {isOdia ? (
              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mb-6">
                ଭାରତର ସବୁଠାରୁ ଲୋକପ୍ରିୟ ୧ ରୁ ୨୫ ବିଙ୍ଗୋ ଖେଳର ସମ୍ପୂର୍ଣ୍ଣ ନିୟମ, ସ୍ମାର୍ଟ ପ୍ଲେ ମିନି-ମ୍ୟାପ୍,
                ଗୁପ୍ତ ମୋଡ୍, ୨-ରଙ୍ଗର ଖେଳାଳି ନମ୍ବର, ଅନଲାଇନ୍ ରୁମ୍ ଏବଂ ଦର୍ଶକ ମୋଡ୍ ବିଷୟରେ ଏଠାରେ ପଢ଼ନ୍ତୁ ।
                ଆପଣ ଏହି ଖେଳକୁ{' '}
                <a
                  href="https://desibingo.netlify.app/"
                  className="text-indigo-600 dark:text-indigo-400 font-bold underline"
                >
                  desibingo.netlify.app
                </a>{' '}
                ରେ ସାଙ୍ଗମାନଙ୍କ ସହିତ କିମ୍ବା କମ୍ପ୍ୟୁଟର ବିପକ୍ଷରେ ମାଗଣାରେ ଖେଳିପାରିବେ ।
              </p>
            ) : (
              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl mb-6">
                Welcome to the official documentation and strategy blog for{' '}
                <strong>Bingo Game - Popular Indian 1 to 25 Bingo (ବିଙ୍ଗୋ)</strong>. Discover how
                classic school-notebook 5×5 Bingo works online with instant multiplayer rooms (
                <code className="font-mono">SBXXXX</code>), Smart Play Mini-Map vs. Secret Mode,
                2-color player numbers, English voice callouts, and live side-by-side Spectator
                mode.
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
                    ? 'ଅନଲାଇନ୍ ବିଙ୍ଗୋ ଖେଳନ୍ତୁ'
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
                <span>ଓଡ଼ିଆରେ ଖେଳନ୍ତୁ</span>
              </a>

              <a
                href="https://desibingo.netlify.app/en"
                className={`px-4 py-3 rounded-2xl border font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/90 border-slate-700 text-indigo-400 hover:bg-slate-800'
                    : 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-xs'
                }`}
              >
                <span>{isOdia ? 'ଇଂରାଜୀରେ ଖେଳନ୍ତୁ' : 'Play in English'}</span>
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
              className={`mt-6 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs ${
                isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
              }`}
            >
              <div>
                <span className="font-bold uppercase text-[10px] block opacity-75">
                  {isOdia ? 'ବ୍ଲଗ୍ ଲିଙ୍କ୍' : 'Blog Canonical'}
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
                  {isOdia ? 'ଖେଳ ୱେବସାଇଟ୍' : 'Game App URL'}
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
                  {isOdia ? 'ଖେଳ ମୋଡ୍' : 'Supported Modes'}
                </span>
                <strong className="text-slate-900 dark:text-white">
                  {isOdia
                    ? 'ଅନଲାଇନ୍ ରୁମ୍, ଦର୍ଶକ ଏବଂ କମ୍ପ୍ୟୁଟର'
                    : 'Online Multiplayer, Spectator & AI'}
                </strong>
              </div>
            </div>
          </section>

          {/* Visual Interactive Board (All 25 Cells) & Color Legend Showcase */}
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
                    ଖେଳ ସମୟରେ ଯେତେବେଳେ କୌଣସି ନମ୍ବର ଡକାଯାଏ, ବକ୍ସଟି <strong>ଲାଲ୍</strong> ହୋଇଯାଏ ଏବଂ
                    ସମ୍ପୂର୍ଣ୍ଣ ୫ଟି ଘରର ଲାଇନ୍ ପୂରଣ ହେଲେ ବକ୍ସଟି <strong>ସବୁଜ</strong> ହୋଇଯାଏ । ଖେଳାଳି ୧
                    ଡାକିଥିବା ନମ୍ବର <strong>ନୀଳ</strong> ରଙ୍ଗରେ ଏବଂ ଖେଳାଳି ୨ ଡାକିଥିବା ନମ୍ବର{' '}
                    <strong>କମଳା</strong> ରଙ୍ଗରେ ଦେଖାଯାଏ । ସବୁଠାରୁ ଶେଷରେ ଡକାଯାଇଥିବା ନମ୍ବର ଚାରିପାଶରେ
                    ହଳଦିଆ ରିଙ୍ଗ୍ ଦେଖାଯାଏ ।
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
                        {isOdia ? 'ସବୁଜ ବକ୍ସ' : 'Green Box (Completed Line)'}
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isOdia
                          ? 'ପୂରଣ ହୋଇଥିବା ଲାଇନର ନମ୍ବର ।'
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
                        {isOdia ? 'ଲାଲ୍ ବକ୍ସ' : 'Red Box (Called Number)'}
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isOdia
                          ? 'ଡକାଯାଇଥିବା ନମ୍ବର ।'
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
                      7 • 19
                    </span>
                    <div>
                      <strong className="block text-blue-700 dark:text-sky-400">
                        {isOdia ? '୨-ରଙ୍ଗର ଖେଳାଳି ନମ୍ବର' : '2-Color Player Numbers'}
                      </strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isOdia
                          ? 'ଖେଳାଳି ୧ ପାଇଁ ନୀଳ ଏବଂ ଖେଳାଳି ୨ ପାଇଁ କମଳା ନମ୍ବର ।'
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
                        {isOdia ? 'ହଳଦିଆ ରିଙ୍ଗ୍' : 'Yellow Ring (Last Called)'}
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

              {/* Full 25-Cell Interactive Sample Card */}
              <div
                className={`w-full lg:w-80 p-4 rounded-2xl border shrink-0 space-y-3 ${
                  isDarkMode
                    ? 'bg-slate-950/90 border-slate-800'
                    : 'bg-slate-50 border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    {isOdia
                      ? '୫×୫ ବୋର୍ଡ ଉଦାହରଣ — କ୍ଲିକ୍ କରନ୍ତୁ'
                      : 'Interactive Sample (Tap a Cell)'}
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
                  {demoCells.map((cell) => {
                    const isLast = cell.num === lastCalledNum;
                    return (
                      <button
                        type="button"
                        key={cell.num}
                        onClick={() => handleTapDemoCell(cell.num)}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center relative border font-mono cursor-pointer transition-transform hover:scale-105 ${
                          cell.state === 'green'
                            ? 'bg-emerald-600 border-emerald-400'
                            : cell.state === 'red'
                            ? 'bg-rose-600 border-rose-400'
                            : isDarkMode
                            ? 'bg-slate-900 border-slate-800 text-slate-200'
                            : 'bg-white border-slate-200 text-slate-800'
                        } ${isLast ? 'ring-3 ring-yellow-400 z-10' : ''}`}
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
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                  {isOdia
                    ? 'ଉପର ୨୫ଟି ନମ୍ବର ମଧ୍ୟରୁ ଯେକୌଣସି ନମ୍ବରରେ କ୍ଲିକ୍ କରନ୍ତୁ ।'
                    : 'Tap any of the 25 cells above to hear the English voice callout!'}
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
                  ? '୧. ୧ ରୁ ୨୫ ବିଙ୍ଗୋ ଖେଳର ନିୟମ'
                  : '1. How to Play Indian 1 to 25 Bingo Online'}
              </h2>
              {isOdia ? (
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>
                    ପ୍ରତ୍ୟେକ ଖେଳାଳିଙ୍କୁ ୫×୫ ବୋର୍ଡରେ ୧ ରୁ ୨୫ ପର୍ଯ୍ୟନ୍ତ ନମ୍ବର ସଜାଇବାକୁ ମିଳେ । ଆପଣ
                    ଓଲଟପାଲଟ ବଟନ୍ କିମ୍ବା ନିଜ ପସନ୍ଦରେ ଗୋଟିଏ ପରେ ଗୋଟିଏ ନମ୍ବର ରଖିପାରିବେ ।
                  </li>
                  <li>
                    ଦୁଇ ଖେଳାଳି ପାଳି କରି ଗୋଟିଏ ଲେଖାଏଁ ନମ୍ବର ଡାକନ୍ତି ଏବଂ ସେହି ନମ୍ବରଟି ଉଭୟ ଖେଳାଳିଙ୍କ
                    ବୋର୍ଡରେ କଟିଯାଏ ।
                  </li>
                  <li>ଗୋଟିଏ ଧାଡ଼ିର ୫ଟି ନମ୍ବର କଟିଗଲେ ଗୋଟିଏ ଲାଇନ୍ ପୂରଣ ହୁଏ ।</li>
                  <li>ଯିଏ ପ୍ରଥମେ ୫ଟି ଲାଇନ୍ ସମ୍ପୂର୍ଣ୍ଣ କରେ, ସେ ବିଜୟୀ ହୁଏ ।</li>
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
                  ? '୨. ସ୍ମାର୍ଟ ପ୍ଲେ ବନାମ ଗୁପ୍ତ ମୋଡ୍'
                  : '2. Smart Play Mode ON vs. Secret Mode OFF'}
              </h2>
              {isOdia ? (
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-indigo-600 dark:text-indigo-400">
                      ଗୁପ୍ତ ମୋଡ୍ — ଡିଫଲ୍ଟ:
                    </strong>{' '}
                    ଖେଳ ଚାଲିଥିବା ସମୟରେ ପ୍ରତିପକ୍ଷଙ୍କ ବୋର୍ଡ ଏବଂ ଲାଇନ୍ ପ୍ରଗତି ସମ୍ପୂର୍ଣ୍ଣ ଗୋପନ ରହେ । ଖେଳ
                    ଶେଷ ହେବା ପରେ ଉଭୟ ଖେଳାଳିଙ୍କ ବୋର୍ଡ ପାଖାପାଖି ଦେଖାଯାଏ ।
                  </p>
                  <p>
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      ସ୍ମାର୍ଟ ପ୍ଲେ ମୋଡ୍:
                    </strong>{' '}
                    ରୁମ୍ ତିଆରି କରିବା ସମୟରେ ସ୍ମାର୍ଟ ପ୍ଲେ ଚେକ୍-ବକ୍ସ ଅନ୍ କଲେ, ପ୍ରତିପକ୍ଷଙ୍କ ୫×୫
                    ମିନି-ମ୍ୟାପ୍ ବିନା ନମ୍ବରରେ କେବଳ ଲାଲ୍ ଓ ସବୁଜ ବକ୍ସ ସହିତ ଲାଇଭ୍ ଦେଖାଯାଏ ।
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

            {/* Section 3: Online Rooms & Spectator Mode */}
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
                  ? '୩. ଅନଲାଇନ୍ ରୁମ୍ ଏବଂ ଦର୍ଶକ ମୋଡ୍'
                  : '3. Online Multiplayer Rooms & Side-by-Side Spectator View'}
              </h2>
              {isOdia ? (
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    କୌଣସି ଲଗଇନ୍ ବିନା ରୁମ୍ କୋଡ୍ ତିଆରି କରି ସାଙ୍ଗମାନଙ୍କ ସହିତ ମୋବାଇଲ୍, ଟାବଲେଟ୍ କିମ୍ବା
                    କମ୍ପ୍ୟୁଟରରେ ଖେଳନ୍ତୁ ।
                  </p>
                  <p>
                    <strong>ଦର୍ଶକ ମୋଡ୍:</strong> ଦର୍ଶକମାନେ ଉଭୟ ଖେଳାଳିଙ୍କ ବୋର୍ଡ ପାଖାପାଖି ଦେଖିପାରିବେ
                    ଏବଂ ଡାହାଣ ପଟେ ଥିବା ଇମୋଜି ପ୍ୟାନେଲରୁ ପ୍ରତିକ୍ରିୟା ପଠାଇପାରିବେ । ଗୁପ୍ତ ମୋଡ୍ ଚାଲୁ ଥିଲେ
                    ଦର୍ଶକମାନଙ୍କୁ ବୋର୍ଡ ସୂଚନା ସେୟାର ନକରିବା ପାଇଁ ସତର୍କ ସୂଚନା ଦେଖାଯାଏ ।
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Create instant online rooms (<code className="font-mono">SBXXXX</code>) and
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
                  ? '୪. ଇଂରାଜୀ ଭଏସ୍ ଘୋଷଣା ଏବଂ ଚତୁର କମ୍ପ୍ୟୁଟର'
                  : '4. Spoken English Number Callouts & Smart Computer AI'}
              </h2>
              {isOdia ? (
                <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong>ଇଂରାଜୀ ସ୍ୱର ଘୋଷଣା:</strong> ଯେତେବେଳେ କୌଣସି ଖେଳାଳି ଏକ ନମ୍ବରରେ କ୍ଲିକ୍
                    କରନ୍ତି, ଉଭୟ ଓଡ଼ିଆ ଏବଂ ଇଂରାଜୀ ମୋଡ୍ ରେ ସେହି ନମ୍ବରଟି ସ୍ପଷ୍ଟ ଇଂରାଜୀ ସ୍ୱରରେ ଶୁଣାଯାଏ ।
                  </p>
                  <p>
                    <strong>କମ୍ପ୍ୟୁଟର ସହିତ ଖେଳ:</strong> ସାଙ୍ଗ ଅନଲାଇନ୍ ନଥିଲେ ଆପଣ ଆମର ଚତୁର କମ୍ପ୍ୟୁଟର
                    ସହିତ ଏକାକୀ ଖେଳି ଅଭ୍ୟାସ କରିପାରିବେ ।
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
                ? 'ସ୍ମାର୍ଟ ପ୍ଲେ ମୋଡ୍ ବନାମ ଗୁପ୍ତ ମୋଡ୍ ତୁଳନା'
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
                      {isOdia ? 'ବୈଶିଷ୍ଟ୍ୟ' : 'Feature'}
                    </th>
                    <th className="py-3 px-4 font-extrabold text-indigo-600 dark:text-indigo-400">
                      <span className="inline-flex items-center gap-1">
                        <EyeOff className="w-3.5 h-3.5" />
                        {isOdia ? 'ଗୁପ୍ତ ମୋଡ୍' : 'Secret Mode (Smart Play OFF)'}
                      </span>
                    </th>
                    <th className="py-3 pl-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {isOdia ? 'ସ୍ମାର୍ଟ ପ୍ଲେ ମୋଡ୍' : 'Smart Play Mode (ON)'}
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
                      {isOdia ? 'ପ୍ରତିପକ୍ଷଙ୍କ ଲାଇନ୍ ପ୍ରଗତି' : 'Opponent B-I-N-G-O Letters'}
                    </td>
                    <td className="py-3 px-4">
                      {isOdia ? 'ଖେଳ ସମୟରେ ଲୁଚି ରହେ ।' : 'Kept secret until a player wins.'}
                    </td>
                    <td className="py-3 pl-4">
                      {isOdia
                        ? 'କେଉଁ ଲାଇନ୍ ପୂରଣ ହେଲା ଲାଇଭ୍ ଦେଖାଯାଏ ।'
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
                      {isOdia ? 'ଦର୍ଶକ ସତର୍କ ସୂଚନା' : 'Spectator Anti-Cheat Notice'}
                    </td>
                    <td className="py-3 px-4">
                      {isOdia
                        ? 'ଦର୍ଶକମାନଙ୍କୁ ବୋର୍ଡ ସେୟାର ନକରିବା ପାଇଁ ସତର୍କ ସୂଚନା ଦେଖାଯାଏ ।'
                        : 'Displays anti-cheat warning not to share board details.'}
                    </td>
                    <td className="py-3 pl-4">
                      {isOdia
                        ? 'ଆବଶ୍ୟକ ନାହିଁ କାରଣ ମିନି-ମ୍ୟାପ୍ ପୂର୍ବରୁ ଖୋଲା ଅଛି ।'
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
                  ? 'ବାରମ୍ବାର ପଚରାଯାଉଥିବା ପ୍ରଶ୍ନ'
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
                    ? 'ସବୁଠାରୁ ଶେଷରେ ଡକାଯାଇଥିବା ନମ୍ବର ଚାରିପାଶରେ ହଳଦିଆ ରିଙ୍ଗ୍ ଦେଖାଯାଏ ।'
                    : 'The last called number is highlighted with a glowing Yellow Ring and a LAST badge on the 5×5 board.'}
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h3 className="font-extrabold text-sm">
                  {isOdia
                    ? '୩. ସ୍ମାର୍ଟ ପ୍ଲେ ମୋଡ୍ କ’ଣ?'
                    : '3. What happens when Smart Play Mode is enabled?'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isOdia
                    ? 'ସ୍ମାର୍ଟ ପ୍ଲେ ଅନ୍ କଲେ ଉଭୟ ଖେଳାଳି ପ୍ରତିପକ୍ଷଙ୍କ ୫×୫ ମିନି-ମ୍ୟାପ୍ ବିନା ନମ୍ବରରେ କେବଳ ଲାଲ୍ ଓ ସବୁଜ ଘର ସହିତ ଲାଇଭ୍ ଦେଖିପାରିବେ ।'
                    : 'When Smart Play is enabled, both players see a live 5×5 mini-map of their opponent’s board without numbers, showing only red called boxes and green completed-line boxes.'}
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h3 className="font-extrabold text-sm">
                  {isOdia
                    ? '୪. ମୁଁ ଛକି ଶୂନ ମଧ୍ୟ ଖେଳିପାରିବି କି?'
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

          {/* Quick Game Links Footer Card */}
          <footer
            className={`rounded-3xl border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
              isDarkMode
                ? 'bg-slate-900/90 border-slate-800'
                : 'bg-gradient-to-r from-indigo-50 via-white to-emerald-50 border-slate-200'
            }`}
          >
            <div className="space-y-1.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {isOdia ? 'ଅନଲାଇନ୍ ଖେଳ ଲିଙ୍କ୍' : 'Quick Game Links'}
              </div>
              <h2 className="text-lg sm:text-xl font-black">
                Bingo Game - Popular Indian 1 to 25 Bingo
              </h2>
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
                    {isOdia ? 'ଛକି ଶୂନ ଖେଳନ୍ତୁ' : 'Play Tic Tac Toe (chhakisuna.netlify.app)'}
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
                  <span>{isOdia ? 'ଅଧିକ ଆପ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ' : 'Google Play Store'}</span>
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
