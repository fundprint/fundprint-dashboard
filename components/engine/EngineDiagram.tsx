import { ENGINE_STAGES, type EngineStage } from "./engine-stages";

// The Machine as a static patent plate: ink linework on paper, mono callouts,
// blueprint framing. This is the accessible, no-JS baseline for Exhibit A (the
// 3D scene is layered on top only where supported) and also the source of the
// OG image. Pure SVG, server-rendered.

const W = 1240;
const H = 560;
const SHAFT_Y = 312;
const BLOCK_W = 150;
const BLOCK_H = 132;
const BLOCK_TOP = SHAFT_Y - BLOCK_H / 2;
const BX0 = 214;
const STEP = 176;

const INK = "#1b1c1a";
const PE = "#b3241c";
const MUTED = "#565851";
const RULE = "#c4c3b4";
const SHEET = "#f6f5ef";

function bolt(cx: number, cy: number, key: string) {
  return <circle key={key} cx={cx} cy={cy} r={2.4} fill={INK} opacity={0.55} />;
}

function Glyph({ stage, cx, cy }: { stage: EngineStage; cx: number; cy: number }) {
  const s = { stroke: INK, strokeWidth: 2, fill: "none" } as const;
  switch (stage.glyph) {
    case "intake":
      return (
        <g {...s}>
          <path d={`M${cx - 26} ${cy - 22} H${cx + 26} L${cx + 9} ${cy + 6} V${cy + 22} H${cx - 9} V${cy + 6} Z`} />
          <line x1={cx - 14} y1={cy - 22} x2={cx - 14} y2={cy - 10} opacity={0.5} />
          <line x1={cx} y1={cy - 22} x2={cx} y2={cy - 6} opacity={0.5} />
          <line x1={cx + 14} y1={cy - 22} x2={cx + 14} y2={cy - 10} opacity={0.5} />
        </g>
      );
    case "store":
      return (
        <g {...s}>
          <ellipse cx={cx} cy={cy - 14} rx={24} ry={7} />
          <path d={`M${cx - 24} ${cy - 14} V${cy + 6} A24 7 0 0 0 ${cx + 24} ${cy + 6} V${cy - 14}`} />
          <ellipse cx={cx} cy={cy + 6} rx={24} ry={7} opacity={0.6} />
          <circle cx={cx - 10} cy={cy + 20} r={1.6} fill={PE} stroke="none" />
          <circle cx={cx} cy={cy + 22} r={1.6} fill={PE} stroke="none" />
          <circle cx={cx + 11} cy={cy + 19} r={1.6} fill={PE} stroke="none" />
        </g>
      );
    case "resolve":
      return (
        <g {...s}>
          {[
            [cx - 12, cy - 4],
            [cx + 13, cy + 8],
          ].map(([gx, gy], i) => (
            <g key={i}>
              <circle cx={gx} cy={gy} r={14} />
              <circle cx={gx} cy={gy} r={5} opacity={0.6} />
              {Array.from({ length: 8 }).map((_, k) => {
                const a = (k / 8) * Math.PI * 2;
                return (
                  <line
                    key={k}
                    x1={gx + Math.cos(a) * 14}
                    y1={gy + Math.sin(a) * 14}
                    x2={gx + Math.cos(a) * 19}
                    y2={gy + Math.sin(a) * 19}
                  />
                );
              })}
            </g>
          ))}
        </g>
      );
    case "validate":
      return (
        <g {...s}>
          <path d={`M${cx - 24} ${cy - 20} H${cx + 24} L${cx + 6} ${cy + 4} V${cy + 22} H${cx - 6} V${cy + 4} Z`} />
          <line x1={cx - 16} y1={cy - 10} x2={cx + 16} y2={cy - 10} opacity={0.5} />
          <path d={`M${cx - 8} ${cy + 10} l6 7 l12 -14`} stroke={PE} strokeWidth={2.6} />
        </g>
      );
    case "publish":
      return (
        <g {...s}>
          <rect x={cx - 22} y={cy - 22} width={30} height={38} rx={1.5} />
          <line x1={cx - 15} y1={cy - 12} x2={cx + 1} y2={cy - 12} opacity={0.6} />
          <line x1={cx - 15} y1={cy - 4} x2={cx + 1} y2={cy - 4} opacity={0.6} />
          <line x1={cx - 15} y1={cy + 4} x2={cx - 4} y2={cy + 4} opacity={0.6} />
          <path d={`M${cx + 12} ${cy - 6} h16 M${cx + 24} ${cy - 10} l4 4 l-4 4`} stroke={PE} strokeWidth={2.4} />
        </g>
      );
  }
}

