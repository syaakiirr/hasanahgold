import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Minus, Plus, X } from 'lucide-react';
import { jewellery } from '../data/jewellery';
import JewelleryImage from './JewelleryImage';
import WhatsAppLink from './WhatsAppLink';
import '../styles/farline-catalogue.css';

const filters: { label: string; ids: string[] }[] = [
  { label: 'Semua', ids: jewellery.map((item) => item.id) },
  { label: 'Cincin', ids: ['rings'] },
  { label: 'Gelang', ids: ['bracelets', 'bangles', 'anklets'] },
  { label: 'Rantai', ids: ['necklaces', 'pendants'] },
  { label: 'Subang', ids: ['earrings'] },
  { label: 'Aksesori', ids: ['accessories'] },
];

const placements = [
  [51, 13, -5, 1.0], [76, 9, 6, .86], [40, 48, -8, .9], [67, 45, 5, 1.08],
  [88, 47, -4, .82], [50, 78, 7, .88], [74, 75, -6, 1.02], [91, 77, 4, .8],
] as const;

export default function FarlineCatalogue() {
  const [filter, setFilter] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; offsetX: number; offsetY: number; moved: boolean } | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = jewellery.map((product, index) => ({ product, index })).filter(({ product }) => filters[filter].ids.includes(product.id));
  const selectedItem = selected === null ? null : jewellery[selected];

  useEffect(() => {
    if (selected === null) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [selected]);

  const move = (direction: number) => {
    const current = visible.findIndex(({ index }) => index === selected);
    setSelected(visible[(current + direction + visible.length) % visible.length].index);
  };
  const close = () => dialog.current?.close();
  const open = (index: number, button: HTMLButtonElement) => { opener.current = button; setSelected(index); };
  const setZoomLevel = (next: number) => setZoom(Math.max(.8, Math.min(1.35, Math.round(next * 100) / 100)));

  return <section className="farline-catalogue" aria-labelledby="catalogue-title">
    <header className="farline-intro">
      <a href="/" className="farline-back"><ArrowLeft size={16} /> Utama</a>
      <p>HASANAH GOLD / KATALOG</p>
      <h1 id="catalogue-title">Pilih dengan mata.<br />Dekatkan dengan hati.</h1>
      <span className="farline-count" aria-live="polite">{visible.length} rekaan</span>
      <div className="farline-filters" role="group" aria-label="Tapis katalog barang kemas">
        {filters.map(({ label }, index) => <button key={label} aria-pressed={filter === index} onClick={() => { setFilter(index); setOffset({ x: 0, y: 0 }); }}>{label}</button>)}
      </div>
      <p className="farline-hint">Seret meja untuk meneroka. Tekan gambar untuk melihat lebih dekat.</p>
    </header>
    <div className="farline-stage" onPointerDown={(event) => {
      if ((event.target as HTMLElement).closest('button, a')) return;
      drag.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y, moved: false };
      event.currentTarget.setPointerCapture(event.pointerId);
    }} onPointerMove={(event) => {
      if (!drag.current) return;
      const x = Math.max(-120, Math.min(120, drag.current.offsetX + event.clientX - drag.current.x));
      const y = Math.max(-90, Math.min(90, drag.current.offsetY + event.clientY - drag.current.y));
      drag.current.moved ||= Math.abs(event.clientX - drag.current.x) + Math.abs(event.clientY - drag.current.y) > 6;
      setOffset({ x, y });
    }} onPointerUp={(event) => { drag.current = null; event.currentTarget.releasePointerCapture(event.pointerId); }}>
      <div className="farline-plane" style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})` }}>
        {visible.map(({ product, index }, order) => {
          const [x, y, rotate, scale] = placements[index];
          return <article className="farline-print" key={product.id} style={{ left: `${x}%`, top: `${y}%`, '--print-rotate': `${rotate}deg`, '--print-scale': scale, '--deal-delay': `${order * 70}ms` } as React.CSSProperties}>
            <button aria-haspopup="dialog" aria-label={`Lihat ${product.name}`} onClick={(event) => open(index, event.currentTarget)}>
              <JewelleryImage src={`/images/collection/${product.id}.webp`} alt={`Rekaan ${product.name.toLowerCase()} emas`} />
            </button>
            <span>{String(index + 1).padStart(2, '0')} / {product.english}</span>
          </article>;
        })}
      </div>
      <div className="farline-zoom" aria-label="Kawalan zoom katalog">
        <button aria-label="Kecilkan paparan" onClick={() => setZoomLevel(zoom - .1)}><Minus size={15} /></button><span>{Math.round(zoom * 100)}%</span><button aria-label="Besarkan paparan" onClick={() => setZoomLevel(zoom + .1)}><Plus size={15} /></button>
      </div>
    </div>
    <dialog className="farline-lightbox" ref={dialog} aria-labelledby="farline-detail-title" onClose={() => { setSelected(null); window.requestAnimationFrame(() => opener.current?.focus()); }} onKeyDown={(event) => {
      if (event.key === 'Escape') return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
    }}>
      {selectedItem && <div className="farline-lightbox-inner"><button className="farline-close" aria-label="Tutup gambar" autoFocus onClick={close}><X size={21} /></button><div className="farline-lightbox-image"><JewelleryImage src={`/images/collection/${selectedItem.id}.webp`} alt={`Rekaan ${selectedItem.name.toLowerCase()} emas`} priority /></div><div className="farline-lightbox-caption"><p>{String((visible.findIndex(({ index }) => index === selected) + 1)).padStart(2, '0')} / {selectedItem.english}</p><h2 id="farline-detail-title">{selectedItem.name}</h2><span>{selectedItem.detail}</span><div><button aria-label="Gambar sebelumnya" disabled={visible.length < 2} onClick={() => move(-1)}><ArrowLeft size={18} /></button><WhatsAppLink subject={selectedItem.name}>Tanya tentang koleksi ini</WhatsAppLink><button aria-label="Gambar seterusnya" disabled={visible.length < 2} onClick={() => move(1)}><ArrowRight size={18} /></button></div></div></div>}
    </dialog>
  </section>;
}
