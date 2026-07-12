"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { Edges, Html } from "@react-three/drei";
import * as THREE from "three";
import { ENGINE_STAGES } from "./engine-stages";

// The Machine as a live blueprint model: ink linework on a paper ground, built
// to carry the same information as Figure 1 (the SVG). Records are pulled in at
// the intake hopper on the left, ride the drive shaft left-to-right through five
// DIFFERENTIATED stations -- each with the mechanism its job implies -- meet the
// validation gate (which rejects some), and leave on the right as a verified
// clinic -> owner -> firm chain. Flat shading is deliberate: this is a drawing
// that moves, not a rendered object. Camera is fixed so labels track cleanly.
// Decorative: the SVG diagram and the stage list carry the same information for
// assistive tech, so the canvas is aria-hidden.

const INK = "#1b1c1a";
const PE = "#b3241c";
const PAPER = "#f6f5ef";
const RULE = "#c4c3b4";

const XS = [-6, -3, 0, 3, 6];
const GATE_X = XS[3]; // Validate: where rejected records peel away
const INTAKE_X = -7.9;
const OUTPUT_X = 8.6;

// The source pile sits forward of the shaft (toward the camera). Records are
// born there and fly down onto the shaft line by the time they reach Acquire.
const SOURCE_Y = 0.1;
const SOURCE_Z = 3.7;
const MERGE_X = -6.9;

// Two source stacks (NPPES + directories), staggered in depth. Shared so the
// bob animation and the record spawn point stay in sync.
const STACKS = [
  { x: -0.35, y: 0.55, z: 0.7 },
  { x: 0.3, y: 0.2, z: -0.55 },
];

// ----- reusable mechanism parts -------------------------------------------

function InkMesh({
  children,
  edge = INK,
  fill = PAPER,
  opacity = 0.5,
  ...props
}: {
  children: React.ReactNode;
  edge?: string;
  fill?: string;
  opacity?: number;
} & ThreeElements["mesh"]) {
  return (
    <mesh {...props}>
      {children}
      <meshBasicMaterial color={fill} transparent opacity={opacity} />
      <Edges threshold={15} color={edge} />
    </mesh>
  );
}

// A cog that reads as a gear: a thin disc facing the camera with square teeth
// around its rim. Spins in the screen plane.
function Gear({ r, teeth, spin, color = INK }: { r: number; teeth: number; spin: number; color?: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = s.clock.elapsedTime * spin;
  });
  return (
    <group ref={ref}>
      <InkMesh rotation={[Math.PI / 2, 0, 0]} edge={color} opacity={0.55}>
        <cylinderGeometry args={[r, r, 0.14, 24]} />
      </InkMesh>
      <InkMesh rotation={[Math.PI / 2, 0, 0]} edge={color} opacity={0.7}>
        <cylinderGeometry args={[r * 0.28, r * 0.28, 0.16, 12]} />
      </InkMesh>
      {Array.from({ length: teeth }).map((_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return (
          <InkMesh
            key={i}
            position={[Math.cos(a) * r, Math.sin(a) * r, 0]}
            rotation={[0, 0, a]}
            edge={color}
            opacity={0.55}
          >
            <boxGeometry args={[r * 0.34, r * 0.24, 0.14]} />
          </InkMesh>
        );
      })}
    </group>
  );
}

