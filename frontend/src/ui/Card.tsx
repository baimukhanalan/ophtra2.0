import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type CardTone = 'default' | 'glass' | 'flat' | 'tint' | 'deep';

export interface CardProps {
  children: ReactNode;
  tone?: CardTone;
  /** Adds lift, media zoom and glow on hover. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Renders the whole card as a router link. */
  to?: string;
}

const toneClass: Record<CardTone, string> = {
  default: '',
  glass: 'oph-card--glass',
  flat: 'oph-card--flat',
  tint: 'oph-card--tint',
  deep: 'oph-card--deep',
};

export const Card = ({
  children,
  tone = 'default',
  interactive = false,
  className,
  style,
  to,
}: CardProps) => {
  const classes = ['oph-card', toneClass[tone], interactive || to ? 'oph-card--interactive' : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  const content = (
    <div className={classes} style={style}>
      {children}
    </div>
  );

  if (!to) return content;

  return (
    <Link to={to} className="oph-card-link">
      {content}
    </Link>
  );
};

export const CardMedia = ({
  children,
  ratio,
}: {
  children: ReactNode;
  ratio?: string;
}) => (
  <div className="oph-card__media" style={ratio ? { ['--oph-card-media-ratio' as string]: ratio } : undefined}>
    {children}
  </div>
);

export const CardTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="oph-card__title">{children}</h3>
);

export const CardText = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <p className={`oph-card__text ${className ?? ''}`}>{children}</p>;

export const CardFooter = ({ children }: { children: ReactNode }) => (
  <div className="oph-card__footer">{children}</div>
);
