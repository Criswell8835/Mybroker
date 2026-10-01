import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function CountStat({ to, suffix = "" }: { to: number; suffix?: string }) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) {
      setValue(to);
      return;
    }
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / 900);
          const eased = 1 - (1 - progress) ** 3;
          setValue(Math.round(to * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reduce, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
