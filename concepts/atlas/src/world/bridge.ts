/**
 * Tiny, dependency-free link between the React tree and the lazily loaded
 * three.js world. Pages register chapters (DOM element + shot id); the world
 * reads them every frame. Nothing here imports three.
 */
export interface ChapterReg {
  el: HTMLElement;
  shot: string;
  /** Absolute document offset, refreshed by the world on resize. */
  top: number;
}

type Listener = () => void;

const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

export const bridge = {
  chapters: [] as ChapterReg[],
  chaptersVersion: 0,
  /** Incremented on every route change; the world starts a camera flight. */
  navToken: 0,
  /** Overrides (e.g. booking step, selected star) merged into the current shot. */
  override: null as null | { shot?: string; fx?: Record<string, number> },
  overrideVersion: 0,
  reduced: mq ? mq.matches : false,
  touch: typeof window !== 'undefined' ? window.matchMedia('(hover: none), (pointer: coarse)').matches : false,
  worldReady: false,
  worldFailed: false,
  listeners: new Set<Listener>(),

  register(el: HTMLElement, shot: string): () => void {
    const reg: ChapterReg = { el, shot, top: 0 };
    this.chapters.push(reg);
    this.sortChapters();
    this.chaptersVersion++;
    return () => {
      const i = this.chapters.indexOf(reg);
      if (i >= 0) this.chapters.splice(i, 1);
      this.chaptersVersion++;
    };
  },
  update(el: HTMLElement, shot: string) {
    const reg = this.chapters.find((c) => c.el === el);
    if (reg && reg.shot !== shot) {
      reg.shot = shot;
      this.chaptersVersion++;
    }
  },
  sortChapters() {
    this.chapters.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  },
  setOverride(o: null | { shot?: string; fx?: Record<string, number> }) {
    this.override = o;
    this.overrideVersion++;
  },
  navigate() {
    this.navToken++;
  },
  ready() {
    this.worldReady = true;
    this.listeners.forEach((l) => l());
  },
  fail() {
    this.worldFailed = true;
    this.listeners.forEach((l) => l());
  },
  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  },
};

mq?.addEventListener('change', (e) => {
  bridge.reduced = e.matches;
});
