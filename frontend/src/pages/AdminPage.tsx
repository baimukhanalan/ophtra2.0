import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Accessibility,
  ArrowUpRight,
  BarChart3,
  FileText,
  FormInput,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Newspaper,
  Plug,
  Plus,
  Search as SearchIcon,
  ShieldCheck,
  Tag,
  Trash2,
  UserPlus,
  Wallet,
  Workflow,
  X,
} from 'lucide-react';
import { useI18n } from '@/i18n';
import type { Localized } from '@/i18n/types';
import { Alert, Button, EmptyState, Input, Modal, useToast, type Column } from '@/ui';
import { Seo } from '@/seo/Seo';
import { LogoMark } from '@/layout/Logo';
import { LanguageSwitcher } from '@/layout/LanguageSwitcher';
import { ROUTES } from '@/app/navigation';
import { api } from '@/services/api';
import { clinics, departments, doctors as seedDoctors, services as seedServices } from '@/content';
import { publishedNews } from '@/content/news';
import { activePromotions } from '@/content/promotions';
import { adminCopy as C, adminNav as N } from '@/content/pages/platform';
import type { Doctor, NewsItem, Promotion, Service } from '@/types';
import { usePersisted } from './admin/store';
import { AdminPanel, ResponsiveTable, StatusPill, Toggle, type Sync } from './admin/ui';
import { ArticlesManager, PagesManager } from './admin/AdminContent';
import { LeadsManager, useCrmLeads } from './admin/AdminLeads';
import { AnalyticsDashboard } from './admin/AdminAnalytics';
import { AutomationManager, FormsManager, IntegrationsManager, SecurityManager, SeoManager } from './admin/AdminSettings';

const TOKEN_KEY = 'ophtra.admin.token';
const USER_KEY = 'ophtra.admin.user';

/**
 * Offline (static deployment) sign-in. Only a salted SHA-256 digest of
 * `login:password` ships in the bundle — never the credentials themselves.
 * This is obfuscation for the demo workspace, not access control: every
 * record it unlocks lives in the visitor's own browser. Real authentication is
 * the API's `/admin/login`, tried first.
 */
const OFFLINE_SALT = 'ophtra-admin-demo/v1|';
const OFFLINE_DIGEST = '773dfd4d214ab9ca2c03edaefee78764bb837365c88b45227c2e2e84d29ed01d';

const sha256Hex = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const matchesOfflineAccount = async (login: string, password: string) => {
  // Web Crypto exists only in secure contexts (https, localhost).
  if (!window.crypto?.subtle) return false;
  try {
    return (await sha256Hex(`${OFFLINE_SALT}${login}:${password}`)) === OFFLINE_DIGEST;
  } catch {
    return false;
  }
};

/**
 * Capabilities required by the specification (§14): create pages, edit
 * content, publish articles, manage forms, manage leads, view analytics — plus
 * the original eight: pages, doctors, news, promotions, prices, photos, SEO and
 * patient requests (leads).
 */
type SectionId =
  | 'pages'
  | 'articles'
  | 'news'
  | 'promotions'
  | 'doctors'
  | 'prices'
  | 'photos'
  | 'requests'
  | 'forms'
  | 'analytics'
  | 'automation'
  | 'integrations'
  | 'seo'
  | 'security';

const NAV: Array<{ group: Localized; items: Array<{ id: SectionId; icon: ReactNode }> }> = [
  {
    group: N.groupContent,
    items: [
      { id: 'pages', icon: <LayoutDashboard size={17} aria-hidden="true" /> },
      { id: 'articles', icon: <FileText size={17} aria-hidden="true" /> },
      { id: 'news', icon: <Newspaper size={17} aria-hidden="true" /> },
      { id: 'promotions', icon: <Tag size={17} aria-hidden="true" /> },
      { id: 'doctors', icon: <UserPlus size={17} aria-hidden="true" /> },
      { id: 'prices', icon: <Wallet size={17} aria-hidden="true" /> },
      { id: 'photos', icon: <ImageIcon size={17} aria-hidden="true" /> },
    ],
  },
  {
    group: N.groupCrm,
    items: [
      { id: 'requests', icon: <Inbox size={17} aria-hidden="true" /> },
      { id: 'forms', icon: <FormInput size={17} aria-hidden="true" /> },
      { id: 'analytics', icon: <BarChart3 size={17} aria-hidden="true" /> },
    ],
  },
  {
    group: N.groupSettings,
    items: [
      { id: 'automation', icon: <Workflow size={17} aria-hidden="true" /> },
      { id: 'integrations', icon: <Plug size={17} aria-hidden="true" /> },
      { id: 'seo', icon: <SearchIcon size={17} aria-hidden="true" /> },
      { id: 'security', icon: <ShieldCheck size={17} aria-hidden="true" /> },
    ],
  },
];

