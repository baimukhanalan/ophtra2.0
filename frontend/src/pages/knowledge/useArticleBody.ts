import { useCallback, useEffect, useState } from 'react';
import { cachedArticleBody, loadArticleBody } from '@/content/pages/knowledge-articles-index';
import type { KnowledgeArticleBody } from '@/content/pages/knowledge-types';

export type BodyState =
  | { status: 'loading' }
  | { status: 'ready'; body: KnowledgeArticleBody }
  | { status: 'error' };

/**
 * Loads one article body on demand (its own chunk). Instant when the body is
 * already cached.
 *
 * `retry`: browsers memoise a failed dynamic import() for the page's
 * lifetime, so asking again would fail again. Retry therefore re-opens the
 * same article with a throw-away query (a plain reload is not used: the
 * preloader script sends reloads of deep links to the home page).
 */
export const useArticleBody = (slug: string): [BodyState, () => void] => {
  const initial = (): BodyState => {
    const cached = cachedArticleBody(slug);
    return cached ? { status: 'ready', body: cached } : { status: 'loading' };
  };
  const [state, setState] = useState<BodyState>(initial);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    const cached = cachedArticleBody(slug);
    if (cached) {
      setState({ status: 'ready', body: cached });
      return;
    }
    setState({ status: 'loading' });
    loadArticleBody(slug).then(
      (body) => alive && setState({ status: 'ready', body }),
      () => alive && setState({ status: 'error' }),
    );
    return () => {
      alive = false;
    };
  }, [slug, attempt]);

  const retry = useCallback(() => {
    const { pathname, hash } = window.location;
    window.location.assign(`${pathname}?retry=${Date.now()}${hash}`);
    setAttempt((value) => value + 1);
  }, []);
  return [state, retry];
};
