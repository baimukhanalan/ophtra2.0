import { useState } from 'react';
import { Bot, CheckCircle2, Download, ExternalLink, Save, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Button, Input, Select } from '@/ui';
import { analyticsConfig } from '@/services/analytics';
import {
  adminCopy as A,
  automationCopy as AU,
  delayLabels,
  formSourceLabels,
  formsCopy as F,
  integrationsCopy as I,
  pendingCopy as P,
  permissionLabels,
  roleLabels,
  securityCopy as S,
} from '@/content/pages/platform';
import {
  DELAYS,
  EMAIL_PATTERN,
  FORM_SOURCES,
  PERMISSIONS,
  ROLES,
  TRACKING_PATTERNS,
  downloadText,
  exportAdminState,
  renderTemplate,
  seedAutomation,
  seedForms,
  seedIntegrations,
  seedSecurity,
  usePersisted,
  type AutomationFlow,
  type CrmLead,
  type CrmProvider,
  type FormSetting,
  type IntegrationSettings,
  type SecuritySettings,
  type VideoProvider,
} from './store';
import { AdminPanel, PendingNotice, StatusPill, Toggle, type Sync } from './ui';

/* ================================================================= FORMS */

export const FormsManager = ({ leads, sync }: { leads: CrmLead[]; sync: Sync }) => {
  const { L, formatDate } = useI18n();
  const [forms, setForms] = usePersisted<Record<string, FormSetting>>('forms', seedForms);
  const [emails, setEmails] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(forms).map(([id, value]) => [id, value.email])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const patch = (id: string, change: Partial<FormSetting>) => {
    setForms((current) => ({ ...current, [id]: { ...(current[id] ?? { enabled: true, email: '' }), ...change } }));
    void sync('forms', id, change as Record<string, unknown>);
  };

  const commitEmail = (id: string) => {
    const value = (emails[id] ?? '').trim();
    if (value === forms[id]?.email) return;
    if (!EMAIL_PATTERN.test(value)) {
      setErrors((current) => ({ ...current, [id]: L(F.emailInvalid) }));
      return;
    }
    setErrors((current) => ({ ...current, [id]: '' }));
    patch(id, { email: value });
  };

  return (
    <AdminPanel title={L(F.title)} lead={L(F.lead)}>
      <p className="oph-apanel__note">{L(P.formsNote)}</p>
      <ul className="oph-forms">
        {FORM_SOURCES.map((form) => {
          const setting = forms[form.id] ?? { enabled: true, email: '' };
          const ofForm = leads.filter((lead) => lead.source === form.id);
          const latest = ofForm[0]?.date;
          return (
            <li key={form.id} className="oph-formrow" data-disabled={!setting.enabled || undefined}>
              <div className="oph-formrow__main">
                <h3 className="oph-formrow__title">{L(formSourceLabels[form.id])}</h3>
                <p className="oph-formrow__meta">
                  <code>{form.id}</code> · {L(F.path)}: {form.path}
                </p>
                <p className="oph-formrow__meta">
                  {L(F.leads)}: <strong>{ofForm.length}</strong> · {L(F.lastLead)}:{' '}
                  {latest ? formatDate(latest, { day: 'numeric', month: 'short' }) : L(F.never)}
                </p>
              </div>
              <form
                className="oph-formrow__email"
                onSubmit={(event) => {
                  event.preventDefault();
                  commitEmail(form.id);
                }}
                noValidate
              >
                <Input
                  label={L(F.email)}
                  type="email"
                  value={emails[form.id] ?? ''}
                  error={errors[form.id] || undefined}
                  onChange={(event) => setEmails((current) => ({ ...current, [form.id]: event.target.value }))}
                  onBlur={() => commitEmail(form.id)}
                />
              </form>
              <Toggle
                checked={setting.enabled}
                onChange={(enabled) => patch(form.id, { enabled })}
                label={`${L(F.form)}: ${L(formSourceLabels[form.id])}`}
                hideLabel
                onLabel={L(F.enabled)}
                offLabel={L(F.disabled)}
              />
            </li>
          );
        })}
      </ul>
    </AdminPanel>
  );
};

