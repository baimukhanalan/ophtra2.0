import { Children, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  MessageCircle,
  ScanEye,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import {
  availableDates as buildDates,
  bookingReference,
  generateSlots,
  type GeneratedSlot,
} from '@shared/booking/slots';
import { useI18n } from '@/i18n';
import {
  Alert,
  Button,
  Checkbox,
  Input,
  SkeletonList,
  SuccessState,
  Textarea,
  useToast,
} from '@/ui';
import { Reveal } from '@/motion';
import { api } from '@/services/api';
import { queueLead } from '@/services/outbox';
import { getAttribution, track, trackAppointmentRequest, trackConversion } from '@/services/analytics';
import { useAnnouncer } from '@/services/accessibility';
import {
  byId,
  bySlug,
  clinics,
  departments,
  doctors as allDoctors,
  doctorsForService,
  services as allServices,
  servicesOfDepartment,
  site,
} from '@/content';
import { bookingCopy } from '@/content/pages/services';
import type { BookingDraft } from '@/types';

type StepId = 'type' | 'clinic' | 'department' | 'service' | 'doctor' | 'date' | 'confirm';

/** The three ways in the specification a patient can book. */
export type VisitType = 'consultation' | 'diagnostics' | 'surgery';

/** Which departments each visit type may lead to. */
const TYPE_DEPARTMENTS: Record<VisitType, string[] | null> = {
  consultation: null, // any department takes consultations
  diagnostics: ['diagnostics'],
  surgery: ['laser', 'cataract'],
};

const STEP_ORDER: StepId[] = ['type', 'clinic', 'department', 'service', 'doctor', 'date', 'confirm'];

/*
 * With a single clinic there is nothing to choose: the clinic step is left
 * out (the wizard becomes six steps, the counter follows) and the draft is
 * pre-set to that clinic, so the submitted booking still carries a branch.
 */
const SINGLE_CLINIC_ID = clinics.length === 1 ? clinics[0].id : '';
const STEPS: StepId[] = SINGLE_CLINIC_ID ? STEP_ORDER.filter((step) => step !== 'clinic') : STEP_ORDER;

const PHONE_PATTERN = /^\+?[\d\s()-]{10,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const emptyDraft: BookingDraft = {
  visitType: '' as VisitType | '',
  clinicId: SINGLE_CLINIC_ID,
  departmentId: '',
  serviceId: '',
  doctorId: '',
  date: '',
  time: '',
  fullName: '',
  phone: '',
  email: '',
  comment: '',
  consent: false,
  marketingConsent: false,
};

/**
 * A selectable option card (Figma «10 Онлайн-запись»): icon tile, title,
 * muted subtitle, gold meta line; the chosen card gets a forest outline and a
 * check. Styling lives in styles/pages/services.css (`.bk-*`).
 */
const ChoiceTile = ({
  title,
  subtitle,
  meta,
  selected,
  onSelect,
  icon,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  selected: boolean;
  onSelect: () => void;
  icon?: ReactNode;
}) => (
  <button type="button" className="bk-choice" onClick={onSelect} aria-pressed={selected}>
    {icon ? (
      <span className="bk-choice__icon" aria-hidden="true">
        {icon}
      </span>
    ) : null}
    <span className="bk-choice__body">
      <strong className="bk-choice__title">{title}</strong>
      {subtitle ? <span className="bk-choice__sub">{subtitle}</span> : null}
      {meta ? <span className="bk-choice__meta">{meta}</span> : null}
    </span>
    <span className="bk-choice__check" aria-hidden="true">
      {selected ? <CheckCircle2 size={20} /> : null}
    </span>
  </button>
);

/**
 * Rows for n option cards: at most three per row, never a lone card after a
 * full row (7 → 3 + 2 + 2, 4 → 2 + 2). Each card spans 6 / row-size of a
 * six-column track, so every row is full — no half-empty grids when a step
 * has only two or three options (UI/UX audit B2, X10).
 */
const balancedSpans = (count: number): number[] => {
  const perRow = count <= 3 ? count : count === 4 ? 2 : 3;
  const rows: number[] = [];
  let left = count;
  while (left > 0) {
    if (left <= perRow) {
      rows.push(left);
      break;
    }
    if (perRow === 3 && left === 4) {
      rows.push(2, 2);
      break;
    }
    rows.push(perRow);
    left -= perRow;
  }
  return rows.flatMap((size) => Array.from({ length: size }, () => 6 / size));
};

/** Fieldset + legend wrapper for one step's options. */
const ChoiceGroup = ({ legend, children }: { legend: string; children: ReactNode }) => {
  const items = Children.toArray(children);
  const spans = balancedSpans(items.length);
  return (
    <fieldset className="bk-group">
      <legend className="bk-group__legend">{legend}</legend>
      <div className="bk-group__grid">
        {items.map((item, index) => (
          <div key={index} className="bk-group__cell" style={{ ['--span' as string]: spans[index] } as CSSProperties}>
            {item}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

/**
 * Seven-step booking flow: visit type → clinic → department → service →
 * doctor → date and time → confirmation. Selections deep-link via the query
 * string, so the assistant and the service pages can open the wizard
 * prefilled.
 */
export const BookingWizard = () => {
  const { t, L, formatPrice, formatDate } = useI18n();
  const { notify } = useToast();
  const announce = useAnnouncer();
  const [params] = useSearchParams();

  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [slots, setSlots] = useState<GeneratedSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  // True when the API was unreachable: the request is held locally and the
  // slot is NOT booked yet, so the success screen must not say it is.
  const [offline, setOffline] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const firstStep = useRef(true);
  const skipFocus = useRef(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dates = useMemo(() => buildDates(14), []);

  /* ------------------------------------------------------------ prefill */
  useEffect(() => {
    const patch: Partial<BookingDraft> = {};

    const serviceSlug = params.get('service');
    const departmentSlug = params.get('department');
    const doctorSlug = params.get('doctor');

    if (serviceSlug) {
      const service = bySlug(allServices, serviceSlug);
      if (service) {
        patch.serviceId = service.id;
        patch.departmentId = service.departmentId;
      }
    }

    if (departmentSlug) {
      const department = bySlug(departments, departmentSlug);
      if (department) patch.departmentId = department.id;
    }

    if (doctorSlug) {
      const doctor = bySlug(allDoctors, doctorSlug);
      if (doctor) {
        patch.doctorId = doctor.id;
        patch.departmentId = patch.departmentId ?? doctor.departmentIds[0];
        // Only a clinic that still exists (the list may shrink to one).
        const clinicId = doctor.clinicIds.find((id) => byId(clinics, id));
        if (clinicId) patch.clinicId = clinicId;
      }
    }

    if (Object.keys(patch).length > 0) {
      const merged = { ...emptyDraft, ...patch };
      setDraft(merged);

      // Land on the first step still unanswered. A deep link may prefill the
      // service without a clinic, and skipping ahead would submit a booking
      // with no branch — so the wizard rewinds to whatever is missing.
      const firstMissing: StepId = !merged.visitType
        ? 'type'
        : !merged.clinicId
          ? 'clinic'
          : !merged.departmentId
            ? 'department'
            : !merged.serviceId
              ? 'service'
              : 'doctor';
      const target = Math.max(0, STEPS.indexOf(firstMissing));
      // A prefilled landing is not a user step change: don't steal focus or
      // scroll past the hero on arrival.
      if (target !== 0) skipFocus.current = true;
      setStepIndex(target);
    }

    track('booking_started', { prefilled: Object.keys(patch).length > 0 });
  }, [params]);

  /* -------------------------------------------------------------- slots */
  const doctorsForStep = useMemo(() => {
    if (draft.serviceId) return doctorsForService(draft.serviceId);
    if (draft.departmentId) return doctorsForService(servicesOfDepartment(draft.departmentId)[0]?.id ?? '');
    return [];
  }, [draft.serviceId, draft.departmentId]);

  const loadSlots = useCallback(
    async (date: string) => {
      if (!date) return;
      setLoadingSlots(true);

      try {
        const remote = await api.slots({
          date,
          clinicId: draft.clinicId,
          ...(draft.doctorId ? { doctorId: draft.doctorId } : {}),
          ...(draft.departmentId ? { departmentId: draft.departmentId } : {}),
        });
        // Never trust the shape blindly — a misconfigured proxy can answer 200
        // with something that is not a slot list.
        if (!Array.isArray(remote)) throw new Error('Malformed slot response');
        setSlots(remote);
      } catch {
        // MIS/API unreachable — fall back to the clinic's own scheduling rules
        // so the visitor can still choose a time and we capture the lead.
        const doctorId = draft.doctorId || doctorsForStep[0]?.id || 'any';
        setSlots(generateSlots(date, doctorId));
      } finally {
        setLoadingSlots(false);
      }
    },
    [draft.clinicId, draft.doctorId, draft.departmentId, doctorsForStep],
  );

  useEffect(() => {
    if (draft.date) void loadSlots(draft.date);
  }, [draft.date, loadSlots]);

  /* --------------------------------------------------------- navigation */
  const currentStep = STEPS[stepIndex];

  const canAdvance = useMemo(() => {
    switch (currentStep) {
      case 'type':
        return Boolean(draft.visitType);
      case 'clinic':
        return Boolean(draft.clinicId);
      case 'department':
        return Boolean(draft.departmentId);
      case 'service':
        return Boolean(draft.serviceId);
      case 'doctor':
        return true; // "any available doctor" is a valid choice
      case 'date':
        return Boolean(draft.date && draft.time);
      default:
        return true;
    }
  }, [currentStep, draft]);

  const goNext = () => {
    if (!canAdvance) return;
    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
    track(`booking_${currentStep}_selected` as never, { value: draft[`${currentStep}Id` as keyof BookingDraft] });
  };

  const goBack = () => setStepIndex((index) => Math.max(index - 1, 0));

  /*
   * Keyboard and screen-reader users land on the new step instead of staying
   * on a «Далее» button that now belongs to different content; on phones the
   * top of the step is brought back into view (the previous step may have
   * been a long list).
   */
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    if (skipFocus.current) {
      skipFocus.current = false;
      return;
    }
    const stage = stageRef.current;
    if (!stage) return;
    stage.focus({ preventScroll: true });
    const top = stage.getBoundingClientRect().top;
    if (top < 80 || top > window.innerHeight * 0.6) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: window.scrollY + top - 120, behavior: reduce ? 'auto' : 'smooth' });
    }
  }, [stepIndex]);

  useEffect(() => {
    if (reference) doneRef.current?.focus();
  }, [reference]);

  const update = (patch: Partial<BookingDraft>) =>
    setDraft((current) => ({ ...current, ...patch }));

  /* ------------------------------------------------------------- submit */
  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!draft.fullName.trim()) next.fullName = t.common.required;
    if (!PHONE_PATTERN.test(draft.phone.trim())) next.phone = t.common.invalidPhone;
    if (draft.email.trim() && !EMAIL_PATTERN.test(draft.email.trim())) {
      next.email = t.common.invalidEmail;
    }
    if (!draft.consent) next.consent = t.common.consentRequired;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setDuplicate(false);
    setOffline(false);

    const attribution = getAttribution();
    const service = byId(allServices, draft.serviceId);

    try {
      const appointment = await api.createAppointment({
        ...draft,
        visitType: draft.visitType || 'consultation',
        source: attribution.source,
        utm: attribution.utm as Record<string, string | undefined>,
      });
      setReference(appointment.reference);
      trackConversion('booking_confirmed', service?.price ?? 0);
      trackAppointmentRequest({ service: draft.serviceId, clinic: draft.clinicId });
      announce(t.booking.successTitle);
    } catch (error) {
      // 409 is the server's duplicate-booking guard.
      if ((error as { status?: number }).status === 409) {
        setDuplicate(true);
        setSubmitting(false);
        return;
      }

      /*
       * API unreachable. The visitor still gets a reference and the WhatsApp
       * handover on the next screen, which is how the booking actually reaches
       * the clinic in this situation — so the lead is also written to the local
       * outbox and retried later rather than being dropped on the floor.
       */
      const localReference = bookingReference(
        `${draft.phone}|${draft.date}|${draft.time}|${draft.doctorId}`,
      );
      setReference(localReference);
      setOffline(true);
      // Saved locally, not booked: a request, never a confirmed conversion.
      trackAppointmentRequest({ service: draft.serviceId, clinic: draft.clinicId });

      const lead = {
        fullName: draft.fullName,
        phone: draft.phone,
        email: draft.email,
        serviceId: draft.serviceId,
        source: attribution.source,
        date: new Date().toISOString(),
        utm: attribution.utm,
        comment: `${draft.comment}\n[${localReference}] ${draft.date} ${draft.time}`.trim(),
      };
      api.createLead(lead).catch(() => queueLead(lead));
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------------------------------------------- done */
  if (reference) {
    const clinic = byId(clinics, draft.clinicId);
    const service = byId(allServices, draft.serviceId);

    return (
      <div className="bk bk--done" ref={doneRef} tabIndex={-1}>
        <SuccessState
          tone={offline ? 'warning' : 'success'}
          title={offline ? L(bookingCopy.offlineTitle) : t.booking.successTitle}
          text={
            offline
              ? L(bookingCopy.offlineText)
              : L(draft.email.trim() ? bookingCopy.successTextEmail : bookingCopy.successTextPhone)
          }
          action={
            <Button
              variant="outline"
              onClick={() => {
                setReference(null);
                setOffline(false);
                setDraft(emptyDraft);
                setStepIndex(0);
              }}
            >
              {t.booking.newBooking}
            </Button>
          }
        />

        <div className="bk-ticket">
          <p className="oph-eyebrow">{offline ? L(bookingCopy.requestNumber) : t.booking.bookingNumber}</p>
          <p className="bk-ticket__ref">{reference}</p>
          <p className="bk-ticket__meta">
            {[
              clinic ? L(clinic.name) : null,
              service ? L(service.name) : null,
              draft.date ? formatDate(draft.date) : null,
              draft.time,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>

        {/* The specification requires the patient to be able to continue the
            conversation in WhatsApp straight after the request. The reference
            is prefilled so the operator has context in the first message. */}
        <a
          className="oph-btn oph-btn--primary oph-btn--block"
          href={`https://wa.me/${site.organization.whatsapp}?text=${encodeURIComponent(
            `${offline ? L(bookingCopy.requestNumber) : t.booking.bookingNumber}: ${reference}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('whatsapp_click', { context: 'booking_success' })}
        >
          <MessageCircle size={17} aria-hidden="true" />
          {t.booking.continueWhatsapp}
        </a>
        <p className="bk-note">{t.booking.continueWhatsappText}</p>

        {offline ? null : (
          <Alert tone="success">
            <strong className="bk-alert-title">{t.booking.notificationsTitle}</strong>
            {t.booking.notificationsText}
          </Alert>
        )}
      </div>
    );
  }

  const stepLabels: Record<StepId, string> = {
    type: t.booking.stepType,
    clinic: t.booking.stepClinic,
    department: t.booking.stepDepartment,
    service: t.booking.stepService,
    doctor: t.booking.stepDoctor,
    date: t.booking.stepDate,
    confirm: t.booking.stepConfirm,
  };
  const steps = STEPS.map((id) => ({ id, label: stepLabels[id] }));

  const allowed = draft.visitType ? TYPE_DEPARTMENTS[draft.visitType as VisitType] : null;

  const departmentsForType = departments.filter(
    (department) => !allowed || allowed.includes(department.id),
  );

  // Surgery only happens at the main centre, so offering the branch here would
  // walk the visitor into a step with nothing to choose.
  const availableClinics = clinics.filter((clinic) =>
    departmentsForType.some((department) => department.clinicIds.includes(clinic.id)),
  );

  const availableClinicDepartments = departmentsForType.filter(
    (department) => !draft.clinicId || department.clinicIds.includes(draft.clinicId),
  );

  const stepServices = draft.departmentId ? servicesOfDepartment(draft.departmentId) : [];
  const openSlots = slots.filter((slot) => slot.available);
  const summaryService = byId(allServices, draft.serviceId);
  const summaryClinic = byId(clinics, draft.clinicId);

  return (
    <div className="bk">
      {/* ------------------------------------------------------ STEPPER */}
      <nav aria-label={t.booking.title} className="bk-steps">
        {/* Scrolls sideways on phones; focusable so keyboard users can too. */}
        <ol tabIndex={0}>
          {steps.map((step, index) => {
            const state = index === stepIndex ? 'active' : index < stepIndex ? 'done' : 'todo';
            const clickable = index < stepIndex;
            return (
              <li key={step.id}>
                <button
                  type="button"
                  className="bk-pill"
                  data-state={state}
                  aria-current={state === 'active' ? 'step' : undefined}
                  disabled={!clickable}
                  onClick={clickable ? () => setStepIndex(index) : undefined}
                >
                  <span className="bk-pill__n" aria-hidden="true">
                    {state === 'done' ? <Check size={12} strokeWidth={3} /> : index + 1}
                  </span>
                  {step.label}
                </button>
              </li>
            );
          })}
        </ol>
        <p className="bk-steps__count" aria-live="polite">
          {L(bookingCopy.stepOf)
            .replace('{n}', String(stepIndex + 1))
            .replace('{total}', String(steps.length))}
        </p>
      </nav>

      <div className="bk-stage" ref={stageRef} tabIndex={-1} aria-label={steps[stepIndex]?.label}>
        {/* --------------------------------------------------- VISIT TYPE */}
        {currentStep === 'type' ? (
          <Reveal variant="fade" key="type">
            <ChoiceGroup legend={t.booking.chooseType}>
              {(
                [
                  ['consultation', <UserRound key="c" size={20} />, t.booking.typeConsultation, t.booking.typeConsultationText],
                  ['diagnostics', <ScanEye key="d" size={20} />, t.booking.typeDiagnostics, t.booking.typeDiagnosticsText],
                  ['surgery', <Building2 key="s" size={20} />, t.booking.typeSurgery, t.booking.typeSurgeryText],
                ] as const
              ).map(([value, icon, title, subtitle]) => (
                <ChoiceTile
                  key={value}
                  icon={icon}
                  title={title}
                  subtitle={subtitle}
                  selected={draft.visitType === value}
                  onSelect={() => {
                    // Changing the reason for the visit invalidates choices it
                    // no longer allows. A department (and its service) that
                    // came in through a deep link — «Записаться» on a service
                    // page — is kept when the new type still permits it.
                    const permitted = TYPE_DEPARTMENTS[value];
                    const keep = Boolean(draft.departmentId) && (!permitted || permitted.includes(draft.departmentId));
                    update(
                      keep
                        ? { visitType: value, date: '', time: '' }
                        : { visitType: value, departmentId: '', serviceId: '', doctorId: '', date: '', time: '' },
                    );
                  }}
                />
              ))}
            </ChoiceGroup>
          </Reveal>
        ) : null}

        {/* ------------------------------------------------------- CLINIC */}
        {currentStep === 'clinic' ? (
          <Reveal variant="fade" key="clinic">
            <ChoiceGroup legend={t.booking.chooseClinic}>
              {availableClinics.map((clinic) => (
                <ChoiceTile
                  key={clinic.id}
                  icon={<Building2 size={20} />}
                  title={L(clinic.name)}
                  subtitle={L(clinic.address)}
                  meta={L(clinic.schedule)}
                  selected={draft.clinicId === clinic.id}
                  onSelect={() => {
                    // Keep a prefilled department if this clinic has it.
                    const current = byId(departments, draft.departmentId);
                    update(
                      current?.clinicIds.includes(clinic.id)
                        ? {
                            clinicId: clinic.id,
                            // A doctor preselected via ?doctor= stays if they see patients here.
                            doctorId: byId(allDoctors, draft.doctorId)?.clinicIds.includes(clinic.id)
                              ? draft.doctorId
                              : '',
                          }
                        : { clinicId: clinic.id, departmentId: '', serviceId: '', doctorId: '' },
                    );
                  }}
                />
              ))}
            </ChoiceGroup>
          </Reveal>
        ) : null}

        {/* --------------------------------------------------- DEPARTMENT */}
        {currentStep === 'department' ? (
          <Reveal variant="fade" key="department">
            <ChoiceGroup legend={t.booking.chooseDepartment}>
              {availableClinicDepartments.map((department) => (
                <ChoiceTile
                  key={department.id}
                  icon={<Stethoscope size={20} />}
                  title={L(department.name)}
                  subtitle={L(department.short)}
                  selected={draft.departmentId === department.id}
                  onSelect={() =>
                    update({
                      departmentId: department.id,
                      serviceId: '',
                      // Keep a preselected doctor who works in this department.
                      doctorId: byId(allDoctors, draft.doctorId)?.departmentIds.includes(department.id)
                        ? draft.doctorId
                        : '',
                    })
                  }
                />
              ))}
            </ChoiceGroup>
          </Reveal>
        ) : null}

        {/* ------------------------------------------------------ SERVICE */}
        {currentStep === 'service' ? (
          <Reveal variant="fade" key="service">
            <ChoiceGroup legend={t.booking.chooseService}>
              {stepServices.map((service) => (
                <ChoiceTile
                  key={service.id}
                  icon={<ScanEye size={20} />}
                  title={L(service.name)}
                  subtitle={L(service.short)}
                  meta={`${formatPrice(service.price)} · ${service.duration} ${t.common.minutes}`}
                  selected={draft.serviceId === service.id}
                  onSelect={() =>
                    update({
                      serviceId: service.id,
                      // Keep the preselected doctor («Записаться» on a doctor
                      // profile) when they perform the chosen service.
                      doctorId:
                        draft.doctorId &&
                        doctorsForService(service.id).some((doctor) => doctor.id === draft.doctorId)
                          ? draft.doctorId
                          : '',
                    })
                  }
                />
              ))}
            </ChoiceGroup>
          </Reveal>
        ) : null}

        {/* ------------------------------------------------------- DOCTOR */}
        {currentStep === 'doctor' ? (
          <Reveal variant="fade" key="doctor">
            <ChoiceGroup legend={t.booking.chooseDoctor}>
              <ChoiceTile
                icon={<UserRound size={20} />}
                title={t.booking.anyDoctor}
                selected={draft.doctorId === ''}
                onSelect={() => update({ doctorId: '' })}
              />

              {doctorsForStep
                .filter((doctor) => !draft.clinicId || doctor.clinicIds.includes(draft.clinicId))
                .map((doctor) => (
                  <ChoiceTile
                    key={doctor.id}
                    icon={<UserRound size={20} />}
                    title={L(doctor.name)}
                    subtitle={L(doctor.role)}
                    meta={`${t.common.experience} ${doctor.experience} ${t.common.years}`}
                    selected={draft.doctorId === doctor.id}
                    onSelect={() => update({ doctorId: doctor.id, date: '', time: '' })}
                  />
                ))}
            </ChoiceGroup>
          </Reveal>
        ) : null}

        {/* --------------------------------------------------------- DATE */}
        {currentStep === 'date' ? (
          <Reveal variant="fade" key="date">
            <div className="bk-date">
              <fieldset className="bk-group">
                <legend className="bk-group__legend">
                  <CalendarDays size={15} aria-hidden="true" />
                  {t.booking.chooseDate}
                </legend>
                <div className="bk-days oph-no-scrollbar">
                  {dates.map((date) => {
                    const parsed = new Date(`${date}T00:00:00`);
                    const selected = draft.date === date;
                    return (
                      <button
                        key={date}
                        type="button"
                        className="bk-day"
                        aria-pressed={selected}
                        aria-label={formatDate(parsed, { weekday: 'long', day: 'numeric', month: 'long' })}
                        onClick={() => update({ date, time: '' })}
                      >
                        <span className="bk-day__wd">{formatDate(parsed, { weekday: 'short' })}</span>
                        <span className="bk-day__d">{parsed.getDate()}</span>
                        <span className="bk-day__m">{formatDate(parsed, { month: 'short' })}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {draft.date ? (
                <fieldset className="bk-group">
                  <legend className="bk-group__legend">
                    <Clock size={15} aria-hidden="true" />
                    {t.booking.chooseTime}
                  </legend>

                  {loadingSlots ? (
                    <SkeletonList count={4} />
                  ) : openSlots.length > 0 ? (
                    <div className="bk-slots">
                      {openSlots.map((slot) => (
                        <button
                          key={`${slot.date}-${slot.time}`}
                          type="button"
                          className="bk-slot"
                          aria-pressed={draft.time === slot.time}
                          onClick={() => update({ time: slot.time, doctorId: draft.doctorId || slot.doctorId })}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <Alert tone="warning">
                      <strong className="bk-alert-title">{t.booking.noSlots}</strong>
                      {t.booking.noSlotsText}
                    </Alert>
                  )}
                </fieldset>
              ) : null}
            </div>
          </Reveal>
        ) : null}

        {/* ------------------------------------------------------ CONFIRM */}
        {currentStep === 'confirm' ? (
          <Reveal variant="fade" key="confirm">
            <div className="bk-confirm">
              <div className="bk-summary">
                <p className="oph-eyebrow">{t.booking.summary}</p>
                <dl className="bk-summary__list">
                  {summaryClinic ? (
                    <div>
                      <dt>{t.common.clinic}</dt>
                      <dd>{L(summaryClinic.name)}</dd>
                    </div>
                  ) : null}
                  {summaryService ? (
                    <div>
                      <dt>{t.common.service}</dt>
                      <dd>{L(summaryService.name)}</dd>
                    </div>
                  ) : null}
                  {draft.date ? (
                    <div>
                      <dt>{t.common.date}</dt>
                      <dd>
                        {formatDate(draft.date)}
                        {draft.time ? `, ${draft.time}` : ''}
                      </dd>
                    </div>
                  ) : null}
                  {summaryService ? (
                    <div>
                      <dt>{t.common.price}</dt>
                      <dd className="bk-summary__price">{formatPrice(summaryService.price)}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              {duplicate ? (
                <Alert tone="error">
                  <strong className="bk-alert-title">{t.booking.duplicateTitle}</strong>
                  {t.booking.duplicateText}
                </Alert>
              ) : null}

              <form
                className="oph-form bk-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void submit();
                }}
                noValidate
              >
                <p className="bk-group__legend">{t.booking.yourData}</p>

                <div className="oph-form__row">
                  <Input
                    label={t.common.fullName}
                    required
                    autoComplete="name"
                    value={draft.fullName}
                    error={errors.fullName}
                    onChange={(event) => update({ fullName: event.target.value })}
                  />
                  <Input
                    label={t.common.phone}
                    required
                    type="tel"
                    inputMode="tel"
                    placeholder="+7 (___) ___ __ __"
                    autoComplete="tel"
                    value={draft.phone}
                    error={errors.phone}
                    onChange={(event) => update({ phone: event.target.value })}
                  />
                </div>

                <Input
                  label={t.common.email}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={draft.email}
                  error={errors.email}
                  onChange={(event) => update({ email: event.target.value })}
                />

                <Textarea
                  label={t.common.comment}
                  value={draft.comment}
                  onChange={(event) => update({ comment: event.target.value })}
                />

                <div className="bk-consents">
                  <Checkbox
                    label={t.booking.consent}
                    checked={draft.consent}
                    aria-invalid={errors.consent ? true : undefined}
                    aria-describedby={errors.consent ? 'bk-consent-error' : undefined}
                    onChange={(event) => update({ consent: event.target.checked })}
                  />
                  {errors.consent ? (
                    <p className="oph-field__error bk-consents__error" id="bk-consent-error" role="alert">
                      <AlertCircle size={14} aria-hidden="true" />
                      {errors.consent}
                    </p>
                  ) : null}
                  <Checkbox
                    label={t.booking.marketingConsent}
                    checked={draft.marketingConsent}
                    onChange={(event) => update({ marketingConsent: event.target.checked })}
                  />
                </div>

                <p className="bk-note bk-note--left">
                  <Bell size={14} aria-hidden="true" />
                  {t.booking.notificationsText}
                </p>

                <div className="bk-nav">
                  <Button variant="outline" onClick={goBack}>
                    <ArrowLeft size={16} aria-hidden="true" />
                    {t.common.back}
                  </Button>
                  {/* `loading` disables the button while the request is in
                      flight, so a double click cannot create two bookings. */}
                  <Button type="submit" loading={submitting} magnetic>
                    {t.booking.confirmBooking}
                  </Button>
                </div>
              </form>
            </div>
          </Reveal>
        ) : null}
      </div>

      {/* --------------------------------------------------------- FOOTER */}
      {currentStep !== 'confirm' ? (
        <div className="bk-nav bk-nav--footer">
          <Button variant="outline" onClick={goBack} disabled={stepIndex === 0}>
            <ArrowLeft size={16} aria-hidden="true" />
            {t.common.back}
          </Button>

          {/* Figma fix: «Далее» was drawn grey and looked disabled. It is
              always the forest primary; until a choice is made it is marked
              aria-disabled and a click explains what is missing instead of
              doing nothing. */}
          <Button
            onClick={() => {
              if (!canAdvance) {
                notify({ tone: 'warning', title: L(bookingCopy.selectFirst) });
                return;
              }
              goNext();
            }}
            aria-disabled={!canAdvance}
            magnetic
          >
            {t.common.next}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};
