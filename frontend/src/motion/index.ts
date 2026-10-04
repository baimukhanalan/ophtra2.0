export {
  clamp,
  getScrollState,
  invalidateScroll,
  isTouch,
  mapRange,
  onScroll,
  prefersReducedMotion,
  TOUCH_QUERY,
  type ScrollState,
} from './scrollController';

export { useReveal, useStagger, type RevealOptions } from './useReveal';

export { useLoopPause } from './useLoopPause';

export {
  mergeRefs,
  NATIVE_HSCROLL_QUERY,
  useAutoRail,
  useCounter,
  useHorizontalScroll,
  useMagnetic,
  useParallax,
  useRipple,
  useScrollScene,
  useTimelineProgress,
  type SceneState,
} from './hooks';

export {
  AutoRail,
  Counter,
  HorizontalScroll,
  ImageReveal,
  Marquee,
  PremiumCursor,
  Reveal,
  RotatingWord,
  ScrollProgress,
  SplitText,
  Stagger,
  Timeline,
  TimelineItem,
  type RevealProps,
} from './components';

export { RecordOrbit, type OrbitCard } from './scenes';

export { ClipReveal, ScrollFx, StackCards, StickyStory, TextFill, useProgressVars } from './story';
