"use client";

import { useEffect, useRef } from "react";

// Faded case documents scattered in the wide side gutters that drift slowly as
// the page scrolls. Fixed + transform only (compositor-friendly, no layout,
// no repaint), shown only where there is gutter room, hidden for reduced motion.
// Purely atmospheric, so aria-hidden.

type Doc = {
  side: "left" | "right";
  top: string;
  offset: number; // px from the gutter edge
  w: number;
  rot: number;
  factor: number; // parallax: fraction of scroll distance
  kind: "memo" | "photo" | "index";
};

const DOCS: Doc[] = [
  { side: "left", top: "12vh", offset: 24, w: 150, rot: -5, factor: 0.06, kind: "memo" },
  { side: "left", top: "46vh", offset: 10, w: 128, rot: 4, factor: -0.05, kind: "index" },
  { side: "left", top: "82vh", offset: 30, w: 140, rot: -3, factor: 0.09, kind: "photo" },
  { side: "right", top: "18vh", offset: 18, w: 138, rot: 5, factor: -0.07, kind: "index" },
  { side: "right", top: "52vh", offset: 28, w: 152, rot: -4, factor: 0.05, kind: "memo" },
  { side: "right", top: "86vh", offset: 8, w: 132, rot: 6, factor: -0.09, kind: "photo" },
];

function DocFace({ kind, w }: { kind: Doc["kind"]; w: number }) {
  if (kind === "photo") {
    return (
      <div className="border border-manila-edge bg-sheet p-1.5 shadow-folder" style={{ width: w }}>
        <div className="h-20 w-full bg-ink/70" style={{ clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)" }} />
        <div className="mt-1.5 h-1.5 w-2/3 bg-ink/25" />
      </div>
    );
  }
  const lines = kind === "index" ? 3 : 5;
  return (
    <div className="border border-manila-edge bg-sheet px-3 py-2.5 shadow-folder" style={{ width: w }}>
      <div className="mb-2 h-2 w-1/2 bg-pe/50" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="mb-1.5 h-1 bg-ink/20" style={{ width: `${90 - i * 8}%` }} />
      ))}
    </div>
  );
}

export default function MarginPapers() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = Array.from(
      ref.current?.querySelectorAll<HTMLElement>("[data-factor]") ?? [],
    );
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
          className="absolute opacity-[0.55]"
          style={{
            top: d.top,
            [d.side]: d.offset,
            transform: `rotate(${d.rot}deg)`,
          }}
        >
          <DocFace kind={d.kind} w={d.w} />
        </div>
      ))}
    </div>
  );
}
