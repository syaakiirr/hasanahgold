import { X, Menu, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { business, navigation, navigationHref } from '../data/business';
import { jewellery as collections } from '../data/jewellery';

export function Brand() {
  return <a className="brand" href="/#home" aria-label={`${business.name}, utama`}><img src="/images/logo/hasanah-gold.svg" width="268" height="88" alt={business.name} /></a>;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wideScreen, setWideScreen] = useState(true);
  const [query, setQuery] = useState('');
  const toggle = useRef<HTMLButtonElement>(null);
  const searchToggle = useRef<HTMLButtonElement>(null);
  const searchDialog = useRef<HTMLDialogElement>(null);
  const header = useRef<HTMLElement>(null);
  const matches = collections.filter((category) => `${category.name} ${category.english}`.toLocaleLowerCase('ms').includes(query.trim().toLocaleLowerCase('ms')));

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 16);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    function close(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
    }
    function outside(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    }
    const wide = window.matchMedia('(min-width: 1180px)');
    const resize = () => { setWideScreen(wide.matches); if (wide.matches) setOpen(false); };
    resize();
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    wide.addEventListener('change', resize);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', outside);
      wide.removeEventListener('change', resize);
    };
  }, [open]);

  return <header className={scrolled ? 'site-header is-scrolled' : 'site-header'} ref={header}>
    <div className="container header-inner">
      <Brand />
      <div className="header-actions">
        <button className="menu-toggle" type="button" ref={toggle} aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}><span aria-hidden="true">{open ? <X size={24} /> : <Menu size={24} />}</span></button>
        <button className="search-toggle" type="button" ref={searchToggle} aria-label="Cari koleksi" aria-haspopup="dialog" aria-controls="collection-search" onClick={() => { setOpen(false); setQuery(''); searchDialog.current?.showModal(); }}><Search size={24} aria-hidden="true" /></button>
      </div>
      <nav id="main-nav" aria-label="Navigasi utama" inert={!open && !wideScreen} className={open ? 'main-nav is-open' : 'main-nav'} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== toggle.current) setOpen(false); }}>
        {navigation.map(([id, label]) => <a href={navigationHref(id)} key={id} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
    </div>
    <dialog id="collection-search" className="search-dialog" ref={searchDialog} aria-labelledby="search-title" onClose={() => searchToggle.current?.focus()} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
    }}>
      <div className="search-heading"><h2 id="search-title">Cari koleksi</h2><button className="search-close" type="button" aria-label="Tutup carian" onClick={() => searchDialog.current?.close()}><X size={24} aria-hidden="true" /></button></div>
      <label className="sr-only" htmlFor="collection-query">Nama koleksi</label>
      <input id="collection-query" className="search-input" type="search" placeholder="Cincin, gelang, rantai…" value={query} onChange={(event) => setQuery(event.target.value)} autoFocus autoComplete="off" />
      <p className="search-count" aria-live="polite">{matches.length ? `${matches.length} kategori ditemui` : 'Tiada kategori yang sepadan. Cuba cari nama lain.'}</p>
      <ul className="search-results">{matches.map((category) => <li key={category.id}><a className="search-result" href={`/koleksi/#${category.id}`} onClick={() => searchDialog.current?.close()}><span>{category.name}<small>{category.english}</small></span></a></li>)}</ul>
      <p className="search-note">Pilih kategori untuk lihat rekaannya.</p>
    </dialog>
  </header>;
}

