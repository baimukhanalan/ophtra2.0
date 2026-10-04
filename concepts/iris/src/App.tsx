import { lazy, Suspense, useCallback, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { NavProvider } from './lib/nav';
import { startEngine } from './lib/engine';
import { Footer, Header } from './components/Layout';
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

const SceneCanvas = lazy(() => import('./three/SceneCanvas'));

startEngine();

export default function App() {
  const onReady = useCallback(() => {
    document.getElementById('boot')?.classList.add('is-done');
  }, []);
  useEffect(() => {
    // The designed loader never outstays 2 s, even on a slow GPU.
    const t = setTimeout(onReady, 1900);
    return () => clearTimeout(t);
  }, [onReady]);

  return (
    <NavProvider>
      <a href="#main" className="skip">
        К содержанию
      </a>
      <Suspense fallback={null}>
        <SceneCanvas onReady={onReady} />
      </Suspense>
      <div className="scrim" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="app">
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dr-kulmaganbetov" element={<Founder />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:slug" element={<DoctorDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/international-patients" element={<International />} />
            <Route path="/second-opinion" element={<SecondOpinion />} />
            <Route path="/online-consultation" element={<Consultation />} />
            <Route path="/appointment" element={<Booking />} />
            <Route path="/knowledge-base" element={<Knowledge />} />
            <Route path="/knowledge-base/:slug" element={<Article />} />
            <Route path="/science" element={<Science />} />
            <Route path="/global-experts" element={<Experts />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </NavProvider>
  );
}
