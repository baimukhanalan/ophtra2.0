import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useI18n } from '@/i18n';
import { lockPageScroll } from './scrollLock';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Shared overlay behaviour: page scroll lock, Escape to dismiss, focus trap and
 * focus restoration. Used by both Modal and Drawer.
 */
const useOverlayBehaviour = (open: boolean, onClose: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const unlock = lockPageScroll();

    // Move focus into the overlay on the next frame so entry animation runs.
    const focusFrame = requestAnimationFrame(() => {
      const first = ref.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? ref.current)?.focus();
    });

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !ref.current) return;

      const focusable = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKey);
      unlock();
      // preventScroll: focusing the (sticky) opener must not scroll the page,
      // which html{scroll-behavior:smooth} would animate as a visible jump.
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return ref;
};

export const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) => {
  const { t } = useI18n();
  const ref = useOverlayBehaviour(open, onClose);
  const titleId = useId();

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="oph-overlay"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={wide ? 'oph-modal oph-modal--wide' : 'oph-modal'}
      >
        <div className="oph-modal__header">
          <h2 id={titleId} className="oph-modal__title">
            {title}
          </h2>
          <button type="button" className="oph-modal__close" onClick={onClose} aria-label={t.common.close}>
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        {children}
        {footer ? <div style={{ marginTop: 'var(--oph-space-6)' }}>{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
};

export const Drawer = ({
  open,
  onClose,
  title,
  children,
  side = 'right',
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  side?: 'left' | 'right';
}) => {
  const { t } = useI18n();
  const ref = useOverlayBehaviour(open, onClose);
  const titleId = useId();

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="oph-overlay"
      style={{ display: 'block', padding: 0 }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={side === 'left' ? 'oph-drawer oph-drawer--left' : 'oph-drawer'}
      >
        <div className="oph-modal__header">
          <h2 id={titleId} className="oph-modal__title">
            {title}
          </h2>
          <button type="button" className="oph-modal__close" onClick={onClose} aria-label={t.common.close}>
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};

/** Dropdown menu with outside-click and Escape dismissal. */
export const Dropdown = ({
  open,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: PointerEvent) => {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) onClose();
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    // Defer so the click that opened the menu does not immediately close it.
    const timer = window.setTimeout(() => {
      document.addEventListener('pointerdown', handlePointer);
    }, 0);
    document.addEventListener('keydown', handleKey);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} className="oph-dropdown" role="menu" aria-labelledby={labelledBy}>
      {children}
    </div>
  );
};
