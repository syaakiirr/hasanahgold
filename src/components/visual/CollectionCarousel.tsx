import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

export default function CollectionCarousel({ children }: { children: ReactNode[] }) {
  const [supported, setSupported] = useState(false);
  const [viewport, api] = useEmblaCarousel({ active: supported, align: 'start', loop: false, duration: 28, slidesToScroll: 1 });
  const [state, setState] = useState({ ready: false, previous: false, next: true, visible: [] as number[] });
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 800px)');
    const update = () => setSupported(wide.matches && Boolean(window.IntersectionObserver && window.ResizeObserver));
    update(); wide.addEventListener('change', update);
    return () => wide.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReduced(media.matches); if (media.matches && api) api.scrollTo(api.selectedScrollSnap(), true); };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [api]);
  useEffect(() => {
    if (!api || !supported) return;
    const update = () => setState({ ready: true, previous: api.canScrollPrev(), next: api.canScrollNext(), visible: api.slidesInView() });
    update();
    api.on('select', update).on('reInit', update).on('slidesInView', update);
    return () => { api.off('select', update).off('reInit', update).off('slidesInView', update); };
  }, [api, supported]);
  return <div className="collection-carousel" data-supported={supported} role="region" aria-roledescription="karusel" aria-label="Inspirasi barang kemas" tabIndex={0} onKeyDown={(event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); api?.scrollPrev(reduced); }
    if (event.key === 'ArrowRight') { event.preventDefault(); api?.scrollNext(reduced); }
  }}>
    <div className="carousel-viewport" ref={viewport} data-ready={state.ready}>
      <div className="carousel-track">{children.map((child, index) => <div className="carousel-slide" key={index} inert={supported && state.ready && !state.visible.includes(index)} role="group" aria-roledescription="slaid" aria-label={`${index + 1} daripada ${children.length}`}>{child}</div>)}</div>
    </div>
    <div className="carousel-controls">
      <div><button type="button" aria-label="Koleksi sebelumnya" disabled={!state.previous} onClick={() => api?.scrollPrev(reduced)}><ArrowLeft size={20} aria-hidden="true" /></button><button type="button" aria-label="Koleksi seterusnya" disabled={!state.next} onClick={() => api?.scrollNext(reduced)}><ArrowRight size={20} aria-hidden="true" /></button></div>
    </div>
  </div>;
}
