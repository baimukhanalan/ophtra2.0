/**
 * Privacy policy and terms of use.
 *
 * One dataset per module. A shared "editorial" barrel meant that a page
 * wanting the news teaser also downloaded articles, vacancies and the legal
 * texts — 27 kB gzipped on the landing page for a three-card block. Keep these
 * modules single-purpose so the bundler ships each dataset only with the routes
 * that actually read it.
 */

import legalJson from '@data/legal.json';
import type { LegalData } from '@/types';

export const legal = legalJson as unknown as LegalData;
