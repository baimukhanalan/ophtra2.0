import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/**
 * Logo reveal.
 *
 * The overlay is static markup in index.html, so it paints before any script
 * runs. It is lifted once the reveal choreography has played (≈2.3 s from
 * navigation start) and the display fonts are ready — whichever is later — and
 * never later than 3.2 s after navigation start. While `data-loading` is set, scroll reveals are held, so the first
 * block of the page animates in as the curtain rises, not behind it.
 */
const MIN_REVEAL_MS = 2300;
const MAX_REVEAL_MS = 3200;

const liftPreloader = () => {
  const overlay = document.getElementById('oph-preloader');
  const root = document.documentElement;
  window.scrollTo(0, 0);
  if (!overlay) {
    root.removeAttribute('data-loading');
    return;
  }
  overlay.classList.add('is-leaving');
  // Let the curtain travel a little before the page content starts moving.
  window.setTimeout(() => root.removeAttribute('data-loading'), 260);
  window.setTimeout(() => overlay.remove(), 1400);
};

const elapsed = performance.now();
const minimum = new Promise((resolve) => window.setTimeout(resolve, Math.max(0, MIN_REVEAL_MS - elapsed)));
const fonts = 'fonts' in document ? document.fonts.ready : Promise.resolve();
const ceiling = new Promise((resolve) => window.setTimeout(resolve, Math.max(0, MAX_REVEAL_MS - elapsed)));

void Promise.race([Promise.all([minimum, fonts]), ceiling]).then(liftPreloader);
