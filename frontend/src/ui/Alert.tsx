import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

const icons: Record<AlertTone, ReactNode> = {
  info: <Info size={18} aria-hidden="true" />,
  success: <CheckCircle2 size={18} aria-hidden="true" />,
  warning: <AlertTriangle size={18} aria-hidden="true" />,
  error: <XCircle size={18} aria-hidden="true" />,
};

export const Alert = ({
  tone = 'info',
  children,
  className,
}: {
  tone?: AlertTone;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`oph-alert oph-alert--${tone} ${className ?? ''}`}
    role={tone === 'error' ? 'alert' : 'status'}
  >
    {icons[tone]}
    <div>{children}</div>
  </div>
);