/* ============================================================ AUTOMATION */

const FLOW_META = {
  email: { title: AU.email, text: AU.emailText },
  whatsapp: { title: AU.whatsapp, text: AU.whatsappText },
  reminders: { title: AU.reminders, text: AU.remindersText },
  followup: { title: AU.followup, text: AU.followupText },
} as const;

export const AutomationManager = ({ sync }: { sync: Sync }) => {
  const { L } = useI18n();
  const [flows, setFlows] = usePersisted<AutomationFlow[]>('automation', seedAutomation);
  const [saving, setSaving] = useState(false);

  const patchFlow = (id: AutomationFlow['id'], change: Partial<AutomationFlow>) =>
    setFlows((current) => current.map((flow) => (flow.id === id ? { ...flow, ...change } : flow)));

  const patchStep = (flowId: AutomationFlow['id'], stepId: string, change: Record<string, unknown>) =>
    setFlows((current) =>
      current.map((flow) =>
        flow.id === flowId
          ? { ...flow, steps: flow.steps.map((step) => (step.id === stepId ? { ...step, ...change } : step)) }
          : flow,
      ),
    );

  const saveAll = async () => {
    if (saving) return;
    setSaving(true);
    await sync('automation', 'scenarios', { flows });
    setSaving(false);
  };

  return (
    <>
      <PendingNotice title={L(P.automationTitle)}>{L(P.automationText)}</PendingNotice>
      <AdminPanel
        title={L(AU.title)}
        lead={L(AU.lead)}
        actions={
          <Button size="sm" onClick={() => void saveAll()} loading={saving}>
            <Save size={15} aria-hidden="true" />
            {L(AU.saveAll)}
          </Button>
        }
      >
        <div className="oph-flows">
          {flows.map((flow) => (
            <article key={flow.id} className="oph-flow" data-off={!flow.enabled || undefined}>
              <header className="oph-flow__head">
                <div>
                  <h3 className="oph-flow__title">{L(FLOW_META[flow.id].title)}</h3>
                  <p className="oph-flow__text">{L(FLOW_META[flow.id].text)}</p>
                </div>
                <StatusPill tone="warn">{L(A.pending)}</StatusPill>
                <Toggle
                  checked={flow.enabled}
                  onChange={(enabled) => patchFlow(flow.id, { enabled })}
                  label={L(FLOW_META[flow.id].title)}
                  hideLabel
                  onLabel={L(AU.on)}
                  offLabel={L(AU.off)}
                />
              </header>
              <ol className="oph-flow__steps" aria-label={L(AU.steps)}>
                {flow.steps.map((step, index) => (
                  <li key={step.id} className="oph-flowstep">
                    <div className="oph-flowstep__head">
                      <span className="oph-flowstep__n" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <strong>{L(step.label)}</strong>
                      <Toggle
                        checked={step.enabled}
                        disabled={!flow.enabled}
                        onChange={(enabled) => patchStep(flow.id, step.id, { enabled })}
                        label={L(step.label)}
                        hideLabel
                      />
                    </div>
                    <div className="oph-flowstep__body">
                      <Select
                        label={L(AU.delay)}
                        value={step.delay}
                        disabled={!flow.enabled}
                        options={DELAYS.map((delay) => ({ value: delay, label: L(delayLabels[delay]) }))}
                        onChange={(event) => patchStep(flow.id, step.id, { delay: event.target.value })}
                      />
                      <label className="oph-field">
                        <span className="oph-field__label">{L(AU.template)}</span>
                        <textarea
                          className="oph-textarea"
                          rows={3}
                          value={step.template}
                          disabled={!flow.enabled}
                          onChange={(event) => patchStep(flow.id, step.id, { template: event.target.value })}
                        />
                      </label>
                      <p className="oph-flowstep__preview">
                        <span className="oph-eyebrow">{L(AU.preview)}</span>
                        {renderTemplate(step.template)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </AdminPanel>
    </>
  );
};

/* ========================================================== INTEGRATIONS */

const CRM_OPTIONS: Array<{ id: CrmProvider; name: string }> = [
  { id: 'none', name: '' },
  { id: 'hubspot', name: 'HubSpot' },
  { id: 'zoho', name: 'Zoho CRM' },
  { id: 'salesforce', name: 'Salesforce Health Cloud' },
];

const VIDEO_OPTIONS: Array<{ id: VideoProvider; name: string }> = [
  { id: 'zoom', name: 'Zoom' },
  { id: 'meet', name: 'Google Meet' },
  { id: 'teams', name: 'Microsoft Teams' },
];

const TRACKING_FIELDS: Array<{ key: 'ga4' | 'gtm' | 'clarity' | 'gsc'; label: string; env: string; placeholder: string; live: string }> = [
  { key: 'ga4', label: 'Google Analytics 4', env: 'VITE_GA4_ID', placeholder: 'G-XXXXXXXXXX', live: analyticsConfig.ga4 },
  { key: 'gtm', label: 'Google Tag Manager', env: 'VITE_GTM_ID', placeholder: 'GTM-XXXXXXX', live: analyticsConfig.gtm },
  { key: 'clarity', label: 'Microsoft Clarity', env: 'VITE_CLARITY_ID', placeholder: 'abcd1234ef', live: analyticsConfig.clarity },
  { key: 'gsc', label: 'Google Search Console', env: 'VITE_GSC_VERIFICATION', placeholder: 'verification token', live: analyticsConfig.gscVerification },
];

export const IntegrationsManager = ({ sync }: { sync: Sync }) => {
  const { L } = useI18n();
  const [settings, setSettings] = usePersisted<IntegrationSettings>('integrations', seedIntegrations);
  const [draft, setDraft] = useState(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (saving) return;
    const next: Record<string, string> = {};
    TRACKING_FIELDS.forEach(({ key }) => {
      const value = draft[key].trim();
      if (value && !TRACKING_PATTERNS[key].test(value)) next[key] = L(I.formatInvalid);
    });
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    setSettings(draft);
    await sync('integrations', 'settings', draft as unknown as Record<string, unknown>);
    setSaving(false);
  };

  return (
    <>
    <PendingNotice title={L(P.integrationsTitle)}>{L(P.integrationsText)}</PendingNotice>
    <AdminPanel
      title={L(I.title)}
      lead={L(I.lead)}
      actions={
        <Button size="sm" onClick={() => void save()} loading={saving}>
          <Save size={15} aria-hidden="true" />
          {L(A.save)}
        </Button>
      }
    >
      <div className="oph-integr">
        <fieldset className="oph-choice">
          <legend>
            <span className="oph-choice__title">{L(I.crm)}</span>
            <span className="oph-choice__text">{L(I.crmText)}</span>
            <span className="oph-choice__status">
              {L(P.statusLabel)}:{' '}
              <StatusPill tone="warn">{draft.crm === 'none' ? L(P.notSelected) : L(A.pending)}</StatusPill>
            </span>
          </legend>
          <div className="oph-choice__grid">
            {CRM_OPTIONS.map((option) => (
              <label key={option.id} className="oph-choice__card">
                <input
                  type="radio"
                  name="crm"
                  value={option.id}
                  checked={draft.crm === option.id}
                  onChange={() => setDraft({ ...draft, crm: option.id })}
                />
                <span>{option.name || L(I.none)}</span>
                <CheckCircle2 size={16} aria-hidden="true" className="oph-choice__check" />
              </label>
            ))}
          </div>
          {draft.crm !== 'none' ? (
            <Input
              label={L(I.accountId)}
              value={draft.crmAccount}
              autoComplete="off"
              onChange={(event) => setDraft({ ...draft, crmAccount: event.target.value })}
            />
          ) : null}
        </fieldset>

        <fieldset className="oph-choice">
          <legend>
            <span className="oph-choice__title">{L(I.video)}</span>
            <span className="oph-choice__text">{L(I.videoText)}</span>
            <span className="oph-choice__status">
              {L(P.statusLabel)}: <StatusPill tone="warn">{L(A.pending)}</StatusPill>
            </span>
          </legend>
          <div className="oph-choice__grid">
            {VIDEO_OPTIONS.map((option) => (
              <label key={option.id} className="oph-choice__card">
                <input
                  type="radio"
                  name="video"
                  value={option.id}
                  checked={draft.video === option.id}
                  onChange={() => setDraft({ ...draft, video: option.id })}
                />
                <span>{option.name}</span>
                <CheckCircle2 size={16} aria-hidden="true" className="oph-choice__check" />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="oph-choice">
          <legend>
            <span className="oph-choice__title">{L(I.tracking)}</span>
            <span className="oph-choice__text">{L(I.trackingText)}</span>
          </legend>
          <div className="oph-aeditor__grid">
            {TRACKING_FIELDS.map((field) => (
              <div key={field.key} className="oph-trackfield">
                <Input
                  label={field.label}
                  placeholder={field.placeholder}
                  value={draft[field.key]}
                  error={errors[field.key]}
                  hint={field.env}
                  spellCheck={false}
                  autoComplete="off"
                  onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
                />
                <StatusPill tone={field.live ? 'ok' : 'muted'}>{field.live ? L(I.envActive) : L(I.notSet)}</StatusPill>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </AdminPanel>
    </>
  );
};

/* =================================================================== SEO */

const AI_ENGINES = ['GPTBot · OAI-SearchBot', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Applebot-Extended', 'Bingbot'];

export const SeoManager = () => {
  const { L } = useI18n();
  const files = [
    { href: '/robots.txt', label: 'robots.txt' },
    { href: '/sitemap.xml', label: 'sitemap.xml' },
    { href: '/llms.txt', label: 'llms.txt' },
    { href: '/manifest.webmanifest', label: 'manifest.webmanifest' },
  ];
  return (
    <>
      <AdminPanel title={L(A.seoTitle)} lead={L(A.seoLead)}>
        <h3 className="oph-apanel__sub">{L(A.seoFiles)}</h3>
        <ul className="oph-alist">
          {files.map((file) => (
            <li key={file.href}>
              <code>{file.label}</code>
              <a className="oph-link" href={file.href} target="_blank" rel="noopener noreferrer">
                {L(A.open)}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <h3 className="oph-apanel__sub">
          <Bot size={16} aria-hidden="true" /> {L(A.aiCrawlers)}
        </h3>
        <ul className="oph-atags">
          {AI_ENGINES.map((engine) => (
            <li key={engine}>
              <StatusPill tone="ok">{engine}</StatusPill>
            </li>
          ))}
        </ul>
        <h3 className="oph-apanel__sub">{L(A.seoSchema)}</h3>
        <p className="oph-apanel__lead">{L(A.seoSchemaText)}</p>
        <h3 className="oph-apanel__sub">{L(A.ogImage)}</h3>
        <p className="oph-apanel__lead">
          <code>/og/ophtra-cover.svg</code>
        </p>
      </AdminPanel>
    </>
  );
};

/* ============================================================== SECURITY */

export const SecurityManager = ({ sync }: { sync: Sync }) => {
  const { L, formatDate } = useI18n();
  const [security, setSecurity] = usePersisted<SecuritySettings>('security', seedSecurity);

  const togglePermission = (role: (typeof ROLES)[number], permission: (typeof PERMISSIONS)[number]) => {
    if (role === 'admin') return;
    const current = security.matrix[role];
    const next = current.includes(permission) ? current.filter((p) => p !== permission) : [...current, permission];
    const matrix = { ...security.matrix, [role]: next };
    setSecurity({ ...security, matrix });
    void sync('security', 'rbac', { role, permissions: next }, { quiet: true });
  };

  const toggleSpam = (key: keyof SecuritySettings['spam'], value: boolean) => {
    setSecurity({ ...security, spam: { ...security.spam, [key]: value } });
    void sync('security', 'spam', { [key]: value }, { quiet: true });
  };

  const backup = () => {
    const now = new Date().toISOString();
    downloadText(
      `ophtra-admin-backup-${now.slice(0, 10)}.json`,
      JSON.stringify({ exportedAt: now, state: exportAdminState() }, null, 2),
      'application/json',
    );
    setSecurity({ ...security, lastBackup: now });
  };

  // Honeypot and minimum fill time run in the site forms today; the rest need
  // the server and are labelled so.
  const spamRows: Array<{ key: keyof SecuritySettings['spam']; label: string; server: boolean }> = [
    { key: 'honeypot', label: L(S.honeypot), server: false },
    { key: 'minTime', label: L(S.minTime), server: false },
    { key: 'rateLimit', label: L(S.rateLimit), server: true },
    { key: 'fileScan', label: L(S.fileScan), server: true },
    { key: 'captcha', label: L(S.captcha), server: true },
  ];

  return (
    <>
      <AdminPanel title={L(S.rbac)} lead={L(S.rbacText)}>
        {/* A matrix stays a matrix on phones: it scrolls sideways inside its
            frame with the role column pinned, and is keyboard-scrollable. */}
        <div className="oph-table-wrap oph-rbac-wrap" role="region" aria-label={L(S.rbac)} tabIndex={0}>
          <table className="oph-table oph-rbac">
            <caption className="oph-visually-hidden">{L(S.rbac)}</caption>
            <thead>
              <tr>
                <th scope="col">{L(S.role)}</th>
                {PERMISSIONS.map((permission) => (
                  <th key={permission} scope="col">
                    {L(permissionLabels[permission])}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role) => (
                <tr key={role}>
                  <th scope="row">{L(roleLabels[role])}</th>
                  {PERMISSIONS.map((permission) => (
                    <td key={permission}>
                      <label className="oph-rbac__hit">
                        <input
                          type="checkbox"
                          className="oph-rbac__check"
                          checked={security.matrix[role].includes(permission)}
                          disabled={role === 'admin'}
                          aria-label={`${L(roleLabels[role])} — ${L(permissionLabels[permission])}`}
                          onChange={() => togglePermission(role, permission)}
                        />
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>

      <div className="oph-agrid">
        <AdminPanel title={L(S.backups)} lead={L(P.backupsText)}>
          <ul className="oph-alist">
            <li>
              <span>{L(S.lastBackup)}</span>
              {security.lastBackup ? (
                <StatusPill tone="ok">
                  {L(P.backupDone)} ·{' '}
                  {formatDate(security.lastBackup, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </StatusPill>
              ) : (
                <StatusPill tone="muted">{L(P.backupNever)}</StatusPill>
              )}
            </li>
          </ul>
          <Button variant="outline" size="sm" onClick={backup}>
            <Download size={15} aria-hidden="true" />
            {L(S.backupNow)}
          </Button>
        </AdminPanel>

        <AdminPanel title={L(S.spam)} lead={L(P.spamText)}>
          <ul className="oph-alist oph-alist--toggles">
            {spamRows.map((row) => (
              <li key={row.key}>
                <Toggle checked={security.spam[row.key]} onChange={(value) => toggleSpam(row.key, value)} label={row.label} />
                <StatusPill tone={row.server ? 'warn' : 'ok'}>{row.server ? L(A.pendingServer) : L(A.clientSide)}</StatusPill>
              </li>
            ))}
          </ul>
        </AdminPanel>
      </div>

      <AdminPanel title={L(S.headers)} lead={L(S.headersText)}>
        <ul className="oph-atags">
          {['Content-Security-Policy', 'Strict-Transport-Security', 'X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy'].map(
            (header) => (
              <li key={header}>
                <StatusPill tone="ok">
                  <ShieldCheck size={13} aria-hidden="true" /> {header}
                </StatusPill>
              </li>
            ),
          )}
        </ul>
      </AdminPanel>
    </>
  );
};
