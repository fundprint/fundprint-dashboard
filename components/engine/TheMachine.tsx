"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import EngineDiagram from "./EngineDiagram";
import { ENGINE_STAGES } from "./engine-stages";

// Loaded only in the browser, only where WebGL is available, and only past the
// first paint, so the static export ships the SVG and the 3D bundle never blocks.
const EngineScene = dynamic(() => import("./EngineScene"), {
  ssr: false,
  loading: () => null,
});

function canRender3D(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function TheMachine() {
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    // Wait a tick so the SVG paints first, then upgrade if we can.
    const id = window.setTimeout(() => setUse3D(canRender3D()), 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div>
      <div className="relative overflow-hidden rounded-sm border border-ink/20 bg-white shadow-folder">
        {/* corner registration marks */}
        <span className="pointer-events-none absolute left-2 top-2 z-10 h-3 w-3 border-l border-t border-ink/40" />
        <span className="pointer-events-none absolute right-2 top-2 z-10 h-3 w-3 border-r border-t border-ink/40" />
        <span className="pointer-events-none absolute bottom-2 left-2 z-10 h-3 w-3 border-b border-l border-ink/40" />
        <span className="pointer-events-none absolute bottom-2 right-2 z-10 h-3 w-3 border-b border-r border-ink/40" />

        <div style={{ aspectRatio: "1240 / 560" }} className="w-full">
          {use3D ? (
            <>
              <EngineScene className="h-full w-full" />
              {/* Keep the described figure reachable by assistive tech. */}
              <div className="sr-only">
                <EngineDiagram />
              </div>
            </>
          ) : (
            <div className="h-full w-full p-3 sm:p-5">
              <EngineDiagram className="h-full w-full" />
            </div>
          )}
        </div>
      </div>

      {use3D ? (
        <p className="mt-2 text-center font-mono text-[0.68rem] text-ink-muted">
          Live model &middot; hover a stage. Records flow left to right; verified
          chains exit at the right.
        </p>
      ) : null}

      {/* The five stages in words: always present, the accessible source of truth. */}
      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ENGINE_STAGES.map((s) => (
          <li key={s.key} className="folder flex flex-col px-3.5 py-3">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-bold text-pe">{s.numeral}</span>
              <span className="font-serif text-lg font-semibold leading-none">
                {s.name}
              </span>
            </div>
            <div className="mt-1.5 font-mono text-[0.66rem] uppercase tracking-wider text-pe/90">
              {s.metric}
            </div>
            <p className="mt-2 font-serif text-[0.92rem] leading-snug text-ink/80">
              {s.line}
            </p>
            <p className="mt-2 border-t border-rule pt-2 font-mono text-[0.68rem] leading-snug text-ink-muted">
              {s.detail}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
