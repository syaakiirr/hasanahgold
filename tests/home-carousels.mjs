import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const page=await browser.newPage();await page.setViewport({width:1440,height:900});await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle0'});
 for(const id of ['products','inspiration']){
  await page.$eval(`#${id}`,el=>el.scrollIntoView({behavior:'instant'}));
  const next=`#${id} button[aria-label="Koleksi seterusnya"]`; const prev=`#${id} button[aria-label="Koleksi sebelumnya"]`;
  await page.waitForSelector(next);assert.ok(await page.$eval(prev,el=>el.disabled));await page.click(next);await page.waitForFunction(s=>!document.querySelector(s).disabled,{},prev);
  await page.focus(`#${id} .collection-carousel`);await page.keyboard.press('ArrowLeft');await page.waitForFunction(s=>document.querySelector(s).disabled,{},prev);
 }
 await page.setViewport({width:390,height:844});await page.waitForFunction(()=>[...document.querySelectorAll('.collection-carousel')].every(el=>el.dataset.supported==='false'));
 assert.equal(await page.$$eval('.carousel-slide[inert]',els=>els.length),0);
 console.log('PASS both original carousels: controls, keyboard, mobile grid and accessible links.');
}finally{await browser.close();}
