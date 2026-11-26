import assert from 'node:assert/strict';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
const executablePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((path) => path && existsSync(path));
assert.ok(executablePath, 'Set CHROME_PATH to an installed Chrome or Chromium browser.');
const browser = await puppeteer.launch({ executablePath, headless: true });
const results = [];
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const width of [320, 360, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewport({ width, height: 900 });
    await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.$eval('html', (el) => el.scrollWidth <= window.innerWidth), true, `Overflow at ${width}`);
    assert.equal(await page.$$eval('h1', (els) => els.length), 1);
    assert.equal(await page.$$eval('.ed-product', (els) => els.length), 4);
    assert.equal(await page.$$eval('.products-section', els => els.length), 2);
    assert.equal(await page.$$eval('.product', els => els.length), 10);
    assert.ok(await page.$('.brand-section .brand-copy'));
    assert.ok(await page.$('.visit-grid'));
    assert.ok(await page.$('.contact-grid'));
    assert.ok(await page.$eval('h1', el => getComputedStyle(el).fontFamily.length > 0));
    assert.equal(await page.$$eval('[id]', els => new Set(els.map(el => el.id)).size === els.length), true);
    assert.ok(await page.$('footer a[href="mailto:hasanahgold78@gmail.com"]'));
    assert.ok(await page.$('footer a[href="https://www.instagram.com/hasanahgold78/"]'));
    assert.ok((await page.$eval('.ed-hero-actions a[href^="https://wa.me/"]', (el) => el.href)).startsWith('https://wa.me/60199089888'));
    if (width < 1180) {
      await page.click('.menu-toggle');
      assert.equal(await page.$eval('.menu-toggle', (el) => el.getAttribute('aria-expanded')), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await page.$eval('.menu-toggle', (el) => el.getAttribute('aria-expanded')), 'false');
      assert.equal(await page.$eval('.menu-toggle', (el) => document.activeElement === el), true);
      assert.equal(await page.$eval('#main-nav', (el) => el.inert), true);
      await page.click('.menu-toggle');
      await page.click('#main-nav a');
      assert.equal(await page.$eval('.menu-toggle', (el) => el.getAttribute('aria-expanded')), 'false');
    }
    const links = await page.$$eval('a', (els) => els.map((el) => ({ href: el.getAttribute('href'), target: el.target, rel: el.rel })));
    for (const link of links) {
      assert.ok(link.href && link.href !== '#');
      if (link.href.startsWith('#')) assert.ok(await page.$(link.href), `Missing destination ${link.href}`);
      if (link.href.startsWith('https://wa.me/')) {
        const url = new URL(link.href);
        assert.equal(url.pathname, '/60199089888');
        assert.ok(url.searchParams.get('text'));
        if (link.target === '_blank') assert.ok(link.rel.includes('noopener'));
      }
    }
    await page.evaluate(async () => { for (const image of document.images) image.loading = 'eager'; await Promise.all([...document.images].map((image) => image.decode())); });
    assert.equal(await page.$$eval('img', (els) => els.every((el) => el.complete && el.naturalWidth > 0 && (el.alt.length > 0 || (el.hasAttribute('alt') && el.closest('[aria-hidden="true"]'))))), true);
    results.push(`PASS ${width}px: no overflow, images, anchors, four featured categories, business links${width < 1180 ? ', menu/Escape/focus/inert' : ''}`);
  }
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.click('.search-toggle');
  await page.waitForFunction(() => document.querySelector('#collection-search').open && document.activeElement.id === 'collection-query');
  await page.type('#collection-query', 'bracelets');
  assert.equal(await page.$$eval('.search-result', (els) => els.length), 1);
  assert.ok((await page.$eval('.search-result', (el) => el.textContent)).includes('Gelang'));
  await page.type('#collection-query', ' nonexistent');
  assert.equal(await page.$$eval('.search-result', (els) => els.length), 0);
  assert.ok((await page.$eval('.search-count', (el) => el.textContent)).includes('Tiada kategori'));
  await page.keyboard.press('Escape');
  assert.equal(await page.$eval('#collection-query', (el) => el.value), '');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('#collection-search').open && document.activeElement === document.querySelector('.search-toggle'));
  results.push('PASS native search dialog autofocus, bilingual category filtering, empty state, Escape and focus restoration');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  assert.equal(await page.$eval('html', (el) => getComputedStyle(el).scrollBehavior), 'auto');
  await page.setRequestInterception(true);
  page.on('request', (request) => request.url().endsWith('/images/editorial/hero-worn-gold.webp') ? request.abort() : request.continue());
  await page.setCacheEnabled(false);
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForSelector('.ed-hero-portrait .image-fallback');
  results.push('PASS failed-image fallback and reduced-motion preference');
  assert.deepEqual(errors, []);
  mkdirSync('.qa', { recursive: true });
  writeFileSync('.qa/browser-results.txt', results.join('\n'));
  console.log(results.join('\n'));
} finally { await browser.close(); }

