import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const results = [];
const baseUrl = process.env.TEST_URL || 'http://127.0.0.1:4173/';

try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [390, 1440]) {
    await page.setViewport({ width, height: 900 });
    await page.goto(new URL('/katalog/', baseUrl).href, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.title(), 'Katalog Barang Kemas | Hasanah Gold');
    assert.equal(await page.$$eval('.farline-print', prints => prints.length), 8);
    assert.ok(await page.$('#main-nav a[href="/katalog/"]'));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    mkdirSync('docs/previews', { recursive: true });
    await page.screenshot({ path: `docs/previews/farline-catalogue-${width}.png` });

    const firstPrint = '.farline-print:first-child button';
    await page.$eval(firstPrint, button => button.click());
    await page.waitForFunction(() => document.querySelector('.farline-lightbox').open);
    assert.equal(await page.$eval('#farline-detail-title', element => element.textContent), 'Cincin Emas');
    assert.equal(await page.$eval('body', element => element.style.overflow), 'hidden');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.$eval('#farline-detail-title', element => element.textContent), 'Gelang Emas');
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.$eval('#farline-detail-title', element => element.textContent), 'Cincin Emas');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('.farline-lightbox').open);
    await page.waitForFunction(selector => document.activeElement === document.querySelector(selector), {}, firstPrint);
    assert.equal(await page.$eval('body', element => element.style.overflow), '');

    await page.click('.farline-filters button:nth-child(3)');
    await page.waitForFunction(() => document.querySelectorAll('.farline-print').length === 3);
    assert.equal(await page.$eval('.farline-filters button:nth-child(3)', element => element.getAttribute('aria-pressed')), 'true');
    await page.$eval('.farline-print:first-child button', button => button.click());
    await page.waitForFunction(() => document.querySelector('.farline-lightbox').open);
    assert.equal(await page.$eval('#farline-detail-title', element => element.textContent), 'Gelang Emas');
    await page.keyboard.press('Escape');

    await page.click('.farline-filters button:nth-child(2)');
    await page.waitForFunction(() => document.querySelectorAll('.farline-print').length === 1);
    await page.$eval('.farline-print button', button => button.click());
    await page.waitForFunction(() => document.querySelector('.farline-lightbox').open);
    assert.equal(await page.$eval('.farline-lightbox button[aria-label="Gambar seterusnya"]', element => element.disabled), true);
    await page.keyboard.press('Escape');
    await page.click('.farline-filters button:first-child');
    await page.waitForFunction(() => document.querySelectorAll('.farline-print').length === 8);

    if (width > 799) {
      const before = await page.$eval('.farline-plane', element => getComputedStyle(element).transform);
      const stage = await page.$('.farline-stage');
      const box = await stage.boundingBox();
      await page.mouse.move(box.x + box.width * .1, box.y + box.height * .95);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * .15, box.y + box.height * .9);
      await page.mouse.up();
      await page.waitForFunction(previous => getComputedStyle(document.querySelector('.farline-plane')).transform !== previous, {}, before);
      await page.click('.farline-zoom button:last-child');
      await page.waitForFunction(() => document.querySelector('.farline-zoom span').textContent === '110%');
    }
    results.push(`PASS ${width}px: Farline prints, filters, lightbox, keyboard navigation, focus recovery${width > 799 ? ', drag and zoom' : ''}`);
  }
  const homepage = await browser.newPage();
  await homepage.goto(baseUrl, { waitUntil: 'networkidle0' });
  assert.equal(await homepage.$$eval('.ed-product', elements => elements.length), 4);
  assert.equal(await homepage.$('.farline-catalogue'), null);
  results.push('PASS homepage keeps the four-card collection gallery');
  assert.deepEqual(errors, []);
  mkdirSync('.qa', { recursive: true });
  writeFileSync('.qa/visual-component-results.txt', results.join('\n'));
  console.log(results.join('\n'));
} finally { await browser.close(); }
