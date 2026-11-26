import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
try {
  const { default: BrandFilm } = await server.ssrLoadModule('/src/components/BrandFilm.tsx');
  const pending = renderToStaticMarkup(createElement(BrandFilm));
  assert.ok(pending.includes('/images/coastal-film-poster.webp'));
  assert.ok(!pending.includes('<video'), 'No missing video request before the generated clip exists.');
  assert.ok(!pending.includes('<button'), 'Do not show nonfunctional playback controls.');
  const ready = renderToStaticMarkup(createElement(BrandFilm, { src: '/videos/test.mp4' }));
  assert.ok(ready.includes('src="/videos/test.mp4"'));
  for (const attribute of ['muted=""', 'loop=""', 'playsInline=""', 'preload="none"']) assert.ok(ready.includes(attribute), attribute);
  assert.ok(!ready.includes('<button'), 'Background film has no playback button.');
  assert.ok(!ready.includes('Visual AI untuk inspirasi'), 'Removed film caption stays absent.');
  console.log('PASS pending poster has no broken video request or controls; configured film renders muted inline loop without playback controls.');
} finally { await server.close(); }
