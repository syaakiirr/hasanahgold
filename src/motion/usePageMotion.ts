import { useEffect } from 'react';

export function usePageMotion() {
  useEffect(() => {
    if (!Element.prototype.animate || !window.IntersectionObserver) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (reduced.matches || entry.target.contains(document.activeElement)) continue;
        const isText = entry.target.hasAttribute('data-text-reveal');
        const lineIndex = isText ? [...entry.target.parentElement!.children].indexOf(entry.target) : 0;
        const animation = entry.target.animate(
          isText
            ? [{ opacity: 0, transform: 'translateY(18px)', clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, transform: 'none', clipPath: 'inset(0)' }]
            : [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }],
          { duration: 600, delay: lineIndex * 100, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
        );
        animations.add(animation);
        animation.onfinish = animation.oncancel = () => animations.delete(animation);
      }
    }, { threshold: 0.08 });
    // Content stays visible if JavaScript, observers, or animations are unavailable.
    document.querySelectorAll('[data-reveal], [data-text-reveal]').forEach((element) => observer.observe(element));
    const stop = () => { for (const animation of animations) animation.cancel(); };
    const preference = () => { if (reduced.matches) stop(); };
    const focus = (event: FocusEvent) => {
      for (const animation of animations) {
        if ((animation.effect as KeyframeEffect).target?.contains(event.target as Node)) animation.cancel();
      }
    };
    reduced.addEventListener('change', preference);
    document.addEventListener('focusin', focus);
    return () => { stop(); observer.disconnect(); reduced.removeEventListener('change', preference); document.removeEventListener('focusin', focus); };
  }, []);
}
