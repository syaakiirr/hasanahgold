// Adapted from React Bits FadeContent, commit 448c03d. See THIRD_PARTY_NOTICES.md.
import { useEffect, useRef, type ReactNode } from 'react';

export default function FadeContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || !element.animate) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(element);
      if (reduced.matches) return;
      const tokens = getComputedStyle(document.documentElement);
      animation = element.animate([
        { opacity: 0.3, clipPath: 'inset(0 0 18% 0)' },
        { opacity: 1, clipPath: 'inset(0)' },
      ], { duration: parseFloat(tokens.getPropertyValue('--motion-slow')), easing: tokens.getPropertyValue('--ease-reveal').trim() });
    }, { threshold: 0.1 });
    const stop = () => { if (reduced.matches) animation?.cancel(); };
    observer.observe(element);
    reduced.addEventListener('change', stop);
    return () => { observer.disconnect(); animation?.cancel(); reduced.removeEventListener('change', stop); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
