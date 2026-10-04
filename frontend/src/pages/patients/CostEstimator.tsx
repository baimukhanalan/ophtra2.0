import { useId, useMemo, useState } from 'react';
import { ArrowDown, ChevronDown, Info } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Checkbox, Segmented } from '@/ui';
import { Reveal } from '@/motion';
import { departments, services } from '@/content';
import { intl } from '@/content/pages/patients-international';

/**
 * Indicative cost calculator for international patients (spec §8).
 *
 * Medical services come from the live price list (`services` in @/content).
 * The upper bound adds 20 % for tests the doctor may add after the review.
 * Travel items are typical Astana market ranges (labelled as such on the
 * page), not clinic prices. Everything is a guide — the binding figure is the
 * written treatment plan.
 *
 * «Add this estimate to my request» hands a plain-text summary to the page,
 * which pre-fills the application form (`LeadForm initialValues`).
 */

/** Indicative tenge per US dollar used for the secondary currency. */
const KZT_PER_USD = 510;
const MEDICAL_MARGIN = 1.2;
const AIRPORT = { min: 15000, max: 25000 };
const DAILY_RIDE = { min: 8000, max: 12000 };
const INTERPRETER_DAY = { min: 25000, max: 40000 };
const DEFAULT_SERVICE = 'svc-complex';

type Tier = (typeof intl.stayTiers)[number]['value'];
type Transfer = (typeof intl.transferOptions)[number]['value'];

interface Range {
  min: number;
  max: number;
}

export interface EstimatePrefill {
  /** First ticked service, for the form's «service of interest» select. */
  serviceId: string;
  /** Human-readable summary for the form comment. */
  summary: string;
}

const add = (a: Range, b: Range): Range => ({ min: a.min + b.min, max: a.max + b.max });
const times = (r: Range, n: number): Range => ({ min: r.min * n, max: r.max * n });
const roundTo = (value: number, step: number) => Math.round(value / step) * step;

/** Groups start open on wide screens; on phones only the group with a ticked service does. */
const wideScreen = () => {
  try {
    return window.matchMedia('(min-width: 768px)').matches;
  } catch {
    return true;
  }
};

