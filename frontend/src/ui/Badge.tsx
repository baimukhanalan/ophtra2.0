import type { ReactNode } from 'react';

export type BadgeTone = 'brand' | 'outline' | 'solid' | 'success' | 'warning' | 'danger' | 'info';

const toneClass: Record<BadgeTone, string> = {
  brand: '',
  outline: 'oph-badge--outline',
  solid: 'oph-badge--solid',
  success: 'oph-badge--success',
  warning: 'oph-badge--warning',
  danger: 'oph-badge--danger',
  info: 'oph-badge--info',
};

export const Badge = ({
  children,
  tone = 'brand',
  dot = false,
  pulse = false,
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}) => (
  <span
    className={['oph-badge', toneClass[tone], pulse ? 'oph-badge--pulse' : '', className ?? '']
      .filter(Boolean)
      .join(' ')}
  >
    {dot ? <span className="oph-badge__dot" aria-hidden="true" /> : null}
    {children}
  </span>
);
