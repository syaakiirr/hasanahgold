import GalleryGrid from './GalleryGrid';
import { Plus } from 'lucide-react';
import { business } from '../data/business';
import JewelleryImage from './JewelleryImage';
import WhatsAppLink from './WhatsAppLink';
import FeaturedProducts from './FeaturedProducts';
import { BrandIntroSection, WhyChooseUsSection, StoreVisitSection, SocialGallerySection, ContactCTASection } from './PageSections';
import '../styles/editorial-home.css';

const questions = [
  ['Bagaimana nak semak stok dan harga?', 'Mesej kami di WhatsApp dengan kategori atau rekaan yang anda suka. Kami akan kongsi gambar terkini, berat, ketulenan dan harga sebelum anda membuat pilihan.'],
  ['Macam mana nak pilih saiz yang sesuai?', 'Beritahu kami sama ada anda mencari cincin, gelang atau rantai. Anda boleh bertanya tentang pilihan ukuran, kemudian singgah ke kedai untuk mencuba sendiri.'],
  ['Di mana kedai dan bila boleh datang?', `${business.address}. Hubungi ${business.phone} untuk semak waktu buka sebelum berkunjung.`],
];

export default function EditorialHome() {
  return <><div className="editorial-home">
    <section id="home" className="ed-hero ed-container" aria-labelledby="ed-hero-title">
      <div className="ed-hero-copy">
        <p className="ed-overline">HASANAH GOLD · KUALA TERENGGANU</p>
        <h1 id="ed-hero-title"><span data-text-reveal>Untuk dipakai.</span><span data-text-reveal>Untuk dikenang.</span></h1>
        <p className="ed-hero-description">Cincin, gelang, rantai dan subang untuk dipakai harian atau hari istimewa. Tanya stok di WhatsApp, atau datang terus ke kedai untuk mencuba.</p>
        <div className="ed-hero-actions"><a className="ed-button" href="/koleksi/">Lihat koleksi</a><WhatsAppLink className="ed-text-link">Tanya kami</WhatsAppLink></div>
      </div>
      <div className="ed-hero-art">
        <div className="ed-hero-portrait"><JewelleryImage src="/images/editorial/hero-worn-gold.webp" alt="Visual editorial wanita berhijab memakai bangle, gelang dan cincin emas" priority /></div>
        <a className="ed-hero-inset" href="/koleksi/#rings"><div><JewelleryImage src="/images/collection/rings.webp" alt="Rekaan cincin emas berjalin dengan tepi berukir" /></div><span>Cincin Emas</span></a>
        <span className="ed-art-caption">THE GOLD EDIT — HASANAH</span>
      </div>
    </section>

    </div>
    <FeaturedProducts />
    <WhyChooseUsSection />
    <div className="editorial-home">
    <GalleryGrid />

    </div>
    <BrandIntroSection />
    <FeaturedProducts curated />
    <StoreVisitSection />
    <SocialGallerySection />
    <div className="editorial-home">
    <section id="faq" className="ed-faq ed-container" aria-labelledby="ed-faq-title"><div><p className="ed-overline">SEBELUM ANDA SINGGAH</p><h2 id="ed-faq-title"><span data-text-reveal>Nak tahu</span><span data-text-reveal>lebih lanjut?</span></h2><p>Kami sedia membantu di WhatsApp.</p></div><div className="ed-faq-list">{questions.map(([question, answer], index) => <details key={question} name="gold-questions"><summary><span className="ed-faq-number">0{index + 1}</span><span>{question}</span><Plus size={17} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>


  </div><ContactCTASection /></>;
}
