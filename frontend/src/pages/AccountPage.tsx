import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarClock,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Download,
  FileSearch,
  FileText,
  LockKeyhole,
  History,
  LogOut,
  Receipt,
  RefreshCw,
  Repeat2,
  Stethoscope,
  XCircle,
} from 'lucide-react';
import { useI18n } from '@/i18n';
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  EmptyState,
  Input,
  Modal,
  Section,
  SkeletonList,
  SuccessState,
  useToast,
  type Column,
} from '@/ui';
import { Reveal } from '@/motion';
import { Seo } from '@/seo/Seo';
import { PageHero } from '@/components/PageHero';
import { SectionIndex } from '@/components/editorial';
import { accountCopy as AC, demoOpinions, opinionStatuses } from '@/content/pages/platform';
import { ResponsiveTable } from './admin/ui';
import { ROUTES } from '@/app/navigation';
import { api } from '@/services/api';
import { track, trackConversion } from '@/services/analytics';
import { byId, clinics, doctors, services } from '@/content';
import demoAccount from '@data/patient-demo.json';
import type {
  Appointment,
  ExamResult,
  Invoice,
  Patient,
  Prescription,
  Recommendation,
} from '@/types';

const TOKEN_KEY = 'ophtra.account.token';
const DEMO_CODE = '0000';

interface AccountData {
  patient: Patient;
  appointments: Appointment[];
  prescriptions: Prescription[];
  recommendations: Recommendation[];
  results: ExamResult[];
  invoices: Invoice[];
}

type TabId = 'appointments' | 'history' | 'recommendations' | 'prescriptions' | 'results' | 'invoices' | 'opinions';

const readToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

/**
 * Patient account.
 *
 * Sign-in is by phone number with a one-time code (the demo backend always
 * accepts 0000). The account exposes exactly what the specification lists:
 * appointments, visit history, doctor recommendations, prescriptions,
 * examination results, invoices, online payment and repeat booking — plus
 * second-opinion / remote requests with their review status
 * (Получено → На рассмотрении → Заключение готово).
 */
