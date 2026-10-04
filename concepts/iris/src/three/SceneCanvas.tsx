import { useEffect, useRef } from 'react';
import { EyeScene } from './EyeScene';
import { env, journey, onFrame } from '../lib/engine';

/** Fixed, full-bleed WebGL layer behind every page. Loaded lazily. */
export default function SceneCanvas({ onReady }: { onReady?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    let scene: EyeScene;
    try {
      scene = new EyeScene(canvas, { mobile: env.touch || env.small, reduced: env.reduced });
    } catch {
      document.documentElement.classList.add('no-webgl');
      onReady?.();
      return;
    }
    let w = 0;
    let h = 0;
    const size = () => {
      const nw = canvas.clientWidth;
      const nh = canvas.clientHeight;
      // Phones: the canvas is sized to the large viewport (100lvh) so the URL
      // bar never triggers a resize; only react to real width changes.
      if (nw === w && (env.touch ? true : nh === h)) return;
      w = nw;
      h = nh;
      scene.setSize(w, h);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    let first = true;
    const off = onFrame((t, dt) => {
      const drew = scene.frame(t, dt, journey.target, journey.version);
      if (first && drew) {
        first = false;
        canvas.classList.add('is-on');
        onReady?.();
      }
    });
    return () => {
      off();
      ro.disconnect();
      scene.dispose();
    };
  }, [onReady]);

  return <canvas ref={ref} className="scene" aria-hidden="true" />;
}
