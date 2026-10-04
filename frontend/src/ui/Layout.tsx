import type { CSSProperties, ElementType, ReactNode } from 'react';
import { Reveal } from '@/motion';

export const Container = ({
  children,
  size = 'default',
  className,
  style,
  as: Tag = 'div',
}: {
  children: ReactNode;
  size?: 'default' | 'narrow' | 'prose';
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
}) => (
  <Tag
    style={style}
    className={[
      'oph-container',
      size === 'narrow' ? 'oph-container--narrow' : '',
      size === 'prose' ? 'oph-container--prose' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </Tag>
);

export type SectionTone = 'default' | 'mist' | 'tint' | 'deep';

export const Section = ({
  children,
  tone = 'default',
  tight = false,
  id,
  className,
  style,
  'aria-labelledby': ariaLabelledBy,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  tone?: SectionTone;
  tight?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
  'aria-labelledby'?: string;
  'aria-label'?: string;
}) => (
  <section
    id={id}
    aria-labelledby={ariaLabelledBy}
    aria-label={ariaLabel}
    style={style}
    className={[
      'oph-section',
      tight ? 'oph-section--tight' : '',
      tone === 'mist' ? 'oph-section--mist' : '',
      tone === 'tint' ? 'oph-section--tint' : '',
      tone === 'deep' ? 'oph-section--deep' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </section>
);

export const SectionHeading = ({
  eyebrow,
  title,
  text,
  center = false,
  id,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  center?: boolean;
  id?: string;
  actions?: ReactNode;
}) => (
  <div
    className={center ? 'oph-heading oph-heading--center' : 'oph-heading'}
    style={
      actions
        ? { maxWidth: '100%', display: 'grid', gap: 'var(--oph-space-6)' }
        : undefined
    }
  >
    <Reveal variant="up">
      <div style={{ display: 'grid', gap: 'var(--oph-space-4)', justifyItems: center ? 'center' : undefined }}>
        {eyebrow ? <span className="oph-eyebrow">{eyebrow}</span> : null}
        <h2 id={id}>{title}</h2>
        {text ? <p className="oph-lead">{text}</p> : null}
      </div>
    </Reveal>
    {actions ? (
      <Reveal variant="up" delay={120}>
        <div className="oph-row">{actions}</div>
      </Reveal>
    ) : null}
  </div>
);