// Per-stage mechanism, centered in the housing on the shaft line.
function Mechanism({ glyph, active }: { glyph: string; active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const edge = active ? PE : INK;

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const g = ref.current;
    if (!g) return;
    if (glyph === "store") g.rotation.y = t * 0.6;
    if (glyph === "publish") g.position.y = Math.sin(t * 2) * 0.05;
  });

  switch (glyph) {
    case "intake":
      // A hopper feeding the shaft: wide square funnel narrowing down.
      return (
        <group ref={ref} position={[0, 0.15, 0]}>
          <InkMesh rotation={[0, Math.PI / 4, 0]} edge={edge} opacity={0.4}>
            <cylinderGeometry args={[0.72, 0.24, 0.9, 4, 1, true]} />
          </InkMesh>
          {[0, 1, 2].map((i) => (
            <InkMesh key={i} position={[0, 0.62 + i * 0.14, 0]} edge={edge} opacity={0.85} fill={i === 0 ? PE : PAPER}>
              <boxGeometry args={[0.62 - i * 0.06, 0.05, 0.42]} />
            </InkMesh>
          ))}
        </group>
      );
    case "store":
      // A database: a short stack of platters that turns.
      return (
        <group ref={ref}>
          {[-0.28, 0, 0.28].map((y) => (
            <InkMesh key={y} position={[0, y, 0]} edge={edge} opacity={0.5}>
              <cylinderGeometry args={[0.62, 0.62, 0.16, 28]} />
            </InkMesh>
          ))}
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2;
            return (
              <mesh key={`d${i}`} position={[Math.cos(a) * 0.4, 0.3, Math.sin(a) * 0.4]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial color={PE} />
              </mesh>
            );
          })}
        </group>
      );
    case "resolve":
      // Two meshing gears: names matched into a chain.
      return (
        <group ref={ref}>
          <group position={[-0.34, 0.18, 0]}>
            <Gear r={0.44} teeth={9} spin={0.9} color={edge} />
          </group>
          <group position={[0.36, -0.16, 0]}>
            <Gear r={0.34} teeth={7} spin={-1.16} color={edge} />
          </group>
        </group>
      );
    case "validate": {
      // A gate: a funnel with a checkmark, and a red reject chute to the side.
      return (
        <group ref={ref}>
          <InkMesh position={[0, -0.1, 0]} edge={edge} opacity={0.4}>
            <cylinderGeometry args={[0.6, 0.16, 0.86, 20, 1, true]} />
          </InkMesh>
          {/* pass mark, sitting in front of the gate mouth so it reads */}
          <group position={[0, 0.42, 0.66]}>
            <mesh position={[-0.13, -0.05, 0]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.09, 0.26, 0.06]} />
              <meshBasicMaterial color={PE} />
            </mesh>
            <mesh position={[0.07, 0.09, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[0.09, 0.46, 0.06]} />
              <meshBasicMaterial color={PE} />
            </mesh>
          </group>
        </group>
      );
    }
    case "publish":
      // An emitter: a document card that pushes verified claims out.
      return (
        <group ref={ref} rotation={[0, -0.3, 0]}>
          {/* the emitted claim: a solid sheet with ruling, not a ghost */}
          <InkMesh position={[-0.1, 0.15, 0]} edge={edge} fill="#ffffff" opacity={1}>
            <boxGeometry args={[0.6, 0.8, 0.05]} />
          </InkMesh>
          {[0.26, 0.13, 0, -0.13].map((y, i) => (
            <mesh key={y} position={[-0.14, 0.15 + y, 0.06]}>
              <boxGeometry args={[i === 0 ? 0.24 : 0.36, 0.035, 0.02]} />
              <meshBasicMaterial color={i === 0 ? PE : INK} transparent opacity={i === 0 ? 0.9 : 0.6} />
            </mesh>
          ))}
          {/* arrow pushing the claim out toward the chain */}
          <mesh position={[0.42, 0.15, 0.06]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.16, 0.3, 4]} />
            <meshBasicMaterial color={PE} />
          </mesh>
          <mesh position={[0.28, 0.15, 0.06]}>
            <boxGeometry args={[0.14, 0.07, 0.02]} />
            <meshBasicMaterial color={PE} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

// ----- one station ---------------------------------------------------------

