import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { IrisLink } from '../lib/nav';
import { ROMAN, ROUTES } from '../lib/routes';
import { lockScroll, onFrame, onLayer, scroll } from '../lib/engine';
import { Arrow, Mark } from './ui';
import { clinic, site } from '../content';

export function Logo() {
  return (
    <IrisLink to="/" className="logo" aria-label="Офтальмологический центр доктора Кулмаганбетова — на главную">
      <Mark />
      <span className="logo__word">
        <b>Dr Kulmaganbetov</b>
        <span>Ophthalmic Centre</span>
      </span>
    </IrisLink>
  );
}

function Hud() {
  const [layer, setLayer] = useState('Взгляд');
  const barRef = useRef<HTMLSpanElement>(null);
  useEffect(
    () =>
      onLayer((name, depth) => {
        setLayer(name);
        barRef.current?.style.setProperty('--depth', depth.toFixed(3));
      }),
    [],
  );
  return (
    <div className="hud" aria-live="off">
      <span>Глубина</span>
      <span className="hud__bar" ref={barRef}>
        <i />
      </span>
      <span className="hud__name">{layer}</span>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const loc = useLocation();

  useEffect(() => {
    let lastY = 0;
    return onFrame(() => {
      const y = scroll.y;
      const s = y > 40;
      setSolid((v) => (v !== s ? s : v));
      if (Math.abs(y - lastY) > 6) {
        const h = y > lastY && y > 300;
        setHidden((v) => (v !== h ? h : v));
        lastY = y;
      }
    });
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const menu = menuRef.current!;
    const focusables = () => Array.from(menu.querySelectorAll<HTMLElement>('a, button'));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key === 'Tab') {
        const f = focusables();
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
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`hdr ${solid ? 'is-solid' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
        <Logo />
        <Hud />
        <div className="hdr__right">
          <IrisLink to="/appointment" className="btn btn--sm hdr__book">
            Записаться
          </IrisLink>
          <button
            ref={btnRef}
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            Слои
            <span className="menu-btn__eye" aria-hidden="true">
              <i />
            </span>
          </button>
        </div>
      </header>
      <div
        id="site-menu"
        ref={menuRef}
        className={`menu ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Навигация по слоям"
        aria-hidden={!open}
      >
        <div className="menu__top">
          <Logo />
          <button
            type="button"
            className="menu-btn"
            onClick={() => {
              close();
              btnRef.current?.focus();
            }}
          >
            Закрыть
            <span className="menu-btn__eye" aria-hidden="true">
              <i style={{ transform: 'scale(1.8)' }} />
            </span>
          </button>
        </div>
        <div className="menu__body">
          <nav aria-label="Основная навигация">
            <ol className="menu__list">
              {ROUTES.filter((r) => r.menu).map((r, i) => (
                <li key={r.path} style={{ '--i': i } as CSSProperties}>
                  <IrisLink to={r.path} onClick={close} tabIndex={open ? 0 : -1}>
                    <span className="menu__n">{ROMAN[i]}</span>
                    <span className="menu__t">{r.title}</span>
                    <span className="menu__l">{r.layer}</span>
                  </IrisLink>
                </li>
              ))}
            </ol>
          </nav>
          <div className="menu__side">
            <p className="menu__anat">
              Каждый раздел — слой глаза. Роговица, хрусталик, сетчатка, зрительный нерв: листайте, чтобы идти глубже.
            </p>
            <div>
              <p className="eyebrow">Центр в Астане</p>
              <p className="body">{clinic.address}</p>
              <p className="small">{clinic.schedule}</p>
            </div>
            <ul>
              {site.channels.map((c: { id: string; label: string; href: string }) => (
                <li key={c.id}>
                  <a href={c.href} tabIndex={open ? 0 : -1} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
            <IrisLink to="/appointment" className="btn" onClick={close} tabIndex={open ? 0 : -1}>
              Записаться на консультацию <Arrow />
            </IrisLink>
          </div>
        </div>
      </div>
    </>
  );
}

export function Footer() {
  const groups: Array<[string, Array<[string, string]>]> = [
    [
      'Центр',
      [
        ['/about', 'О центре'],
        ['/dr-kulmaganbetov', 'Основатель'],
        ['/doctors', 'Врачи'],
        ['/global-experts', 'Глобальные эксперты'],
        ['/science', 'Наука и академия'],
      ],
    ],
    [
      'Пациентам',
      [
        ['/services', 'Центры и услуги'],
        ['/appointment', 'Запись на приём'],
        ['/international-patients', 'Международным пациентам'],
        ['/second-opinion', 'Второе мнение'],
        ['/online-consultation', 'Онлайн-консультация'],
        ['/account', 'Личный кабинет'],
      ],
    ],
    [
      'Знания',
      [
        ['/knowledge-base', 'База знаний'],
        ['/reviews', 'Отзывы'],
        ['/faq', 'Вопросы и ответы'],
        ['/contacts', 'Контакты'],
      ],
    ],
  ];
  return (
    <footer className="ftr">
      <div className="wrap">
        <p className="quote ftr__quote" data-reveal>
          «Сохранить зрение проще, чем вернуть. Поэтому всё начинается с <em>ранней и точной</em> диагностики».
        </p>
        <div className="ftr__grid">
          <div>
            <h2>{site.organization.legalName}</h2>
            <p className="body">{clinic.address}</p>
            <p className="small">{clinic.schedule}</p>
            <ul>
              {site.channels.map((c: { id: string; label: string; href: string }) => (
                <li key={c.id}>
                  <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {groups.map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h2>{title}</h2>
              <ul>
                {links.map(([to, label]) => (
                  <li key={to}>
                    <IrisLink to={to}>{label}</IrisLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="ftr__base">
          <span>IRIS — дизайн-концепт платформы. Не является публичной офертой.</span>
          <span>Информация носит справочный характер и не заменяет очную консультацию.</span>
        </div>
      </div>
    </footer>
  );
}
