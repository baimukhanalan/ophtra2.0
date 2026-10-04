import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/navigation';

/**
 * Brand lockup — the supplied artwork, not a reconstruction.
 *
 * The source is flat black on white, so the assets are keyed to transparency
 * at build time with luminance driving alpha: the anti-aliased edges survive.
 * Two colour variants exist because the header sits on white and the footer on
 * deep green.
 */

const ASSETS = {
  dark: { full: '/brand/logo.png', mark: '/brand/logo-mark.png' },
  light: { full: '/brand/logo-light.png', mark: '/brand/logo-mark-light.png' },
};

export const LogoMark = ({
  size = 36,
  tone = 'dark',
}: {
  size?: number;
  tone?: 'dark' | 'light';
}) => (
  <img
    className="oph-logo__mark"
    src={ASSETS[tone].mark}
    alt=""
    width={size}
    height={size}
    aria-hidden="true"
  />
);

export const Logo = ({
  name,
  compact = false,
  tone = 'dark',
}: {
  name: string;
  compact?: boolean;
  tone?: 'dark' | 'light';
}) => (
  <Link to={ROUTES.home} className="oph-logo" aria-label={name}>
    <img
      className="oph-logo__lockup"
      src={ASSETS[tone].full}
      alt={name}
      width={460}
      height={80}
      style={{ height: compact ? 32 : 40 }}
      // The dark lockup is in the header and is usually the largest thing
      // painted first; the light one is in the footer, far below the fold.
      {...(tone === 'light'
        ? { loading: 'lazy' as const, decoding: 'async' as const }
        : { fetchPriority: 'high' as const })}
    />
  </Link>
);
