/**
 * Seasonal offers.
 *
 * One dataset per module. A shared "editorial" barrel meant that a page
 * wanting the news teaser also downloaded articles, vacancies and the legal
 * texts — 27 kB gzipped on the landing page for a three-card block. Keep these
 * modules single-purpose so the bundler ships each dataset only with the routes
 * that actually read it.
 */

import promotionsJson from '@data/promotions.json';
import type { Promotion } from '@/types';

export const promotions = promotionsJson as unknown as Promotion[];

export const activePromotions = (today = new Date().toISOString().slice(0, 10)): Promotion[] =>
  promotions.filter((promo) => promo.published && promo.validTo >= today);