const ALL_SECTIONS = NAV.flatMap((group) => group.items.map((item) => item.id));

const readStored = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

/* ============================================================== TOP BAR */

/**
 * The workspace's own chrome (the public header, footer and assistant are not
 * rendered on /admin): brand, language, accessibility, back to the site and —
 * once signed in — who is signed in and «Выйти».
 */
const AdminTopBar = ({ user, onSignOut }: { user?: string; onSignOut?: () => void }) => {
  const { t, L } = useI18n();
  return (
    <header className="oph-adminbar oph-on-dark">
      <Link to={ROUTES.admin} className="oph-adminbar__brand">
        <LogoMark size={30} tone="light" />
        <span className="oph-adminbar__brandtext">
          <span className="oph-adminbar__name">{t.brand.name}</span>
          <span className="oph-adminbar__role">{t.admin.title}</span>
        </span>
      </Link>

      <div className="oph-adminbar__tools">
        <LanguageSwitcher />
        <button
          type="button"
          className="oph-adminbar__btn"
          onClick={() => window.dispatchEvent(new Event('oph:open-a11y'))}
        >
          <Accessibility size={18} aria-hidden="true" />
          <span className="oph-adminbar__label">{L(C.a11y)}</span>
        </button>
        <Link to={ROUTES.home} className="oph-adminbar__btn">
          <ArrowUpRight size={18} aria-hidden="true" />
          <span className="oph-adminbar__label">{L(C.backToSite)}</span>
        </Link>
        {user && onSignOut ? (
          <>
            <p className="oph-adminbar__who">
              {L(C.signedInAs)} <strong>{user}</strong>
            </p>
            <button type="button" className="oph-adminbar__btn oph-adminbar__btn--out" onClick={onSignOut}>
              <LogOut size={18} aria-hidden="true" />
              <span className="oph-adminbar__label">{t.account.signOut}</span>
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
};

/* ================================================================ SIGN-IN */

const SignIn = ({ onToken }: { onToken: (token: string, user: string) => void }) => {
  const { t, L } = useI18n();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;
    if (!login.trim() || !password) {
      setError(L(C.loginRequired));
      return;
    }
    setPending(true);
    setError(undefined);
    const user = login.trim();
    try {
      const result = await api.adminLogin(user, password);
      onToken(result.token, user);
    } catch {
      // Static deployment: no API to ask, so the offline workspace opens for
      // the documented account (compared by digest, see above).
      if (await matchesOfflineAccount(user, password)) onToken(`demo-admin-${Date.now()}`, user);
      else setError(L(C.loginError));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="oph-admin-shell">
      <Seo title={t.admin.signIn} description={t.admin.title} noIndex />
      <AdminTopBar />
      <div className="oph-adminauth">
        <div className="oph-panel oph-authcard">
          <span className="oph-authcard__icon" aria-hidden="true">
            <LockKeyhole size={20} />
          </span>
          <span className="oph-eyebrow">{L(C.eyebrow)}</span>
          <h1 className="oph-authcard__title">{t.admin.signIn}</h1>
          <p className="oph-authcard__text">{L(C.signInLead)}</p>
          <form className="oph-form oph-authcard__form" onSubmit={submit} noValidate>
            <Input
              label={L(C.login)}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={login}
              onChange={(event) => setLogin(event.target.value)}
            />
            <Input
              label={L(C.password)}
              type="password"
              autoComplete="current-password"
              required
              value={password}
              error={error}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" loading={pending} block>
              {t.admin.signIn}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ================================================================== PAGE */

const AdminPage = () => {
  const { t, L, formatPrice, formatDate } = useI18n();
  const { notify } = useToast();

  const [token, setToken] = useState<string | null>(() => readStored(TOKEN_KEY));
  const [user, setUser] = useState<string>(() => readStored(USER_KEY) ?? 'admin');
  const isDemoToken = Boolean(token?.startsWith('demo-'));
  const [offline, setOffline] = useState(isDemoToken);
  const [stored, setSection] = usePersisted<SectionId>('section', () => 'pages');
  const section: SectionId = ALL_SECTIONS.includes(stored) ? stored : 'pages';

  const [doctorList, setDoctorList] = usePersisted<Doctor[]>('doctors', () => seedDoctors);
  const [newsList, setNewsList] = usePersisted<NewsItem[]>('news', publishedNews);
  const [promotionList, setPromotionList] = usePersisted<Promotion[]>('promotions', activePromotions);
  const [priceList, setPriceList] = usePersisted<Service[]>('prices', () => seedServices);
  const [photos, setPhotos] = useState<Array<{ name: string; url: string; size: number }>>([]);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', role: '', experience: '', departmentId: '' });

  useEffect(() => setOffline(isDemoToken), [isDemoToken]);
  // Object URLs are revoked on removal and once more when the page unmounts.
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)), []);

  const acceptToken = (next: string, name: string) => {
    try {
      window.localStorage.setItem(TOKEN_KEY, next);
      window.localStorage.setItem(USER_KEY, name);
    } catch {
      /* session-only sign-in */
    }
    setUser(name);
    setToken(next);
  };

  const signOut = () => {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    } catch {
      /* nothing stored */
    }
    setToken(null);
  };

  /** Mirrors one change to the API; the local copy is already saved. */
  const sync = useCallback<Sync>(
    async (collection, id, body, options = {}) => {
      if (!token) return false;
      try {
        if (token.startsWith('demo-')) throw new Error('demo');
        if (options.remove) await api.adminDelete(collection, id, token);
        else if (options.create) await api.adminCreate(collection, { id, ...body }, token);
        else await api.adminSave(collection, id, body, token);
        setOffline(false);
        if (!options.quiet) notify({ tone: 'success', title: L(C.saved) });
        return true;
      } catch {
        setOffline(true);
        if (!options.quiet) notify({ tone: 'info', title: L(C.savedLocal), text: L(C.demoModeText) });
        return false;
      }
    },
    [token, notify, L],
  );

  const { leads, loading: leadsLoading, apiOnline, update: updateLead } = useCrmLeads(token, sync);
  useEffect(() => {
    if (apiOnline) setOffline(false);
  }, [apiOnline]);

  const labels = useMemo(
    () => Object.fromEntries(ALL_SECTIONS.map((id) => [id, L(N[id])])) as Record<SectionId, string>,
    [L],
  );

  if (!token) return <SignIn onToken={acceptToken} />;

  /* ---------------------------------------------------- legacy tables */
  const doctorColumns: Array<Column<Doctor>> = [
    {
      key: 'name',
      header: t.common.doctor,
      render: (doctor) => (
        <>
          <span className="oph-table__name">{L(doctor.name)}</span>
          <span className="oph-atable__sub">{L(doctor.role)}</span>
        </>
      ),
    },
    {
      key: 'department',
      header: t.common.department,
      render: (doctor) =>
        doctor.departmentIds
          .map((id) => departments.find((entry) => entry.id === id))
          .filter(Boolean)
          .map((department) => L(department!.name))
          .join(', ') || '—',
    },
    { key: 'experience', header: t.common.experience, width: '120px', render: (doctor) => `${doctor.experience} ${t.common.years}` },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (doctor) => (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          aria-label={`${t.common.delete}: ${L(doctor.name)}`}
          onClick={() => {
            if (!window.confirm(`${L(C.confirmDelete)}\n${L(doctor.name)}`)) return;
            setDoctorList((current) => current.filter((entry) => entry.id !== doctor.id));
            void sync('doctors', doctor.id, {}, { remove: true });
          }}
        >
          <Trash2 size={15} aria-hidden="true" />
        </Button>
      ),
    },
  ];

  const priceColumns: Array<Column<Service>> = [
    { key: 'name', header: t.common.service, render: (service) => <span className="oph-table__name">{L(service.name)}</span> },
    {
      key: 'price',
      header: t.common.price,
      align: 'right',
      width: '180px',
      render: (service) => (
        <input
          className="oph-input oph-input--compact"
          type="number"
          min={0}
          step={1000}
          inputMode="numeric"
          value={service.price}
          aria-label={`${L(service.name)} — ${t.common.price}`}
          onChange={(event) => {
            const price = Math.max(0, Number(event.target.value) || 0);
            setPriceList((current) => current.map((entry) => (entry.id === service.id ? { ...entry, price } : entry)));
          }}
          onBlur={(event) => void sync('services', service.id, { price: Math.max(0, Number(event.target.value) || 0) }, { quiet: true })}
        />
      ),
    },
    {
      key: 'current',
      header: '',
      align: 'right',
      width: '140px',
      render: (service) => <span className="oph-table__price">{formatPrice(service.price)}</span>,
    },
  ];

  const addPhotos = (list: FileList | null) => {
    if (!list) return;
    const accepted = Array.from(list).filter((file) => file.type.startsWith('image/') && file.size <= 8 * 1024 * 1024);
    if (accepted.length < list.length) notify({ tone: 'warning', title: L(C.photoInvalid) });
    if (!accepted.length) return;
    setPhotos((current) => [
      ...current,
      ...accepted.map((file) => ({ name: file.name, size: file.size, url: URL.createObjectURL(file) })),
    ]);
    notify({ tone: 'success', title: `${t.common.add}: ${accepted.length}` });
  };

  const togglePublished = <T extends { id: string; published: boolean }>(
    list: T[],
    setList: (next: T[]) => void,
    collection: string,
    item: T,
  ) => {
    setList(list.map((entry) => (entry.id === item.id ? { ...entry, published: !entry.published } : entry)));
    void sync(collection, item.id, { published: !item.published });
  };

  /* ------------------------------------------------------------ content */
  const renderSection = () => {
    switch (section) {
      case 'pages':
        return <PagesManager sync={sync} />;
      case 'articles':
        return <ArticlesManager sync={sync} />;
      case 'requests':
        return <LeadsManager leads={leads} loading={leadsLoading} update={updateLead} />;
      case 'forms':
        return <FormsManager leads={leads} sync={sync} />;
      case 'analytics':
        return <AnalyticsDashboard leads={leads} />;
      case 'automation':
        return <AutomationManager sync={sync} />;
      case 'integrations':
        return <IntegrationsManager sync={sync} />;
      case 'seo':
        return <SeoManager />;
      case 'security':
        return <SecurityManager sync={sync} />;
      case 'doctors':
        return (
          <AdminPanel
            title={labels.doctors}
            actions={
              <Button size="sm" onClick={() => setDoctorModalOpen(true)}>
                <Plus size={15} aria-hidden="true" />
                {t.common.add}
              </Button>
            }
          >
            {doctorList.length === 0 ? (
              <EmptyState title={t.common.nothingFound} />
            ) : (
              <ResponsiveTable
                columns={doctorColumns}
                rows={doctorList}
                rowKey={(row) => row.id}
                caption={labels.doctors}
                className="oph-rtable--corner"
              />
            )}
          </AdminPanel>
        );
      case 'news':
      case 'promotions': {
        const isNews = section === 'news';
        const items = (isNews ? newsList : promotionList) as Array<NewsItem | Promotion>;
        return (
          <AdminPanel title={labels[section]}>
            {items.length === 0 ? (
              <EmptyState title={t.common.nothingFound} />
            ) : (
              <ul className="oph-alist oph-alist--cards">
                {items.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong className="oph-alist__title">{L(item.title)}</strong>
                      <span className="oph-atable__sub">
                        {'discount' in item
                          ? `−${item.discount}% · ${formatDate(item.validFrom)} — ${formatDate(item.validTo)}`
                          : `${formatDate(item.date)} · ${L(item.category)}`}
                      </span>
                    </div>
                    <Toggle
                      checked={item.published}
                      label={`${L(C.published)}: ${L(item.title)}`}
                      hideLabel
                      onLabel={L(C.published)}
                      offLabel={L(C.draft)}
                      onChange={() =>
                        isNews
                          ? togglePublished(newsList, setNewsList, 'news', item as NewsItem)
                          : togglePublished(promotionList, setPromotionList, 'promotions', item as Promotion)
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>
        );
      }
      case 'prices':
        return (
          <AdminPanel title={labels.prices}>
            <ResponsiveTable
              columns={priceColumns}
              rows={priceList}
              rowKey={(row) => row.id}
              caption={labels.prices}
              className="oph-rtable--prices"
            />
          </AdminPanel>
        );
      case 'photos':
        return (
          <AdminPanel title={labels.photos} lead={L(C.photosLocal)}>
            <label className="oph-dropzone">
              <ImageIcon size={26} aria-hidden="true" />
              <span>{t.common.add}</span>
              <small>{L(C.photosLead)}</small>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="oph-visually-hidden"
                onChange={(event) => {
                  addPhotos(event.target.files);
                  event.target.value = '';
                }}
              />
            </label>
            {photos.length ? (
              <ul className="oph-photos">
                {photos.map((photo, index) => (
                  <li key={photo.url}>
                    <img src={photo.url} alt={photo.name} loading="lazy" />
                    <span>{photo.name}</span>
                    <button
                      type="button"
                      aria-label={`${L(C.removePhoto)}: ${photo.name}`}
                      onClick={() => {
                        URL.revokeObjectURL(photo.url);
                        setPhotos((current) => current.filter((_, i) => i !== index));
                      }}
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </AdminPanel>
        );
      default:
        return null;
    }
  };

  const currentGroup = NAV.find((group) => group.items.some((item) => item.id === section));
  const newLeads = leads.filter((lead) => lead.stage === 'new').length;

  return (
    <div className="oph-admin-shell">
      <Seo title={`${labels[section]} — ${t.admin.title}`} description={t.admin.title} noIndex />

      <AdminTopBar user={user} onSignOut={signOut} />

      <div className="oph-admin">
        <aside className="oph-admin__side oph-on-dark" aria-label={L(C.workspace)}>
          <nav className="oph-admin__nav" aria-label={t.admin.title}>
            {NAV.map((group) => (
              <div key={group.group.en} className="oph-admin__group">
                <p className="oph-admin__grouplabel">{L(group.group)}</p>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="oph-admin__link"
                        aria-current={section === item.id ? 'page' : undefined}
                        onClick={() => setSection(item.id)}
                      >
                        {item.icon}
                        <span>{labels[item.id]}</span>
                        {item.id === 'requests' && newLeads > 0 ? (
                          <span className="oph-admin__badge">
                            <span className="oph-visually-hidden">: </span>
                            {newLeads}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="oph-admin__foot">
            <StatusPill tone={offline ? 'warn' : 'ok'}>{offline ? L(C.demoMode) : L(C.online)}</StatusPill>
          </div>
        </aside>

        <div className="oph-admin__main">
          {/* Phones and tablets: every one of the 14 sections in one native
              picker (grouped), instead of a strip that hid 11 of them. */}
          <div className="oph-admin__picker">
            <label className="oph-field">
              <span className="oph-field__label">{L(C.sectionPicker)}</span>
              <select
                className="oph-select"
                value={section}
                onChange={(event) => setSection(event.target.value as SectionId)}
              >
                {NAV.map((group) => (
                  <optgroup key={group.group.en} label={L(group.group)}>
                    {group.items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {labels[item.id]}
                        {item.id === 'requests' && newLeads > 0 ? ` (${newLeads})` : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <StatusPill tone={offline ? 'warn' : 'ok'}>{offline ? L(C.demoMode) : L(C.online)}</StatusPill>
          </div>

          <header className="oph-admin__top">
            <div>
              {currentGroup ? <span className="oph-eyebrow">{L(currentGroup.group)}</span> : null}
              <h1 className="oph-admin__title">{labels[section]}</h1>
            </div>
          </header>

          {offline ? (
            <div className="oph-admin__notice" role="status">
              <Alert tone="warning">{L(C.demoModeText)}</Alert>
            </div>
          ) : null}

          <div className="oph-admin__content" key={section}>
            {renderSection()}
          </div>
        </div>
      </div>

      <Modal open={doctorModalOpen} onClose={() => setDoctorModalOpen(false)} title={`${t.common.add} — ${t.common.doctor}`}>
        <form
          className="oph-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!newDoctor.name.trim() || !newDoctor.role.trim()) return;
            const id = `doc-${Date.now()}`;
            const created: Doctor = {
              id,
              slug: id,
              name: { ru: newDoctor.name, kk: newDoctor.name, en: newDoctor.name },
              role: { ru: newDoctor.role, kk: newDoctor.role, en: newDoctor.role },
              departmentIds: newDoctor.departmentId ? [newDoctor.departmentId] : [],
              clinicIds: [clinics[0].id],
              experience: Number(newDoctor.experience) || 0,
              category: { ru: '', kk: '', en: '' },
              bio: { ru: '', kk: '', en: '' },
              languages: ['ru'],
              education: { ru: '', kk: '', en: '' },
              isManagement: false,
              acceptsOnline: true,
            };
            setDoctorList((current) => [created, ...current]);
            void sync('doctors', id, created as unknown as Record<string, unknown>, { create: true });
            setDoctorModalOpen(false);
            setNewDoctor({ name: '', role: '', experience: '', departmentId: '' });
          }}
        >
          <Input label={t.common.fullName} required value={newDoctor.name} onChange={(event) => setNewDoctor({ ...newDoctor, name: event.target.value })} />
          <Input label={t.common.doctor} required value={newDoctor.role} onChange={(event) => setNewDoctor({ ...newDoctor, role: event.target.value })} />
          <Input
            label={t.common.experience}
            type="number"
            min={0}
            value={newDoctor.experience}
            onChange={(event) => setNewDoctor({ ...newDoctor, experience: event.target.value })}
          />
          <label className="oph-field">
            <span className="oph-field__label">{t.common.department}</span>
            <select
              className="oph-select"
              value={newDoctor.departmentId}
              onChange={(event) => setNewDoctor({ ...newDoctor, departmentId: event.target.value })}
            >
              <option value="">—</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {L(department.name)}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" block>
            <Plus size={16} aria-hidden="true" />
            {t.common.add}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPage;