export default function EngineDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={{ width: "100%", height: "auto" }}
      role="img"
      aria-labelledby="engine-title engine-desc"
    >
      <title id="engine-title">The Fundprint ownership engine, Figure 1</title>
      <desc id="engine-desc">
        A schematic of the five-stage pipeline. Public records from the NPPES
        registry and owner directories enter at the intake on the left, pass
        through five machined stages, Acquire, Store, Resolve, Validate and
        Publish, along a drive shaft, and exit on the right as verified clinic to
        owner to parent-firm ownership chains.
      </desc>

      {/* Blueprint frame + corner ticks */}
      <rect x={16} y={16} width={W - 32} height={H - 32} fill="none" stroke={RULE} strokeWidth={1} />
      {[
        [16, 16],
        [W - 16, 16],
        [16, H - 16],
        [W - 16, H - 16],
      ].map(([x, y], i) => (
        <g key={i} stroke={INK} strokeWidth={1.4}>
          <line x1={x - 8} y1={y} x2={x + 8} y2={y} />
          <line x1={x} y1={y - 8} x2={x} y2={y + 8} />
        </g>
      ))}
      <text x={30} y={40} fill={MUTED} fontFamily="monospace" fontSize={12} letterSpacing={2}>
        FIG. 1 / THE OWNERSHIP ENGINE
      </text>
      <text x={W - 30} y={40} fill={MUTED} fontFamily="monospace" fontSize={12} letterSpacing={2} textAnchor="end">
        DETERMINISTIC / SOURCED
      </text>

      {/* Drive shaft with flow arrows */}
      <line x1={150} y1={SHAFT_Y} x2={1070} y2={SHAFT_Y} stroke={INK} strokeWidth={3} />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 176 + i * 100;
        return (
          <path key={i} d={`M${x} ${SHAFT_Y - 5} l8 5 l-8 5`} fill="none" stroke={PE} strokeWidth={2} opacity={0.8} />
        );
      })}

      {/* Intake: hopper fed by two record stacks */}
      <g fill="none" stroke={INK} strokeWidth={2}>
        <path d={`M56 150 H184 L150 250 V266 H90 V250 Z`} />
        {[0, 1, 2].map((i) => (
          <rect key={`n${i}`} x={70 + i * 6} y={120 - i * 8} width={44} height={26} rx={1.5} opacity={0.9 - i * 0.2} />
        ))}
      </g>
      <text x={120} y={108} fill={INK} fontFamily="monospace" fontSize={12} textAnchor="middle" fontWeight={600}>
        NPPES
      </text>
      <text x={120} y={286} fill={MUTED} fontFamily="monospace" fontSize={11} textAnchor="middle" letterSpacing={1.5}>
        + DIRECTORIES
      </text>
      <line x1={150} y1={266} x2={150} y2={SHAFT_Y} stroke={INK} strokeWidth={2} />

      {/* Five machined stages */}
      {ENGINE_STAGES.map((stage, i) => {
        const bx = BX0 + i * STEP;
        const cx = bx + BLOCK_W / 2;
        const above = i % 2 === 0;
        const calloutY = above ? 96 : H - 78;
        const leaderY0 = above ? BLOCK_TOP : BLOCK_TOP + BLOCK_H;
        const leaderY1 = above ? calloutY + 24 : calloutY - 40;
        return (
          <g key={stage.key}>
            {/* drive collar */}
            {i > 0 ? (
              <rect x={bx - 22} y={SHAFT_Y - 7} width={14} height={14} fill="#d0cfbf" stroke={INK} strokeWidth={1.5} />
            ) : null}

            {/* housing */}
            <rect x={bx} y={BLOCK_TOP} width={BLOCK_W} height={BLOCK_H} rx={3} fill={SHEET} stroke={INK} strokeWidth={2} />
            {[
              [bx + 8, BLOCK_TOP + 8],
              [bx + BLOCK_W - 8, BLOCK_TOP + 8],
              [bx + 8, BLOCK_TOP + BLOCK_H - 8],
              [bx + BLOCK_W - 8, BLOCK_TOP + BLOCK_H - 8],
            ].map(([x, y], k) => bolt(x, y, `${stage.key}-b${k}`))}

            <text x={bx + 14} y={BLOCK_TOP + 24} fill={PE} fontFamily="monospace" fontSize={13} fontWeight={700}>
              {stage.numeral}
            </text>
            <Glyph stage={stage} cx={cx} cy={SHAFT_Y - 4} />
            <text
              x={cx}
              y={BLOCK_TOP + BLOCK_H - 13}
              fill={INK}
              fontFamily="var(--font-display), 'Libre Caslon Text', Georgia, serif"
              fontSize={15}
              fontWeight={600}
              textAnchor="middle"
            >
              {stage.name}
            </text>

            {/* leader + callout */}
            <line x1={cx} y1={leaderY0} x2={cx} y2={leaderY1} stroke={MUTED} strokeWidth={1} strokeDasharray="2 3" />
            <circle cx={cx} cy={leaderY0} r={2.4} fill={PE} />
            <text x={cx} y={calloutY} fill={PE} fontFamily="monospace" fontSize={12} fontWeight={600} textAnchor="middle">
              {stage.metric}
            </text>
            <text x={cx} y={calloutY + (above ? 18 : 18)} fill={MUTED} fontFamily="monospace" fontSize={10.5} textAnchor="middle">
              {stage.verb.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* Output: verified ownership chain */}
      <g>
        <path d={`M1070 ${SHAFT_Y} h22 M1086 ${SHAFT_Y - 6} l8 6 l-8 6`} fill="none" stroke={INK} strokeWidth={2.5} />
        {[
          { y: SHAFT_Y - 54, label: "CLINIC" },
          { y: SHAFT_Y, label: "OWNER" },
          { y: SHAFT_Y + 54, label: "FIRM" },
        ].map((n, i, arr) => (
          <g key={n.label}>
            <circle cx={1150} cy={n.y} r={9} fill={SHEET} stroke={INK} strokeWidth={2} />
            {i < arr.length - 1 ? (
              <line x1={1150} y1={n.y + 9} x2={1150} y2={arr[i + 1].y - 9} stroke={INK} strokeWidth={2} />
            ) : null}
            <text x={1168} y={n.y + 4} fill={INK} fontFamily="monospace" fontSize={11} fontWeight={600}>
              {n.label}
            </text>
          </g>
        ))}
        <g transform={`rotate(-8 1150 ${SHAFT_Y + 96})`}>
          <rect x={1104} y={SHAFT_Y + 84} width={92} height={22} rx={2} fill="none" stroke={PE} strokeWidth={1.6} />
          <text x={1150} y={SHAFT_Y + 99} fill={PE} fontFamily="monospace" fontSize={11} fontWeight={700} textAnchor="middle" letterSpacing={2}>
            VERIFIED
          </text>
        </g>
      </g>

      {/* Scale bar */}
      <g stroke={MUTED} strokeWidth={1}>
        <line x1={30} y1={H - 34} x2={110} y2={H - 34} />
        <line x1={30} y1={H - 38} x2={30} y2={H - 30} />
        <line x1={110} y1={H - 38} x2={110} y2={H - 30} />
      </g>
      <text x={30} y={H - 44} fill={MUTED} fontFamily="monospace" fontSize={10} letterSpacing={1}>
        PIPELINE: 5 STAGES
      </text>
    </svg>
  );
}
