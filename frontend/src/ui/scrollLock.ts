/**
 * Page scroll lock for overlays (drawer, modal, assistant sheet).
 *
 * The lock goes on the root element, not on <body>. `base.css` gives both
 * html and body `overflow-x: clip`; once the root's overflow is not `visible`
 * the body's `overflow` is no longer propagated to the viewport, so a body
 * lock turned <body> into its own clipping box instead: the viewport kept
 * scrolling under the finger and the sticky header, now stuck to <body>,
 * jumped off-screen while the overlay was open. See `[data-scroll-locked]`
 * in base.css.
 *
 * Reference-counted so a modal opened from the drawer (or the assistant sheet
 * over either) releases the page only when the last overlay closes.
 */
let locks = 0;
let savedPaddingRight = '';

export const lockPageScroll = (): (() => void) => {
  if (typeof document === 'undefined') return () => undefined;
  const root = document.documentElement;
  const { body } = document;

  if (locks === 0) {
    // Desktop: the scrollbar disappears with the lock; keep the content from
    // shifting sideways by the width it leaves behind.
    const scrollbar = window.innerWidth - root.clientWidth;
    savedPaddingRight = body.style.paddingRight;
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    root.setAttribute('data-scroll-locked', '');
  }
  locks += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks > 0) return;
    root.removeAttribute('data-scroll-locked');
    body.style.paddingRight = savedPaddingRight;
  };
};
