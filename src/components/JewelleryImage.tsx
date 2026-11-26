import { useEffect, useRef, useState } from 'react';

export default function JewelleryImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // A prerendered image can fail before React attaches its error handler.
    if (image.current?.complete && image.current.naturalWidth === 0) setFailed(true);
  }, [src]);
  return failed
    ? <div className="image-fallback" role="img" aria-label={alt}><span>Gambar tidak dapat dimuatkan.</span><span>Mesej kami untuk gambar koleksi.</span></div>
    : <img ref={image} src={src} alt={alt} width="1200" height="1500" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} onError={() => setFailed(true)} />;
}
