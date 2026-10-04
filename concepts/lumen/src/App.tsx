import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { startObservers } from './lib/observers';
import { ScrollTrigger, startScroll } from './lib/scroll';
import { markReady, reducedMotion } from './lib/env';
import { PAGES, ROUTE_TABLE } from './routes';
import { Footer } from './shell/Footer';
import { Header } from './shell/Header';
import { TransitionProvider } from './shell/Transition';

const BenchCanvas = lazy(() => import('./scene/Bench'));

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <div className="bench__fallback" /> : this.props.children;
  }
}

const webglOk = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

function Bench() {
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!webglOk()) return;
    // Let the first paint and the loader finish before compiling shaders.
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    const t = idle ? idle(() => setMount(true), { timeout: 900 }) : window.setTimeout(() => setMount(true), 300);
    return () => {
      if (!idle) clearTimeout(t);
    };
  }, []);
  return (
    <div className={'bench' + (ready ? ' is-ready' : '')} aria-hidden="true">
      <div className="bench__fallback" />
      {mount && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <BenchCanvas onReady={() => setTimeout(() => setReady(true), 120)} />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}

function PageFallback() {
  return (
    <div className="page-loading" role="status">
      <span className="page-loading__lens" aria-hidden="true" />
      <span className="sr-only">Загрузка страницы</span>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    startScroll();
    const main = document.getElementById('main');
    if (main) startObservers(main);
    // Lazy content (fonts, images, loaded article bodies) changes the page height:
    // keep scroll-trigger positions honest.
    let t = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = window.setTimeout(() => {
        if (!document.documentElement.classList.contains('is-warping')) ScrollTrigger.refresh();
      }, 250);
    });
    if (main) ro.observe(main);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    const done = () => {
      markReady();
      setTimeout(() => document.getElementById('boot')?.remove(), 900);
    };
    Promise.race([fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1100))]).then(() =>
      setTimeout(done, reducedMotion ? 0 : 350),
    );
  }, []);

  return (
    <TransitionProvider>
      <Bench />
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {ROUTE_TABLE.map(({ path, page }) => {
              const C = PAGES[page].Component;
              return <Route key={path} path={path} element={<C />} />;
            })}
            <Route path="*" element={<PAGES.notFound.Component />} />
          </Routes>
        </Suspense>
        <Footer />
      </main>
    </TransitionProvider>
  );
}
