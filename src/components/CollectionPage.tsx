import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { jewellery } from '../data/jewellery';
import { CoverflowCarousel } from './ui/coverflow-carousel';
import WhatsAppLink from './WhatsAppLink';
import '../styles/collection.css';

const slides = jewellery.map((item) => ({
  id: item.id,
  src: `/images/collection/${item.id}.webp`,
  alt: `Rekaan ${item.name.toLowerCase()} dengan pencahayaan studio hangat`,
  title: item.name,
  subtitle: item.detail,
}));

export default function CollectionPage() {
  const [selected, setSelected] = useState(0);
  const item = jewellery[selected];
  return <div className="collection-page">
    <header className="collection-heading container">
      <div className="collection-topline"><a href="/"><ArrowLeft size={14} /> Utama</a><span>HASANAH GOLD / KOLEKSI</span><span>08 PILIHAN</span></div>
      <h1><span data-text-reveal>Emas untuk <em>setiap cerita.</em></span></h1>
    </header>
    <section className="collection-gallery" aria-label="Pilihan barang kemas" data-reveal>
      <CoverflowCarousel slides={slides} onSelect={setSelected} cardWidth="clamp(240px, 29vw, 400px)" rotate={44} depth={0.6} gap={0.08} fade={0.12} showCaption showPagination showNavigation label="Lapan koleksi emas" />
      <noscript><div className="collection-noscript">{jewellery.map((product) => <WhatsAppLink code={product.code} subject={product.name} key={product.id}>{product.name}</WhatsAppLink>)}</div></noscript>
      <div className="collection-selection container" data-reveal>
        <span className="collection-counter" aria-live="polite">{String(selected + 1).padStart(2, '0')}<span> / 08</span></span>
        <div className="collection-selection-copy"><p className="eyebrow">{item.code} · {item.english} / {item.design}</p><p>{item.description}</p></div>
        <WhatsAppLink className="button collection-enquire" code={item.code} subject={item.name}>Tanya tentang koleksi ini</WhatsAppLink>
      </div>
    </section>
    <section className="collection-visit container">
      <div className="collection-editorial-photo" data-reveal><img src="/images/collection/bangles.webp" alt="Perincian ukiran pada rekaan bangle emas" width="1024" height="1024" loading="lazy" /><span>THE FINER DETAILS</span></div>
      <div className="collection-visit-copy" data-reveal><p className="eyebrow">Hasanah Gold · Panji Curve</p><h2><span data-text-reveal>Yang indah dipandang.</span><span data-text-reveal><em>Lebih indah dicuba.</em></span></h2><p>Rasa beratnya di tangan, cari saiz yang selesa di jari. Singgah ke kedai untuk memilih barang kemas bersama kami.</p><a className="collection-visit-link" href="/#visit">Temui kami di Kuala Terengganu</a></div>
    </section>
  </div>;
}
