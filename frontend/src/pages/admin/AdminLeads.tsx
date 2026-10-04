import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { Download, Inbox, RotateCcw, Search } from 'lucide-react';
import { useI18n } from '@/i18n';
import { LOCALE_TAGS } from '@/i18n/types';
import { Button, EmptyState, Input, Segmented, Select, SkeletonList } from '@/ui';
import { api } from '@/services/api';
import { pendingLeads } from '@/services/outbox';
import {
  conversionLabels,
  formSourceLabels,
  leadStages,
  leadsCopy as C,
  type ConversionStatus,
  type LeadStage,
} from '@/content/pages/platform';
import { demoLeads, downloadText, toCrmLead, toCsv, usePersisted, type CrmLead, type LeadOverride } from './store';
import { AdminPanel, StatusPill, type Sync } from './ui';

/* =================================================================== DATA */

/**
 * CRM leads: the API when reachable; otherwise the local outbox (real
 * enquiries this browser could not deliver) plus clearly-labelled demo leads.
 * Stage / conversion edits are kept as local overrides and mirrored to the API.
 */
export const useCrmLeads = (token: string | null, sync: Sync) => {
  const [base, setBase] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(false);
  const [overrides, setOverrides] = usePersisted<Record<string, LeadOverride>>('leadOverrides', () => ({}));

  useEffect(() => {
    if (!token) return;
    let live = true;
    const queued = pendingLeads().map((item, index) => toCrmLead(item.lead, index, 'outbox'));
    setLoading(true);
    api
      .adminLeads(token)
      .then((remote) => {
        if (!live) return;
        setApiOnline(true);
        setBase([...queued, ...remote.map((lead, index) => toCrmLead(lead, index, 'api'))]);
      })
      .catch(() => {
        if (!live) return;
        setApiOnline(false);
        setBase([...queued, ...demoLeads()]);
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [token]);

  const leads = useMemo(
    () =>
      base
        .map((lead) => ({ ...lead, ...overrides[lead.id] }))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [base, overrides],
  );

  const update = useCallback(
    (id: string, patch: LeadOverride) => {
      setOverrides((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
      void sync('leads', id, patch as Record<string, unknown>, { quiet: true });
    },
    [setOverrides, sync],
  );

  return { leads, loading, apiOnline, update };
};

export const useCountryName = () => {
  const { language } = useI18n();
  return useMemo(() => {
    let names: Intl.DisplayNames | null = null;
    try {
      names = new Intl.DisplayNames([LOCALE_TAGS[language], 'ru'], { type: 'region' });
    } catch {
      names = null;
    }
    return (code: string) => {
      if (!code) return '—';
      try {
        return names?.of(code) ?? code;
      } catch {
        return code;
      }
    };
  }, [language]);
};

/* ===================================================================== UI */

type View = 'board' | 'table';

export const LeadsManager = ({
  leads,
  loading,
  update,
}: {
  leads: CrmLead[];
  loading: boolean;
  update: (id: string, patch: LeadOverride) => void;
}) => {
  const { L, formatDate } = useI18n();
  const countryName = useCountryName();
  const [view, setView] = usePersisted<View>('leadsView', () => 'board');
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [source, setSource] = useState('');
  const [stage, setStage] = useState('');
  const [conversion, setConversion] = useState('');
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<LeadStage | null>(null);
  const [announcement, setAnnouncement] = useState('');
  // Board scroll affordance: fade the right edge while more columns hide there.
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardEnd, setBoardEnd] = useState(true);
  const measureBoard = useCallback(() => {
    const node = boardRef.current;
    if (!node) return;
    setBoardEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 8);
  }, []);
  useEffect(() => {
    measureBoard();
    window.addEventListener('resize', measureBoard);
    return () => window.removeEventListener('resize', measureBoard);
  }, [measureBoard, view, loading, leads.length]);

  const sourceLabel = (id: string) => (formSourceLabels[id] ? L(formSourceLabels[id]) : id);
  const stageLabel = (id: LeadStage) => L(leadStages.find((s) => s.id === id)!.label);

  const countries = useMemo(() => [...new Set(leads.map((lead) => lead.country))].sort(), [leads]);
  const sources = useMemo(() => [...new Set(leads.map((lead) => lead.source))].sort(), [leads]);

  const filtered = leads.filter((lead) => {
    const needle = query.trim().toLowerCase();
    return (
      (!country || lead.country === country) &&
      (!source || lead.source === source) &&
      (!stage || lead.stage === stage) &&
      (!conversion || lead.conversion === conversion) &&
      (!needle || `${lead.fullName} ${lead.phone} ${lead.email} ${lead.diagnosis}`.toLowerCase().includes(needle))
    );
  });

  const hasFilters = Boolean(query || country || source || stage || conversion);
  const resetFilters = () => {
    setQuery('');
    setCountry('');
    setSource('');
    setStage('');
    setConversion('');
  };

  const moveTo = (id: string, next: LeadStage) => {
    const lead = leads.find((entry) => entry.id === id);
    if (!lead || lead.stage === next) return;
    // Closing a lead that was never lost counts as a conversion; the status
    // stays editable in the table.
    update(id, { stage: next, ...(next === 'closed' && lead.conversion === 'open' ? { conversion: 'converted' } : {}) });
    setAnnouncement(`${lead.fullName}: ${stageLabel(next)}`);
  };

  const exportCsv = () => {
    const header = ['Name', 'Phone', 'E-mail', 'Country', 'Lead source', 'Channel', 'Diagnosis', 'Stage', 'Conversion', 'Date', 'Origin'];
    const rows = filtered.map((lead) => [
      lead.fullName,
      lead.phone,
      lead.email,
      lead.country,
      lead.source,
      lead.channel,
      lead.diagnosis,
      lead.stage,
      lead.conversion,
      lead.date,
      lead.origin,
    ]);
    downloadText(`ophtra-leads-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(header, rows));
  };

  const stageSelect = (lead: CrmLead, compact = false) => (
    <select
      className={`oph-select ${compact ? 'oph-select--compact' : ''}`}
      value={lead.stage}
      aria-label={`${L(C.stage)}: ${lead.fullName}`}
      onChange={(event) => moveTo(lead.id, event.target.value as LeadStage)}
    >
      {leadStages.map((option) => (
        <option key={option.id} value={option.id}>
          {L(option.label)}
        </option>
      ))}
    </select>
  );

  const conversionPill = (status: ConversionStatus) => (
    <StatusPill tone={status === 'converted' ? 'ok' : status === 'lost' ? 'bad' : 'muted'}>{L(conversionLabels[status])}</StatusPill>
  );

  const originTag = (lead: CrmLead) =>
    lead.origin === 'outbox' ? (
      <span className="oph-atag" title={L(C.queuedHint)}>
        {L(C.queued)}
      </span>
    ) : lead.origin === 'demo' ? (
      <span className="oph-atag oph-atag--muted">{L(C.demo)}</span>
    ) : null;

  const onDrop = (event: DragEvent, target: LeadStage) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain') || dragging;
    if (id) moveTo(id, target);
    setDragging(null);
    setOver(null);
  };

  return (
    <AdminPanel
      title={L(C.title)}
      lead={L(C.lead)}
      actions={
        <>
          <Segmented<View>
            label={L(C.view)}
            value={view}
            onChange={setView}
            options={[
              { value: 'board', label: L(C.board) },
              { value: 'table', label: L(C.table) },
            ]}
          />
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!filtered.length}>
            <Download size={15} aria-hidden="true" />
            {L(C.exportCsv)}
          </Button>
        </>
      }
    >
      <div className="oph-afilters oph-afilters--wide" role="search">
        <Input
          label={L(C.search)}
          type="search"
          value={query}
          icon={<Search size={16} aria-hidden="true" />}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          label={L(C.country)}
          value={country}
          options={[{ value: '', label: L(C.allCountries) }, ...countries.map((code) => ({ value: code, label: countryName(code) }))]}
          onChange={(event) => setCountry(event.target.value)}
        />
        <Select
          label={L(C.source)}
          value={source}
          options={[{ value: '', label: L(C.allSources) }, ...sources.map((id) => ({ value: id, label: sourceLabel(id) }))]}
          onChange={(event) => setSource(event.target.value)}
        />
        <Select
          label={L(C.stage)}
          value={stage}
          options={[{ value: '', label: L(C.allStages) }, ...leadStages.map((s) => ({ value: s.id, label: L(s.label) }))]}
          onChange={(event) => setStage(event.target.value)}
        />
        <Select
          label={L(C.conversion)}
          value={conversion}
          options={[
            { value: '', label: L(C.allConversions) },
            ...(['open', 'converted', 'lost'] as const).map((id) => ({ value: id, label: L(conversionLabels[id]) })),
          ]}
          onChange={(event) => setConversion(event.target.value)}
        />
      </div>

      <div className="oph-acount">
        <span>
          {L(C.shown)}: <strong>{filtered.length}</strong> / {leads.length}
        </span>
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw size={14} aria-hidden="true" />
            {L(C.reset)}
          </Button>
        ) : null}
      </div>

      <p className="oph-visually-hidden" aria-live="polite">
        {announcement}
      </p>

      {loading ? (
        <div role="status" aria-label={L(C.loading)}>
          <SkeletonList count={3} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title={L(C.empty)} text={L(C.emptyText)} icon={<Inbox size={30} />} />
      ) : view === 'board' ? (
        <div className="oph-board" ref={boardRef} onScroll={measureBoard} data-more={boardEnd ? undefined : true}>
          {leadStages.map((column) => {
            const items = filtered.filter((lead) => lead.stage === column.id);
            return (
              <section
                key={column.id}
                className="oph-board__col"
                data-over={over === column.id || undefined}
                aria-label={`${L(column.label)} (${items.length})`}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'move';
                  if (over !== column.id) setOver(column.id);
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) setOver(null);
                }}
                onDrop={(event) => onDrop(event, column.id)}
              >
                <header className="oph-board__head">
                  <h3>{L(column.label)}</h3>
                  <span className="oph-board__count">{items.length}</span>
                </header>
                <ul className="oph-board__list">
                  {items.map((lead) => (
                    <li
                      key={lead.id}
                      className="oph-lcard"
                      draggable
                      data-dragging={dragging === lead.id || undefined}
                      onDragStart={(event) => {
                        event.dataTransfer.setData('text/plain', lead.id);
                        event.dataTransfer.effectAllowed = 'move';
                        setDragging(lead.id);
                      }}
                      onDragEnd={() => {
                        setDragging(null);
                        setOver(null);
                      }}
                    >
                      <div className="oph-lcard__top">
                        <strong className="oph-lcard__name">{lead.fullName}</strong>
                        {originTag(lead)}
                      </div>
                      <p className="oph-lcard__meta">
                        {countryName(lead.country)} · {sourceLabel(lead.source)}
                      </p>
                      {lead.diagnosis ? <p className="oph-lcard__dx">{lead.diagnosis}</p> : null}
                      <div className="oph-lcard__foot">
                        {conversionPill(lead.conversion)}
                        <time dateTime={lead.date}>{formatDate(lead.date, { day: 'numeric', month: 'short' })}</time>
                      </div>
                      {stageSelect(lead, true)}
                    </li>
                  ))}
                  {items.length === 0 ? <li className="oph-board__empty">{L(C.dropHere)}</li> : null}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="oph-rtable-wrap">
          <table className="oph-table oph-rtable oph-table--leads">
            <caption className="oph-visually-hidden">{L(C.lead)}</caption>
            <thead>
              <tr>
                <th scope="col">{L(C.name)}</th>
                <th scope="col">{L(C.country)}</th>
                <th scope="col">{L(C.source)}</th>
                <th scope="col">{L(C.diagnosis)}</th>
                <th scope="col">{L(C.stage)}</th>
                <th scope="col">{L(C.conversion)}</th>
                <th scope="col">{L(C.date)}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <span className="oph-table__name">
                      {lead.fullName} {originTag(lead)}
                    </span>
                    <span className="oph-atable__sub">
                      {lead.phone}
                      {lead.email ? ` · ${lead.email}` : ''}
                    </span>
                  </td>
                  <td data-label={L(C.country)}>{countryName(lead.country)}</td>
                  <td data-label={L(C.source)}>
                    {sourceLabel(lead.source)}
                    <span className="oph-atable__sub">{lead.channel}</span>
                  </td>
                  <td className="oph-atable__muted" data-label={L(C.diagnosis)}>
                    {lead.diagnosis || L(C.unknown)}
                  </td>
                  <td data-label={L(C.stage)}>{stageSelect(lead, true)}</td>
                  <td data-label={L(C.conversion)}>
                    <select
                      className="oph-select oph-select--compact"
                      value={lead.conversion}
                      aria-label={`${L(C.conversion)}: ${lead.fullName}`}
                      onChange={(event) => update(lead.id, { conversion: event.target.value as ConversionStatus })}
                    >
                      {(['open', 'converted', 'lost'] as const).map((id) => (
                        <option key={id} value={id}>
                          {L(conversionLabels[id])}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="oph-atable__muted" data-label={L(C.date)}>
                    <time dateTime={lead.date}>{formatDate(lead.date, { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPanel>
  );
};
