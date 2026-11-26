import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const html = await readFile('dist/index.html', 'utf8');
  const shell = '<div id="root"></div>';
  if (!html.includes(shell)) throw new Error('Missing root element in production HTML.');
  await writeFile('dist/index.html', html.replace(shell, () => `<div id="root">${renderToString(createElement(App))}</div>`));
  const collectionHtml = html
    .replace(/<title>.*?<\/title>/, '<title>Koleksi Emas | Hasanah Gold</title>')
    .replace(/(<meta name="description" content=")[^"]*/, '$1Terokai lapan kategori barang kemas Hasanah Gold. Cincin, gelang, rantai, loket, subang, bangle, gelang kaki dan aksesori emas.')
    .replace(/(<meta property="og:title" content=")[^"]*/, '$1Koleksi Emas | Hasanah Gold')
    .replace(shell, () => `<div id="root">${renderToString(createElement(App, { path: '/koleksi/' }))}</div>`);
  await mkdir('dist/koleksi', { recursive: true });
  await writeFile('dist/koleksi/index.html', collectionHtml);
  const catalogueHtml = html
    .replace(/<title>.*?<\/title>/, '<title>Katalog Barang Kemas | Hasanah Gold</title>')
    .replace(/(<meta name="description" content=")[^"]*/, '$1Lihat galeri lapan kategori barang kemas Hasanah Gold. Tapis kategori, lihat gambar besar dan tanya stok terkini.')
    .replace(/(<meta property="og:title" content=")[^"]*/, '$1Katalog Barang Kemas | Hasanah Gold')
    .replace(shell, () => `<div id="root">${renderToString(createElement(App, { path: '/katalog/' }))}</div>`);
  await mkdir('dist/katalog', { recursive: true });
  await writeFile('dist/katalog/index.html', catalogueHtml);
  const aboutHtml = html
    .replace(/<title>.*?<\/title>/, '<title>Tentang Kami | Hasanah Gold</title>')
    .replace(/(<meta name="description" content=")[^"]*/, '$1Hasanah Gold, kedai barang kemas emas di Dataran Panji, Jalan Panji Alam, 21100 Kuala Terengganu. Singgah ke kedai atau tanya stok di WhatsApp.')
    .replace(/(<meta property="og:title" content=")[^"]*/, '$1Tentang Kami | Hasanah Gold')
    .replace(shell, () => `<div id="root">${renderToString(createElement(App, { path: '/tentang/' }))}</div>`);
  await mkdir('dist/tentang', { recursive: true });
  await writeFile('dist/tentang/index.html', aboutHtml);
  console.log('Prerendered landing, collection, catalogue and about pages.');
} finally { await server.close(); }

