import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { business, mapsUrl, navigation, whatsappUrl } from '../src/data/business.ts';
import { jewellery } from '../src/data/jewellery.ts';
import { collections, products } from '../src/data/products.ts';

test('general WhatsApp enquiry preserves the correct number and editable message', () => {
  const url = new URL(whatsappUrl());
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, '/60199089888');
  assert.equal(url.searchParams.get('text'), business.generalMessage);
});

test('category messages are encoded safely and do not claim sample stock', () => {
  const subject = 'Cincin & loket / hadiah?';
  const url = new URL(whatsappUrl(subject));
  assert.equal([...url.searchParams].length, 1);
  assert.ok(url.searchParams.get('text')?.includes(subject));
  assert.ok(url.searchParams.get('text')?.includes('gambar inspirasi'));
});

test('map query retains the exact business address', () => {
  assert.equal(new URL(mapsUrl).searchParams.get('query'), `${business.name}, ${business.address}`);
});

test('all five categories have local, explicitly temporary product imagery', () => {
  assert.equal(collections.length, 5);
  assert.equal(new Set(collections.map((item) => item.id)).size, 5);
  assert.equal(products.length, 5);
  for (const product of products) {
    assert.equal(product.isPlaceholder, true);
    assert.ok(existsSync(`public${product.image}`));
    assert.ok(collections.some((item) => item.id === product.category));
  }
  assert.equal(new Set(navigation.map(([id]) => id)).size, navigation.length);
});

test('product enquiry includes product code and auto-fills WhatsApp message', () => {
  assert.equal(new Set(jewellery.map((item) => item.code)).size, jewellery.length);
  const earrings = jewellery.find((item) => item.id === 'earrings');
  assert.equal(earrings?.code, '#C8274');
  const url = new URL(whatsappUrl('Subang Emas', '#C8274'));
  const text = url.searchParams.get('text') ?? '';
  assert.ok(text.includes('Assalam Hasanah Gold, saya nak bertanya tentang produk #C8274'));
  assert.ok(text.includes('Subang Emas'));
});
