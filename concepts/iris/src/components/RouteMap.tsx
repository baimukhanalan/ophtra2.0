import type { CSSProperties } from 'react';

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
const proj = (lat: number, lng: number): [number, number] => [((lng + 170) / 340) * W, ((78 - lat) / 140) * H];

/**
 * Schematic "light along the optic nerve" map: each place is a node, arcs of
 * light travel from every node to the hub. Pure SVG + CSS (dash offset).
 */
export function RouteMap({ points, label }: { points: MapPoint[]; label: string }) {
  const hub = points.find((p) => p.hub) ?? points[points.length - 1];
  const [hx, hy] = proj(hub.lat, hub.lng);
  // dotted graticule
  const dots: Array<[number, number]> = [];
  for (let x = 20; x < W; x += 26) for (let y = 20; y < H; y += 26) dots.push([x, y]);
  return (
    <figure className="rmap" role="img" aria-label={label}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="rm-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4dcae" />
            <stop offset="100%" stopColor="#c9b08a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="rmap__grid">
          {dots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1} />
          ))}
        </g>
        {points
          .filter((p) => p !== hub)
          .map((p, i) => {
            const [x, y] = proj(p.lat, p.lng);
            const mx = (x + hx) / 2;
            const my = Math.min(y, hy) - Math.abs(x - hx) * 0.28 - 20;
            const d = `M${x.toFixed(1)} ${y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)}`;
            return (
              <g key={p.id} style={{ '--i': i } as CSSProperties}>
                <path d={d} className="rmap__arc" pathLength={1} />
                <path d={d} className="rmap__pulse" pathLength={1} />
              </g>
            );
          })}
        {points.map((p) => {
          const [x, y] = proj(p.lat, p.lng);
          return (
            <g key={p.id} className={`rmap__node ${p === hub ? 'is-hub' : ''}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <circle r={p === hub ? 34 : 18} fill="url(#rm-g)" opacity={0.6} />
              <circle r={p === hub ? 6 : 4} />
              <text y={p === hub ? 30 : -14} textAnchor="middle">
                {p.name}
              </text>
              {p.note && (
                <text y={p === hub ? 48 : 22} textAnchor="middle" className="rmap__note">
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
