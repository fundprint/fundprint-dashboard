"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { ENGINE_STAGES } from "./engine-stages";

// The Machine as a live blueprint model: five machined housings on a drive
// shaft, ink edges on a paper ground, with public "records" flowing through and
// out as chains. Camera is fixed (labels track cleanly, no font fetch); the
// parts breathe and the records flow. Decorative: the SVG diagram and the text
// cards carry the same information for assistive tech, so the canvas is hidden.

const INK = "#201d17";
const PE = "#8a1f1c";
const PAPER = "#f4eedb";
const XS = [-6, -3, 0, 3, 6];

function Housing({
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
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.position.y = Math.sin(t * 1.1 + index) * 0.06;
    const target = active ? 1.08 : 1;
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
      <RoundedBox args={[2, 2, 1.7]} radius={0.12} smoothness={3}>
        <meshBasicMaterial color={PAPER} transparent opacity={0.72} />
        <Edges threshold={15} color={active ? PE : INK} />
      </RoundedBox>
      {/* corner bolts */}
      {[
        [-0.8, 0.8],
        [0.8, 0.8],
        [-0.8, -0.8],
        [0.8, -0.8],
      ].map(([bx, by], i) => (
        <mesh key={i} position={[bx, by, 0.86]}>
          <circleGeometry args={[0.05, 12]} />
          <meshBasicMaterial color={INK} />
        </mesh>
      ))}
      <Html
        position={[0, 1.5, 0]}
        center
        distanceFactor={12}
        wrapperClass="engine-label"
        pointerEvents="none"
      >
        <div
          style={{
            fontFamily: "var(--font-display), 'Oswald', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: active ? PE : INK,
            whiteSpace: "nowrap",
          }}
        >
          {ENGINE_STAGES[index].numeral} &middot; {ENGINE_STAGES[index].name}
        </div>
      </Html>
    </group>
  );
}

const RECORD_COUNT = 54;

function Records() {
  const mesh = useMemo(() => {
    const geo = new THREE.BoxGeometry();
    const mat = new THREE.MeshBasicMaterial({
      color: PE,
      transparent: true,
      opacity: 0.85,
    });
    return new THREE.InstancedMesh(geo, mat, RECORD_COUNT);
  }, []);
  const seeds = useMemo(
    () =>
      Array.from({ length: RECORD_COUNT }).map((_, i) => ({
        speed: 1.6 + Math.random() * 1.4,
        y: (Math.random() - 0.5) * 1.2,
        z: (Math.random() - 0.5) * 1.0,
        offset: (i / RECORD_COUNT) * 18,
        spin: Math.random() * Math.PI,
      })),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const x = ((((t * s.speed + s.offset) % 18) + 18) % 18) - 9;
      dummy.position.set(x, s.y + Math.sin(t + i) * 0.05, s.z);
      dummy.rotation.set(0.3, t * 0.6 + s.spin, 0.2);
      const fade = x > 6.5 ? Math.max(0, 1 - (x - 6.5) / 2.5) : 1;
      const scl = 0.22 * fade;
      dummy.scale.set(scl, scl * 1.3, scl * 0.1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });
  return <primitive object={mesh} />;
}

function Machine() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <group rotation={[0.14, -0.4, 0]} scale={0.82}>
      {/* drive shaft */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 17, 12]} />
        <meshBasicMaterial color={INK} />
      </mesh>
      <Records />
      {XS.map((x, i) => (
        <Housing key={i} x={x} index={i} active={active === i} onHover={setActive} />
      ))}
      {/* output chain nodes */}
      {[1.1, 0, -1.1].map((y, i, arr) => (
        <group key={i}>
          <mesh position={[8.4, y, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshBasicMaterial color={PAPER} />
            <Edges threshold={15} color={INK} />
          </mesh>
          {i < arr.length - 1 ? (
            <mesh position={[8.4, (y + arr[i + 1]) / 2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.1, 8]} />
              <meshBasicMaterial color={INK} />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  );
}

export default function EngineScene({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.5, 18], fov: 30 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Machine />
      </Canvas>
    </div>
  );
}
