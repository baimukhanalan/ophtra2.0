import { useMemo } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useI18n } from '@/i18n';
import { analyticsConfig } from '@/services/analytics';
import { adminCopy as A, adminNav, analyticsCopy as C, formSourceLabels, pendingCopy as P } from '@/content/pages/platform';
import { AreaChart, BarList, Funnel, Sparkline, type Point } from './charts';
import { useCountryName } from './AdminLeads';
import type { CrmLead } from './store';
import { AdminPanel, PendingNotice, StatusPill } from './ui';

/** Deterministic pseudo-random series so the demo does not jump between renders. */
const series = (days: number, base: number, amplitude: number, seed: number) => {
  let state = seed;
  const rand = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
  return Array.from({ length: days }, (_, index) => {
    const weekday = (index + 3) % 7;
    const weekend = weekday >= 5 ? 0.72 : 1;
    const trend = 1 + index / (days * 6);
    return Math.round((base + (rand() - 0.5) * amplitude) * weekend * trend);
  });
};

/** Demo share of leads by country (spec §13 — international focus). */
const DEMO_COUNTRIES: Array<[string, number]> = [
  ['KZ', 384],
  ['UZ', 71],
  ['KG', 46],
  ['RU', 39],
  ['AE', 22],
  ['TR', 17],
  ['DE', 12],
  ['MN', 9],
];

export const AnalyticsDashboard = ({ leads }: { leads: CrmLead[] }) => {
  const { L, formatNumber, formatDate } = useI18n();
  const countryName = useCountryName();

  const data = useMemo(() => {
    const visits = series(30, 1280, 520, 7);
    const leadsDaily = series(30, 20, 14, 11);
    const bookings = leadsDaily.map((v) => Math.round(v * 0.68));
    const prevVisits = series(30, 1130, 520, 3).reduce((a, b) => a + b, 0);
    const prevLeads = series(30, 18, 14, 5).reduce((a, b) => a + b, 0);
    const totalVisits = visits.reduce((a, b) => a + b, 0);
    const totalLeads = leadsDaily.reduce((a, b) => a + b, 0);
    const totalBookings = bookings.reduce((a, b) => a + b, 0);
    const start = new Date();
    start.setDate(start.getDate() - 29);
    const labels = visits.map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d.toISOString();
    });
    return {
      visits,
      leadsDaily,
      bookings,
      labels,
      totalVisits,
      totalLeads,
      totalBookings,
      rate: (totalLeads / totalVisits) * 100,
      prevRate: (prevLeads / prevVisits) * 100,
      visitsDelta: ((totalVisits - prevVisits) / prevVisits) * 100,
      leadsDelta: ((totalLeads - prevLeads) / prevLeads) * 100,
    };
  }, []);

  const trafficPoints: Point[] = data.visits.map((value, i) => ({
    label: formatDate(data.labels[i], { day: 'numeric', month: 'short' }),
    value,
  }));

  const crmSources: Point[] = useMemo(() => {
    const counts = new Map<string, number>();
    leads.forEach((lead) => counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id, value]) => ({ label: formSourceLabels[id] ? L(formSourceLabels[id]) : id, value }));
  }, [leads, L]);

  const countries: Point[] = DEMO_COUNTRIES.map(([code, value]) => ({ label: countryName(code), value }));

  const kpis = [
    { label: L(C.traffic), value: formatNumber(data.totalVisits), delta: data.visitsDelta, spark: data.visits },
    { label: L(C.leads), value: formatNumber(data.totalLeads), delta: data.leadsDelta, spark: data.leadsDaily },
    {
      label: L(C.conversion),
      value: `${formatNumber(data.rate, { maximumFractionDigits: 2 })}%`,
      delta: ((data.rate - data.prevRate) / data.prevRate) * 100,
      spark: data.leadsDaily.map((v, i) => v / data.visits[i]),
    },
    { label: L(C.appointments), value: formatNumber(data.totalBookings), delta: data.leadsDelta * 0.9, spark: data.bookings },
  ];

  // Figures below stay demo data until GA4 is wired in (build ID + server
  // access to the GA4 Data API); the notice says so up front.
  const connected = Boolean(analyticsConfig.ga4);

  const tracking = [
    { name: 'Google Analytics 4', value: analyticsConfig.ga4 },
    { name: 'Google Tag Manager', value: analyticsConfig.gtm },
    { name: 'Microsoft Clarity', value: analyticsConfig.clarity },
    { name: 'Google Search Console', value: analyticsConfig.gscVerification },
  ];

  return (
    <>
      {connected ? null : <PendingNotice title={L(P.analyticsTitle)}>{L(P.analyticsText)}</PendingNotice>}

      <AdminPanel
        title={L(adminNav.analytics)}
        lead={L(C.lead)}
        actions={<StatusPill tone="warn">{L(A.demoData)}</StatusPill>}
      >
        <ul className="oph-kpis">
          {kpis.map((kpi) => {
            const up = kpi.delta >= 0;
            return (
              <li key={kpi.label} className="oph-kpi">
                <span className="oph-kpi__label">{kpi.label}</span>
                <strong className="oph-kpi__value">{kpi.value}</strong>
                <span className={`oph-kpi__delta ${up ? 'is-up' : 'is-down'}`}>
                  {up ? <TrendingUp size={14} aria-hidden="true" /> : <TrendingDown size={14} aria-hidden="true" />}
                  {up ? '+' : '−'}
                  {formatNumber(Math.abs(kpi.delta), { maximumFractionDigits: 1 })}% <span>{L(C.vsPrev)}</span>
                </span>
                <Sparkline values={kpi.spark} />
              </li>
            );
          })}
        </ul>
      </AdminPanel>

      <AdminPanel title={L(C.trafficTitle)} actions={<StatusPill tone="warn">{L(A.demoData)}</StatusPill>}>
        <AreaChart
          points={trafficPoints}
          label={L(C.trafficTitle)}
          tableCaption={L(C.tableView)}
          format={(v) => formatNumber(v)}
        />
      </AdminPanel>

      <div className="oph-agrid">
        <AdminPanel title={L(C.countriesTitle)} actions={<StatusPill tone="warn">{L(A.demoData)}</StatusPill>}>
          <BarList items={countries} tableCaption={L(C.tableView)} format={(v) => formatNumber(v)} empty="—" />
        </AdminPanel>
        <AdminPanel title={L(C.funnelTitle)} actions={<StatusPill tone="warn">{L(A.demoData)}</StatusPill>}>
          <Funnel
            tableCaption={L(C.tableView)}
            steps={[
              { label: L(C.funnelView), value: 9840 },
              { label: L(C.funnelStart), value: 1712 },
              { label: L(C.funnelSubmit), value: data.totalBookings + 120 },
              { label: L(C.funnelConfirm), value: data.totalBookings },
            ]}
          />
        </AdminPanel>
      </div>

      <div className="oph-agrid">
        <AdminPanel title={L(C.sourcesTitle)} lead={`CRM · ${leads.length}`}>
          <BarList items={crmSources} tableCaption={L(C.tableView)} empty="—" />
        </AdminPanel>
        <AdminPanel title={L(C.trackingStatus)} lead={L(C.consentNote)}>
          <ul className="oph-alist">
            {tracking.map((item) => (
              <li key={item.name}>
                <span>{item.name}</span>
                <StatusPill tone={item.value ? 'ok' : 'warn'}>
                  {item.value ? `${L(C.active)} · ${item.value.slice(0, 14)}` : L(C.notSet)}
                </StatusPill>
              </li>
            ))}
          </ul>
        </AdminPanel>
      </div>
    </>
  );
};
