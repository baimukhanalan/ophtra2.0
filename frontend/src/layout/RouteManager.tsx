import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { invalidateScroll, prefersReducedMotion } from '@/motion';
import { trackPageView } from '@/services/analytics';
import { useAnnouncer } from '@/services/accessibility';

/**
 * Route side effects: scroll restoration, screen-reader announcement,
 * analytics page view, and re-measuring the scroll controller once the new
 * page has laid out.
 */
export const RouteManager = () => {
  const { pathname, hash } = useLocation();
  const announce = useAnnouncer();

  useEffect(() => {
    if (hash) {
      // Let the target render before scrolling to it.
      const timer = window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'start',
        });
      }, 60);
      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return undefined;
  }, [pathname, hash]);

  useEffect(() => {
    // document.title is set by <Seo> in the same commit; read it on the next
    // frame so the announcement and the analytics hit carry the real title.
    const frame = requestAnimationFrame(() => {
      announce(document.title);
      trackPageView(pathname, document.title);
      invalidateScroll();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, announce]);

  return null;
};
