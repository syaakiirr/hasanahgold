// Adapted from React Bits TiltedCard, commit 448c03d. See THIRD_PARTY_NOTICES.md.
import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const spring = { damping: 30, stiffness: 100, mass: 2 };

export default function TiltedCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);
  const scale = useSpring(1, spring);
  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => {
      setEnabled(media.matches);
      if (!media.matches) { rotateX.jump(0); rotateY.jump(0); scale.jump(1); }
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [rotateX, rotateY, scale]);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType !== 'mouse' || event.buttons) return;
    const rect = ref.current!.getBoundingClientRect();
    const clamp = (value: number) => Math.max(-3, Math.min(3, value));
    rotateX.set(clamp((event.clientY - rect.top - rect.height / 2) / (rect.height / 2) * -3));
    rotateY.set(clamp((event.clientX - rect.left - rect.width / 2) / (rect.width / 2) * 3));
    scale.set(1.025);
  }
  function reset() { rotateX.set(0); rotateY.set(0); scale.set(1); }
  return <div className="tilted-card-figure" ref={ref} onPointerMove={move} onPointerLeave={reset} onPointerDown={reset}>
    <motion.div className="tilted-card-inner" style={{ rotateX, rotateY, scale }}>{children}</motion.div>
  </div>;
}
