/**
 * Clinic photograph with a phone-sized variant.
 *
 * Every file in /media ships twice: the 1440px original and a 780px `.sm.jpg`
 * at about 40% of the weight. A phone that downloads the full-size asset spends
 * roughly 140 kB on an image it renders at 390 CSS px — the srcset below lets
 * the browser pick before the request is made, which is the single largest
 * saving on a mobile first load.
 */

export interface PhotoProps {
  /** Path to the full-size asset, e.g. `/media/clinic-night.jpg`. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** `sizes` hint; defaults to full-bleed, which is right for backdrops. */
  sizes?: string;
  className?: string;
  eager?: boolean;
  'data-active'?: boolean;
}

/** `/media/x.jpg` → `/media/x.sm.jpg` */
export const smallVariant = (src: string) => src.replace(/\.jpg$/, '.sm.jpg');

export const Photo = ({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  className,
  eager = false,
  ...rest
}: PhotoProps) => (
  <img
    src={src}
    srcSet={`${smallVariant(src)} 780w, ${src} 1440w`}
    sizes={sizes}
    alt={alt}
    width={width}
    height={height}
    className={className}
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
    {...(eager ? { fetchPriority: 'high' as const } : {})}
    {...rest}
  />
);
