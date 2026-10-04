const RAYS = Array.from({ length: 36 }, (_, i) => (i / 36) * Math.PI * 2);

/** Stylised eye-and-rays mark echoing the centre's facade sign. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <g stroke="#e8c27c" strokeWidth="1.3" fill="none" strokeLinecap="round">
        {RAYS.map((a, i) => (
          <line key={i} x1={32 + Math.cos(a) * 15} y1={32 + Math.sin(a) * 15} x2={32 + Math.cos(a) * 25} y2={32 + Math.sin(a) * 25} />
        ))}
        <circle cx="32" cy="32" r="29" strokeOpacity="0.6" />
        <path d="M21 32 Q32 22 43 32 Q32 42 21 32Z" />
        <circle cx="32" cy="32" r="3" fill="#e8c27c" stroke="none" />
      </g>
    </svg>
  );
}
