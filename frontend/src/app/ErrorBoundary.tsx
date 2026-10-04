import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Render-error boundary.
 *
 * Without one, a single thrown error unmounts the whole React tree and the
 * visitor gets a blank page. This catches it, keeps the site chrome intact and
 * offers a way out.
 *
 * It is deliberately dependency-free and inline-styled: the failure it handles
 * may itself come from the design system, so it must not rely on it.
 */

interface Props {
  children: ReactNode;
  /** Changing this value clears the error — used to recover on navigation. */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

type Lang = 'ru' | 'kk' | 'en';

const COPY: Record<Lang, { title: string; text: string; retry: string; home: string }> = {
  ru: {
    title: 'Не удалось отобразить страницу',
    text: 'Мы уже знаем о проблеме. Попробуйте обновить страницу или вернуться на главную. Записаться на приём можно по телефону +7 717 000 00 00.',
    retry: 'Обновить',
    home: 'На главную',
  },
  kk: {
    title: 'Бетті көрсету мүмкін болмады',
    text: 'Біз мәселе туралы білеміз. Бетті жаңартып көріңіз немесе басты бетке оралыңыз. Қабылдауға +7 717 000 00 00 телефоны арқылы жазылуға болады.',
    retry: 'Жаңарту',
    home: 'Басты бетке',
  },
  en: {
    title: 'This page could not be displayed',
    text: 'We already know about the problem. Try reloading the page or go back to the home page. You can book an appointment by phone: +7 717 000 00 00.',
    retry: 'Reload',
    home: 'Home page',
  },
};

/**
 * The boundary must not depend on the i18n context (it may sit outside it or
 * the context itself may have failed), so read the active language from the
 * document, falling back to the stored preference.
 */
const activeLanguage = (): Lang => {
  const isLang = (value: unknown): value is Lang => value === 'ru' || value === 'kk' || value === 'en';
  try {
    const fromDocument = document.documentElement.lang;
    if (isLang(fromDocument)) return fromDocument;
    const stored = window.localStorage.getItem('ophtra.lang');
    if (isLang(stored)) return stored;
  } catch {
    /* storage may be blocked */
  }
  return 'ru';
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(previous: Props) {
    // A new route is a fresh chance to render successfully.
    if (this.state.error && previous.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ophtra] render error', error, info.componentStack);

    // Report to the first-party analytics endpoint if it is reachable. Errors
    // here are swallowed: a failing error report must not mask the error.
    try {
      void fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'render_error',
          sessionId: 'error-boundary',
          payload: { message: error.message, path: window.location.pathname },
        }),
      }).catch(() => undefined);
    } catch {
      /* reporting is best-effort */
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    const lang = activeLanguage();
    const copy = COPY[lang];

    return (
      <div
        role="alert"
        lang={lang}
        style={{
          display: 'grid',
          gap: 20,
          justifyItems: 'center',
          maxWidth: 560,
          margin: '0 auto',
          padding: '160px 24px 120px',
          textAlign: 'center',
          fontFamily: "'Manrope', system-ui, sans-serif",
          color: '#06231a',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 72,
            height: 72,
            borderRadius: 24,
            background: '#ddf2e7',
            color: '#167f5b',
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          !
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>{copy.title}</h1>
        <p style={{ margin: 0, color: '#5f7d71', lineHeight: 1.6 }}>{copy.text}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              minHeight: 48,
              padding: '0 24px',
              border: 0,
              borderRadius: 16,
              background: '#167f5b',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {copy.retry}
          </button>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 48,
              padding: '0 24px',
              border: '1px solid #cbe0d5',
              borderRadius: 16,
              color: '#167f5b',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {copy.home}
          </a>
        </div>
      </div>
    );
  }
}
