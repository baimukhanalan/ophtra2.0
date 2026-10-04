import { scene } from './scene-store';

/**
 * Two page-wide observers, attached once:
 * - `.rv` blocks come into focus when they enter the viewport (once);
 * - `[data-stage]` sections are transparent windows onto the 3D bench —
 *   while none is on screen the WebGL loop is paused.
 */
let started = false;
export const startObservers = (root: HTMLElement) => {
  if (started) return;
  started = true;
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          reveal.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  const visibleStages = new Set<Element>();
  const stages = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visibleStages.add(e.target);
        else visibleStages.delete(e.target);
      }
      scene.stageVisible = visibleStages.size > 0;
    },
    { rootMargin: '10% 0px 10% 0px' },
  );

  const scan = (node: ParentNode) => {
    node.querySelectorAll('.rv:not(.is-in)').forEach((el) => reveal.observe(el));
    node.querySelectorAll('[data-stage]').forEach((el) => stages.observe(el));
  };

  const mo = new MutationObserver((muts) => {
    scene.anchorsDirty = true;
    let removed = false;
    for (const m of muts) {
      m.addedNodes.forEach((n) => {
        if (n instanceof HTMLElement) {
          if (n.matches('.rv:not(.is-in)')) reveal.observe(n);
          if (n.matches('[data-stage]')) stages.observe(n);
          scan(n);
        }
      });
      if (m.removedNodes.length) removed = true;
    }
    if (removed) {
      for (const el of [...visibleStages]) if (!el.isConnected) visibleStages.delete(el);
      scene.stageVisible = visibleStages.size > 0;
    }
  });
  mo.observe(root, { childList: true, subtree: true });
  scan(root);
};
