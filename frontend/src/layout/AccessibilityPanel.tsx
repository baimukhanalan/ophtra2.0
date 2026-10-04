import { useCallback, useEffect, useRef, useState } from 'react';
import { Accessibility, X } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useA11y, type FontScale } from '@/services/accessibility';
import { Button, Checkbox, Segmented } from '@/ui';

/**
 * Accessibility preferences (forest/paper/gold): larger fonts, high contrast
 * and reduced motion — the three the specification requires.
 *
 * Two entry points:
 * - the floating toggle bottom-left on tablets and desktops (the cookie card
 *   lives bottom-right, so the toggle no longer has to move);
 * - the `oph:open-a11y` window event, dispatched by the mobile drawer (the
 *   floating toggle is hidden on phones) and by the admin top bar. The panel
 *   then docks to the bottom edge and hands focus back to whatever opened it.
 */
export const AccessibilityPanel = () => {
  const { t } = useI18n();
  const { preferences, update, reset } = useA11y();
  const [open, setOpen] = useState(false);
  const [docked, setDocked] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  /**
   * Element that had focus when the panel opened (the floating toggle, the
   * drawer button or the admin bar); focus goes back there on close.
   */
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    // `offsetParent` is null for position: fixed elements such as the floating
    // toggle, so visibility is judged by layout boxes instead. The drawer that
    // dispatched the event may have closed in the meantime; only focus things
    // that are still in the document and rendered.
    const focusable = (element: HTMLElement | null): element is HTMLElement =>
      Boolean(element && element.isConnected && element.getClientRects().length > 0);
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (focusable(target)) target.focus();
    else if (focusable(toggleRef.current)) toggleRef.current.focus();
  }, []);

  useEffect(() => {
    const openPanel = () => {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setDocked(true);
      setOpen(true);
    };
    window.addEventListener('oph:open-a11y', openPanel);
    return () => window.removeEventListener('oph:open-a11y', openPanel);
  }, []);

  // Move focus into the dialog so keyboard and screen-reader users land in it.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const handlePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !toggleRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('pointerdown', handlePointer);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('pointerdown', handlePointer);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="oph-a11y-toggle"
        aria-label={t.a11y.open}
        aria-expanded={open}
        onClick={() => {
          // Some browsers (Safari) do not focus a button on click, so the
          // toggle itself is remembered rather than document.activeElement.
          if (!open) returnFocusRef.current = toggleRef.current;
          setDocked(false);
          setOpen((current) => !current);
        }}
      >
        <Accessibility size={22} aria-hidden="true" />
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="oph-a11y-panel"
          data-docked={docked || undefined}
          role="dialog"
          aria-labelledby="oph-a11y-title"
          tabIndex={-1}
        >
          <div className="oph-a11y-panel__head">
            <h2 id="oph-a11y-title" className="oph-a11y-panel__title">
              {t.a11y.title}
            </h2>
            <button type="button" className="oph-a11y-panel__close" onClick={close} aria-label={t.common.close}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="oph-a11y-panel__body">
            <div className="oph-a11y-panel__group">
              <span className="oph-field__label" aria-hidden="true">
                {t.a11y.fontSize}
              </span>
              <Segmented<FontScale>
                label={t.a11y.fontSize}
                value={preferences.fontScale}
                onChange={(fontScale) => update({ fontScale })}
                options={[
                  { value: 'base', label: t.a11y.fontBase },
                  { value: 'lg', label: t.a11y.fontLarge },
                  { value: 'xl', label: t.a11y.fontXl },
                ]}
              />
            </div>

            <Checkbox
              label={t.a11y.contrast}
              checked={preferences.contrast === 'high'}
              onChange={(event) => update({ contrast: event.target.checked ? 'high' : 'normal' })}
            />

            <Checkbox
              label={t.a11y.motion}
              checked={preferences.reducedMotion}
              onChange={(event) => update({ reducedMotion: event.target.checked })}
            />

            <Button variant="ghost" size="sm" className="oph-a11y-panel__reset" onClick={reset}>
              {t.a11y.reset}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};
