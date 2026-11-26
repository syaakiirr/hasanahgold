import { useEffect, useRef, useState } from 'react';

export default function BrandFilm({ src }: { src?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setEnabled(!preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updatePreference(); updateVisibility();
    preference.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = window.IntersectionObserver
      ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 })
      : null;
    if (observer && video.current) observer.observe(video.current);
    else setVisible(true);
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', updatePreference);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, [src]);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (visible && enabled && pageVisible && !failed) {
      void element.play().catch(() => { /* Keep the poster if autoplay is blocked. */ });
    } else element.pause();
    return () => element.pause();
  }, [src, visible, enabled, pageVisible, failed]);

  return <div className="brand-image brand-film" aria-hidden="true">
      <img src="/images/coastal-film-poster.webp" alt="" width="1920" height="1080" loading="lazy" />
      {src && !failed && <video ref={video} src={src} poster="/images/coastal-film-poster.webp"
        autoPlay={visible && enabled && pageVisible} muted loop playsInline preload="none" tabIndex={-1}
        onError={() => setFailed(true)} />}
    </div>;
}
