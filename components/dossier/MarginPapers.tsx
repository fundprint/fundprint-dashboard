"use client";

import { useEffect, useRef } from "react";
import { PhotoCard, Pushpin, RedactedDoc } from "./Props";

// Case documents scattered in the wide side gutters that drift as the page
// scrolls. Fixed + transform only (compositor-friendly, no layout, no repaint),
// shown only where there is gutter room, disabled for reduced motion. Purely
// atmospheric, so aria-hidden.

type Doc = {
  side: "left" | "right";
  top: string;
  offset: number;
  rot: number;
  factor: number;
  kind: "redacted" | "photo" | "memo";
};

const DOCS: Doc[] = [
  { side: "left", top: "11vh", offset: 14, rot: -6, factor: 0.05, kind: "redacted" },
  { side: "left", top: "48vh", offset: 26, rot: 5, factor: -0.06, kind: "memo" },
  { side: "left", top: "84vh", offset: 8, rot: -3, factor: 0.09, kind: "photo" },
  { side: "right", top: "16vh", offset: 20, rot: 6, factor: -0.05, kind: "photo" },
  { side: "right", top: "54vh", offset: 10, rot: -5, factor: 0.07, kind: "redacted" },
  { side: "right", top: "88vh", offset: 24, rot: 4, factor: -0.09, kind: "memo" },
];

function Memo() {
  return (
    <div className="border border-manila-edge bg-sheet px-3 py-2.5 shadow-folder" style={{ width: 130 }}>
      <div className="mb-2 h-2 w-1/2 bg-pe/55" />
      {[92, 84, 76, 88].map((w, i) => (
        <div key={i} className="mb-1.5 h-1 bg-ink/20" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

export default function MarginPapers() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-factor]") ?? []);
    let raf = 0;
    const apply = () => {
      const y = window.scrollY;
      for (const el of nodes) {
        const f = Number(el.dataset.factor);
        const r = Number(el.dataset.rot);
        el.style.transform = `translate3d(0, ${(y * f).toFixed(1)}px, 0) rotate(${r}deg)`;
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden xl:block">
      {DOCS.map((d, i) => (
        <div
          key={i}
          data-factor={d.factor}
          data-rot={d.rot}
          className="absolute opacity-[0.6]"
          style={{ top: d.top, [d.side]: d.offset, transform: `rotate(${d.rot}deg)` }}
        >
          <Pushpin className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/3" />
          {d.kind === "redacted" ? <RedactedDoc w={128} /> : d.kind === "photo" ? <PhotoCard w={124} /> : <Memo />}
        </div>
      ))}
    </div>
  );
}
