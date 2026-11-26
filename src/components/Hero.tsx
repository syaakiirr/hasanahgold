import { useEffect, useState } from 'react';
import WhatsAppLink from './WhatsAppLink';
import JewelleryImage from './JewelleryImage';

const slides = [
  { image: '/images/earrings.webp', title: 'Sepasang subang yang selesa dipakai.', alt: 'Sepasang subang emas' },
  { image: '/images/bracelets.webp', title: 'Gelang yang muat di pergelangan.', alt: 'Gelang emas' },
  { image: '/images/necklaces.webp', title: 'Rantai untuk dipakai sendiri atau untuk hadiah.', alt: 'Rantai emas' },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (paused || hovered || reduced) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [paused, hovered, reduced]);
  return <section id="home" className="hero container" aria-label="Inspirasi Hasanah Gold" aria-roledescription="karusel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <div className="hero-images">{slides.map((slide, index) => <div className={`hero-photo${active === index ? ' is-active' : ''}`} key={slide.image} aria-hidden={active !== index}>
      <JewelleryImage src={slide.image} alt={slide.alt} priority={index === 0} />
    </div>)}</div>
    <div className="hero-shade" />
    <div className="hero-copy">
      <p className="eyebrow">Hasanah Gold · Kuala Terengganu</p>
      <h1 key={active}>{slides[active].title}</h1>
      <div className="hero-actions"><WhatsAppLink className="button button-light">Tanya tentang koleksi</WhatsAppLink></div>
    </div>
    <div className="hero-pagination" aria-label="Pilih paparan">{slides.map((slide, index) => <button key={slide.image} type="button" aria-label={`Paparan ${index + 1}: ${slide.title}`} aria-pressed={active === index} onClick={() => { setActive(index); }}><span /></button>)}</div>
  </section>;
}
