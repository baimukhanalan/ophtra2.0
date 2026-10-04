import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/unbounded/index.css';
import '@fontsource-variable/inter-tight/index.css';
import './styles/base.css';
import './styles/shell.css';
import './styles/parts.css';
import App from './App';
import { isTouch, reducedMotion, tier } from './lib/env';

const root = document.documentElement;
if (tier === 'low') root.classList.add('low');
if (isTouch) root.classList.add('touch', 'no-blur');
if (reducedMotion) root.classList.add('reduced');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
