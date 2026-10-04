import { useCallback, useEffect, useRef } from 'react';
import { MoveHorizontal } from 'lucide-react';

/**
 * Vision simulator.
 *
 * A draggable split showing the same scene as a patient sees it before and
 * after correction. Both halves are drawn in SVG rather than photographed, so
 * the "impaired" side is an honest optical simulation — blur radius, halo and
 * contrast loss — instead of a stock image with a filter, and it costs nothing
 * to load.
 *
 * Works with pointer, touch and keyboard (arrow keys), and is exposed as a
 * slider so assistive technology can operate it.
 */

const Scene = ({ impaired }: { impaired: boolean }) => (
  <svg viewBox="0 0 800 500" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id={impaired ? 'sky-b' : 'sky-a'} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a3d2c" />
        <stop offset="100%" stopColor="#0d5039" />
      </linearGradient>
      <filter id="oph-impair" x="-20%" y="-20%" width="140%" height="140%">
        {/* Defocus plus a bloom around light sources — the two things patients
            describe most often before cataract surgery. */}
        <feGaussianBlur stdDeviation="7" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="0.9 0 0 0 0.06  0 0.9 0 0 0.06  0 0 0.9 0 0.06  0 0 0 1 0"
        />
      </filter>
    </defs>

    <g filter={impaired ? 'url(#oph-impair)' : undefined}>
      <rect width="800" height="500" fill={`url(#${impaired ? 'sky-b' : 'sky-a'})`} />

      {/* Street lights — the halo effect is what the blur exaggerates. */}
      {[140, 330, 520, 690].map((x, index) => (
        <g key={x}>
          <circle cx={x} cy={120 + (index % 2) * 26} r={impaired ? 34 : 16} fill="#f4ffe9" opacity={impaired ? 0.5 : 0.9} />
          <circle cx={x} cy={120 + (index % 2) * 26} r={impaired ? 64 : 30} fill="#dff6ea" opacity={impaired ? 0.24 : 0.1} />
        </g>
      ))}

      {/* Eye-chart line: the practical readability test. */}
      <text
        x="400"
        y="300"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="86"
        fontWeight="800"
        letterSpacing="14"
        fontFamily="Manrope, sans-serif"
      >
        ШБ МНК
      </text>
      <text
        x="400"
        y="360"
        textAnchor="middle"
        fill="#bce4d0"
        fontSize="40"
        fontWeight="700"
        letterSpacing="10"
        fontFamily="Manrope, sans-serif"
      >
        ЫМБШ Н
      </text>
      <text
        x="400"
        y="404"
        textAnchor="middle"
        fill="#8fd0b2"
        fontSize="24"
        fontWeight="600"
        letterSpacing="7"
        fontFamily="Manrope, sans-serif"
      >
        ИНШМКЫ Б
      </text>

      <rect y="440" width="800" height="60" fill="#06231a" opacity="0.55" />
    </g>
  </svg>
);

export const VisionSimulator = ({
  labelBefore,
  labelAfter,
  ariaLabel,
}: {
  labelBefore: string;
  labelAfter: string;
  ariaLabel: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const gripRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const splitRef = useRef(48);
  // The split is written straight to a CSS custom property rather than held in
  // state: React state would re-render two filtered SVG scenes on every
  // pointermove, which is what made dragging stutter.

  const applySplit = useCallback((next: number) => {
    const value = Math.min(96, Math.max(4, next));
    splitRef.current = value;
    ref.current?.style.setProperty('--oph-vision-split', `${value}%`);
    gripRef.current?.setAttribute('aria-valuenow', String(Math.round(value)));
    gripRef.current?.setAttribute('aria-valuetext', `${Math.round(value)}%`);
  }, []);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      applySplit(((clientX - rect.left) / rect.width) * 100);
    },
    [applySplit],
  );

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!dragging.current) return;
      setFromClientX(event.clientX);
    };
    const stop = () => {
      dragging.current = false;
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [setFromClientX]);

  return (
    <div
      ref={ref}
      className="oph-vision"
      style={{ ['--oph-vision-split' as string]: '48%' }}
      onPointerDown={(event) => {
        dragging.current = true;
        setFromClientX(event.clientX);
      }}
    >
      <div className="oph-vision__layer">
        <Scene impaired={false} />
      </div>
      <div className="oph-vision__layer oph-vision__layer--before">
        <Scene impaired />
      </div>

      <span className="oph-vision__label oph-vision__label--before">{labelBefore}</span>
      <span className="oph-vision__label oph-vision__label--after">{labelAfter}</span>

      <div className="oph-vision__handle">
        <div
          ref={gripRef}
          className="oph-vision__grip"
          role="slider"
          tabIndex={0}
          aria-label={ariaLabel}
          aria-valuemin={4}
          aria-valuemax={96}
          aria-valuenow={48}
          aria-valuetext="48%"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') applySplit(splitRef.current - 4);
            if (event.key === 'ArrowRight') applySplit(splitRef.current + 4);
          }}
        >
          <MoveHorizontal size={19} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