function Station({
  x,
  index,
  active,
  onHover,
}: {
  x: number;
  index: number;
  active: boolean;
  onHover: (i: number | null) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const stage = ENGINE_STAGES[index];
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.position.y = Math.sin(t * 0.9 + index) * 0.05;
    const target = active ? 1.06 : 1;
    g.scale.x += (target - g.scale.x) * 0.12;
    g.scale.y = g.scale.z = g.scale.x;
  });
  return (
    <group
      ref={ref}
      position={[x, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(index);
      }}
      onPointerOut={() => onHover(null)}
    >
      {/* open machined housing: an outlined frame, corner bolts */}
      <InkMesh edge={active ? PE : INK} opacity={0.14}>
        <boxGeometry args={[1.9, 2, 1.7]} />
      </InkMesh>
      {[
        [-0.78, 0.82],
        [0.78, 0.82],
        [-0.78, -0.82],
        [0.78, -0.82],
      ].map(([bx, by], i) => (
        <mesh key={i} position={[bx, by, 0.86]}>
          <circleGeometry args={[0.05, 12]} />
          <meshBasicMaterial color={active ? PE : INK} />
        </mesh>
      ))}

      <Mechanism glyph={stage.glyph} active={active} />

      <Html position={[0, 1.42, 0]} center distanceFactor={11} pointerEvents="none">
        <div
          style={{
            fontFamily: "var(--font-display), 'Libre Caslon Text', serif",
            fontSize: 17,
            fontWeight: 700,
            color: active ? PE : INK,
            whiteSpace: "nowrap",
          }}
        >
          {stage.numeral}
          <span style={{ opacity: 0.4 }}> · </span>
          {stage.name}
        </div>
      </Html>
    </group>
  );
}

// ----- the record stream ---------------------------------------------------

const RECORD_COUNT = 26;
const FLOW_SPAN = OUTPUT_X - INTAKE_X; // travel distance before wrapping

function Records() {
  const mesh = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.34, 0.44, 0.03);
    const mat = new THREE.MeshBasicMaterial({ color: PE, transparent: true, opacity: 0.9 });
    const m = new THREE.InstancedMesh(geo, mat, RECORD_COUNT);
    m.frustumCulled = false;
    return m;
  }, []);
  // Evenly spaced along the line so the stream reads as an orderly conveyor,
  // not a swarm. Every fourth record is a reject that peels off at the gate.
  const seeds = useMemo(
    () =>
      Array.from({ length: RECORD_COUNT }).map((_, i) => ({
        phase: i / RECORD_COUNT,
        lane: ((i % 3) - 1) * 0.28,
        reject: i % 4 === 0,
      })),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const speed = 0.09;
    seeds.forEach((s, i) => {
      const p = (s.phase + t * speed) % 1;
      const x = INTAKE_X + p * FLOW_SPAN;

      const laneY = s.lane * 0.35;
      const laneZ = s.lane * 0.5;
      let y: number;
      let z: number;
      let fade = 1;
      let tumble = 0.15;
      const scl = 0.85;

      if (x < MERGE_X) {
        // feed phase: the record flies out of the foreground source pile and
        // drops onto the shaft line, arriving by the time it reaches Acquire.
        const tt = THREE.MathUtils.clamp((x - INTAKE_X) / (MERGE_X - INTAKE_X), 0, 1);
        const e = tt * tt * (3 - 2 * tt);
        y = THREE.MathUtils.lerp(SOURCE_Y, laneY, e);
        z = THREE.MathUtils.lerp(SOURCE_Z, laneZ, e);
        fade = Math.min(1, tt / 0.12);
        tumble = 0.15 + (1 - e) * 1.1;
      } else {
        y = laneY;
        z = laneZ;
        // fade out approaching the output
        if (x > OUTPUT_X - 1.2) fade = Math.max(0, (OUTPUT_X - x) / 1.2);
        // rejects peel downward just past the validation gate
        if (s.reject && x > GATE_X) {
          const d = x - GATE_X;
          y -= d * d * 0.5;
          fade *= Math.max(0, 1 - d / 2.4);
          tumble = -d * 0.6;
        }
      }

      dummy.position.set(x, y, z);
      dummy.rotation.set(0.2, 0, tumble);
      const f = scl * fade;
      dummy.scale.set(f, f, f);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return <primitive object={mesh} />;
}

// ----- intake + output ------------------------------------------------------

function Intake() {
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    STACKS.forEach((p, i) => {
      const g = refs.current[i];
      if (g) g.position.y = p.y + Math.sin(t * 1.9 + i * 1.5) * 0.2;
    });
  });
  return (
    // Sat forward of the shaft, toward the camera, so the two sources read as a
    // foreground pile feeding the machine rather than a flat shape on the line.
    <group position={[INTAKE_X + 0.4, -0.35, 3.9]} rotation={[0, 0.5, 0]} scale={1.28}>
      {/* two source stacks: NPPES + directories, staggered in depth, bobbing */}
      {STACKS.map((p, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el; }} position={[p.x, p.y, p.z]}>
          {[0, 1, 2, 3].map((j) => (
            <InkMesh key={j} position={[0, j * 0.13, 0]} edge={INK} opacity={0.88 - j * 0.14}>
              <boxGeometry args={[0.56, 0.09, 0.4]} />
            </InkMesh>
          ))}
        </group>
      ))}
      <Html position={[0, -0.5, 0.1]} center distanceFactor={11} pointerEvents="none">
        <div style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 11, letterSpacing: 1, color: INK, whiteSpace: "nowrap" }}>
          NPPES + DIRECTORIES
        </div>
      </Html>
    </group>
  );
}

