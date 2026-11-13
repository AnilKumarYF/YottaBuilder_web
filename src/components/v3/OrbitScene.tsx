"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

export type OrbitRingMeta = { key: string; label: string; items: string[]; color: string };
type OrbitRing = OrbitRingMeta & { radius: number; tilt: [number, number, number]; speed: number };

/** Geometry per ring, by index (innermost first). Metadata comes from the section. */
const GEOMETRY: Pick<OrbitRing, "radius" | "tilt" | "speed">[] = [
  { radius: 2.1, tilt: [1.2, 0.2, 0.15], speed: 0.16 },
  { radius: 2.85, tilt: [1.45, -0.35, -0.25], speed: -0.12 },
  { radius: 3.6, tilt: [1.05, 0.45, 0.4], speed: 0.09 },
  { radius: 4.35, tilt: [1.35, -0.15, -0.5], speed: -0.07 },
];

type Labels = MutableRefObject<Record<string, HTMLElement | null>>;

function Core({ animate }: { animate: boolean }) {
  const g = useRef<THREE.Group>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.95, 1)), []);
  useEffect(() => () => edges.dispose(), [edges]);
  useFrame((s, d) => {
    if (!animate || !g.current) return;
    g.current.rotation.y += d * 0.25;
    g.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.3) * 0.2;
    const k = 1 + Math.sin(s.clock.elapsedTime * 1.6) * 0.03;
    g.current.scale.setScalar(k);
  });
  return (
    <group ref={g}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#7fe6e8" transparent opacity={0.85} />
      </lineSegments>
      <mesh>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial color="#0e7f84" emissive="#22c3c9" emissiveIntensity={1.4} metalness={0.3} roughness={0.35} flatShading />
      </mesh>
      <pointLight color="#22c3c9" intensity={8} distance={7} />
    </group>
  );
}

function Rings({ animate, active, labels, showLabels, meta }: { animate: boolean; active: string | null; labels: Labels; showLabels: boolean; meta: OrbitRingMeta[] }) {
  const ORBIT_RINGS = useMemo<OrbitRing[]>(() => meta.map((m, i) => ({ ...m, ...GEOMETRY[i % GEOMETRY.length] })), [meta]);
  const { camera, size } = useThree();
  const nodeRefs = useRef<Record<string, THREE.Mesh | null>>({});
  const ringMats = useRef<Record<string, THREE.LineBasicMaterial | null>>({});
  const nodeMats = useRef<Record<string, THREE.MeshBasicMaterial[]>>({});
  const spin = useRef<Record<string, THREE.Group | null>>({});
  const circles = useMemo(
    () =>
      Object.fromEntries(
        ORBIT_RINGS.map((r) => {
          const pts = Array.from({ length: 129 }, (_, i) => {
            const a = (i / 128) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(a) * r.radius, Math.sin(a) * r.radius, 0);
          });
          return [r.key, new THREE.BufferGeometry().setFromPoints(pts)];
        }),
      ),
    [ORBIT_RINGS],
  );
  useEffect(() => () => Object.values(circles).forEach((g) => g.dispose()), [circles]);

  const v = useMemo(() => new THREE.Vector3(), []);
  const camSpace = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, d) => {
    for (const r of ORBIT_RINGS) {
      const g = spin.current[r.key];
      if (g && animate) g.rotation.z += d * r.speed;
      const on = !active || active === r.key;
      const ringMat = ringMats.current[r.key];
      if (ringMat) ringMat.opacity += ((on ? (active ? 0.75 : 0.32) : 0.07) - ringMat.opacity) * 0.12;
      for (const m of nodeMats.current[r.key] ?? []) m.opacity += ((on ? 1 : 0.15) - m.opacity) * 0.12;

      r.items.forEach((name) => {
        const id = `${r.key}:${name}`;
        const mesh = nodeRefs.current[id];
        const el = labels.current[id];
        if (!mesh || !el) return;
        if (!showLabels) {
          el.style.opacity = "0";
          return;
        }
        mesh.getWorldPosition(v);
        camSpace.copy(v).applyMatrix4(camera.matrixWorldInverse);
        v.project(camera);
        const x = (v.x * 0.5 + 0.5) * size.width;
        const y = (-v.y * 0.5 + 0.5) * size.height;
        const behind = camSpace.z < -camera.position.length(); // farther than the core
        const base = on ? 1 : 0.18;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -160%)`;
        el.style.opacity = String(behind ? base * 0.4 : base);
        el.style.zIndex = behind ? "0" : "1";
      });
    }
  });

  return (
    <>
      {ORBIT_RINGS.map((r) => (
        <group key={r.key} rotation={r.tilt}>
          <lineLoop geometry={circles[r.key]}>
            <lineBasicMaterial
              ref={(m) => {
                ringMats.current[r.key] = m;
              }}
              color={r.color}
              transparent
              opacity={0.32}
            />
          </lineLoop>
          <group
            ref={(g) => {
              spin.current[r.key] = g;
            }}
          >
            {r.items.map((name, i) => {
              const a = (i / r.items.length) * Math.PI * 2 + r.radius;
              return (
                <mesh
                  key={name}
                  ref={(m) => {
                    nodeRefs.current[`${r.key}:${name}`] = m;
                  }}
                  position={[Math.cos(a) * r.radius, Math.sin(a) * r.radius, 0]}
                >
                  <sphereGeometry args={[0.075, 16, 16]} />
                  <meshBasicMaterial
                    ref={(m) => {
                      if (!m) return;
                      const list = (nodeMats.current[r.key] ??= []);
                      if (!list.includes(m)) list.push(m);
                    }}
                    color={r.color}
                    transparent
                  />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}
    </>
  );
}

function Dust({ count }: { count: number }) {
  const geo = useMemo(() => {
    const arr = new Float32Array(count * 3);
    let s = 11;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647) * 2 - 1;
    for (let i = 0; i < count; i++) {
      const rad = 5 + Math.abs(r()) * 7;
      const th = r() * Math.PI;
      const ph = r() * Math.PI;
      arr.set([rad * Math.cos(th) * Math.cos(ph), rad * Math.sin(ph) * 0.6, rad * Math.sin(th) * Math.cos(ph)], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.025} color="#9aa1ac" transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

function Rig({ animate }: { animate: boolean }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useFrame((s) => {
    const t = animate ? s.clock.elapsedTime : 0;
    const tx = Math.sin(t * 0.08) * 0.8 + (animate ? mouse.current.x : 0) * 0.9;
    const ty = 1.4 - (animate ? mouse.current.y : 0) * 0.6;
    camera.position.x += (tx - camera.position.x) * 0.035;
    camera.position.y += (ty - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function OrbitScene({
  className,
  active,
  labels,
  showLabels,
  rings,
  mobile = false,
}: {
  rings: OrbitRingMeta[];
  className?: string;
  active: string | null;
  labels: Labels;
  showLabels: boolean;
  mobile?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Reduced motion: nothing orbits or drifts, but frames keep running so ring highlighting still responds.
  const animate = !reduce;
  return (
    <div ref={wrap} className={className} aria-hidden>
      <Canvas
        frameloop={!inView || hidden ? "never" : "always"}
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.4, 10.5], fov: 45, near: 0.1, far: 80 }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.5} />
        <Core animate={animate} />
        <Rings animate={animate} active={active} labels={labels} showLabels={showLabels} meta={rings} />
        <Dust count={mobile ? 150 : 400} />
        <Rig animate={animate} />
      </Canvas>
    </div>
  );
}