export const CostEstimator = ({ onApply }: { onApply?: (prefill: EstimatePrefill) => void }) => {
  const { L, formatNumber, formatPrice } = useI18n();
  const baseId = useId();
  const [selected, setSelected] = useState<string[]>([DEFAULT_SERVICE]);
  const [nights, setNights] = useState(4);
  const [clinicDays, setClinicDays] = useState(2);
  const [tier, setTier] = useState<Tier>('comfort');
  const [transfer, setTransfer] = useState<Transfer>('airport');
  const [interpreter, setInterpreter] = useState(false);

  const groups = useMemo(
    () =>
      departments
        .map((department) => ({ department, items: services.filter((s) => s.departmentId === department.id) }))
        .filter((group) => group.items.length > 0),
    [],
  );

  const [open, setOpen] = useState<string[]>(() => {
    if (wideScreen()) return groups.map((group) => group.department.id);
    const withDefault = groups.find((group) => group.items.some((item) => item.id === DEFAULT_SERVICE));
    return withDefault ? [withDefault.department.id] : [];
  });

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

  const estimate = useMemo(() => {
    const sum = services.filter((s) => selected.includes(s.id)).reduce((total, s) => total + s.price, 0);
    const medical: Range = { min: sum, max: roundTo(sum * MEDICAL_MARGIN, 1000) };
    const stayTier = intl.stayTiers.find((t) => t.value === tier)!;
    let travel: Range = times({ min: stayTier.min, max: stayTier.max }, nights);
    if (transfer !== 'none') travel = add(travel, AIRPORT);
    if (transfer === 'full') travel = add(travel, times(DAILY_RIDE, clinicDays));
    if (interpreter) travel = add(travel, times(INTERPRETER_DAY, clinicDays));
    return { medical, travel, total: add(medical, travel) };
  }, [selected, nights, clinicDays, tier, transfer, interpreter]);

  const kzt = (r: Range) => (r.min === r.max ? formatPrice(r.min) : `${formatNumber(r.min)} – ${formatPrice(r.max)}`);
  const usd = (r: Range) => {
    const fmt = (v: number) =>
      formatNumber(roundTo(v / KZT_PER_USD, 10), { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    return r.min === r.max ? fmt(r.min) : `${fmt(r.min)} – ${fmt(r.max)}`;
  };

  const empty = selected.length === 0;
  const nightsId = `${baseId}-nights`;
  const daysId = `${baseId}-days`;
  const stayTier = intl.stayTiers.find((x) => x.value === tier)!;

  const apply = () => {
    if (!onApply || empty) return;
    const picked = services.filter((s) => selected.includes(s.id));
    const lines = [
      `${L(intl.estPrefill)}:`,
      `${L(intl.estServices)}: ${picked.map((s) => L(s.name)).join(', ')}`,
      `${L(intl.estNights)}: ${nights}; ${L(intl.estClinicDays)}: ${clinicDays}`,
      `${L(intl.estStay)}: ${L(stayTier.label)}; ${L(intl.estTransfer)}: ${L(
        intl.transferOptions.find((t) => t.value === transfer)!.label,
      )}${interpreter ? `; ${L(intl.estInterpreter)}: ${L(intl.estYes)}` : ''}`,
      `${L(intl.estResult)}: ${kzt(estimate.total)} (≈ ${usd(estimate.total)})`,
    ];
    onApply({ serviceId: picked[0]?.id ?? '', summary: lines.join('\n') });
  };

  return (
    <div className="oph-pt-est">
      <div className="oph-pt-est__controls">
        <fieldset className="oph-pt-est__group">
          <legend className="oph-pt-est__legend">{L(intl.estServices)}</legend>
          <div className="oph-pt-est__services">
            {groups.map(({ department, items }) => {
              const count = items.filter((item) => selected.includes(item.id)).length;
              const isOpen = open.includes(department.id);
              return (
                <details
                  key={department.id}
                  className="oph-pt-est__dept"
                  open={isOpen}
                  onToggle={(event) => {
                    const next = (event.currentTarget as HTMLDetailsElement).open;
                    if (next !== isOpen)
                      setOpen((current) =>
                        next ? [...current, department.id] : current.filter((id) => id !== department.id),
                      );
                  }}
                >
                  <summary className="oph-pt-est__summary">
                    <span className="oph-pt-est__deptname">{L(department.name)}</span>
                    {count ? (
                      <span className="oph-pt-est__count">
                        {L(intl.estSelected)}: {count}
                      </span>
                    ) : null}
                    <ChevronDown size={16} aria-hidden="true" className="oph-pt-est__chev" />
                  </summary>
                  <ul>
                    {items.map((service) => (
                      <li key={service.id}>
                        <Checkbox
                          checked={selected.includes(service.id)}
                          onChange={() => toggle(service.id)}
                          label={
                            <span className="oph-pt-est__svc">
                              <span>{L(service.name)}</span>
                              <span className="oph-pt-est__price">{formatPrice(service.price)}</span>
                            </span>
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
        </fieldset>

        <div className="oph-pt-est__ranges">
          <div className="oph-pt-est__range">
            <label htmlFor={nightsId} className="oph-pt-est__legend">
              {L(intl.estNights)}
            </label>
            <div className="oph-pt-est__rangerow">
              <input
                id={nightsId}
                type="range"
                min={0}
                max={21}
                value={nights}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setNights(next);
                  if (clinicDays > next + 1) setClinicDays(next + 1);
                }}
              />
              <output htmlFor={nightsId} className="oph-pt-est__value">
                {nights}
              </output>
            </div>
          </div>
          <div className="oph-pt-est__range">
            <label htmlFor={daysId} className="oph-pt-est__legend">
              {L(intl.estClinicDays)}
            </label>
            <div className="oph-pt-est__rangerow">
              <input
                id={daysId}
                type="range"
                min={1}
                max={Math.max(1, Math.min(10, nights + 1))}
                value={clinicDays}
                onChange={(event) => setClinicDays(Number(event.target.value))}
              />
              <output htmlFor={daysId} className="oph-pt-est__value">
                {clinicDays}
              </output>
            </div>
          </div>
        </div>

        <div className="oph-pt-est__group">
          <p className="oph-pt-est__legend" aria-hidden="true">
            {L(intl.estStay)}
          </p>
          <Segmented<Tier>
            label={L(intl.estStay)}
            value={tier}
            onChange={setTier}
            options={intl.stayTiers.map((t) => ({ value: t.value, label: L(t.label) }))}
          />
          {tier !== 'own' ? (
            <p className="oph-pt-est__hint">
              {`${formatNumber(stayTier.min)} – ${formatPrice(stayTier.max)} ${L(intl.estPerNight)}`}
            </p>
          ) : null}
        </div>

        <div className="oph-pt-est__group">
          <p className="oph-pt-est__legend" aria-hidden="true">
            {L(intl.estTransfer)}
          </p>
          <Segmented<Transfer>
            label={L(intl.estTransfer)}
            value={transfer}
            onChange={setTransfer}
            options={intl.transferOptions.map((t) => ({ value: t.value, label: L(t.label) }))}
          />
        </div>

        <div className="oph-pt-est__group">
          <Checkbox
            checked={interpreter}
            onChange={(event) => setInterpreter(event.target.checked)}
            label={L(intl.estInterpreter)}
          />
        </div>
      </div>

      <Reveal variant="left" className="oph-pt-est__result">
        <div className="oph-pt-est__panel">
          <p className="oph-eyebrow">{L(intl.estResult)}</p>
          <div aria-live="polite" aria-atomic="true" className="oph-pt-est__live">
            {empty ? (
              <p className="oph-pt-est__empty">{L(intl.estEmpty)}</p>
            ) : (
              <>
                <p className="oph-pt-est__total">{kzt(estimate.total)}</p>
                <p className="oph-pt-est__usd">≈ {usd(estimate.total)}</p>
                <dl className="oph-pt-est__breakdown">
                  <div>
                    <dt>{L(intl.estMedical)}</dt>
                    <dd>{kzt(estimate.medical)}</dd>
                  </div>
                  <div>
                    <dt>{L(intl.estTravel)}</dt>
                    <dd>{kzt(estimate.travel)}</dd>
                  </div>
                </dl>
              </>
            )}
          </div>
          <p className="oph-pt-est__note">
            <Info size={15} aria-hidden="true" />
            <span>{L(intl.estNote).replace('{rate}', formatNumber(KZT_PER_USD))}</span>
          </p>
          {/* A fragment link, so the browser scrolls to the form natively; the
              click also hands the estimate to the form. */}
          <a
            className="oph-herolink oph-pt-est__cta"
            href="#apply"
            aria-disabled={empty || undefined}
            onClick={(event) => {
              if (empty) {
                event.preventDefault();
                return;
              }
              apply();
            }}
          >
            {L(intl.estCta)}
            <ArrowDown size={15} aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </div>
  );
};
