import type { Language } from './translations';

export type AppPage = 'home' | 'terms';

/**
 * Determines whether the current URL should display the SEO Blog / Feature Article page
 * (hosted on http://imsbg.github.io/bingo/ or accessed via /bingo or ?view=blog)
 * versus the full interactive Game UI (hosted on https://desibingo.netlify.app/).
 */
export function isGithubBlogView(
  hostname: string = '',
  pathname: string = '',
  search: string = ''
): boolean {
  const host = hostname.toLowerCase();
  const path = pathname.toLowerCase();

  if (search) {
    const params = new URLSearchParams(search);
    const viewParam = params.get('view')?.toLowerCase();
    if (viewParam === 'game') return false;
    if (viewParam === 'blog') return true;
    // If a direct room invite link (?room=SBXXXX) is opened, open the game directly
    if (params.get('room')) return false;
  }

  if (host.includes('desibingo')) {
    return false;
  }

  if (host.includes('github.io') || path === '/bingo' || path.startsWith('/bingo/')) {
    return true;
  }

  return false;
}

/**
 * Returns the canonical URL for the current view:
 * - https://imsbg.github.io/bingo/ for the GitHub Pages SEO blog view
 * - https://desibingo.netlify.app/ for the DesiBingo Netlify game view
 */
export function getCanonicalUrlForView(isBlogView: boolean): string {
  return isBlogView
    ? 'https://imsbg.github.io/bingo/'
    : 'https://desibingo.netlify.app/';
}

/**
 * Detects whether the current pathname points to the Terms & Conditions page (/en/terms or /odia/terms).
 */
export function detectPageFromUrl(pathname: string): AppPage {
  const cleanPath = pathname.replace(/\/+$/, '');
  if (/\/terms$/i.test(cleanPath)) {
    return 'terms';
  }
  return 'home';
}

/**
 * Detects language ('en' or 'or') from URL pathname (/en, /odia, /en/terms, /odia/terms) or search params.
 * Returns null if neither is explicitly present in the URL.
 */
export function detectLanguageFromUrl(pathname: string, search: string = ''): Language | null {
  const cleanPath = pathname.replace(/\/+$/, '').replace(/\/terms$/i, '');
  if (/\/en$/i.test(cleanPath) || cleanPath.toLowerCase() === 'en') {
    return 'en';
  }
  if (/\/odia$/i.test(cleanPath) || cleanPath.toLowerCase() === 'odia') {
    return 'or';
  }

  if (search) {
    const params = new URLSearchParams(search);
    const langParam = params.get('lang')?.toLowerCase();
    if (langParam === 'en' || langParam === 'english') return 'en';
    if (langParam === 'or' || langParam === 'odia') return 'or';
  }
  return null;
}

/**
 * Computes the updated pathname ending with `/en`, `/odia`, `/en/terms`, or `/odia/terms`,
 * preserving any base path prefix if the app is hosted in a subdirectory (such as `/bingo`).
 */
export function getPathWithLang(
  pathname: string,
  lang: Language,
  pageOverride?: AppPage
): string {
  const targetSlug = lang === 'en' ? 'en' : 'odia';
  const targetPage = pageOverride ?? detectPageFromUrl(pathname);

  let base = pathname.replace(/\/+$/, '');
  base = base.replace(/\/terms$/i, '');
  base = base.replace(/\/(en|odia)$/i, '');
  base = base.replace(/\/index\.html$/i, '');

  const prefix = !base || base === '/' ? '' : base;
  const langPath = `${prefix}/${targetSlug}`;
  return targetPage === 'terms' ? `${langPath}/terms` : langPath;
}

/**
 * Builds the full relative URL (`pathname + search + hash`) with the language slug (`/en` or `/odia`)
 * and optional page override (`home` or `terms`).
 */
export function buildUrlWithLang(
  pathname: string,
  search: string,
  hash: string,
  lang: Language,
  pageOverride?: AppPage
): string {
  const nextPath = getPathWithLang(pathname, lang, pageOverride);
  return `${nextPath}${search || ''}${hash || ''}`;
}

/**
 * Generates a localized Bingo share message in Odia ('or') or English ('en') with the proper /odia or /en link.
 */
export function buildFriendSharePayload(
  shareLang: Language,
  roomCode?: string | null,
  origin: string = 'https://desibingo.netlify.app',
  pathname: string = '/'
): { url: string; title: string; text: string; fullMessage: string } {
  const basePath = getPathWithLang(pathname, shareLang, 'home');
  const cleanOrigin = origin.replace(/\/+$/, '');
  const url = roomCode
    ? `${cleanOrigin}${basePath}?room=${roomCode}`
    : `${cleanOrigin}${basePath}`;

  if (shareLang === 'or') {
    if (roomCode) {
      const title = `ବିଙ୍ଗୋ (Bingo) – ରୁମ୍ ${roomCode} ରେ ମୋ ସହିତ ଖେଳନ୍ତୁ!`;
      const text = `ଆସନ୍ତୁ ମୋ ସହିତ ଅନଲାଇନ୍ ୧–୨୫ ବିଙ୍ଗୋ (Bingo) ଖେଳିବା! ରୁମ୍ କୋଡ୍: ${roomCode} । ଖେଳିବା କିମ୍ବା ଲାଇଭ୍ ଦେଖିବା ପାଇଁ ଏହି ଲିଙ୍କ୍ ରେ କ୍ଲିକ୍ କରନ୍ତୁ:`;
      return {
        url,
        title,
        text,
        fullMessage: `${text}\n${url}`,
      };
    }
    const title = 'ବିଙ୍ଗୋ (Bingo) – ମାଗଣା ଅନଲାଇନ୍ ଏବଂ ଏକାକୀ ଖେଳ';
    const text = 'ଆସନ୍ତୁ ସାଙ୍ଗମାନଙ୍କ ସହିତ ଅନଲାଇନ୍ କିମ୍ବା ଏକାକୀ ୧–୨୫ ବିଙ୍ଗୋ ଖେଳିବା! ଏଠାରେ କ୍ଲିକ୍ କରନ୍ତୁ:';
    return {
      url,
      title,
      text,
      fullMessage: `${text}\n${url}`,
    };
  } else {
    if (roomCode) {
      const title = `Play 1–25 Bingo in Room ${roomCode}!`;
      const text = `Come play 1–25 Bingo online with me! Room Code: ${roomCode}. Click the link below to join as a player or watch live as a spectator:`;
      return {
        url,
        title,
        text,
        fullMessage: `${text}\n${url}`,
      };
    }
    const title = 'Bingo Game - Popular Indian 1 to 25 Bingo';
    const text = 'Come play 1–25 Bingo online with friends or solo! Click here to play:';
    return {
      url,
      title,
      text,
      fullMessage: `${text}\n${url}`,
    };
  }
}