/** YYYY-MM-DD in the visitor's local time zone (appointment dates are local). */
const localDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const AccountPage = () => {
  const { t, L, formatDate, formatPrice } = useI18n();
  const [demoData, setDemoData] = useState(false);
  const { notify } = useToast();

  const [token, setToken] = useState<string | null>(readToken);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string>();

  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<TabId>('appointments');
  const tabStripRef = useRef<HTMLElement>(null);
  // Phones/tablets: the tab strip scrolls sideways — keep the active tab in
  // view (horizontally only, the page itself never jumps).
  useEffect(() => {
    const strip = tabStripRef.current;
    const active = strip?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!strip || !active || strip.scrollWidth <= strip.clientWidth) return;
    const offset = active.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
    const left = offset - (strip.clientWidth - active.offsetWidth) / 2;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    strip.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' });
  }, [tab]);
  // Edge fades only where tabs are actually hidden (set on the DOM node, no
  // re-render per scroll frame).
  const markStripEdges = useCallback(() => {
    const strip = tabStripRef.current;
    if (!strip) return;
    const max = strip.scrollWidth - strip.clientWidth;
    strip.toggleAttribute('data-more-start', max > 1 && strip.scrollLeft > 1);
    strip.toggleAttribute('data-more-end', max > 1 && strip.scrollLeft < max - 1);
  }, []);
  useEffect(() => {
    markStripEdges();
    window.addEventListener('resize', markStripEdges);
    return () => window.removeEventListener('resize', markStripEdges);
  });
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [processing, setProcessing] = useState(false);

  const load = useCallback(async (activeToken: string) => {
    setLoading(true);
    try {
      setData(await api.account(activeToken));
      setDemoData(false);
    } catch {
      // API unavailable — show the demo dataset so the account is explorable.
      setData(demoAccount as unknown as AccountData);
      setDemoData(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) void load(token);
  }, [token, load]);

  /* ------------------------------------------------------------ sign-in */
  const storeToken = (value: string | null) => {
    try {
      if (value) window.localStorage.setItem(TOKEN_KEY, value);
      else window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* session-only sign-in */
    }
  };

  const requestCode = async () => {
    if (signingIn) return;
    if (phone.replace(/\D/g, '').length < 10) {
      setSignInError(t.common.invalidPhone);
      return;
    }
    setSignInError(undefined);
    setSigningIn(true);
    try {
      const result = await api.requestCode(phone.trim());
      // The server hands back the code when it has no way to deliver it.
      if (result.demoCode) {
        setDemoCode(result.demoCode);
        setCode(result.demoCode);
      }
    } catch {
      // No API at all (static deployment): fall back to the documented demo
      // code and fill it in, so the account is reachable rather than a dead end.
      setDemoCode(DEMO_CODE);
      setCode(DEMO_CODE);
    } finally {
      setCodeSent(true);
      setSigningIn(false);
    }
  };

  const verify = async () => {
    if (!/^\d{4}$/.test(code.trim())) {
      setSignInError(L(AC.codeInvalid));
      return;
    }
    setSigningIn(true);
    setSignInError(undefined);
    try {
      const result = await api.verifyCode(phone.trim(), code.trim());
      storeToken(result.token);
      setToken(result.token);
      track('account_signed_in');
    } catch {
      if (code.trim() === DEMO_CODE) {
        const demoToken = `demo-${Date.now()}`;
        storeToken(demoToken);
        setToken(demoToken);
        track('account_signed_in', { mode: 'demo' });
      } else {
        setSignInError(t.common.error);
      }
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = () => {
    storeToken(null);
    setToken(null);
    setData(null);
    setCodeSent(false);
    setCode('');
  };

  /* ----------------------------------------------------------- payments */
  const pay = async () => {
    if (!payingInvoice || !token) return;
    setProcessing(true);
    try {
      await api.pay(payingInvoice.id, token);
    } catch {
      /* demo payment loop — no real funds move */
    } finally {
      setData((current) =>
        current
          ? {
              ...current,
              invoices: current.invoices.map((invoice) =>
                invoice.id === payingInvoice.id
                  ? {
                      ...invoice,
                      status: 'paid',
                      receiptUrl: `/receipts/${invoice.number}.pdf`,
                    }
                  : invoice,
              ),
            }
          : current,
      );
      trackConversion('payment_completed', payingInvoice.amount);
      setPaymentDone(true);
      setProcessing(false);
    }
  };

  const refund = async (invoice: Invoice) => {
    if (!token) return;
    try {
      await api.refund(invoice.id, token);
    } catch {
      /* demo refund loop */
    }
    setData((current) =>
      current
        ? {
            ...current,
            invoices: current.invoices.map((entry) =>
              entry.id === invoice.id ? { ...entry, status: 'refunded' } : entry,
            ),
          }
        : current,
    );
    notify({ tone: 'success', title: t.payments.refundRequested, text: t.payments.refundText });
  };

  const cancelAppointment = async (appointment: Appointment) => {
    if (!token) return;
    try {
      await api.cancelAppointment(appointment.id, token);
    } catch {
      /* demo cancellation */
    }
    setData((current) =>
      current
        ? {
            ...current,
            appointments: current.appointments.map((entry) =>
              entry.id === appointment.id ? { ...entry, status: 'cancelled' } : entry,
            ),
          }
        : current,
    );
    notify({ tone: 'success', title: t.common.confirm });
  };

  /* ------------------------------------------------------------- render */
  if (!token) {
    return (
      <>
        <Seo title={t.account.signIn} description={t.account.signInText} noIndex />
        <PageHero
          eyebrow={t.nav.account}
          title={t.account.title}
          text={t.account.subtitle}
          crumbs={[{ label: t.nav.account }]}
        />

        <Section aria-labelledby="account-signin">
          <Container size="prose">
            <SectionIndex n={1} label={t.account.signIn} />
            <Reveal variant="up">
              <div className="oph-panel oph-authcard">
                <span className="oph-authcard__icon" aria-hidden="true">
                  <LockKeyhole size={20} />
                </span>
                <h2 id="account-signin" className="oph-authcard__title">
                  {t.account.signIn}
                </h2>
                <p className="oph-authcard__text">{t.account.signInText}</p>

                <ol className="oph-authsteps" aria-label={t.account.signIn}>
                  <li aria-current={!codeSent ? 'step' : undefined} data-done={codeSent || undefined}>
                    <span>01</span> {L(AC.step1)}
                  </li>
                  <li aria-current={codeSent ? 'step' : undefined}>
                    <span>02</span> {L(AC.step2)}
                  </li>
                </ol>

                <form
                  className="oph-form oph-authcard__form"
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    void (codeSent ? verify() : requestCode());
                  }}
                >
                  <Input
                    label={t.common.phone}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+7 (___) ___ __ __"
                    required
                    value={phone}
                    disabled={codeSent}
                    error={!codeSent ? signInError : undefined}
                    onChange={(event) => setPhone(event.target.value)}
                  />

                  {codeSent ? (
                    <>
                      {demoCode ? (
                        <Alert tone="warning">
                          <strong style={{ display: 'block', marginBottom: 4 }}>{t.account.demoModeTitle}</strong>
                          {t.account.demoModeText}{' '}
                          <strong className="oph-authcard__code">{demoCode}</strong>
                        </Alert>
                      ) : null}
                      <Input
                        label={t.account.code}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]{4}"
                        maxLength={4}
                        required
                        value={code}
                        error={signInError}
                        hint={demoCode ? t.account.demoModePrefilled : undefined}
                        onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
                      />
                    </>
                  ) : null}

                  <Button type="submit" loading={signingIn} block>
                    {codeSent ? t.common.confirm : t.account.getCode}
                  </Button>

                  {codeSent ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCodeSent(false);
                        setCode('');
                        setSignInError(undefined);
                      }}
                    >
                      {L(AC.changePhone)}
                    </Button>
                  ) : null}
                </form>

                <p className="oph-authcard__secure">
                  <LockKeyhole size={14} aria-hidden="true" />
                  <span>{L(AC.secureNote)}</span>
                </p>
              </div>
            </Reveal>
          </Container>
        </Section>
      </>
    );
  }

  // «Upcoming» is decided by the calendar, not only by status: a confirmed
  // visit whose date has passed belongs to the history (and reads «Состоялась»).
  const todayKey = localDateKey(new Date());
  const isUpcoming = (appointment: Appointment) =>
    appointment.status === 'confirmed' && appointment.date >= todayKey;
  const displayStatus = (appointment: Appointment): Appointment['status'] =>
    appointment.status === 'confirmed' && !isUpcoming(appointment) ? 'completed' : appointment.status;
  const byDate = (a: Appointment, b: Appointment) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
  const upcoming = (data?.appointments ?? []).filter(isUpcoming).sort(byDate);
  const past = (data?.appointments ?? [])
    .filter((appointment) => !isUpcoming(appointment))
    .sort((a, b) => byDate(b, a));

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'appointments', label: t.account.appointments, icon: <CalendarClock size={17} /> },
    { id: 'history', label: t.account.history, icon: <History size={17} /> },
    { id: 'recommendations', label: t.account.recommendations, icon: <Stethoscope size={17} /> },
    { id: 'prescriptions', label: t.account.prescriptions, icon: <ClipboardList size={17} /> },
    { id: 'results', label: t.account.results, icon: <FileText size={17} /> },
    { id: 'invoices', label: t.account.invoices, icon: <Receipt size={17} /> },
    { id: 'opinions', label: L(AC.opinionsTab), icon: <FileSearch size={17} /> },
  ];

  const describe = (appointment: Appointment) =>
    [
      byId(services, appointment.serviceId)
        ? L(byId(services, appointment.serviceId)!.name)
        : null,
      byId(doctors, appointment.doctorId) ? L(byId(doctors, appointment.doctorId)!.name) : null,
      byId(clinics, appointment.clinicId) ? L(byId(clinics, appointment.clinicId)!.name) : null,
    ]
      .filter(Boolean)
      .join(' · ');

  const appointmentColumns: Array<Column<Appointment>> = [
    {
      key: 'when',
      header: t.common.date,
      render: (appointment) => (
        <div style={{ display: 'grid', gap: 4 }}>
          <span className="oph-table__name">
            {formatDate(appointment.date)} · {appointment.time}
          </span>
          <span style={{ color: 'var(--oph-muted)', fontSize: 'var(--oph-text-xs)' }}>
            {describe(appointment)}
          </span>
        </div>
      ),
    },
    {
      key: 'reference',
      header: t.booking.bookingNumber,
      width: '150px',
      render: (appointment) => (
        <span style={{ fontSize: 'var(--oph-text-xs)', letterSpacing: '0.05em' }}>
          {appointment.reference}
        </span>
      ),
    },
    {
      key: 'status',
      header: t.common.status,
      width: '140px',
      render: (appointment) => (
        <Badge tone={displayStatus(appointment) === 'cancelled' ? 'danger' : displayStatus(appointment) === 'completed' ? 'outline' : 'success'}>
          {displayStatus(appointment) === 'confirmed'
            ? L(AC.statusConfirmed)
            : displayStatus(appointment) === 'cancelled'
              ? L(AC.statusCancelled)
              : L(AC.statusCompleted)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: L(AC.actions),
      align: 'right',
      width: '230px',
      render: (appointment) => (
        <div className="oph-rtable__actions">
          <Link
            className="oph-link"
            to={`${ROUTES.appointment}?service=${byId(services, appointment.serviceId)?.slug ?? ''}`}
          >
            <Repeat2 size={15} aria-hidden="true" />
            {t.account.repeat}
          </Link>
          {isUpcoming(appointment) ? (
            <Button variant="ghost" size="sm" onClick={() => void cancelAppointment(appointment)}>
              <XCircle size={15} aria-hidden="true" />
              {t.common.cancel}
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  const invoiceColumns: Array<Column<Invoice>> = [
    {
      key: 'number',
      header: t.account.invoices,
      render: (invoice) => (
        <div style={{ display: 'grid', gap: 4 }}>
          <span className="oph-table__name">{invoice.number}</span>
          <span style={{ color: 'var(--oph-muted)', fontSize: 'var(--oph-text-xs)' }}>
            {invoice.kind === 'prepayment'
              ? t.payments.prepayment
              : invoice.kind === 'operation'
                ? t.payments.operation
                : t.payments.service}
            {' · '}
            {formatDate(invoice.issuedAt)}
          </span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: t.payments.amount,
      align: 'right',
      width: '150px',
      render: (invoice) => <span className="oph-table__price">{formatPrice(invoice.amount)}</span>,
    },
    {
      key: 'status',
      header: t.common.status,
      width: '150px',
      render: (invoice) => (
        <Badge tone={invoice.status === 'paid' ? 'success' : invoice.status === 'refunded' ? 'warning' : 'danger'}>
          {invoice.status === 'paid'
            ? t.account.paid
            : invoice.status === 'refunded'
              ? t.account.refunded
              : t.account.unpaid}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: L(AC.actions),
      align: 'right',
      width: '220px',
      render: (invoice) => (
        <div className="oph-rtable__actions">
          {invoice.status === 'unpaid' ? (
            <Button
              size="sm"
              onClick={() => {
                setPayingInvoice(invoice);
                setPaymentDone(false);
                track('payment_started', { invoice: invoice.number, amount: invoice.amount });
              }}
            >
              <CreditCard size={15} aria-hidden="true" />
              {t.account.pay}
            </Button>
          ) : null}
          {invoice.status === 'paid' ? (
            <>
              <a className="oph-link" href={invoice.receiptUrl ?? '#'} download>
                <Download size={15} aria-hidden="true" />
                {t.account.receipt}
              </a>
              <Button variant="ghost" size="sm" onClick={() => void refund(invoice)}>
                <RefreshCw size={15} aria-hidden="true" />
                {t.payments.refund}
              </Button>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <>
      <Seo title={t.account.title} description={t.account.subtitle} noIndex />

      {/* A signed-in patient came for the dashboard, not a marketing hero:
          one compact forest band with the name and the two actions. */}
      <section className="oph-acchead oph-on-dark" aria-labelledby="account-title">
        <Container>
          <nav className="oph-breadcrumbs" aria-label="breadcrumb">
            <Link to={ROUTES.home}>{t.common.breadcrumbHome}</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span aria-current="page">{t.nav.account}</span>
          </nav>
          <div className="oph-acchead__row">
            <div>
              <span className="oph-eyebrow">{`${L(AC.welcome)} · ${t.nav.account}`}</span>
              <h1 id="account-title" className="oph-acchead__title">
                {data ? data.patient.fullName : t.account.title}
              </h1>
            </div>
            <div className="oph-acchead__actions">
              <Link className="oph-btn oph-btn--on-dark" to={ROUTES.appointment}>
                {t.common.bookNow}
              </Link>
              <button type="button" className="oph-acchead__signout" onClick={signOut}>
                <LogOut size={16} aria-hidden="true" />
                {t.account.signOut}
              </button>
            </div>
          </div>
        </Container>
      </section>

      <Section aria-label={t.account.title}>
        <Container>
          <SectionIndex n={1} label={tabs.find((entry) => entry.id === tab)?.label} />
          {demoData ? (
            <div className="oph-account__demo">
              <Alert tone="info">{L(AC.demoBanner)}</Alert>
            </div>
          ) : null}
          <div className="oph-workspace">
            <nav ref={tabStripRef} className="oph-workspace__side oph-on-dark" aria-label={L(AC.menu)} onScroll={markStripEdges}>
              {tabs.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className="oph-workspace__link"
                  aria-current={tab === entry.id ? 'page' : undefined}
                  onClick={() => setTab(entry.id)}
                >
                  {entry.icon}
                  {entry.label}
                </button>
              ))}
            </nav>

            <div>
              {loading ? (
                <SkeletonList count={3} />
              ) : !data ? (
                <EmptyState title={t.common.error} text={t.common.retry} />
              ) : (
                <Reveal variant="fade" key={tab}>
                  <div style={{ display: 'grid', gap: 'var(--oph-space-6)' }}>
                    {tab === 'appointments' ? (
                      upcoming.length > 0 ? (
                        <ResponsiveTable
                          columns={appointmentColumns}
                          rows={upcoming}
                          rowKey={(row) => row.id}
                          caption={t.account.upcoming}
                        />
                      ) : (
                        <EmptyState
                          title={t.account.noAppointments}
                          text={t.account.noAppointmentsText}
                          action={
                            <Link className="oph-btn oph-btn--primary" to={ROUTES.appointment}>
                              {t.common.bookNow}
                            </Link>
                          }
                        />
                      )
                    ) : null}

                    {tab === 'history' ? (
                      past.length > 0 ? (
                        <ResponsiveTable
                          columns={appointmentColumns}
                          rows={past}
                          rowKey={(row) => row.id}
                          caption={t.account.history}
                        />
                      ) : (
                        <EmptyState title={t.account.noAppointments} />
                      )
                    ) : null}

                    {tab === 'recommendations'
                      ? data.recommendations.map((item) => (
                          <Card key={item.id} tone="tint">
                            <div className="oph-row" style={{ justifyContent: 'space-between' }}>
                              <Badge tone="outline">
                                {byId(doctors, item.doctorId)
                                  ? L(byId(doctors, item.doctorId)!.name)
                                  : t.common.doctor}
                              </Badge>
                              <time
                                dateTime={item.date}
                                style={{ color: 'var(--oph-muted)', fontSize: 'var(--oph-text-xs)' }}
                              >
                                {formatDate(item.date)}
                              </time>
                            </div>
                            <p
                              style={{
                                marginTop: 'var(--oph-space-4)',
                                color: 'var(--oph-ink-soft)',
                                fontSize: 'var(--oph-text-sm)',
                                lineHeight: 'var(--oph-leading-relaxed)',
                              }}
                            >
                              {L(item.text)}
                            </p>
                          </Card>
                        ))
                      : null}

                    {tab === 'prescriptions'
                      ? data.prescriptions.map((item) => (
                          <Card key={item.id}>
                            <div className="oph-row" style={{ justifyContent: 'space-between' }}>
                              <h3 className="oph-card__title">{L(item.title)}</h3>
                              <time
                                dateTime={item.date}
                                style={{ color: 'var(--oph-muted)', fontSize: 'var(--oph-text-xs)' }}
                              >
                                {formatDate(item.date)}
                              </time>
                            </div>
                            <p className="oph-card__text" style={{ marginTop: 'var(--oph-space-4)' }}>
                              {L(item.detail)}
                            </p>
                          </Card>
                        ))
                      : null}

                    {tab === 'results'
                      ? data.results.map((item) => (
                          <Card key={item.id}>
                            <div className="oph-row" style={{ justifyContent: 'space-between' }}>
                              <h3 className="oph-card__title">{L(item.name)}</h3>
                              <time
                                dateTime={item.date}
                                style={{ color: 'var(--oph-muted)', fontSize: 'var(--oph-text-xs)' }}
                              >
                                {formatDate(item.date)}
                              </time>
                            </div>
                            <p className="oph-card__text" style={{ marginTop: 'var(--oph-space-4)' }}>
                              {L(item.summary)}
                            </p>
                            <div className="oph-card__footer">
                              <a className="oph-link" href={`/results/${item.fileName}`} download>
                                <Download size={15} aria-hidden="true" />
                                {t.account.download}
                              </a>
                            </div>
                          </Card>
                        ))
                      : null}

                    {tab === 'opinions' ? (
                      <div className="oph-opinions">
                        <header className="oph-opinions__head">
                          <div>
                            <h2 className="oph-apanel__title">{L(AC.opinionsTitle)}</h2>
                            <p className="oph-apanel__lead">{L(AC.opinionsLead)}</p>
                          </div>
                          <Link className="oph-link" to={ROUTES.secondOpinion}>
                            {L(AC.newRequest)} →
                          </Link>
                        </header>
                        {demoOpinions.length === 0 ? (
                          <EmptyState title={L(AC.noRequests)} text={L(AC.noRequestsText)} />
                        ) : (
                          <ul className="oph-opinions__list">
                            {demoOpinions.map((request) => {
                              const current = opinionStatuses.findIndex((entry) => entry.id === request.status);
                              return (
                                <li key={request.id} className="oph-panel oph-opinion">
                                  <div className="oph-opinion__top">
                                    <span className="oph-eyebrow">{request.reference}</span>
                                    <span className={`oph-pill oph-pill--${request.status === 'ready' ? 'ok' : request.status === 'review' ? 'warn' : 'muted'}`}>
                                      <span className="oph-pill__dot" aria-hidden="true" />
                                      {L(opinionStatuses[current].label)}
                                    </span>
                                  </div>
                                  <h3 className="oph-opinion__title">{L(request.topic)}</h3>
                                  <p className="oph-opinion__meta">
                                    {L(AC.submitted)}: {formatDate(request.submitted)} · {L(AC.eta)}: {formatDate(request.eta)} ·{' '}
                                    {L(AC.files)}: {request.files}
                                  </p>
                                  <ol className="oph-track" aria-label={`${request.reference}: ${L(opinionStatuses[current].label)}`}>
                                    {opinionStatuses.map((status, index) => (
                                      <li
                                        key={status.id}
                                        data-state={index < current ? 'done' : index === current ? 'current' : 'todo'}
                                        aria-current={index === current ? 'step' : undefined}
                                      >
                                        <span className="oph-track__dot" aria-hidden="true" />
                                        <strong>{L(status.label)}</strong>
                                        <span>{L(status.text)}</span>
                                      </li>
                                    ))}
                                  </ol>
                                  {request.status === 'ready' ? (
                                    <div className="oph-card__footer">
                                      <a className="oph-link" href={`/results/${request.reference}.pdf`} download>
                                        <Download size={15} aria-hidden="true" />
                                        {L(AC.downloadOpinion)}
                                      </a>
                                    </div>
                                  ) : null}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ) : null}

                    {tab === 'invoices' ? (
                      <>
                        {data.invoices.length > 0 ? (
                          <ResponsiveTable
                            columns={invoiceColumns}
                            rows={data.invoices}
                            rowKey={(row) => row.id}
                            caption={t.account.invoices}
                          />
                        ) : (
                          <EmptyState title={t.common.nothingFound} />
                        )}
                        {demoData ? <Alert tone="info">{t.payments.demoNotice}</Alert> : null}
                      </>
                    ) : null}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <Modal
        open={Boolean(payingInvoice)}
        onClose={() => setPayingInvoice(null)}
        title={t.payments.title}
      >
        {paymentDone ? (
          <SuccessState
            title={t.payments.successTitle}
            text={t.payments.successText}
            action={
              <Button variant="outline" onClick={() => setPayingInvoice(null)}>
                {t.common.close}
              </Button>
            }
          />
        ) : payingInvoice ? (
          <div style={{ display: 'grid', gap: 'var(--oph-space-5)' }}>
            <div
              style={{
                display: 'grid',
                gap: 'var(--oph-space-2)',
                padding: 'var(--oph-space-5)',
                borderRadius: 'var(--oph-radius-lg)',
                background: 'var(--oph-surface-2)',
              }}
            >
              <span className="oph-field__label">{payingInvoice.number}</span>
              <strong style={{ fontSize: 'var(--oph-text-2xl)' }}>
                {formatPrice(payingInvoice.amount)}
              </strong>
              <span style={{ color: 'var(--oph-muted)', fontSize: 'var(--oph-text-sm)' }}>
                {payingInvoice.kind === 'prepayment' ? t.payments.prepayment : t.payments.service}
              </span>
            </div>

            {demoData ? <Alert tone="warning">{t.payments.demoNotice}</Alert> : null}

            <Button loading={processing} onClick={() => void pay()} block magnetic>
              <CreditCard size={17} aria-hidden="true" />
              {t.payments.card}
            </Button>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

export default AccountPage;
