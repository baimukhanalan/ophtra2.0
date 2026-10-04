/**
 * Schematic "light route" map: points on an equirectangular graticule joined
 * to the hub (Astana) by beams. Decorative + labelled; real data only.
 */
export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  note?: string;
  hub?: boolean;
}

const W = 1000;
const H = 480;
const px = (lng: number) => ((lng + 180) / 360) * W;
const py = (lat: number) => ((80 - lat) / 140) * H;

export function RouteMap({ points, label, active }: { points: MapPoint[]; label: string; active?: string | null }) {
  const hub = points.find((p) => p.hub) ?? points[points.length - 1];
  const hx = px(hub.lng);
  const hy = py(hub.lat);
  return (
    <figure className="routemap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        <defs>
          <linearGradient id="beam" x1="0" x2="1">
            <stop offset="0" stopColor="#c9b08a" stopOpacity="0.1" />
            <stop offset="1" stopColor="#a88b5e" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="glow">
            <stop offset="0" stopColor="#fff8e8" />
            <stop offset="1" stopColor="#fff8e8" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={'v' + i} x1={(i * W) / 12} y1="0" x2={(i * W) / 12} y2={H} className="routemap__grid" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={'h' + i} x1="0" y1={(i * H) / 7} x2={W} y2={(i * H) / 7} className="routemap__grid" />
        ))}
        {points
          .filter((p) => p !== hub)
          .map((p, i) => {
            const x = px(p.lng);
            const y = py(p.lat);
            const mx = (x + hx) / 2;
            const my = Math.min(y, hy) - 90 - Math.abs(x - hx) * 0.08;
            return (
              <path
                key={p.id}
                d={`M${x} ${y} Q${mx} ${my} ${hx} ${hy}`}
                className={'routemap__beam' + (active && active !== p.id ? ' is-dim' : '')}
                style={{ animationDelay: `${i * 0.6}s` }}
              />
            );
          })}
        {points.map((p) => {
          const x = px(p.lng);
          const y = py(p.lat);
          const right = x < W - 160;
          return (
            <g key={p.id} className={'routemap__pt' + (p.hub ? ' is-hub' : '') + (active === p.id ? ' is-active' : '')}>
              <circle cx={x} cy={y} r={p.hub ? 46 : 26} fill="url(#glow)" />
              <circle cx={x} cy={y} r={p.hub ? 8 : 5} className="routemap__dot" />
              {p.hub && <circle cx={x} cy={y} r={18} className="routemap__ring" />}
              <text x={right ? x + 14 : x - 14} y={y - 10} textAnchor={right ? 'start' : 'end'} className="routemap__name">
                {p.name}
              </text>
              {p.note && (
                <text x={right ? x + 14 : x - 14} y={y + 12} textAnchor={right ? 'start' : 'end'} className="routemap__note">
                  {p.note}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
