import { build } from 'esbuild';
import { cp, mkdir, rm } from 'node:fs/promises';

const ROOT = new URL('./', import.meta.url);
const DIST = new URL('./dist/', import.meta.url);

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

await cp(new URL('./assets', ROOT), new URL('./assets', DIST), { recursive: true });
await cp(new URL('./styles.css', ROOT), new URL('./styles.css', DIST));
await cp(new URL('./index.html', ROOT), new URL('./index.html', DIST));

await build({
  entryPoints: ['app.jsx', 'tweaks-panel.jsx'],
  outdir: 'dist',
  bundle: false,
  loader: { '.jsx': 'jsx' },
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  target: ['es2020'],
  minify: true,
  sourcemap: false,
  legalComments: 'none',
  logLevel: 'info',
});

console.log('build complete → dist/');
