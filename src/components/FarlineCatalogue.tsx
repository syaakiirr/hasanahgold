import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Minus, Plus, X } from 'lucide-react';
import { jewellery, type Jewellery } from '../data/jewellery';
import JewelleryImage from './JewelleryImage';
import WhatsAppLink from './WhatsAppLink';
import '../styles/farline-catalogue.css';

const NecklaceViewer3D = lazy(() => import('./three/NecklaceViewer3D'));
const RingViewer3D = lazy(() => import('./three/RingViewer3D'));
const BraceletViewer3D = lazy(() => import('./three/BraceletViewer3D'));
const BangleViewer3D = lazy(() => import('./three/BangleViewer3D'));
const PendantViewer3D = lazy(() => import('./three/PendantViewer3D'));
const AnkletViewer3D = lazy(() => import('./three/AnkletViewer3D'));
const AccessoriesViewer3D = lazy(() => import('./three/AccessoriesViewer3D'));
const EarringsViewer3D = lazy(() => import('./three/EarringsViewer3D'));

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

const finishes = [
  { id: '916', label: 'Emas 916', swatch: '#c99738' },
  { id: 'two-tone', label: 'Dua Tona', swatch: 'linear-gradient(135deg, #c99738 50%, #e6dfd5 50%)' },
  { id: 'matte', label: 'Kemasan Matte', swatch: '#b38b46' },
] as const;

