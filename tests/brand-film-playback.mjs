import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewport({ width, height: 900 });
    await page.goto(process.env.TEST_URL || 'http://127.0.0.1:4173/', { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.querySelector('#about').scrollIntoView({ behavior: 'instant' }));
    await page.waitForFunction(() => { const v = document.querySelector('.brand-film video'); return v && !v.paused && v.currentTime > .2; });
    assert.equal(await page.$eval('.brand-film video', (v) => v.duration), 8);
    assert.equal(await page.$('.brand-film-toggle'), null);
    assert.equal(await page.$('.brand-film-note'), null);
    assert.equal(await page.$('.hero-pause'), null);
    await page.$eval('.brand-film video', (v) => { v.currentTime = 7.9; });
    await page.waitForFunction(() => document.querySelector('.brand-film video').currentTime < 2);
    await page.screenshot({ path: `docs/previews/brand-film-${width}.png` });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForFunction(() => document.querySelector('.brand-film video').paused);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluate(() => document.querySelector('#about').scrollIntoView({ behavior: 'instant' }));
    await new Promise((resolve) => setTimeout(resolve, 300));
    assert.ok(await page.$eval('.brand-film video', (v) => v.paused));
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.waitForFunction(() => !document.querySelector('.brand-film video').paused);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.$eval('.brand-film video', (v) => v.dispatchEvent(new Event('error')));
    await page.waitForFunction(() => !document.querySelector('.brand-film video'));
    assert.equal(await page.$('.brand-film-toggle'), null);
    assert.ok(await page.$eval('.brand-film img', (img) => img.complete && img.naturalWidth > 0));
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: autoplay without buttons, loop, offscreen pause, reduced motion, resumed autoplay, fallback and overflow.`);
    await page.close();
  }
} finally { await browser.close(); }
