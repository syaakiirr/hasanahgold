import assert from 'node:assert/strict';
import { mkdirSync, readFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
const base = process.env.TEST_URL || 'http://127.0.0.1:4173';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
 const page = await browser.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message));
 const names = ['Cincin Emas','Gelang Emas','Rantai Leher','Loket Emas','Subang Emas','Bangle Emas','Gelang Kaki Emas','Aksesori Emas'];
 const title = () => page.$eval('.cf-title', el => el.textContent);
 const selected = async (name) => page.waitForFunction(name => document.querySelector('.cf-title')?.textContent === name, {}, name);
 for(const width of [320,390,768,1440]) {
  await page.setViewport({width,height:1000}); await page.goto(`${base}/koleksi/`,{waitUntil:'networkidle0'});
  await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode()));});
  assert.equal(await page.$$eval('.cf-card', els=>els.length),8); assert.equal(await page.$$eval('h1', els=>els.length),1);
  assert.ok(await page.$eval('html',el=>el.scrollWidth<=innerWidth),`No overflow at ${width}`);
  assert.equal(await page.$$eval('canvas', els=>els.length),0);
  if(width===390 || width===1440){mkdirSync('docs/previews',{recursive:true});await page.screenshot({path:`docs/previews/collection-coverflow-${width}.png`,fullPage:true});}
 }
 for(let i=0;i<8;i++){
  await page.click(`.cf-page:nth-child(${i+1})`); await selected(names[i]);
  assert.equal(await page.$eval('.cf-page[aria-current=true]', el=>el.getAttribute('aria-label')),`Lihat ${names[i]}`);
  const url=new URL(await page.$eval('.collection-enquire',el=>el.href));assert.equal(url.pathname,'/60199089888');assert.ok(url.searchParams.get('text').includes(names[i]));
 }
 await page.click('.cf-next');await selected(names[0]); await page.click('.cf-prev'); await selected(names[7]);
 await page.focus('.cf-frame');await page.keyboard.press('ArrowRight');await selected(names[0]);
 await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await selected(names[2]);
 // Reduced motion also lets us inspect settled geometry deterministically.
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.click('.cf-page:first-child');await selected(names[0]);
 const sibling=await (await page.$('[data-card-index="1"]')).boundingBox();
 await page.mouse.click(sibling.x+sibling.width/2,sibling.y+sibling.height/2);await selected(names[1]);
 await page.click('.cf-page:first-child');
 const box=await(await page.$('.cf-frame')).boundingBox();
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
 await page.mouse.move(box.x+box.width/2-250,box.y+box.height/2,{steps:16});await page.mouse.up();
 assert.notEqual(await title(),names[0],'Drag selects another category');
 await page.goto(`${base}/koleksi/#anklets`,{waitUntil:'networkidle0'});await selected(names[6]);
 await page.evaluate(()=>{window.location.hash='pendants';});await selected(names[3]);
 await page.setViewport({width:390,height:844});await page.click('.cf-next');await selected(names[4]);
 // Real touch events exercise horizontal swipe and preserve vertical page scrolling.
 const mobile=await browser.newPage();await mobile.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
 await mobile.goto(`${base}/koleksi/`,{waitUntil:'networkidle0'});const client=await mobile.createCDPSession();
 const touch=(type,x,y)=>client.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
 await touch('touchStart',285,440);for(let x=265;x>=65;x-=20)await touch('touchMove',x,440);await touch('touchEnd',65,440);
 await mobile.waitForFunction(()=>document.querySelector('.cf-title').textContent!=='Cincin Emas');
 assert.equal(await mobile.$eval('.cf-frame',el=>getComputedStyle(el).touchAction),'pan-y');await mobile.close();
 await page.setCacheEnabled(false);await page.setRequestInterception(true);
 page.on('request',req=>req.url().endsWith('/rings.webp')?req.abort():req.continue());
 await page.reload({waitUntil:'networkidle0'});await page.waitForSelector('.cf-image-fallback');
 assert.ok(await page.$('.collection-enquire'));await page.click('.cf-page:first-child');await page.click('.cf-next');await selected(names[1]);
 const noJs=await browser.newPage();await noJs.setJavaScriptEnabled(false);await noJs.goto(`${base}/koleksi/`,{waitUntil:'networkidle0'});
 assert.equal(await noJs.$$eval('.collection-noscript a',els=>els.length),8);
 assert.ok(await noJs.$eval('.cf-card:nth-child(2)',el=>getComputedStyle(el).opacity==='1'));
 assert.ok(readFileSync('dist/koleksi/index.html','utf8').includes('Emas untuk'));
 assert.deepEqual(errors,[]);
 console.log('PASS: 8 generated images; 320/390/768/1440 layouts; all enquiry links; selection; looping; keyboard bursts; side-card click; drag; touch swipe; hash navigation; reduced motion; image failure; no-JS.');
} finally {await browser.close();}
