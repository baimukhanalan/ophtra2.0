import { useId, useMemo, useState, type PointerEvent } from 'react';

/**
 * Tiny dependency-free charts for the admin dashboard (spec §18).
 *
 * Single-series only, so identity never depends on colour: forest marks on
 * paper, recessive hairline grid, hover read-out on every chart and a data
 * table behind a disclosure for screen readers and exact values.
 */

export interface Point {
  label: string;
  value: number;
}

const DataTable = ({ caption, rows, format }: { caption: string; rows: Point[]; format: (v: number) => string }) => (
  <details className="oph-chart__data">
    <summary>{caption}</summary>
    <table>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{format(row.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </details>
);

/* ============================================================ AREA CHART */

export const AreaChart = ({
  points,
  label,
  tableCaption,
  format = (v) => String(v),
}: {
  points: Point[];
  label: string;
  tableCaption: string;
  format?: (value: number) => string;
}) => {
  const gradientId = useId();
  const [active, setActive] = useState<number | null>(null);
  const W = 640;
  const H = 200;
  const PAD = { top: 16, right: 8, bottom: 24, left: 8 };

  const { line, area, xs, ys, ticks } = useMemo(() => {
    const top = Math.max(...points.map((p) => p.value), 1);
    const niceMax = Math.ceil(top / 100) * 100 || top;
    const x = (i: number) => PAD.left + (i / Math.max(points.length - 1, 1)) * (W - PAD.left - PAD.right);
    const y = (v: number) => PAD.top + (1 - v / niceMax) * (H - PAD.top - PAD.bottom);
    const xsList = points.map((_, i) => x(i));
    const ysList = points.map((p) => y(p.value));
    const d = xsList.map((px, i) => `${i ? 'L' : 'M'}${px.toFixed(1)},${ysList[i].toFixed(1)}`).join(' ');
    return {
      line: d,
      area: `${d} L${xsList[xsList.length - 1].toFixed(1)},${H - PAD.bottom} L${PAD.left},${H - PAD.bottom} Z`,
      xs: xsList,
      ys: ysList,
      ticks: [0.5, 1].map((f) => ({ y: y(niceMax * f), v: niceMax * f })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  const onMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const rel = ((event.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    xs.forEach((x, i) => {
      if (Math.abs(x - rel) < Math.abs(xs[nearest] - rel)) nearest = i;
    });
    setActive(nearest);
  };

  const current = active !== null ? points[active] : null;

  return (
    <figure className="oph-chart">
      <div className="oph-chart__readout" aria-live="polite">
        {current ? (
          <>
            <strong>{format(current.value)}</strong> <span>{current.label}</span>
          </>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="oph-chart__svg"
        role="img"
        aria-label={`${label}: ${points.map((p) => `${p.label} ${format(p.value)}`).slice(-7).join(', ')}`}
        onPointerDown={onMove}
        onPointerMove={onMove}
        onPointerLeave={() => setActive(null)}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--oph-forest)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--oph-forest)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((tick) => (
          <line key={tick.v} x1={PAD.left} x2={W - PAD.right} y1={tick.y} y2={tick.y} className="oph-chart__grid" vectorEffect="non-scaling-stroke" />
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} className="oph-chart__axis" />
        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} className="oph-chart__line" vectorEffect="non-scaling-stroke" />
        {active !== null ? (
          <>
            <line x1={xs[active]} x2={xs[active]} y1={PAD.top} y2={H - PAD.bottom} className="oph-chart__cross" vectorEffect="non-scaling-stroke" />
            {/* The SVG stretches (preserveAspectRatio="none"), which would turn a
                circle into an oval on phones; a zero-length line with round caps
                and a non-scaling stroke always stays round. */}
            <line x1={xs[active]} x2={xs[active]} y1={ys[active]} y2={ys[active]} className="oph-chart__dot" vectorEffect="non-scaling-stroke" />
            <line x1={xs[active]} x2={xs[active]} y1={ys[active]} y2={ys[active]} className="oph-chart__dot-core" vectorEffect="non-scaling-stroke" />
          </>
        ) : null}
      </svg>
      <div className="oph-chart__xlabels" aria-hidden="true">
        <span>{points[0]?.label}</span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
      <DataTable caption={tableCaption} rows={points} format={format} />
    </figure>
  );
};

/* ============================================================== BAR LIST */

/** Horizontal ranked bars (countries, sources): label left, value right. */
export const BarList = ({
  items,
  tableCaption,
  format = (v) => String(v),
  empty,
}: {
  items: Point[];
  tableCaption: string;
  format?: (value: number) => string;
  empty: string;
}) => {
  const max = Math.max(...items.map((item) => item.value), 1);
  if (!items.length) return <p className="oph-chart__empty">{empty}</p>;
  return (
    <figure className="oph-chart">
      <ul className="oph-barlist">
        {items.map((item) => (
          <li key={item.label} title={`${item.label}: ${format(item.value)}`}>
            <span className="oph-barlist__label">{item.label}</span>
            <span className="oph-barlist__track" aria-hidden="true">
              <span style={{ transform: `scaleX(${item.value / max})` }} />
            </span>
            <span className="oph-barlist__value">{format(item.value)}</span>
          </li>
        ))}
      </ul>
      <DataTable caption={tableCaption} rows={items} format={format} />
    </figure>
  );
};

/* ================================================================ FUNNEL */

export const Funnel = ({ steps, tableCaption }: { steps: Point[]; tableCaption: string }) => {
  const first = steps[0]?.value || 1;
  return (
    <figure className="oph-chart">
      <ol className="oph-funnel">
        {steps.map((step, index) => {
          const share = step.value / first;
          const fromPrev = index ? step.value / (steps[index - 1].value || 1) : 1;
          return (
            <li key={step.label} title={`${step.label}: ${step.value}`}>
              <div className="oph-funnel__head">
                <span>{step.label}</span>
                <strong>{step.value.toLocaleString()}</strong>
              </div>
              <span className="oph-funnel__bar" aria-hidden="true">
                <span style={{ transform: `scaleX(${Math.max(share, 0.02)})` }} />
              </span>
              {index ? <span className="oph-funnel__rate">{Math.round(fromPrev * 100)}%</span> : null}
            </li>
          );
        })}
      </ol>
      <DataTable caption={tableCaption} rows={steps} format={(v) => v.toLocaleString()} />
    </figure>
  );
};

/* ============================================================= SPARKLINE */

export const Sparkline = ({ values }: { values: number[] }) => {
  const W = 120;
  const H = 32;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const d = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * W;
      const y = H - 2 - ((v - min) / (max - min || 1)) * (H - 4);
      return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg className="oph-spark" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" preserveAspectRatio="none">
      <path d={d} vectorEffect="non-scaling-stroke" />
    </svg>
  );
};
