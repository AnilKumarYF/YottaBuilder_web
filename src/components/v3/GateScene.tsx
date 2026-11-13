"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * "AI generates. Experts validate." — a noisy cyan stream (AI output) flows into an
 * amber approval ring. Validated work straightens into green production lanes;
 * a small share is rejected and falls away.
 */

const CYAN = new THREE.Color("#22c3c9");
const GREEN = new THREE.Color("#3dd68c");
const REJECT = new THREE.Color("#7a5a5a");
const AMBER = "#e8a33d";
const X_START = -7.5;
const X_END = 7.5;
const LANES = [-0.9, -0.45, 0, 0.45, 0.9];

function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.8)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

type P = { x: number; speed: number; phase: number; amp: number; y0: number; z0: number; lane: number; reject: boolean; fall: number };

function Stream({ count, animate }: { count: number; animate: boolean }) {
  const rand = useMemo(() => seeded(7), []);
  const parts = useMemo<P[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: X_START + rand() * (X_END - X_START),
        speed: 0.9 + rand() * 0.8,
        phase: rand() * Math.PI * 2,
        amp: 0.35 + rand() * 0.9,
        y0: (rand() - 0.5) * 2.6,
        z0: (rand() - 0.5) * 2.2,
        lane: LANES[Math.floor(rand() * LANES.length)],
        reject: rand() < 0.09,
        fall: 0,
      })),
    [count, rand],
  );
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, [count]);
  const tex = useMemo(() => dotTexture(), []);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.085,
        map: tex,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    [tex],
  );
  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
      tex.dispose();
    },
    [geo, mat, tex],
  );

  const tmp = useMemo(() => new THREE.Color(), []);
  const write = (t: number, dt: number) => {
    const pos = geo.attributes.position.array as Float32Array;
    const col = geo.attributes.color.array as Float32Array;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (dt > 0) {
        const slow = p.reject && p.x > 0 ? 0.35 : 1;
        p.x += p.speed * dt * slow;
        if (p.reject && p.x > 0) p.fall += dt * 1.6;
        if (p.x > X_END || p.fall > 4) {
          p.x = X_START;
          p.fall = 0;
        }
      }
      let y: number;
      let z: number;
      let fade = 1;
      if (p.x < 0) {
        // Chaotic AI output, converging as it approaches the gate.
        const k = Math.min(1, -p.x / 4);
        const noise = Math.sin(t * 1.3 + p.phase + p.x * 1.7) * p.amp * k;
        y = p.y0 * (0.25 + 0.75 * k) + noise * 0.5;
        z = p.z0 * (0.25 + 0.75 * k) + Math.cos(t * 1.1 + p.phase) * p.amp * 0.35 * k;
        tmp.copy(CYAN);
      } else if (!p.reject) {
        // Validated: ordered production lanes.
        const k = Math.min(1, p.x / 1.4);
        y = THREE.MathUtils.lerp(p.y0 * 0.25, p.lane, k);
        z = THREE.MathUtils.lerp(p.z0 * 0.25, 0, k);
        tmp.copy(CYAN).lerp(GREEN, Math.min(1, p.x / 0.8));
      } else {
        // Rejected at the gate: slows, greys out, falls away.
        y = p.y0 * 0.25 - p.fall * p.fall * 0.35;
        z = p.z0 * 0.25 + p.fall * 0.25;
        fade = Math.max(0, 1 - p.fall / 4);
        tmp.copy(CYAN).lerp(REJECT, Math.min(1, p.x / 0.4));
      }
      // Fade at the stream ends.
      const edge = Math.min(1, (p.x - X_START) / 1.2, (X_END - p.x) / 1.2);
      const a = Math.max(0, edge) * fade;
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      col[i * 3] = tmp.r * a;
      col[i * 3 + 1] = tmp.g * a;
      col[i * 3 + 2] = tmp.b * a;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  };

  const first = useRef(true);
  useFrame((state, delta) => {
    if (first.current) {
      write(2, 0);
      first.current = false;
    }
    if (!animate) return;
    write(state.clock.elapsedTime, Math.min(delta, 0.05));
  });

  return <points geometry={geo} material={mat} frustumCulled={false} />;
}

function Gate({ animate }: { animate: boolean }) {
  const scan = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    if (scan.current) scan.current.position.y = Math.sin(t * 1.4) * 1.35;
    if (ring.current) ring.current.rotation.x = t * 0.25;
  });
  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <torusGeometry args={[1.75, 0.045, 24, 160]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={1.8} metalness={0.4} roughness={0.25} />
      </mesh>
      <group ref={ring}>
        <mesh>
          <torusGeometry args={[2.05, 0.008, 8, 160]} />
          <meshBasicMaterial color={AMBER} transparent opacity={0.35} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.cos((i * Math.PI) / 2) * 2.05, Math.sin((i * Math.PI) / 2) * 2.05, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.09, 0.09, 0.09]} />
            <meshBasicMaterial color={AMBER} />
          </mesh>
        ))}
      </group>
      {/* faint gate membrane */}
      <mesh>
        <circleGeometry args={[1.72, 64]} />
        <meshBasicMaterial color={AMBER} transparent opacity={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* scanning line */}
      <mesh ref={scan}>
        <planeGeometry args={[3.2, 0.02]} />
        <meshBasicMaterial color={AMBER} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight color={AMBER} intensity={6} distance={6} />
    </group>
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
  useFrame((state) => {
    const t = animate ? state.clock.elapsedTime : 0;
    const tx = -2.2 + Math.sin(t * 0.12) * 0.6 + (animate ? mouse.current.x : 0) * 0.8;
    const ty = 1.2 + Math.cos(t * 0.1) * 0.25 - (animate ? mouse.current.y : 0) * 0.5;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(0.6, 0, 0);
  });
  return null;
}

export default function GateScene({ className, mobile = false }: { className?: string; mobile?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [reduce, setReduce] = useState(false);
  const visible = inView && !hidden;

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const animate = !reduce;
  return (
    <div ref={wrap} className={className} aria-hidden>
      <Canvas
        frameloop={!visible ? "never" : reduce ? "demand" : "always"}
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [-2.2, 1.2, 9], fov: 42, near: 0.1, far: 60 }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.4} />
        <Stream count={mobile ? 600 : 1500} animate={animate} />
        <Gate animate={animate} />
        <Rig animate={animate} />
      </Canvas>
    </div>
  );
}
