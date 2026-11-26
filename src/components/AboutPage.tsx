import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { business, mapsUrl } from '../data/business';
import WhatsAppLink from './WhatsAppLink';
import '../styles/collection.css';

export default function AboutPage() {
  return <div className="collection-page about-page">
    <header className="about-header container">
      <div className="collection-topline">
        <a href="/"><ArrowLeft size={14} /> Utama</a>
        <span>HASANAH GOLD / TENTANG KAMI</span>
        <span>KUALA TERENGGANU</span>
      </div>
      <div className="about-title-row" data-reveal>
        <div>
          <p className="eyebrow">Panji Curve · Kuala Terengganu</p>
          <h1><span data-text-reveal>Tentang <em>Hasanah Gold.</em></span></h1>
        </div>
      </div>
    </header>

    <section className="about-card container" aria-label="Maklumat butik Hasanah Gold">
      <a className="about-map-panel" data-reveal href={mapsUrl} target="_blank" rel="noopener noreferrer">
        <img
          src="/images/location/location-hasanah-gold.png"
          alt="Peta lokasi Hasanah Gold di Panji Curve, Jalan Panji Alam, Kuala Terengganu"
          width="1209"
          height="832"
          loading="lazy"
        />
        <span className="about-map-pill">Buka Google Maps <ArrowUpRight size={13} /></span>
      </a>

      <div className="about-info-panel" data-reveal>
        <p className="eyebrow">Butik kami</p>
        <h2><span data-text-reveal>Singgah &amp; <em>cuba sendiri.</em></span></h2>
        <address className="about-address">{business.address}</address>

        <dl className="about-details">
          <div><dt>Koleksi</dt><dd>Emas 916 · Cincin, Gelang, Rantai, Loket, Subang</dd></div>
          <div><dt>Telefon</dt><dd><a href={`tel:${business.telephone}`}>{business.phone}</a></dd></div>
          <div><dt>Emel</dt><dd><a href={`mailto:${business.email}`}>{business.email}</a></dd></div>
          <div>
            <dt>Sosial</dt>
            <dd className="about-socials">
              <a href={business.socials.instagram ?? undefined} target="_blank" rel="noopener noreferrer">Instagram</a>
              <span aria-hidden="true">·</span>
              <a href={business.socials.tiktok ?? undefined} target="_blank" rel="noopener noreferrer">TikTok</a>
            </dd>
          </div>
        </dl>

        <div className="about-actions">
          <WhatsAppLink className="about-btn-primary">Tanya di WhatsApp</WhatsAppLink>
          <a className="about-btn-secondary" href={mapsUrl} target="_blank" rel="noopener noreferrer">Arah ke kedai</a>
        </div>
      </div>
    </section>
  </div>;
}
