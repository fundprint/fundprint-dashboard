"use client";

import { useEffect, useRef } from "react";
import { PhotoCard, Pushpin, RedactedDoc } from "./Props";

// Case documents pinned in the wide side gutters that drift as the page
// scrolls. Fixed + transform only (compositor-friendly: no layout, no repaint),
// centered in the gutter via calc so they never clip the viewport edge or
// crowd the reading column, and only shown once the gutter is genuinely wide
// enough to hold them. Purely atmospheric, so aria-hidden.
//
// Depth is intentional, not random. Each paper sits on one of three layers:
// near papers are larger, sharper and more present; far papers are smaller,
// softer and fainter, and drift less. Within a column every paper drifts the
// same direction with magnitude ordered so the gaps between them only ever
// grow, never shrink -- so they can never collide as you scroll.

type Layer = "near" | "mid" | "far";

const LAYER: Record<Layer, { w: number; opacity: number; blur: number; mag: number }> = {
  near: { w: 130, opacity: 0.6, blur: 0, mag: 0.07 },
  mid: { w: 110, opacity: 0.48, blur: 0.5, mag: 0.045 },
  far: { w: 94, opacity: 0.38, blur: 1.1, mag: 0.022 },
};

type Doc = {
  side: "left" | "right";
  top: string;
  rot: number;
  layer: Layer;
  kind: "redacted" | "photo" | "memo";
};

// Left column drifts down (positive factor), ordered far -> near top-to-bottom
// so the faster near paper pulls away from the slower ones above it. Right
// column mirrors it, drifting up (negative), near at the top. The two nearest
// papers land on a diagonal (bottom-left / top-right) which reads as composed
// rather than scattered.
const DOCS: Doc[] = [
  { side: "left", top: "12vh", rot: -5, layer: "far", kind: "redacted" },
  { side: "left", top: "46vh", rot: 4, layer: "mid", kind: "memo" },
  { side: "left", top: "78vh", rot: -3, layer: "near", kind: "photo" },
  { side: "right", top: "14vh", rot: 5, layer: "near", kind: "photo" },
  { side: "right", top: "50vh", rot: -4, layer: "mid", kind: "redacted" },
  { side: "right", top: "82vh", rot: 3, layer: "far", kind: "memo" },
];

// Signed drift factor: left column positive (down), right negative (up).
function factorFor(d: Doc) {
  const mag = LAYER[d.layer].mag;
  return d.side === "left" ? mag : -mag;
}

function Memo({ w = 130 }: { w?: number }) {
  return (
    <div className="border border-manila-edge bg-sheet px-3 py-2.5 shadow-folder" style={{ width: w }}>
      <div className="mb-2 h-2 w-1/2 bg-pe/55" />
      {[92, 84, 76, 88].map((wi, i) => (
        <div key={i} className="mb-1.5 h-1 bg-ink/20" style={{ width: `${wi}%` }} />
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
    // Gated at 1400px, not xl: below that the gutter is too narrow to hold a
    // paper without clipping or touching the column.
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden min-[1400px]:block">
      {DOCS.map((d, i) => {
        const { w, opacity, blur } = LAYER[d.layer];
        // Center the paper in its gutter: the reading column is 64rem wide, so
        // each gutter is (100vw - 64rem)/2 and its center is (100vw - 64rem)/4.
        const gutterCenter = "calc((100vw - 64rem) / 4)";
        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: d.top,
              [d.side]: gutterCenter,
              transform: d.side === "left" ? "translateX(-50%)" : "translateX(50%)",
            }}
          >
            {/* Inner element carries the scroll-driven transform (translateY +
                rotate). Opacity and filter live here too and are untouched by
                the animation, which only rewrites `transform`. */}
            <div
              data-factor={factorFor(d)}
              data-rot={d.rot}
              style={{ transform: `rotate(${d.rot}deg)`, opacity, filter: blur ? `blur(${blur}px)` : undefined }}
            >
              <Pushpin className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/3" />
              {d.kind === "redacted" ? <RedactedDoc w={w} /> : d.kind === "photo" ? <PhotoCard w={w} /> : <Memo w={w} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
