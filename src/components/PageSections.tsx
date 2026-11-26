import { business, mapsUrl } from '../data/business';
import { collections } from '../data/products';
import JewelleryImage from './JewelleryImage';
import SocialLinks from './SocialLinks';
import WhatsAppLink from './WhatsAppLink';
import BrandFilm from './BrandFilm';

export function BrandIntroSection() {
  return <section id="about" className="brand-section container" aria-labelledby="about-title">
    <BrandFilm src="/videos/hasanah-gold-coastal-film.mp4" />
    <div className="brand-overlay" /><div className="brand-copy" data-reveal><p className="eyebrow">Di kedai, bukan dalam gambar.</p><h2 id="about-title">Datang lihat sendiri<br />di kedai kami.</h2><p>Singgah ke Hasanah Gold di Panji Curve, Kuala Terengganu.</p><a className="button button-light" href="#visit">Cari kedai kami</a></div>
  </section>;
}
export function CategoryShowcase() {
  return <section id="collections" className="section collections-section"><div className="container">
    <div className="section-heading" data-reveal><h2>Kategori barang kemas</h2><a className="text-link" href="/koleksi/">Lihat koleksi</a></div>
    <div className="collection-grid">{collections.map((category) => <a className="collection" key={category.id} href={`/koleksi/#${category.id}`}>
      <div className="collection-photo"><JewelleryImage src={category.image} alt={category.alt} /></div>
      <div className="collection-caption"><div className="collection-title"><h3>{category.name}</h3></div><p>{category.description}</p></div>
    </a>)}</div>
  </div></section>;
}
export function WhyChooseUsSection() {
  const reasons = [
    ['Lihat pilihan barang kemas', 'Cincin, gelang, rantai, loket dan subang, semuanya ada dalam katalog di laman ini.'],
    ['Tanya kami di WhatsApp', 'Minta gambar dan maklumat barang kemas yang ada di kedai.'],
    ['Singgah ke kedai', 'Lihat barang kemas dengan lebih dekat di Hasanah Gold, Panji Curve.'],
  ];
  return <section className="reasons-section" aria-label="Kenali Hasanah Gold"><div className="container reasons-list">{reasons.map(([title, description], index) => <div key={title} data-reveal><span className="reason-number">0{index + 1}</span><h2>{title}</h2><p>{description}</p></div>)}</div></section>;
}
export function StoreVisitSection() {
  return <section id="visit" className="section visit-section"><div className="container visit-grid">
    <div data-reveal><p className="eyebrow">Lokasi kedai</p><h2>Singgah bila ke<br />Kuala Terengganu.</h2></div>
    <div className="visit-details" data-reveal><h3>Hasanah Gold · Panji Curve</h3><address>{business.address}</address><p>Hubungi kami untuk semak waktu buka sebelum datang.</p><div className="visit-actions"><a className="button button-outline" href={mapsUrl} target="_blank" rel="noopener noreferrer">Buka Google Maps</a><WhatsAppLink className="button">Tanya di WhatsApp</WhatsAppLink></div></div>
  </div></section>;
}
export function SocialGallerySection() {
  return <section id="social" className="social-section"><div className="container social-content"><div><h2>Ikuti kami di media sosial</h2><p>@hasanahgold78</p></div><SocialLinks /></div></section>;
}
export function ContactCTASection() {
  return <section id="contact" className="contact-section" aria-labelledby="contact-title"><div className="container contact-grid">
    <div className="contact-copy" data-reveal>
      <p className="eyebrow">HUBUNGI KAMI · PANJI CURVE</p>
      <h2 id="contact-title">Ada yang <em>anda suka?</em></h2>
      <p>Beritahu kami barang kemas yang anda cari. Kami sedia berkongsi gambar terkini, berat, ketulenan dan harga koleksi yang ada di kedai.</p>
      <div className="contact-meta">
        <div><span>WhatsApp &amp; Telefon</span><a href={`tel:${business.telephone}`}>{business.phone}</a></div>
        <div><span>Butik</span><p>Panji Curve, Kuala Terengganu</p></div>
      </div>
      <div className="contact-actions">
        <WhatsAppLink className="button contact-whatsapp-btn">Tanya di WhatsApp</WhatsAppLink>
        <a className="button button-outline" href={mapsUrl} target="_blank" rel="noopener noreferrer">Buka Google Maps</a>
      </div>
    </div>
    <div className="contact-photo">
      <JewelleryImage src="/images/editorial/contact-consultation.jpg" alt="Dulang pameran barang kemas emas 916 di kaunter Hasanah Gold" />
      <span className="contact-photo-caption">HASANAH GOLD · DI KAUNTER KAMI</span>
    </div>
  </div></section>;
}



