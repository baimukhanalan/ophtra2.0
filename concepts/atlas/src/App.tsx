import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, type Location } from 'react-router-dom';
import Lenis from 'lenis';
import { bridge } from './world/bridge';
import { Header, World } from './components/Shell';
import { Rail } from './components/Chapter';
import { titleFor } from './lib/routes';
import Home from './pages/Home';
import About from './pages/About';
import Founder from './pages/Founder';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import International from './pages/International';
import SecondOpinion from './pages/SecondOpinion';
import Consultation from './pages/Consultation';
import Booking from './pages/Booking';
import Knowledge from './pages/Knowledge';
import Article from './pages/Article';
import Science from './pages/Science';
import Experts from './pages/Experts';
import Reviews from './pages/Reviews';
import Faq from './pages/Faq';
import Contacts from './pages/Contacts';
import Account from './pages/Account';
import NotFound from './pages/NotFound';

type LenisLike = { scrollTo: (t: number, o?: object) => void };
const getLenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

function useLenis() {
  useEffect(() => {
    if (bridge.touch || bridge.reduced) return;
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95, anchors: { offset: -80 } });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);
}

function useBootHandoff() {
  useEffect(() => {
    const boot = document.getElementById('boot');
    if (!boot) return;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      boot.classList.add('is-done');
      setTimeout(() => boot.remove(), 900);
    };
    const t = setTimeout(finish, 1900);
    const un = bridge.subscribe(() => {
      if (bridge.worldReady || bridge.worldFailed) setTimeout(finish, 250);
    });
    return () => {
      clearTimeout(t);
      un();
    };
  }, []);
}

function PageRoutes({ location }: { location: Location }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/founder" element={<Founder />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:slug" element={<DoctorDetail />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:slug" element={<ServiceDetail />} />
      <Route path="/international" element={<International />} />
      <Route path="/second-opinion" element={<SecondOpinion />} />
      <Route path="/consultation" element={<Consultation />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/knowledge" element={<Knowledge />} />
      <Route path="/knowledge/:slug" element={<Article />} />
      <Route path="/science" element={<Science />} />
      <Route path="/experts" element={<Experts />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/account" element={<Account />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  useLenis();
  useBootHandoff();
  const location = useLocation();
  const [shown, setShown] = useState(location);
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const [transit, setTransit] = useState<{ n: number; title: string } | null>(null);
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (location.pathname === shown.pathname) {
      if (location.key !== shown.key) setShown(location);
      return;
    }
    const go = () => {
      setShown(location);
      window.scrollTo(0, 0);
      getLenis()?.scrollTo(0, { immediate: true, force: true });
      setPhase('enter');
    };
    if (bridge.reduced) {
      go();
      return;
    }
    setPhase('exit');
    setTransit((t) => ({ n: (t?.n ?? 0) + 1, title: titleFor(location.pathname) }));
    const t = setTimeout(go, 540);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    bridge.navigate();
    main.current?.focus({ preventScroll: true });
    const t = setTimeout(() => setPhase('idle'), 1500);
    return () => clearTimeout(t);
  }, [shown.pathname]);

  return (
    <>
      <a className="skip" href="#main">
        Перейти к содержанию
      </a>
      <World />
      <Header />
      <Rail />
      {transit && (
        <div key={transit.n} className="transit is-on" aria-hidden="true">
          Курс на
          <b>{transit.title}</b>
        </div>
      )}
      <main id="main" ref={main} tabIndex={-1} className={`page page--${phase}`} style={{ outline: 'none' }}>
        <PageRoutes location={shown} key={shown.pathname} />
      </main>
      <div className="sr-only" aria-live="polite">
        {titleFor(shown.pathname)}
      </div>
    </>
  );
}
