"use client";

import { useEffect, useRef, useState } from "react";

// Text hidden under a redaction bar that lifts when it scrolls into view (or on
// hover/focus). The point is thematic: a friendly brand name, then the owner
// behind it revealed. CSS forces the revealed state under prefers-reduced-motion
// and there is no JS-gated content, so the word is always present in the DOM
// for screen readers and no-JS visitors.
export default function RedactionReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const t = window.setTimeout(() => setRevealed(true), delay);
          io.disconnect();
          return () => window.clearTimeout(t);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <span
      ref={ref}
      className={`redaction ${className}`}
      data-revealed={revealed}
      onMouseEnter={() => setRevealed(true)}
      onFocus={() => setRevealed(true)}
      tabIndex={0}
    >
      {children}
      <span className="redaction-cover" aria-hidden />
    </span>
  );
}
