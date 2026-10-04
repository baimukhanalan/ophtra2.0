import { R } from '../routes';

/** Production copy links to routes this concept folds into other pages. */
const MAP: Record<string, string> = {
  '/diagnostics': R.services + '?d=diagnostics',
  '/treatment': R.services + '?d=treatment',
  '/laser-vision-correction': R.services + '?d=laser',
  '/cataract-surgery': R.services + '?d=cataract',
  '/pediatric-ophthalmology': R.services + '?d=pediatric',
  '/optics': R.services + '?d=optical',
  '/departments': R.services,
  '/management': R.doctors,
  '/academy': R.science + '#academy',
  '/media': R.science + '#media',
  '/partnerships': R.experts,
  '/appointment': R.booking,
  '/programs': R.services + '#programs',
};

export const mapLink = (to: string) => MAP[to] ?? to;
