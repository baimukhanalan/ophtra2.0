import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { Accessibility, ArrowUpRight, CalendarPlus, ChevronDown, CircleUserRound, Menu, Phone } from 'lucide-react';
import { useI18n } from '@/i18n';
import { onScroll } from '@/motion';
import { Button, ButtonLink, Drawer } from '@/ui';
import { NAV_GROUPS, ROUTES } from '@/app/navigation';
import { resolveTrackedPhone, trackCall } from '@/services/analytics';
import { site } from '@/content';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * Site header (Figma: cream bar, four dropdown groups, phone, language,
 * account and the dark «Записаться» button).
 *
 * Figma fix: the stray «ЦЕНТР И ЗНАНИЯ» second row is gone — every section of
 * the specification now lives inside the four dropdowns, so the bar is a
 * single line on every page. The bar hides on scroll-down and returns on
 * scroll-up so it never covers the storytelling scenes.
 */
export const Header = () => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const phone = resolveTrackedPhone(site.organization.phone);
  const closeTimer = useRef<number>(0);
  const lastPointer = useRef('');

  const openMenu = useCallback((id: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenGroup(id);
  }, []);

  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    // 300ms: long enough for a diagonal move from a label into the sheet, or a
    // brief overshoot past its edge, without the sheet fading out and back.
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 300);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    let scrolled = false;
    let hidden = false;
    let lastY = 0;
    // Touch screens keep the bar in place: sliding it away against a momentum
    // scroll reads as the page shaking, and sticky sub-bars would have to jump
    // between two offsets (--oph-sticky-top) mid-flick.
    const touch = window.matchMedia('(hover: none) and (pointer: coarse)');

    let pastHero = false;
    return onScroll(({ y, viewport }) => {
      // Phones: floating launchers and the cookie card wait until the first
      // screen (with its calls to action) has been scrolled past. Hysteresis
      // (show past 0.6·vh, hide above 0.45·vh) so a thumb resting near the
      // line does not flap the launcher in and out.
      const nextPastHero = pastHero ? y > viewport * 0.45 : y > viewport * 0.6;
      if (nextPastHero !== pastHero) {
        pastHero = nextPastHero;
        if (nextPastHero) document.documentElement.dataset.pastHero = 'true';
        else delete document.documentElement.dataset.pastHero;
      }
      const nextScrolled = scrolled ? y > 16 : y > 48;
      if (nextScrolled !== scrolled) {
        scrolled = nextScrolled;
        node.dataset.scrolled = String(nextScrolled);
      }
      // Hide only after a meaningful downward travel; show on any upward one.
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        const nextHidden = !touch.matches && delta > 0 && y > 420;
        if (nextHidden !== hidden) {
          hidden = nextHidden;
          node.dataset.hidden = String(nextHidden);
          document.documentElement.dataset.headerHidden = String(nextHidden);
        }
        lastY = y;
      }
    });
  }, []);

  useEffect(() => {
    setOpenGroup(null);
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (drawerOpen) root.dataset.drawerOpen = 'true';
    else delete root.dataset.drawerOpen;
  }, [drawerOpen]);

  useEffect(() => {
    if (!openGroup) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenGroup(null);
    };
    const closeOnOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenGroup(null);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', closeOnOutside);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', closeOnOutside);
    };
  }, [openGroup]);

  // The last opened group stays rendered while the sheet fades out.
  const lastGroup = useRef<string | null>(null);
  if (openGroup) lastGroup.current = openGroup;
  const shownGroup = NAV_GROUPS.find((group) => group.id === (openGroup ?? lastGroup.current));

  const activeGroup = NAV_GROUPS.find((group) =>
    group.links.some((link) => link.path !== '/' && pathname.startsWith(link.path)),
  )?.id;

  return (
    <>
      <header ref={headerRef} className="oph-header" data-menu-open={openGroup ? 'true' : undefined}>
        <div className="oph-header__bar oph-container">
          <Logo name={t.brand.name} compact />

          <nav className="oph-nav oph-header__nav-desktop" aria-label={t.nav.menu}>
            {NAV_GROUPS.map((group) => (
              <div
                key={group.id}
                className="oph-nav__item"
                onPointerEnter={(event) => {
                  if (event.pointerType === 'touch') return;
                  openMenu(group.id);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === 'touch') return;
                  scheduleClose();
                }}
                onFocus={() => openMenu(group.id)}
                onBlur={(event) => {
                  if (!headerRef.current?.contains(event.relatedTarget as Node)) scheduleClose();
                }}
              >
                <button
                  type="button"
                  className="oph-nav__link"
                  aria-expanded={openGroup === group.id}
                  aria-haspopup="true"
                  data-active={activeGroup === group.id || undefined}
                  onPointerDown={(event) => {
                    lastPointer.current = event.pointerType;
                  }}
                  onClick={() => {
                    window.clearTimeout(closeTimer.current);
                    // Hover and focus already open the group; a mouse click or
                    // Enter must not toggle it shut again. Touch still toggles.
                    const touch = lastPointer.current === 'touch';
                    lastPointer.current = '';
                    setOpenGroup((current) => (touch && current === group.id ? null : group.id));
                  }}
                  onKeyDown={(event) => {
                    // The sheet sits after the bar in the DOM: Tab from an open
                    // trigger goes into its links instead of the next group.
                    if (event.key === 'Tab' && !event.shiftKey && openGroup === group.id) {
                      const first = document.querySelector<HTMLElement>('.oph-nav__panel .oph-nav__panel-link');
                      if (first) {
                        event.preventDefault();
                        first.focus();
                      }
                    }
                  }}
                >
                  {t.nav[group.labelKey]}
                  <ChevronDown size={13} aria-hidden="true" />
                </button>

              </div>
            ))}
          </nav>

          {/* One persistent mega-menu sheet: switching between groups swaps only
              its content (cross-fade), so the panel never closes, re-opens or
              jumps while the pointer travels along the bar. */}
          <div
            className="oph-nav__panel"
            data-open={openGroup ? 'true' : undefined}
            aria-hidden={openGroup ? undefined : true}
            onPointerEnter={(event) => {
              if (event.pointerType === 'touch' || !openGroup) return;
              window.clearTimeout(closeTimer.current);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === 'touch') return;
              scheduleClose();
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Tab' || !openGroup) return;
              const links = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('.oph-nav__panel-link'));
              const triggers = Array.from(document.querySelectorAll<HTMLElement>('.oph-header__nav-desktop .oph-nav__link'));
              const index = NAV_GROUPS.findIndex((group) => group.id === openGroup);
              if (!event.shiftKey && document.activeElement === links[links.length - 1]) {
                event.preventDefault();
                const next = triggers[index + 1];
                setOpenGroup(null);
                (next ?? document.querySelector<HTMLElement>('.oph-header__phone'))?.focus();
              } else if (event.shiftKey && document.activeElement === links[0]) {
                event.preventDefault();
                triggers[index]?.focus();
              }
            }}
          >
            {shownGroup ? (
              <div key={shownGroup.id} className="oph-nav__panel-card oph-container">
                <div className="oph-nav__panel-intro">
                  <span className="oph-eyebrow">{String(NAV_GROUPS.indexOf(shownGroup) + 1).padStart(2, '0')}</span>
                  <p className="oph-nav__panel-title">{t.nav[shownGroup.labelKey]}</p>
                  {shownGroup.links[0].descriptionKey ? (
                    <p className="oph-nav__panel-desc">{t.nav[shownGroup.links[0].descriptionKey]}</p>
                  ) : null}
                  <Link to={ROUTES.appointment} className="oph-nav__panel-more" tabIndex={openGroup ? 0 : -1} onClick={() => setOpenGroup(null)}>
                    {t.common.bookNow}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
                <div className="oph-nav__panel-grid">
                  {shownGroup.links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="oph-nav__panel-link"
                      tabIndex={openGroup ? 0 : -1}
                      aria-current={pathname === link.path ? 'page' : undefined}
                      onClick={() => setOpenGroup(null)}
                      onFocus={() => window.clearTimeout(closeTimer.current)}
                      onBlur={(event) => {
                        if (!headerRef.current?.contains(event.relatedTarget as Node)) scheduleClose();
                      }}
                    >
                      <strong>{t.nav[link.labelKey]}</strong>
                      {link.descriptionKey ? <span>{t.nav[link.descriptionKey]}</span> : null}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="oph-header__actions">
            <a
              className="oph-header__phone"
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              onClick={() => trackCall(phone)}
            >
              <Phone size={15} aria-hidden="true" />
              {phone}
            </a>

            <LanguageSwitcher />

            <Link to={ROUTES.account} className="oph-header__account" aria-label={t.nav.account} title={t.nav.account}>
              <CircleUserRound size={22} strokeWidth={1.5} aria-hidden="true" />
            </Link>

            <ButtonLink to={ROUTES.appointment} magnetic className="oph-header__cta" size="sm">
              <CalendarPlus size={15} aria-hidden="true" />
              {t.common.book}
            </ButtonLink>

            <button
              type="button"
              className="oph-header__burger"
              aria-label={t.nav.openMenu}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={t.nav.menu}>
        <nav aria-label={t.nav.menu}>
          {[...NAV_GROUPS].sort((a, b) => (a.id === 'patients' ? -1 : b.id === 'patients' ? 1 : 0)).map((group) => (
            <details key={group.id} className="oph-mobile-nav__group" open={group.id === 'patients'}>
              <summary className="oph-mobile-nav__title">
                {t.nav[group.labelKey]}
                <ChevronDown size={16} aria-hidden="true" />
              </summary>
              {group.links.map((link) => (
                <RouterNavLink
                  key={link.path}
                  to={link.path}
                  className="oph-mobile-nav__link"
                  onClick={() => setDrawerOpen(false)}
                >
                  {t.nav[link.labelKey]}
                </RouterNavLink>
              ))}
            </details>
          ))}

          <div className="oph-mobile-nav__group">
            <RouterNavLink to={ROUTES.account} className="oph-mobile-nav__link">
              {t.nav.account}
            </RouterNavLink>
          </div>
        </nav>

        {/* Only the booking button stays pinned to the drawer's bottom edge;
            the phone and tools follow it, so on a 320-740 phone the menu keeps
            most of the screen instead of a third of it. */}
        <div className="oph-mobile-nav__footer">
          <ButtonLink to={ROUTES.appointment} block>
            <CalendarPlus size={17} aria-hidden="true" />
            {t.common.bookNow}
          </ButtonLink>
        </div>
        <div className="oph-mobile-nav__extras">
          <Button
            variant="outline"
            block
            onClick={() => {
              trackCall(phone);
              window.location.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
            }}
          >
            <Phone size={17} aria-hidden="true" />
            {phone}
          </Button>
          <div className="oph-mobile-nav__tools">
            <LanguageSwitcher />
            <button
              type="button"
              className="oph-mobile-nav__a11y"
              onClick={() => {
                setDrawerOpen(false);
                window.dispatchEvent(new Event('oph:open-a11y'));
              }}
            >
              <Accessibility size={17} aria-hidden="true" />
              {t.a11y.open}
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
};
