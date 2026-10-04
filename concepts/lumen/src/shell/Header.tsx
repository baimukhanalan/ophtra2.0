import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { reducedMotion } from '../lib/env';
import { gsap, stopScroll } from '../lib/scroll';
import { R } from '../routes';
import { HEADER_LINKS, NAV_GROUPS } from './nav';
import { TLink } from './Transition';

function LangSwitch() {
  return (
    <div className="lang" role="group" aria-label="Язык сайта">
      <button type="button" aria-pressed="true" className="lang__b is-on">
        RU
      </button>
      <button type="button" aria-disabled="true" className="lang__b" title="В концепте показана русская версия">
        KK
      </button>
      <button type="button" aria-disabled="true" className="lang__b" title="В концепте показана русская версия">
        EN
      </button>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Close the menu whenever the page changes.
  useEffect(() => setOpen(false), [location.key]);

  // Aperture menu: an iris opening from the menu button.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    stopScroll(open);
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      el.hidden = false;
      const r = btn.current?.getBoundingClientRect();
      const cx = r ? r.left + r.width / 2 : window.innerWidth - 40;
      const cy = r ? r.top + r.height / 2 : 36;
      if (!reducedMotion) {
        gsap.fromTo(
          el,
          { clipPath: `circle(0px at ${cx}px ${cy}px)` },
          { clipPath: `circle(150vmax at ${cx}px ${cy}px)`, duration: 0.9, ease: 'expo.out' },
        );
        gsap.fromTo(
          el.querySelectorAll('.menu__item'),
          { opacity: 0, y: 24, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.025, ease: 'expo.out', delay: 0.1 },
        );
      }
      el.querySelector<HTMLElement>('a, button')?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
        if (e.key === 'Tab') {
          const f = [...el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
          const first = f[0];
          const last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    } else if (!el.hidden) {
      const done = () => {
        el.hidden = true;
      };
      if (reducedMotion) done();
      else gsap.to(el, { clipPath: 'circle(0px at 50% 0%)', duration: 0.5, ease: 'power3.in', onComplete: done });
      btn.current?.focus({ preventScroll: true });
    }
  }, [open]);

  const path = location.pathname;
  return (
    <>
      <a href="#main" className="skip">
        К содержанию
      </a>
      <header className={'hdr' + (scrolled ? ' is-scrolled' : '')}>
        <div className="hdr__in wrap">
          <TLink to={R.home} className="hdr__logo" aria-label="Офтальмологический центр доктора Кулмаганбетова — на главную">
            <img src="/brand/logo.png" alt="" width={460} height={80} fetchPriority="high" />
          </TLink>
          <nav className="hdr__nav" aria-label="Основная навигация">
            <ul role="list">
              {HEADER_LINKS.map((l) => (
                <li key={l.to}>
                  <TLink to={l.to} aria-current={path.startsWith(l.to) ? 'page' : undefined}>
                    {l.label}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hdr__end">
            <LangSwitch />
            <TLink to={R.booking} className="btn btn--sm hdr__cta">
              Записаться
            </TLink>
            <button
              ref={btn}
              type="button"
              className={'hdr__menu' + (open ? ' is-open' : '')}
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">{open ? 'Закрыть меню' : 'Открыть меню'}</span>
              <span className="hdr__iris" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>
      <div id="menu" className="menu" ref={panel} hidden role="dialog" aria-modal="true" aria-label="Меню">
        <div className="menu__in wrap">
          <div className="menu__grid">
            {NAV_GROUPS.map((g, gi) => (
              <section key={g.label} className="menu__group">
                <h2 className="anno menu__label">
                  <span>0{gi + 1}</span> {g.label}
                </h2>
                <ul role="list">
                  {g.items.map((it) => (
                    <li key={it.to} className="menu__item">
                      <TLink to={it.to} aria-current={path === it.to ? 'page' : undefined}>
                        <span className="menu__t">{it.label}</span>
                        {it.desc && <span className="menu__d">{it.desc}</span>}
                      </TLink>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <div className="menu__foot menu__item">
            <LangSwitch />
            <TLink to={R.booking} className="btn">
              Записаться на консультацию
            </TLink>
          </div>
        </div>
      </div>
    </>
  );
}
