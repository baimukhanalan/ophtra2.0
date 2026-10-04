import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * Accessibility preferences (WCAG 2.1 AA).
 *
 * Preferences are written to the documentElement as data attributes, which the
 * token layer reads — no component needs to know a preference exists. They are
 * also restored by an inline script in index.html before first paint so the
 * page never flashes the default appearance.
 */

export type FontScale = 'base' | 'lg' | 'xl';

export interface A11yPreferences {
  fontScale: FontScale;
  contrast: 'normal' | 'high';
  reducedMotion: boolean;
}

const STORAGE_KEY = 'ophtra.a11y';

const DEFAULTS: A11yPreferences = {
  fontScale: 'base',
  contrast: 'normal',
  reducedMotion: false,
};

const read = (): A11yPreferences => {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<A11yPreferences>) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

const apply = (preferences: A11yPreferences) => {
  const root = document.documentElement;

  if (preferences.fontScale === 'base') root.removeAttribute('data-font-scale');
  else root.setAttribute('data-font-scale', preferences.fontScale);

  if (preferences.contrast === 'high') root.setAttribute('data-contrast', 'high');
  else root.removeAttribute('data-contrast');

  if (preferences.reducedMotion) root.setAttribute('data-reduced-motion', 'true');
  else root.removeAttribute('data-reduced-motion');
};

interface A11yContextValue {
  preferences: A11yPreferences;
  update: (patch: Partial<A11yPreferences>) => void;
  reset: () => void;
}

const A11yContext = createContext<A11yContextValue | null>(null);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<A11yPreferences>(read);

  useEffect(() => {
    apply(preferences);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      /* storage unavailable — preferences last for this session only */
    }
  }, [preferences]);

  const update = useCallback((patch: Partial<A11yPreferences>) => {
    setPreferences((current) => ({ ...current, ...patch }));
  }, []);

  const reset = useCallback(() => setPreferences(DEFAULTS), []);

  const value = useMemo(() => ({ preferences, update, reset }), [preferences, update, reset]);

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
};

export const useA11y = (): A11yContextValue => {
  const context = useContext(A11yContext);
  if (!context) throw new Error('useA11y must be used inside <AccessibilityProvider>');
  return context;
};

/**
 * Announces route changes and async results to screen readers via a polite
 * live region that lives for the lifetime of the app.
 */
export const useAnnouncer = () => {
  return useCallback((message: string) => {
    let region = document.getElementById('oph-announcer');
    if (!region) {
      region = document.createElement('div');
      region.id = 'oph-announcer';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      region.className = 'oph-visually-hidden';
      document.body.appendChild(region);
    }
    // Clearing first guarantees repeated identical messages are re-announced.
    region.textContent = '';
    window.setTimeout(() => {
      region!.textContent = message;
    }, 60);
  }, []);
};
