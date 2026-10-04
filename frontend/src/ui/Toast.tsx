import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useI18n, type Localized } from '@/i18n';

const COPY = {
  region: { ru: 'Уведомления', kk: 'Хабарландырулар', en: 'Notifications' },
  dismiss: { ru: 'Скрыть уведомление', kk: 'Хабарландыруды жасыру', en: 'Dismiss notification' },
} satisfies Record<string, Localized>;

export type ToastTone = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  text?: string;
}

interface ToastContextValue {
  notify: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastTone, ReactNode> = {
  info: <Info size={18} color="var(--oph-info)" aria-hidden="true" />,
  success: <CheckCircle2 size={18} color="var(--oph-success)" aria-hidden="true" />,
  warning: <AlertTriangle size={18} color="var(--oph-warning)" aria-hidden="true" />,
  error: <XCircle size={18} color="var(--oph-danger)" aria-hidden="true" />,
};

/**
 * Notification host. Toasts are the in-page half of the notification
 * requirement; the delivered channels (WhatsApp/SMS/email) are dispatched by
 * the backend notification service.
 */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { L } = useI18n();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const notify = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current.slice(-3), { ...toast, id }]);
      timers.current.set(id, window.setTimeout(() => dismiss(id), 6000));
    },
    [dismiss],
  );

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div className="oph-toasts" role="region" aria-live="polite" aria-label={L(COPY.region)}>
              {toasts.map((toast) => (
                <div key={toast.id} className="oph-toast">
                  {icons[toast.tone]}
                  <div style={{ flex: 1 }}>
                    <p className="oph-toast__title">{toast.title}</p>
                    {toast.text ? <p className="oph-toast__text">{toast.text}</p> : null}
                  </div>
                  <button
                    type="button"
                    className="oph-modal__close"
                    style={{ width: 30, height: 30 }}
                    onClick={() => dismiss(toast.id)}
                    aria-label={L(COPY.dismiss)}
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
};