export default function FarlineCatalogue() {
  const [filter, setFilter] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finishIndex, setFinishIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; offsetX: number; offsetY: number; moved: boolean } | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = jewellery.map((product, index) => ({ product, index })).filter(({ product }) => filters[filter].ids.includes(product.id));
  const selectedItem = selected === null ? null : jewellery[selected];
  const visiblePosition = visible.findIndex(({ index }) => index === selected);
  const activeFinish = finishes[finishIndex];

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
      <h1 id="catalogue-title"><span data-text-reveal>Pilih dengan mata.</span><span data-text-reveal>Dekatkan dengan hati.</span></h1>
      <span className="farline-count" aria-live="polite">{visible.length} rekaan</span>
      <div className="farline-filters" role="group" aria-label="Tapis katalog barang kemas" data-reveal>
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
            <span>{product.code} · {product.english}</span>
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
    }} onClick={(event) => {
      if (event.target === event.currentTarget) close();
    }}>
      {selectedItem && <div className="farline-pdp">
        <div className="farline-pdp-media">
          <div className="farline-pdp-stage">
            <button className="farline-pdp-nav farline-pdp-prev" aria-label="Gambar sebelumnya" disabled={visible.length < 2} onClick={() => move(-1)}><ArrowLeft size={16} /></button>
            <div className="farline-pdp-photo">
              {selectedItem.id === 'necklaces' ? (
                <Suspense fallback={<div className="necklace-3d-loading">Memuatkan model 3D emas 22K...</div>}>
                  <NecklaceViewer3D finish={activeFinish.id} />
                </Suspense>
              ) : selectedItem.id === 'rings' ? (
                <Suspense fallback={<div className="necklace-3d-loading">Memuatkan model 3D cincin emas 22K...</div>}>
                  <RingViewer3D finish={activeFinish.id} />
                </Suspense>
              ) : selectedItem.id === 'bracelets' ? (
                <Suspense fallback={<div className="necklace-3d-loading">Memuatkan model 3D gelang emas 22K...</div>}>
                  <BraceletViewer3D finish={activeFinish.id} />
                </Suspense>
              ) : selectedItem.id === 'bangles' ? (
                <Suspense fallback={<div className="necklace-3d-loading">Memuatkan model 3D bangle emas 22K...</div>}>
                  <BangleViewer3D finish={activeFinish.id} />
                </Suspense>
              ) : selectedItem.id === 'pendants' ? (
                <Suspense fallback={<div className="necklace-3d-loading">Memuatkan model 3D loket emas 22K...</div>}>
                  <PendantViewer3D finish={activeFinish.id} />
                </Suspense>
              ) : selectedItem.id === 'anklets' ? (
                <Suspense fallback={<div className="necklace-3d-loading">Memuatkan model 3D gelang kaki emas 22K...</div>}>
                  <AnkletViewer3D finish={activeFinish.id} />
                </Suspense>
              ) : selectedItem.id === 'accessories' ? (
                <Suspense fallback={<div className="necklace-3d-loading">Memuatkan koleksi 3D aksesori emas 22K...</div>}>
                  <AccessoriesViewer3D finish={activeFinish.id} />
                </Suspense>
              ) : selectedItem.id === 'earrings' ? (
                <Suspense fallback={<div className="necklace-3d-loading">Memuatkan model 3D subang emas 22K...</div>}>
                  <EarringsViewer3D finish={activeFinish.id} />
                </Suspense>
              ) : (
                <JewelleryImage key={(selectedItem as Jewellery).id} src={`/images/collection/${(selectedItem as Jewellery).id}.webp`} alt={`Rekaan ${(selectedItem as Jewellery).name.toLowerCase()} emas`} priority />
              )}
            </div>
            <button className="farline-pdp-nav farline-pdp-next" aria-label="Gambar seterusnya" disabled={visible.length < 2} onClick={() => move(1)}><ArrowRight size={16} /></button>
            <div className="farline-pdp-stage-foot">
              <span>{String(visiblePosition + 1).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}</span>
            </div>
            <div className="farline-pdp-progress" aria-hidden="true">
              {visible.map(({ product, index }) => <span key={product.id} className={index === selected ? 'is-active' : undefined} />)}
            </div>
          </div>
          <div className="farline-pdp-thumbs" aria-label="Pilih rekaan lain">
            {visible.map(({ product, index }) => <button key={product.id} type="button" className={index === selected ? 'is-active' : undefined} aria-label={product.name} aria-pressed={index === selected} onClick={() => setSelected(index)}>
              <JewelleryImage src={`/images/collection/${product.id}.webp`} alt={product.name} />
            </button>)}
          </div>
        </div>
        <div className="farline-pdp-info">
          <div className="farline-pdp-topbar">
            <p className="farline-pdp-crumb">KOLEKSI / {selectedItem.english.toUpperCase()} / {selectedItem.code}</p>
            <button className="farline-close" aria-label="Tutup gambar" autoFocus onClick={close}><X size={19} /></button>
          </div>
          <h2 id="farline-detail-title">{selectedItem.name}</h2>
          <p className="farline-pdp-status"><strong>{selectedItem.code}</strong> · <strong>Emas 916</strong> <span>STOK DI KEDAI · TANYA BERAT &amp; HARGA</span></p>
          <p className="farline-pdp-desc">{selectedItem.description}</p>
          <div className="farline-pdp-option">
            <span className="farline-pdp-label">KEMASAN — <strong>{activeFinish.label.toUpperCase()}</strong></span>
            <div className="farline-pdp-swatches" role="group" aria-label="Pilih kemasan">
              {finishes.map((finish, index) => <button key={finish.id} type="button" aria-label={finish.label} aria-pressed={finishIndex === index} onClick={() => setFinishIndex(index)}><span style={{ background: finish.swatch }} /></button>)}
            </div>
          </div>
          <div className="farline-pdp-ctas">
            <WhatsAppLink className="farline-pdp-primary" code={selectedItem.code} subject={`${selectedItem.name}, ${activeFinish.label}`}>
              Tanya di WhatsApp
            </WhatsAppLink>
            <a className="farline-pdp-secondary" href={`/koleksi/#${selectedItem.id}`}>Lihat di halaman Koleksi</a>
          </div>
          <p className="farline-pdp-trust">SEMAK BERAT &amp; HARGA · CUBA DI KEDAI · PANJI CURVE</p>
          <dl className="farline-pdp-specs">
            <div><dt>KOD PRODUK</dt><dd>{selectedItem.code}</dd></div>
            <div><dt>KETULENAN</dt><dd>Emas 916 (22K), disahkan di kaunter.</dd></div>
            <div><dt>REKAAN</dt><dd>{selectedItem.design}</dd></div>
            <div><dt>PEMAKAIAN</dt><dd>{selectedItem.detail}</dd></div>
            <div><dt>BUTIK</dt><dd>Lot 11-A &amp; 12-A, Panji Curve, Kuala Terengganu.</dd></div>
          </dl>
        </div>
      </div>}
    </dialog>
  </section>;
}
