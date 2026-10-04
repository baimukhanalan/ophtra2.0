import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';

/**
 * Preload the landing route's chunks from the HTML.
 *
 * The home page is lazily routed like every other page, so the browser only
 * discovers its chunk after the entry bundle has downloaded, parsed and run —
 * a serial round trip in front of the first meaningful paint, on the one route
 * that is guaranteed to be needed. These links let it start in parallel with
 * the entry bundle instead. Emitted at bundle time so the content hashes stay
 * correct.
 */
const preloadLandingRoute = (): Plugin => ({
  name: 'ophtra-preload-landing-route',
  apply: 'build',
  enforce: 'post',
  // Runs in generateBundle rather than transformIndexHtml because the chunk
  // hashes only exist once the bundle is generated, and the html transform
  // hook has already run by then.
  generateBundle(_options, bundle) {
    const home = Object.values(bundle).find(
      (chunk) => chunk.type === 'chunk' && chunk.name === 'HomePage',
    );
    const html = bundle['index.html'];
    if (home?.type !== 'chunk' || !html || html.type !== 'asset') return;

    const existing = String(html.source);
    // The chunk plus its own static imports; without them the waterfall just
    // moves one level down. Vite already preloads the entry's imports, so skip
    // anything the HTML lists.
    const links = [home.fileName, ...home.imports]
      .filter((file) => !existing.includes(file))
      .map((file) => `    <link rel="modulepreload" crossorigin href="/${file}" />`)
      .join('\n');

    if (links) html.source = existing.replace('</head>', `${links}\n  </head>`);
  },
});

/**
 * OPHTRA build configuration.
 *
 * Performance targets (docs/PERFORMANCE.md):
 *  - first meaningful paint under 2 seconds on 4G
 *  - Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
 *
 * Route-level code splitting lives in src/app/routes.tsx (React.lazy),
 * vendor splitting in the manualChunks map below.
 */
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadLandingRoute()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Canonical seed dataset, shared with the backend demo database so the
      // catalogue never diverges between the API and the site fallback.
      '@data': path.resolve(__dirname, '../data'),
      // Domain logic shared with the API (assistant engine, booking rules).
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  build: {
    target: ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14'],
    reportCompressedSize: false,
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-router')) return 'router-vendor';
          if (/[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react-vendor';
          if (id.includes('lucide-react')) return 'icons-vendor';
          if (id.includes('motion')) return 'motion-vendor';
        },
      },
    },
  },
  server: {
    port: 5173,
    fs: { allow: [path.resolve(__dirname, '..')] },
    hmr: process.env.DISABLE_HMR !== 'true',
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
