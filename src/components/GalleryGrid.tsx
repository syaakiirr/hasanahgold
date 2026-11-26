import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ZoomIn, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { jewellery } from '../data/jewellery';
import JewelleryImage from './JewelleryImage';
import WhatsAppLink from './WhatsAppLink';
import '../styles/editorial-home.css';

const galleryFilters = [
  { label: 'Semua', ids: jewellery.map(item => item.id) },
  { label: 'Cincin', ids: ['rings'] },
  { label: 'Gelang & Bangle', ids: ['bracelets', 'bangles', 'anklets'] },
  { label: 'Rantai & Loket', ids: ['necklaces', 'pendants'] },
  { label: 'Subang', ids: ['earrings'] },
  { label: 'Aksesori', ids: ['accessories'] },
];

export default function GalleryGrid({ catalogue = false }: { catalogue?: boolean }) {
  const featured = catalogue ? jewellery : [jewellery[0], jewellery[1], jewellery[2], jewellery[4]];
  const [filter, setFilter] = useState(0);
  const reducedMotion = useReducedMotion();
  const visibleItems = featured.map((product, index) => ({ product, index })).filter(({ product }) => galleryFilters[filter].ids.includes(product.id));
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const item = selected === null ? null : featured[selected];
  const navigate = (direction: number) => {
    const current = visibleItems.findIndex(entry => entry.index === selected);
    setSelected(visibleItems[(current + direction + visibleItems.length) % visibleItems.length].index);
  };
  useEffect(() => {
    if (selected === null) return;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [selected]);

  return <>
    <section id="collections" className={`ed-collections ed-container ${catalogue ? "catalogue-gallery" : "home-gallery"}`} aria-labelledby="ed-collection-title">
      <div className="ed-section-heading"><div><p className="ed-overline">{catalogue ? 'HASANAH GOLD / KATALOG' : '01 / PILIHAN KOLEKSI'}</p>{catalogue ? <h1 id="ed-collection-title">Katalog barang kemas.</h1> : <h2 id="ed-collection-title"><span data-text-reveal>Pilihan yang ada</span><span data-text-reveal>di kedai kami.</span></h2>}</div><a className="ed-text-link" href={catalogue ? '/koleksi/' : '/katalog/'}>{catalogue ? 'Lihat koleksi' : 'Lihat semua katalog'}</a></div>
      {catalogue && <><p className="ed-gallery-description">Pilih kategori di bawah, atau tekan mana-mana gambar untuk lihat lebih dekat.</p>
      <div className="ed-gallery-filters" role="group" aria-label="Tapis galeri barang kemas">{galleryFilters.map((category, index) => <button key={category.label} aria-pressed={filter === index} onClick={() => setFilter(index)}>{category.label}</button>)}</div>
      <p className="ed-gallery-count" aria-live="polite">{visibleItems.length} rekaan dalam galeri</p></>}
      <motion.div layout={catalogue && !reducedMotion} className="ed-products">
        <AnimatePresence initial={false} mode="popLayout">{visibleItems.map(({ product, index }) => <motion.article layout={catalogue && !reducedMotion} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: reducedMotion ? 0 : .25 }} className="ed-product" key={product.id}>
          <button className="ed-product-image" aria-label={`Lihat dekat ${product.name}`} aria-haspopup="dialog" onClick={(event) => { opener.current = event.currentTarget; setSelected(index); }}><JewelleryImage src={`/images/collection/${product.id}.webp`} alt={`${product.name.toLowerCase()} emas`} /><span className="ed-image-action"><ZoomIn size={28} /><span>Lihat dekat</span></span></button>
          <a className="ed-product-title" href={`/koleksi/#${product.id}`}><div><span className="ed-overline">{product.code} · {product.english}</span><h3>{product.name}</h3></div></a>
        </motion.article>)}</AnimatePresence>
      </motion.div>
    </section>
    <dialog className={`ed-lightbox ${catalogue ? "catalogue-lightbox" : "home-lightbox"}`} ref={dialog} aria-labelledby="ed-detail-title" onClose={() => { setSelected(null); opener.current?.focus(); }} onKeyDown={(event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); navigate(event.key === 'ArrowRight' ? 1 : -1); return; }
      if (event.key !== 'Tab') return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]');
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const box = event.currentTarget.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.current?.close();
    }}>
      {item && <><button className="ed-lightbox-close" aria-label="Tutup gambar" autoFocus onClick={() => dialog.current?.close()}><X size={22} /></button><div className="ed-lightbox-layout"><div className="ed-lightbox-image"><JewelleryImage key={item.id} src={`/images/collection/${item.id}.webp`} alt={`${item.name.toLowerCase()} emas`} priority /></div><div className="ed-lightbox-info"><p className="ed-overline">HASANAH GOLD / {item.english} · {item.code}</p><h2 id="ed-detail-title">{item.name}</h2><p>{item.description}</p><WhatsAppLink className="ed-button" code={item.code} subject={item.name}>Tanya tentang koleksi ini</WhatsAppLink><a className="ed-text-link" href={`/koleksi/#${item.id}`}>Lihat di halaman Koleksi</a><div className="ed-lightbox-navigation"><button aria-label="Gambar sebelumnya" disabled={visibleItems.length < 2} onClick={() => navigate(-1)}><ArrowLeft size={18} /></button><span>{visibleItems.findIndex(entry => entry.index === selected) + 1} / {visibleItems.length}</span><button aria-label="Gambar seterusnya" disabled={visibleItems.length < 2} onClick={() => navigate(1)}><ArrowRight size={18} /></button></div></div></div></>}
    </dialog>
  </>;
}
