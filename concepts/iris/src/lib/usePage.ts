import { useEffect } from 'react';
import { refreshMarkers, scanReveals, setFallbackStation, setStationOverride } from './engine';
import type { StationId } from './stations';

/** Per-page setup: document title, fallback station, marker + reveal scan after mount. */
export function usePage(title: string, fallback: StationId = 'gaze') {
  useEffect(() => {
    document.title = `${title} · IRIS · Офтальмологический центр доктора Кулмаганбетова`;
    setFallbackStation(fallback);
    setStationOverride(null);
    const id = requestAnimationFrame(() => {
      refreshMarkers();
      scanReveals();
    });
    const t = setTimeout(() => {
      refreshMarkers();
      scanReveals();
    }, 400);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [title, fallback]);
}
