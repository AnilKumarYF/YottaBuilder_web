"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
 * "Lattice cube" — an isometric cube assembled from thin channels, echoing the
 * bar language of the YottaFlex mark without reproducing it.
 * Colour semantics: brand/electric = AI work, gold = human approval gates,
 * teal = verified output.
 * ------------------------------------------------------------------------- */

type Kind = 0 | 1 | 2 | 3; // 0 brand blue, 1 electric, 2 gold, 3 teal
type Bar = { pos: THREE.Vector3; scale: THREE.Vector3; kind: Kind };

const T = 0.075; // bar thickness in-plane
const D = 0.11; // bar depth (out of plane)
const ISO_X = Math.atan(1 / Math.SQRT2); // ~35.26° — classic isometric tilt
const IDENT = new THREE.Quaternion();

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildBars(): Bar[] {
  const rnd = mulberry32(20260213);
  const axes = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
  const bars: Bar[] = [];
  const seg = 0.5;
  const starts = [-1, -0.5, 0, 0.5];
  const lines = [-0.5, 0, 0.5];

  // Maze-like channels on each of the six faces.
  for (let n = 0; n < 3; n++) {
    for (const s of [1, -1]) {
      const normal = axes[n].clone().multiplyScalar(s);
      const ua = axes[(n + 1) % 3];
      const va = axes[(n + 2) % 3];
      for (const [dir, other] of [
        [ua, va],
        [va, ua],
      ] as const) {
        for (const l of lines) {
          let run: number[] = [];
          const flush = () => {
            if (!run.length) return;
            const a = run[0];
            const b = run[run.length - 1] + seg;
            const mid = (a + b) / 2;
            const len = b - a - T;
            const pos = normal
              .clone()
              .multiplyScalar(1 + D / 2)
              .addScaledVector(dir, mid)
              .addScaledVector(other, l);
            const scale = new THREE.Vector3().addScaledVector(dir, len).addScaledVector(other, T).addScaledVector(axes[n], D);
            bars.push({ pos, scale, kind: rnd() < 0.38 ? 1 : 0 });
            run = [];
          };
          for (const c of starts) {
            if (rnd() < 0.52) run.push(c);
            else flush();
          }
          flush();
        }
      }
    }
  }

  // Accent bars: a few approval gates (gold) and verified outputs (teal).
  const pick = (count: number, kind: Kind) => {
    let placed = 0;
    let guard = 0;
    while (placed < count && guard++ < 500) {
      const b = bars[Math.floor(rnd() * bars.length)];
      if (b.kind < 2) {
        b.kind = kind;
        placed++;
      }
    }
  };
  pick(5, 2);
  pick(3, 3);

  // Structural frame: the twelve cube edges.
  const e = 1 + D / 2;
  for (let a = 0; a < 3; a++) {
    const o1 = axes[(a + 1) % 3];
    const o2 = axes[(a + 2) % 3];
    for (const s1 of [1, -1])
      for (const s2 of [1, -1]) {
        const pos = new THREE.Vector3().addScaledVector(o1, s1 * e).addScaledVector(o2, s2 * e);
        const scale = new THREE.Vector3().addScaledVector(axes[a], 2 + 2 * D).addScaledVector(o1, D).addScaledVector(o2, D);
        bars.push({ pos, scale, kind: 0 });
      }
  }
  return bars;
}

const easeOutQuart = (p: number) => 1 - Math.pow(1 - p, 4);

function BarSet({ bars, material, colors, reduced, seed }: { bars: Bar[]; material: THREE.Material; colors?: THREE.Color[]; reduced: boolean; seed: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const invalidate = useThree((s) => s.invalidate);
  const done = useRef(false);
  const t0 = useRef<number | null>(null);

  const data = useMemo(() => {
    const rnd = mulberry32(seed);
    return bars.map((b) => {
      const dir = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize();
      return {
        ...b,
        start: b.pos.clone().addScaledVector(dir, 2.4 + rnd() * 3.2),
        rot: new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI)),
        delay: 0.1 + rnd() * 1.1,
      };
    });
  }, [bars, seed]);

  const write = (progress: (i: number) => number) => {
    data.forEach((d, i) => {
      const e = easeOutQuart(progress(i));
      dummy.position.lerpVectors(d.start, d.pos, e);
      dummy.quaternion.slerpQuaternions(d.rot, IDENT, e);
      dummy.scale.copy(d.scale).multiplyScalar(0.25 + 0.75 * e);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  };

  useLayoutEffect(() => {
    if (colors) colors.forEach((c, i) => ref.current.setColorAt(i, c));
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    write(() => (reduced ? 1 : 0));
    if (reduced) done.current = true;
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, colors, reduced]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (done.current) return;
    if (t0.current === null) t0.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - t0.current;
    let all = true;
    write((i) => {
      const p = Math.min(1, Math.max(0, (t - data[i].delay) / 1.5));
      if (p < 1) all = false;
      return p;
    });
    if (all) done.current = true;
  });

  return <instancedMesh ref={ref} args={[geometry, material, data.length]} frustumCulled={false} />;
}

