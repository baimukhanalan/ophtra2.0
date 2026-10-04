import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { Button } from './Button';

/* ================================================================ SKELETON */

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className,
}: {
  variant?: 'text' | 'title' | 'media' | 'avatar' | 'block';
  width?: string | number;
  height?: string | number;
  className?: string;
}) => (
  <div
    className={[
      'oph-skeleton',
      variant === 'text' ? 'oph-skeleton--text' : '',
      variant === 'title' ? 'oph-skeleton--title' : '',
      variant === 'media' ? 'oph-skeleton--media' : '',
      variant === 'avatar' ? 'oph-skeleton--avatar' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')}
    style={{ width, height }}
    aria-hidden="true"
  />
);

/** Card-shaped placeholder used while catalogue data loads. */
export const SkeletonCard = () => (
  <div className="oph-card" aria-hidden="true">
    <Skeleton variant="media" />
    <div style={{ display: 'grid', gap: 'var(--oph-space-3)', marginTop: 'var(--oph-space-6)' }}>
      <Skeleton variant="title" width="72%" />
      <Skeleton width="100%" />
      <Skeleton width="86%" />
    </div>
  </div>
);

export const SkeletonList = ({ count = 6 }: { count?: number }) => (
  <div className="oph-cards" role="status" aria-live="polite" aria-busy="true">
    <span className="oph-visually-hidden">Загрузка данных</span>
    {Array.from({ length: count }, (_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

/* ================================================================== STATES */

export const LoadingState = ({ title = 'Загружаем данные', text }: { title?: string; text?: string }) => (
  <div className="oph-state oph-state--loading" role="status" aria-live="polite">
    <div className="oph-spinner" aria-hidden="true" />
    <p className="oph-state__title">{title}</p>
    {text ? <p className="oph-state__text">{text}</p> : null}
  </div>
);

export const EmptyState = ({
  title,
  text,
  icon,
  action,
}: {
  title: string;
  text?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) => (
  <div className="oph-state">
    <div className="oph-state__icon" aria-hidden="true">
      {icon ?? <Inbox size={30} />}
    </div>
    <p className="oph-state__title">{title}</p>
    {text ? <p className="oph-state__text">{text}</p> : null}
    {action}
  </div>
);

export const ErrorState = ({
  title = 'Что-то пошло не так',
  text,
  onRetry,
  retryLabel = 'Повторить',
}: {
  title?: string;
  text?: string;
  onRetry?: () => void;
  retryLabel?: string;
}) => (
  <div className="oph-state oph-state--error" role="alert">
    <div className="oph-state__icon" aria-hidden="true">
      <AlertTriangle size={30} />
    </div>
    <p className="oph-state__title">{title}</p>
    {text ? <p className="oph-state__text">{text}</p> : null}
    {onRetry ? (
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw size={16} aria-hidden="true" />
        {retryLabel}
      </Button>
    ) : null}
  </div>
);

/** Animated success checkmark — the confirmation moment across the product. */
export const SuccessCheck = ({ size = 84 }: { size?: number }) => (
  <svg
    className="oph-checkmark"
    style={{ width: size, height: size }}
    viewBox="0 0 60 60"
    aria-hidden="true"
  >
    <circle className="oph-checkmark__circle" cx="30" cy="30" r="26.5" />
    <path className="oph-checkmark__tick" d="M18 30.5 26.5 39 42 22.5" />
  </svg>
);

export const SuccessState = ({
  title,
  text,
  action,
  tone = 'success',
}: {
  title: string;
  text?: string;
  action?: ReactNode;
  /**
   * `warning` for an outcome that completed but not as intended — an enquiry
   * held locally because the API was unreachable, say. A tick over that copy
   * would tell the visitor their message arrived when it has not.
   */
  tone?: 'success' | 'warning';
}) => (
  <div
    className={`oph-state oph-state--${tone === 'warning' ? 'warning' : 'success'}`}
    role="status"
    aria-live="polite"
  >
    {tone === 'warning' ? (
      <div className="oph-state__icon" aria-hidden="true">
        <AlertTriangle size={30} />
      </div>
    ) : (
      <SuccessCheck />
    )}
    <p className="oph-state__title">{title}</p>
    {text ? <p className="oph-state__text">{text}</p> : null}
    {action}
  </div>
);
