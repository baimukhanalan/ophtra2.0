/**
 * Frequently asked questions.
 *
 * One dataset per module. A shared "editorial" barrel meant that a page
 * wanting the news teaser also downloaded articles, vacancies and the legal
 * texts — 27 kB gzipped on the landing page for a three-card block. Keep these
 * modules single-purpose so the bundler ships each dataset only with the routes
 * that actually read it.
 */

import faqJson from '@data/faq.json';
import type { FaqItem } from '@/types';

export const faq = faqJson as unknown as FaqItem[];