function Output() {
  const nodes = [
    { y: 1.0, label: "CLINIC" },
    { y: 0, label: "OWNER" },
    { y: -1.0, label: "FIRM" },
  ];
  return (
    <group position={[OUTPUT_X, 0, 0]}>
      {nodes.map((n, i) => (
        <group key={n.label}>
          <InkMesh position={[0, n.y, 0]} edge={INK} fill={PAPER} opacity={0.85}>
            <sphereGeometry args={[0.18, 18, 18]} />
          </InkMesh>
          {i < nodes.length - 1 ? (
            <mesh position={[0, (n.y + nodes[i + 1].y) / 2, 0]}>
              <cylinderGeometry args={[0.025, 0.025, Math.abs(n.y - nodes[i + 1].y) - 0.36, 8]} />
              <meshBasicMaterial color={INK} />
            </mesh>
          ) : null}
          <Html position={[0.32, n.y, 0]} distanceFactor={13} pointerEvents="none">
            <div style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: 1, color: INK, whiteSpace: "nowrap" }}>
              {n.label}
            </div>
          </Html>
        </group>
      ))}
      <Html position={[0, -1.7, 0]} center distanceFactor={12} pointerEvents="none">
        <div
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            color: PE,
            border: `1.5px solid ${PE}`,
            padding: "2px 6px",
            transform: "rotate(-8deg)",
            whiteSpace: "nowrap",
          }}
        >
          VERIFIED
        </div>
      </Html>
    </group>
  );
}

// ----- assembly -------------------------------------------------------------

function BlueprintFloor() {
  // A single-colour grid, no coloured centre line. Sits below the machine to
  // give depth without competing with the ink.
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(46, 26, RULE, RULE);
    (g.material as THREE.Material).transparent = true;
    (g.material as THREE.Material).opacity = 0.32;
    return g;
  }, []);
  return <primitive object={grid} position={[0, -1.9, 0]} />;
}

function Machine() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <group rotation={[0.09, -0.26, 0]} scale={0.96} position={[0, 0.1, 0]}>
      <BlueprintFloor />
      <Intake />
      <Records />
      {XS.map((x, i) => (
        <Station key={i} x={x} index={i} active={active === i} onHover={setActive} />
      ))}
      <Output />
    </group>
  );
}

export default function EngineScene({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.6, 13.4], fov: 34 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Machine />
      </Canvas>
    </div>
  );
}
