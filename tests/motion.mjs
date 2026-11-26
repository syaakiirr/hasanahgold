import assert from 'node:assert/strict';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
const executablePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((path) => path && existsSync(path));
assert.ok(executablePath, 'Set CHROME_PATH to Chrome or Chromium.');
const browser = await puppeteer.launch({ executablePath, headless: true });
const results = [];
const url = process.env.TEST_URL || 'http://127.0.0.1:4173/';
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => {
    window.motionCalls = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      window.motionCalls.push({ className: this.getAttribute('class'), text: this.hasAttribute('data-text-reveal'), frames: args[0] });
      return animate.apply(this, args);
    };
  });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelector('#collections').scrollIntoView({ behavior: 'instant' }));
  await page.waitForFunction(() => window.motionCalls.some((call) => call.text));
  await page.waitForFunction(() => window.motionCalls.filter(call => call.text).length === 4);
  const count = await page.evaluate(() => window.motionCalls.filter((call) => call.text).length);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.evaluate(() => document.querySelector('#collections').scrollIntoView({ behavior: 'instant' }));
  assert.equal(await page.evaluate(() => window.motionCalls.filter((call) => call.text).length), count);
  results.push('PASS hero and collection text reveals run once');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluate(() => document.querySelector('#faq').scrollIntoView({ behavior: 'instant' }));
  assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
  results.push('PASS reduced motion stops animations and leaves text visible');
  const fallback = await browser.newPage();
  await fallback.evaluateOnNewDocument(() => { Element.prototype.animate = undefined; window.IntersectionObserver = undefined; });
  await fallback.goto(url, { waitUntil: 'networkidle0' });
  assert.equal(await fallback.$eval('.ed-hero-copy', (el) => getComputedStyle(el).opacity), '1');
  assert.equal(await fallback.$eval('.ed-product', (el) => getComputedStyle(el).opacity), '1');
  assert.equal(await fallback.$$eval('.ed-product-title[href]', (els) => els.length), 4);
  results.push('PASS unavailable animation APIs leave content and all product links accessible');
  const staticPage = await browser.newPage();
  await staticPage.setJavaScriptEnabled(false);
  await staticPage.goto(url, { waitUntil: 'networkidle0' });
  assert.equal(await staticPage.$$eval('h1', (els) => els.length), 1, 'Run this suite against the production preview for no-JavaScript verification.');
  assert.equal(await staticPage.$$eval('.ed-product', (els) => els.length), 4);
  assert.ok(await staticPage.$('a[href^="https://wa.me/60199089888"]'));
  await staticPage.click('.ed-faq summary');
  assert.ok(await staticPage.$eval('.ed-faq details', (el) => el.open));
  results.push('PASS prerendered production page provides headline, four categories, working FAQ and enquiry links without JavaScript');
  assert.deepEqual(errors, []);
  results.push('PASS no browser runtime/hydration errors');
  mkdirSync('.qa', { recursive: true });
  writeFileSync('.qa/motion-results.txt', results.join('\n'));
  console.log(results.join('\n'));
} finally { await browser.close(); }

