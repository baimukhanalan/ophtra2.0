import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, useLocation, useRoutes } from 'react-router-dom';
import { I18nProvider, useI18n } from '@/i18n';
import { AccessibilityProvider } from '@/services/accessibility';
import { captureAttribution } from '@/services/analytics';
import { PremiumCursor, ScrollProgress } from '@/motion';
import { ToastProvider } from '@/ui';
import { Header } from '@/layout/Header';
import { Footer } from '@/layout/Footer';
import { AccessibilityPanel } from '@/layout/AccessibilityPanel';
import { ConsentBanner } from '@/layout/ConsentBanner';
import { RouteManager } from '@/layout/RouteManager';
import { ErrorBoundary } from './ErrorBoundary';
import { routes } from './routes';

/** Full-page fallback while a lazily loaded route arrives. */
const RouteFallback = () => (
  <div
    style={{ display: 'grid', placeItems: 'center', minHeight: '100svh', padding: 'var(--oph-space-16)' }}
    role="status"
    aria-live="polite"
  >
    <div className="oph-spinner" style={{ ['--oph-spinner-size' as string]: '44px' }} aria-hidden="true" />
  </div>
);

const Pages = () => {
  const element = useRoutes(routes);
  const { pathname } = useLocation();

  // The boundary is keyed on the path so navigating away from a broken page
  // clears the error instead of trapping the visitor on it.
  return (
    <ErrorBoundary resetKey={pathname}>
      <div className="oph-page-enter">{element}</div>
    </ErrorBoundary>
  );
};

/**
 * The assistant carries the rule engine, its phrase tables and the FAQ dataset
 * — roughly 45 kB that nothing above the fold needs. It is a floating button
 * the visitor may never press, so it is fetched once the page is idle instead
 * of competing with the first paint.
 */
const AssistantWidget = lazy(() =>
  import('@/features/assistant/AssistantWidget').then((m) => ({ default: m.AssistantWidget })),
);

const DeferredAssistant = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback;
    // requestIdleCallback is still unimplemented in Safari; the timeout is the
    // fallback rather than an optimisation.
    if (idle) {
      const handle = idle(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback?.(handle);
    }
    const timer = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <AssistantWidget />
    </Suspense>
  );
};

const Shell = () => {
  const { t } = useI18n();
  // The admin workspace has its own chrome; public header/footer/floating UI
  // would sit over its tables.
  const isAdmin = useLocation().pathname.startsWith('/admin');

  useEffect(() => {
    // Campaign parameters must be captured on the landing page, before the
    // visitor navigates away and the query string disappears.
    captureAttribution();

    // Anything an outage stranded in the local outbox goes out as soon as the
    // API answers again. Deferred so a retry never competes with first paint.
    const timer = window.setTimeout(() => {
      void import('@/services/outbox').then(({ flushOutbox }) =>
        import('@/services/api').then(({ api }) => flushOutbox(api.createLead)),
      );
    }, 3000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <a className="oph-skip-link" href="#main">
        {t.a11y.skipToContent}
      </a>

      <ScrollProgress />
      <PremiumCursor />
      <RouteManager />
      {isAdmin ? null : <Header />}

      <main id="main" tabIndex={-1}>
        <Suspense fallback={<RouteFallback />}>
          <Pages />
        </Suspense>
      </main>

      {isAdmin ? null : <Footer />}
      {isAdmin ? null : <DeferredAssistant />}
      <AccessibilityPanel />
      <ConsentBanner />
    </>
  );
};

export const App = () => (
  <BrowserRouter>
    <AccessibilityProvider>
      <I18nProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </I18nProvider>
    </AccessibilityProvider>
  </BrowserRouter>
);
