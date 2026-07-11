"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import statesTopo from "us-atlas/states-10m.json";
import { fmtNum } from "@/lib/format";
import {
  binFor,
  COVERAGE_BINS,
  FIPS_TO_POSTAL,
  STATE_NAME,
} from "@/lib/states";
import type { StateCount } from "@/lib/types";

// PE/institution-owned clinics by state. Coverage, not census - a darker state
// is better-covered, never "worse" (see docs/visualization.md). Color is never
// the only signal: a ranked table sits behind the map for colorblind and
// grayscale-screenshot readers.
export default function StateHeatmap({ states }: { states: StateCount[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const countBy = new Map(states.map((s) => [s.state, s.clinic_count]));

  return (
    <div>
      <div className="folder p-3">
        <ComposableMap
          projection="geoAlbersUsa"
          width={900}
          height={500}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={statesTopo as object}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo) => {
                const postal = FIPS_TO_POSTAL[geo.id as string];
                const count = (postal && countBy.get(postal)) || 0;
                const bin = binFor(count);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={bin.color}
                    stroke="#fbfaf7"
                    strokeWidth={0.75}
                    onMouseEnter={() =>
                      setHover(
                        postal
                          ? `${STATE_NAME[postal] ?? postal}: ${fmtNum(count)} tracked`
                          : null,
                      )
                    }
                    onMouseLeave={() => setHover(null)}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", opacity: 0.85 },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        <div className="flex items-center justify-between px-1 pt-2">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-ink-muted">
            {COVERAGE_BINS.map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-3 rounded-sm border border-black/10"
                  style={{ background: b.color }}
                />
                {b.label}
              </span>
            ))}
          </div>
          <span className="min-h-4 font-mono text-xs font-medium text-ink/75">
            {hover}
          </span>
        </div>
      </div>

      {/* Text alternative: the same numbers, reachable without the map. */}
      <details className="mt-3">
        <summary className="cursor-pointer font-mono text-sm text-ink-muted hover:text-pe">
          Show the numbers as a table
        </summary>
        <div className="folder mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-left">
                <th className="label-mono px-4 py-2">State</th>
                <th className="label-mono px-4 py-2 text-right">Clinics tracked</th>
              </tr>
            </thead>
            <tbody>
              {[...states]
                .sort((a, b) => b.clinic_count - a.clinic_count)
                .map((s) => (
                  <tr key={s.state} className="border-b border-rule last:border-0">
                    <td className="px-4 py-2 font-serif">{STATE_NAME[s.state] ?? s.state}</td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums">
                      {fmtNum(s.clinic_count)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