function Lattice({ reduced }: { reduced: boolean }) {
  const bars = useMemo(buildBars, []);
  const groups = useMemo(() => {
    const blue = bars.filter((b) => b.kind < 2);
    return {
      blue,
      blueColors: blue.map((b) => new THREE.Color(b.kind === 1 ? "#22c3c9" : "#3b424c")),
      gold: bars.filter((b) => b.kind === 2),
      teal: bars.filter((b) => b.kind === 3),
    };
  }, [bars]);

  const mats = useMemo(
    () => ({
      blue: new THREE.MeshPhysicalMaterial({ color: "#ffffff", metalness: 0.45, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.25 }),
      gold: new THREE.MeshStandardMaterial({ color: "#e8a33d", emissive: "#e8a33d", emissiveIntensity: 0.45, metalness: 0.65, roughness: 0.25 }),
      teal: new THREE.MeshStandardMaterial({ color: "#3dd68c", emissive: "#3dd68c", emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.3 }),
      frame: new THREE.LineBasicMaterial({ color: "#9aa1ac", transparent: true, opacity: 0.16 }),
    }),
    [],
  );
  const frameGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.9, 2.9, 2.9)), []);
  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
      frameGeo.dispose();
    },
    [mats, frameGeo],
  );

  const core = useRef<THREE.Mesh>(null!);
  useFrame((state, dt) => {
    if (reduced) return;
    const d = Math.min(dt, 0.05);
    core.current.rotation.x += d * 0.35;
    core.current.rotation.y -= d * 0.5;
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.06;
    core.current.scale.setScalar(s);
  });

  return (
    <>
      <BarSet bars={groups.blue} colors={groups.blueColors} material={mats.blue} reduced={reduced} seed={11} />
      <BarSet bars={groups.gold} material={mats.gold} reduced={reduced} seed={23} />
      <BarSet bars={groups.teal} material={mats.teal} reduced={reduced} seed={37} />
      <lineSegments geometry={frameGeo} material={mats.frame} />
      <mesh ref={core} rotation={[0.6, 0.4, 0]}>
        <boxGeometry args={[0.42, 0.42, 0.42]} />
        <meshStandardMaterial color="#22c3c9" emissive="#22c3c9" emissiveIntensity={1.6} metalness={0.2} roughness={0.4} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={6} distance={3.2} color="#4fd3d8" />
    </>
  );
}

function Rig({ children, reduced }: { children: ReactNode; reduced: boolean }) {
  const outer = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const on = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, [reduced]);

  useFrame((_, dt) => {
    if (reduced) return;
    const d = Math.min(dt, 0.05);
    inner.current.rotation.y += d * 0.12;
    const k = 1 - Math.pow(0.001, d); // frame-rate independent lerp
    outer.current.rotation.x = THREE.MathUtils.lerp(outer.current.rotation.x, ISO_X + pointer.current.y * 0.16, k);
    outer.current.rotation.y = THREE.MathUtils.lerp(outer.current.rotation.y, pointer.current.x * 0.28, k);
  });

  return (
    <group ref={outer} rotation={[ISO_X, 0, 0]}>
      <group ref={inner} rotation={[0, Math.PI / 4, 0]}>
        {children}
      </group>
    </group>
  );
}

function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const geometry = useMemo(() => {
    const rnd = mulberry32(99);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + rnd() * 4.5;
      const th = rnd() * Math.PI * 2;
      const ph = Math.acos(2 * rnd() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(ph) - 1.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, dt) => {
    if (!reduced) ref.current.rotation.y += Math.min(dt, 0.05) * 0.02;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.022} color="#9aa1ac" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function HeroScene({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [mobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const frameloop = reduced ? "demand" : inView && visible ? "always" : "never";

  return (
    <div ref={wrap} className={className} style={{ opacity: ready ? 1 : 0, transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1)" }}>
      <Canvas
        frameloop={frameloop}
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, mobile ? 7.4 : 6.6], fov: 34 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          setReady(true);
        }}
        aria-hidden
      >
        <ambientLight intensity={0.35} color="#9aa1ac" />
        <hemisphereLight args={["#d7f4f4", "#0a0b0d", 0.55]} />
        <directionalLight position={[4, 5, 3]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-5, -1, -4]} intensity={3} color="#22c3c9" />
        <pointLight position={[-3.5, 2, 4]} intensity={6} distance={14} color="#22c3c9" />
        <Rig reduced={reduced}>
          <Lattice reduced={reduced} />
        </Rig>
        <Particles count={mobile ? 180 : 520} reduced={reduced} />
      </Canvas>
    </div>
  );
}
