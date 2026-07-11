"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import statesTopo from "us-atlas/states-10m.json";
import { fmtNum } from "@/lib/format";
import { FIRM_TYPE_COLOR, type Acquirer, type Clinic } from "@/lib/types";

// The interactive map: one dot per located clinic on an Albers-USA projection,
// colored by owner type. Filter by owner to see a single firm's national
// footprint. Fully self-contained (bundled TopoJSON, no tiles, no API, no
// keys), so it stays static-export and offline-friendly. A ranked table below
// (in the page) is the text alternative; color is never the only signal.

type MapClinic = Pick<
  Clinic,
  "id" | "name" | "city" | "state" | "lat" | "lng" | "firm_id" | "firm_name" | "firm_type" | "owner_name"
>;

export default function ClinicMap({
  clinics,
  acquirers,
}: {
  clinics: MapClinic[];
  acquirers: Acquirer[];
}) {
  const [firm, setFirm] = useState<string | null>(null);
  const [hover, setHover] = useState<MapClinic | null>(null);

  const located = useMemo(
    () => clinics.filter((c) => c.lat != null && c.lng != null),
    [clinics],
  );
  const topFirms = useMemo(
    () =>
      [...acquirers]
        .filter((a) => a.clinic_count > 0)
        .sort((a, b) => b.clinic_count - a.clinic_count)
        .slice(0, 8),
    [acquirers],
  );

  return (
    <div>
      {/* Filter by owner */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFirm(null)}
          className={`rounded-sm border px-2.5 py-1 font-mono text-xs transition-colors ${
            firm === null
              ? "border-ink bg-ink text-paper"
              : "border-rule bg-white text-ink/70 hover:border-ink"
          }`}
        >
          All owners
        </button>
        {topFirms.map((a) => (
          <button
            key={a.id}
            onClick={() => setFirm(firm === a.id ? null : a.id)}
            className={`rounded-sm border px-2.5 py-1 font-mono text-xs transition-colors ${
              firm === a.id
                ? "border-ink text-paper"
                : "border-rule bg-white text-ink/70 hover:border-ink"
            }`}
            style={firm === a.id ? { backgroundColor: FIRM_TYPE_COLOR[a.firm_type] } : undefined}
          >
            {a.name} <span className="opacity-60">{a.clinic_count}</span>
          </button>
        ))}
      </div>

      <div className="relative folder p-2 sm:p-3">
        <ComposableMap
          projection="geoAlbersUsa"
          width={900}
          height={520}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={statesTopo as object}>
            {({ geographies }: { geographies: unknown[] }) =>
              (geographies as { rsmKey: string }[]).map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo as object}
                  fill="#e7e6da"
                  stroke="#c4c3b4"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#e7e6da" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {located.map((c) => {
            const dim = firm !== null && c.firm_id !== firm;
            const color = FIRM_TYPE_COLOR[c.firm_type];
            const active = firm !== null && c.firm_id === firm;
            return (
              <Marker key={c.id} coordinates={[c.lng as number, c.lat as number]}>
                <circle
                  r={active ? 4 : 2.6}
                  fill={dim ? "#c9c2b2" : color}
                  fillOpacity={dim ? 0.35 : 0.82}
                  stroke={active ? "#12161c" : "none"}
                  strokeWidth={active ? 0.6 : 0}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHover(c)}
                  onMouseLeave={() => setHover(null)}
                />
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Hover readout */}
        <div className="pointer-events-none absolute left-3 top-3 max-w-[70%]">
          {hover ? (
            <div className="folder px-3 py-2">
              <div className="font-sans text-sm font-semibold leading-tight">
                {hover.name}
              </div>
              <div className="font-mono text-[0.7rem] text-ink-muted">
                {[hover.city, hover.state].filter(Boolean).join(", ")}
              </div>
              <div className="mt-1 font-mono text-[0.7rem]">
                <span style={{ color: FIRM_TYPE_COLOR[hover.firm_type] }}>&#9679;</span>{" "}
                {hover.owner_name} &middot; {hover.firm_name}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {(["private_equity", "pension_fund", "family_office", "other"] as const).map(
            (t) => (
              <span key={t} className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-ink-muted">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: FIRM_TYPE_COLOR[t] }} />
                {t.replace("_", " ")}
              </span>
            ),
          )}
        </div>
        {firm ? (
          <Link href={`/acquirers/${firm}/`} className="font-mono text-xs text-pe hover:underline">
            Open owner file
          </Link>
        ) : null}
      </div>
    </div>
  );
}
