import { ArrowLeft } from 'lucide-react';
import { business, mapsUrl } from '../data/business';
import WhatsAppLink from './WhatsAppLink';
import '../styles/collection.css';

export default function AboutPage() {
  return <div className="collection-page about-page">
    <header className="collection-heading container">
      <div className="collection-topline"><a href="/"><ArrowLeft size={14} /> Utama</a><span>HASANAH GOLD / TENTANG KAMI</span><span>KUALA TERENGGANU</span></div>
      <p className="eyebrow">Lot 11-A &amp; 12-A, Dataran Panji, Jalan Panji Alam</p>
      <h1>Tentang <em>Hasanah Gold.</em></h1>
      <div className="about-heading-rule" aria-hidden="true" />
    </header>
    <section className="about-intro container" aria-label="Pengenalan Hasanah Gold">
      <div className="about-story">
        <p className="about-lead">Hasanah Gold beroperasi di Dataran Panji, Kuala Terengganu, menawarkan barang kemas emas untuk dipakai harian mahupun majlis istimewa, termasuk cincin, gelang, bangle, rantai, loket, subang dan gelang kaki.</p>
        <p>Semua koleksi dipamerkan terus di kedai supaya anda boleh melihat dan mencuba saiznya sendiri. Jika ingin semak stok, berat atau harga terlebih dahulu, mesej sahaja kami di WhatsApp sebelum singgah.</p>
      </div>
      <dl className="about-highlights">
        <div><dt>Koleksi Kedai</dt><dd>Cincin, gelang, bangle, rantai, loket, subang &amp; gelang kaki.</dd></div>
        <div><dt>Cuba Terus</dt><dd>Lihat berat, ketulenan dan keselesaan saiz di kaunter kami.</dd></div>
        <div><dt>Semak Dahulu</dt><dd>Tanya stok &amp; harga terkini di WhatsApp sebelum datang.</dd></div>
      </dl>
    </section>
    <section className="collection-visit container about-location">
      <a className="collection-editorial-photo about-map" href={mapsUrl} target="_blank" rel="noopener noreferrer">
        <img src="/images/location/location-hasanah-gold.png" alt="Peta lokasi Hasanah Gold di Dataran Panji, Jalan Panji Alam, Kuala Terengganu" width="1209" height="832" loading="lazy" />
        <span>TEKAN UNTUK BUKA GOOGLE MAPS</span>
      </a>
      <div className="collection-visit-copy">
        <p className="eyebrow">Lokasi kedai</p>
        <h2>Singgah ke <em>kedai kami.</em></h2>
        <address>{business.address}</address>
        <ul className="about-details">
          <li><span>Telefon</span><a href={`tel:${business.telephone}`}>{business.phone}</a></li>
          <li><span>Emel</span><a href={`mailto:${business.email}`}>{business.email}</a></li>
          <li><span>Instagram</span><a href={business.socials.instagram ?? undefined} target="_blank" rel="noopener noreferrer">hasanahgold78</a></li>
          <li><span>TikTok</span><a href={business.socials.tiktok ?? undefined} target="_blank" rel="noopener noreferrer">@hasanahgold78</a></li>
        </ul>
        <div className="about-actions">
          <WhatsAppLink className="button about-whatsapp">Tanya di WhatsApp</WhatsAppLink>
          <a className="about-maps" href={mapsUrl} target="_blank" rel="noopener noreferrer">Buka Google Maps</a>
        </div>
      </div>
    </section>
  </div>;
}
