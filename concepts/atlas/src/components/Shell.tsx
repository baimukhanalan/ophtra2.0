import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { bridge } from '../world/bridge';
import { BrandMark } from './BrandMark';
import { NAV_GROUPS } from '../lib/routes';
import { clinic, site } from '../lib/data';
import { Arrow } from './ui';

/* ---------------- world canvas + HUD ---------------- */
function useWorldState() {
  return useSyncExternalStore(
    (l) => bridge.subscribe(l),
    () => (bridge.worldFailed ? 'failed' : bridge.worldReady ? 'ready' : 'loading'),
  );
}

function webglOk() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function World() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const coords = useRef<HTMLSpanElement>(null);
  const alt = useRef<HTMLSpanElement>(null);
  const stage = useRef<HTMLSpanElement>(null);
  const state = useWorldState();
  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    if (!webglOk()) {
      bridge.fail();
      return;
    }
    import('../world/engine')
      .then(({ startWorld }) => {
        if (cancelled || !canvas.current || !labels.current) return;
        try {
          stop = startWorld({ canvas: canvas.current, labelLayer: labels.current, hudCoords: coords.current, hudAlt: alt.current, hudStage: stage.current });
        } catch (e) {
          console.error(e);
          bridge.fail();
        }
      })
      .catch(() => bridge.fail());
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);
  return (
    <>
      <div className={`world ${state === 'ready' ? 'is-ready' : ''}`} aria-hidden="true">
        {state === 'failed' && (
          <>
            <div className="world__fallback" />
            <div className="world__stars" />
          </>
        )}
        <canvas ref={canvas} />
      </div>
      <div className="veil" aria-hidden="true" />
      <div className="labels" ref={labels} aria-hidden="true" />
      <div className="hud" aria-hidden="true">
        <span className="hud__stage" ref={stage}>
          ОРБИТА
        </span>
        <span className="hud__coords" ref={coords}>
          51.1284° N · 71.4306° E
        </span>
        <span ref={alt}>ALT —</span>
      </div>
    </>
  );
}

/* ---------------- header + route menu ---------------- */
export function Header() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [solid, setSolid] = useState(false);
  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setSolid(window.scrollY > 40);
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      window.removeEventListener('scroll', on);
      cancelAnimationFrame(raf);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    const first = panel.current?.querySelector<HTMLElement>('a');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
      if (e.key === 'Tab' && panel.current) {
        const f = [btn.current!, ...panel.current.querySelectorAll<HTMLElement>('a, button')];
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [open]);
  return (
    <>
      <header className={`hdr ${solid ? 'hdr--solid' : ''}`}>
        <Link to="/" className="brand" aria-label="Офтальмологический центр доктора Кулмаганбетова — на главную">
          <BrandMark className="brand__mark" />
          <span className="brand__txt" aria-hidden="true">
            <span className="brand__name">Dr Kulmaganbetov</span>
            <span className="brand__sub">Офтальмологический центр · Астана</span>
          </span>
        </Link>
        <div className="hdr__nav">
          <nav className="hdr__links" aria-label="Основные разделы">
            <NavLink to="/about">О центре</NavLink>
            <NavLink to="/doctors">Врачи</NavLink>
            <NavLink to="/services">Направления</NavLink>
            <NavLink to="/international">Иностранным пациентам</NavLink>
            <NavLink to="/science">Наука</NavLink>
          </nav>
          <div className="lang" role="group" aria-label="Язык сайта">
            <button type="button" aria-pressed="true">
              RU
            </button>
            <button type="button" aria-pressed="false" aria-disabled="true" title="В концепте показан русский; казахская версия — в продакшене">
              KK
            </button>
            <button type="button" aria-pressed="false" aria-disabled="true" title="В концепте показан русский; английская версия — в продакшене">
              EN
            </button>
          </div>
          <Link to="/booking" className="btn btn--sm btn--book">
            Записаться
          </Link>
          <button ref={btn} type="button" className="menu-btn" aria-expanded={open} aria-controls="route-menu" onClick={() => setOpen((o) => !o)}>
            <span className="menu-btn__icon" aria-hidden="true" />
            {open ? 'Закрыть' : 'Маршруты'}
          </button>
        </div>
      </header>
      <div id="route-menu" ref={panel} className={`menu ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Все разделы" aria-hidden={!open} inert={!open}>
        <div className="menu__grid">
          {NAV_GROUPS.map((g) => (
            <section className="menu__group" key={g.title}>
              <h2>{g.title}</h2>
              <ul>
                {g.items.map((it) => (
                  <li key={it.to}>
                    <NavLink to={it.to} end={it.to === '/'}>
                      {it.label}
                      <span>{it.wp}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="menu__foot">
          <span>{clinic.address}</span>
          <a href={`tel:${site.organization.phoneHref}`}>{site.organization.phone}</a>
          <a href={`mailto:${site.organization.email}`}>{site.organization.email}</a>
        </div>
      </div>
    </>
  );
}

/* ---------------- footer ---------------- */
export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap pad">
        <p className="ftr__big" data-reveal>
          От Астаны к миру — <em>и обратно</em>, к пациенту.
        </p>
        <div className="actions" style={{ marginBottom: 56 }}>
          <Link className="btn" to="/booking">
            Записаться на приём <Arrow />
          </Link>
          <Link className="btn btn--ghost" to="/second-opinion">
            Второе мнение по документам
          </Link>
        </div>
        <div className="ftr__grid">
          <div>
            <h2>Центр</h2>
            <p className="muted" style={{ margin: '0 0 8px' }}>
              {site.organization.legalName}
            </p>
            <p className="muted" style={{ margin: 0 }}>
              {clinic.address}
              <br />
              {clinic.schedule}
            </p>
          </div>
          {NAV_GROUPS.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2>{g.title}</h2>
              <ul>
                {g.items.map((it) => (
                  <li key={it.to}>
                    <Link to={it.to}>{it.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="ftr__legal">
          <span>
            <a href={`tel:${site.organization.phoneHref}`}>{site.organization.phone}</a> ·{' '}
            <a href={`mailto:${site.organization.email}`}>{site.organization.email}</a>
          </span>
          <span className="mono">ATLAS · дизайн-концепт · 51.1284° N 71.4306° E</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- page wrapper: title + reveal observer ---------------- */
export function Page({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.title = `${title} · ATLAS — Dr Kulmaganbetov`;
  }, [title]);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    const scan = () => root.querySelectorAll('[data-reveal]:not(.is-in), .st:not(.is-in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return (
    <div ref={ref}>
      {children}
      <Footer />
    </div>
  );
}
