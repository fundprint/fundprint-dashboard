"use client";

import { Component, type ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import EngineDiagram from "./EngineDiagram";
import { ENGINE_STAGES } from "./engine-stages";

// If anything in the WebGL scene throws at runtime, fall back to the static
// figure instead of breaking the page. The SVG is always a complete substitute.
class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

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
      <div className="relative w-full overflow-hidden bg-sheet">
        {/* corner registration marks */}
        <span className="pointer-events-none absolute left-2 top-2 z-10 h-3.5 w-3.5 border-l border-t border-ink/40" />
        <span className="pointer-events-none absolute right-2 top-2 z-10 h-3.5 w-3.5 border-r border-t border-ink/40" />
        <span className="pointer-events-none absolute bottom-2 left-2 z-10 h-3.5 w-3.5 border-b border-l border-ink/40" />
        <span className="pointer-events-none absolute bottom-2 right-2 z-10 h-3.5 w-3.5 border-b border-r border-ink/40" />

        <div style={{ aspectRatio: "1240 / 450" }} className="w-full">
          {use3D ? (
            <SceneBoundary
              fallback={
                <div className="h-full w-full px-4 py-2">
                  <EngineDiagram className="h-full w-full" />
                </div>
              }
            >
              <EngineScene className="h-full w-full" />
              <div className="sr-only">
                <EngineDiagram />
              </div>
            </SceneBoundary>
          ) : (
            <div className="h-full w-full px-4 py-2">
              <EngineDiagram className="h-full w-full" />
            </div>
          )}
        </div>
      </div>

      {use3D ? (
        <p className="mt-2 text-center text-[0.72rem] text-ink-muted">
          Live model. Hover a stage; records flow left to right and exit as
          verified chains.
        </p>
      ) : null}

      {/* The five stages in words: always present, the accessible source. */}
      <ol className="mt-8 grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
        {ENGINE_STAGES.map((s) => (
          <li key={s.key} className="border-t border-ink/70 pt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-semibold text-pe">
                {s.numeral}
              </span>
              <span className="font-display text-lg font-semibold leading-none">
                {s.name}
              </span>
            </div>
            <div className="mt-1.5 text-[0.64rem] font-semibold uppercase tracking-wider text-pe">
              {s.metric}
            </div>
            <p className="mt-2 text-[0.95rem] leading-snug text-ink/85">{s.line}</p>
            <p className="mt-2 text-[0.78rem] leading-snug text-ink-muted">
              {s.detail}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
