import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';

/** Last router-link activation, to swallow double/triple clicks on a CTA. */
const lastActivation = { to: '', at: 0 };
import { Link, useLocation } from 'react-router-dom';
import { mergeRefs, useMagnetic, useRipple } from '@/motion';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'onDark';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'oph-btn--primary',
  secondary: 'oph-btn--secondary',
  outline: 'oph-btn--outline',
  ghost: 'oph-btn--ghost',
  danger: 'oph-btn--danger',
  onDark: 'oph-btn--on-dark',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'oph-btn--sm',
  md: '',
  lg: 'oph-btn--lg',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  /** Pointer-following attraction. Reserve for primary calls to action. */
  magnetic?: boolean;
  iconOnly?: boolean;
  children?: ReactNode;
  className?: string;
}

const classNameFor = ({ variant = 'primary', size = 'md', block, iconOnly, className }: CommonProps) =>
  [
    'oph-btn',
    variantClass[variant],
    sizeClass[size],
    block ? 'oph-btn--block' : '',
    iconOnly ? 'oph-btn--icon' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, variant, size, block, loading = false, magnetic = false, iconOnly, className, disabled, type = 'button', ...rest },
  forwardedRef,
) {
  const rippleRef = useRipple<HTMLButtonElement>();
  const magneticRef = useMagnetic<HTMLButtonElement>(magnetic ? 0.24 : 0);

  return (
    <button
      ref={mergeRefs(forwardedRef, rippleRef, magnetic ? magneticRef : null)}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classNameFor({ variant, size, block, iconOnly, className })}
      {...rest}
    >
      {loading ? <span className="oph-btn__spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
});

export type ButtonLinkProps = CommonProps & {
  to: string;
  external?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

/** Same visual contract as Button, rendered as a router link or `<a>`. */
export const ButtonLink = ({
  to,
  external = false,
  children,
  variant,
  size,
  block,
  iconOnly,
  className,
  magnetic = false,
  ...rest
}: ButtonLinkProps) => {
  const magneticRef = useMagnetic<HTMLAnchorElement>(magnetic ? 0.24 : 0);
  const classes = classNameFor({ variant, size, block, iconOnly, className });
  const { pathname, search } = useLocation();
  // Repeated clicks on a link to the current page must not stack history entries.
  const samePage = !external && to === `${pathname}${search}`;
  const guardRepeat = (event: MouseEvent<HTMLAnchorElement>) => {
    const now = event.timeStamp;
    if (lastActivation.to === to && now - lastActivation.at < 800) event.preventDefault();
    lastActivation.to = to;
    lastActivation.at = now;
    rest.onClick?.(event);
  };

  if (external) {
    return (
      <a
        ref={magnetic ? magneticRef : undefined}
        href={to}
        className={classes}
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link ref={magnetic ? magneticRef : undefined} to={to} replace={samePage} className={classes} {...rest} onClick={guardRepeat}>
      {children}
    </Link>
  );
};
