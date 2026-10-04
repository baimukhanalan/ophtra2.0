/**
 * Patient-education articles.
 *
 * One dataset per module. A shared "editorial" barrel meant that a page
 * wanting the news teaser also downloaded articles, vacancies and the legal
 * texts — 27 kB gzipped on the landing page for a three-card block. Keep these
 * modules single-purpose so the bundler ships each dataset only with the routes
 * that actually read it.
 */

import articlesJson from '@data/articles.json';
import type { Article } from '@/types';

export const articles = articlesJson as unknown as Article[];

export const publishedArticles = (): Article[] =>
  articles.filter((entry) => entry.published).sort((a, b) => b.date.localeCompare(a.date));
