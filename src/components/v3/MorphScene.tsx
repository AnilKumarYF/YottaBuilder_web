"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * One particle cloud that morphs between three shapes, driven by `progress` (0..2):
 *   0  Upload  — a fanned stack of requirement documents
 *   1  Build   — a 5-layer neural network with amber human-gate rings between layers
 *   2  Ship    — an isometric lattice of repository blocks, top layer shipped (green)
 * Pass `progressRef` for scroll-scrubbed use (read every frame, no React re-render),
 * or `progress` for stepped use.
 */

const CYAN = new THREE.Color("#22c3c9");
const CYAN_LIGHT = new THREE.Color("#7fe6e8");
const STEEL = new THREE.Color("#9aa1ac");
const STEEL_LIGHT = new THREE.Color("#c8ced6");
const AMBER = new THREE.Color("#e8a33d");
const GREEN = new THREE.Color("#3dd68c");

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Shape = { pos: Float32Array; col: Float32Array; size: Float32Array };

function emptyShape(n: number): Shape {
  return { pos: new Float32Array(n * 3), col: new Float32Array(n * 3), size: new Float32Array(n) };
}

function put(s: Shape, i: number, v: THREE.Vector3, c: THREE.Color, k: number, size: number) {
  s.pos[i * 3] = v.x;
  s.pos[i * 3 + 1] = v.y;
  s.pos[i * 3 + 2] = v.z;
  s.col[i * 3] = c.r * k;
  s.col[i * 3 + 1] = c.g * k;
  s.col[i * 3 + 2] = c.b * k;
  s.size[i] = size;
}

/** Shape A — three fanned requirement sheets with text rows. */
function shapeDocs(n: number, r: () => number): Shape {
  const s = emptyShape(n);
  const W = 2.4;
  const H = 3.1;
  const sheets = [
    { off: new THREE.Vector3(-0.55, -0.25, -0.6), rot: -0.2 },
    { off: new THREE.Vector3(0, 0, 0), rot: -0.04 },
    { off: new THREE.Vector3(0.55, 0.22, 0.6), rot: 0.12 },
  ];
  const rows = 14;
  const rowLen = Array.from({ length: rows }, (_, k) => (0.45 + ((k * 37) % 11) / 20) * (W - 0.5));
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const si = Math.floor(r() * 3);
    const sheet = sheets[si];
    const front = si === 2;
    const t = r();
    let c = STEEL_LIGHT;
    let k = 0.55;
    let size = 1;
    if (t < 0.22) {
      // outline
      const p = r() * 2 * (W + H);
      if (p < W) v.set(-W / 2 + p, H / 2, 0);
      else if (p < W + H) v.set(W / 2, H / 2 - (p - W), 0);
      else if (p < 2 * W + H) v.set(W / 2 - (p - W - H), -H / 2, 0);
      else v.set(-W / 2, -H / 2 + (p - 2 * W - H), 0);
      c = STEEL;
      k = 0.5;
      size = 0.85;
    } else if (t < 0.32) {
      // header bar
      v.set(-W / 2 + 0.25 + r() * 1.2, H / 2 - 0.3 - r() * 0.18, 0);
      c = front ? CYAN_LIGHT : STEEL_LIGHT;
      k = front ? 0.9 : 0.6;
      size = 1.25;
    } else {
      const row = Math.floor(r() * rows);
      const y = H / 2 - 0.75 - (row * (H - 1.05)) / (rows - 1);
      v.set(-W / 2 + 0.25 + r() * rowLen[row], y + (r() - 0.5) * 0.035, 0);
      // extracted requirement lines on the front sheet glow cyan
      if (front && row % 5 === 2) {
        c = CYAN;
        k = 0.95;
        size = 1.15;
      }
    }
    v.z += (r() - 0.5) * 0.02;
    v.applyAxisAngle(new THREE.Vector3(0, 0, 1), sheet.rot).add(sheet.off);
    v.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.45);
    put(s, i, v, c, k, size);
  }
  return s;
}

/** Shape B — neural network: nodes + sampled edges + amber human-gate rings. */
function shapeNetwork(n: number, r: () => number): Shape {
  const s = emptyShape(n);
  const layers = [4, 6, 7, 6, 3];
  const xs = layers.map((_, i) => -2.7 + (i * 5.4) / (layers.length - 1));
  const nodes = layers.map((count, li) =>
    Array.from({ length: count }, (_, j) => new THREE.Vector3(xs[li], ((count - 1) / 2 - j) * 0.62, (r() - 0.5) * 0.9)),
  );
  const gates = [(xs[1] + xs[2]) / 2, (xs[3] + xs[4]) / 2];
  const v = new THREE.Vector3();
  const g = () => (r() + r() + r() - 1.5) * 0.09;
  for (let i = 0; i < n; i++) {
    const t = r();
    if (t < 0.4) {
      const layer = nodes[Math.floor(r() * nodes.length)];
      const node = layer[Math.floor(r() * layer.length)];
      v.set(node.x + g(), node.y + g(), node.z + g());
      put(s, i, v, r() < 0.5 ? CYAN_LIGHT : CYAN, 0.95, 1.55);
    } else if (t < 0.85) {
      const li = Math.floor(r() * (nodes.length - 1));
      const a = nodes[li][Math.floor(r() * nodes[li].length)];
      const b = nodes[li + 1][Math.floor(r() * nodes[li + 1].length)];
      v.lerpVectors(a, b, r());
      v.y += (r() - 0.5) * 0.015;
      put(s, i, v, CYAN, 0.42, 0.7);
    } else {
      const gx = gates[r() < 0.5 ? 0 : 1];
      const th = r() * Math.PI * 2;
      v.set(gx + (r() - 0.5) * 0.05, Math.cos(th) * 2.35, Math.sin(th) * 1.05);
      put(s, i, v, AMBER, 0.85, 1.05);
    }
  }
  const rot = new THREE.Euler(0.12, -0.35, 0);
  for (let i = 0; i < n; i++) {
    v.fromArray(s.pos, i * 3).applyEuler(rot);
    v.toArray(s.pos, i * 3);
  }
  return s;
}

/** Shape C — isometric repository lattice: 3x3x3 blocks, top layer shipped. */
function shapeRepo(n: number, r: () => number): Shape {
  const s = emptyShape(n);
  const b = 0.62;
  const gap = 0.16;
  const step = b + gap;
  const v = new THREE.Vector3();
  const corners = [
    [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
    [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
  ];
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  for (let i = 0; i < n; i++) {
    const ix = Math.floor(r() * 3);
    const iy = Math.floor(r() * 3);
    const iz = Math.floor(r() * 3);
    const top = iy === 2;
    const ox = (ix - 1) * step - b / 2;
    const oy = (iy - 1) * step - b / 2;
    const oz = (iz - 1) * step - b / 2;
    if (r() < 0.62) {
      const [e0, e1] = edges[Math.floor(r() * edges.length)];
      const t = r();
      const a = corners[e0];
      const c = corners[e1];
      v.set(ox + (a[0] + (c[0] - a[0]) * t) * b, oy + (a[1] + (c[1] - a[1]) * t) * b, oz + (a[2] + (c[2] - a[2]) * t) * b);
      put(s, i, v, top ? GREEN : CYAN, top ? 0.95 : 0.75, top ? 1.3 : 1.1);
    } else {
      const face = Math.floor(r() * 6);
      const u = r() * b;
      const w = r() * b;
      if (face === 0) v.set(ox + u, oy + w, oz);
      else if (face === 1) v.set(ox + u, oy + w, oz + b);
      else if (face === 2) v.set(ox, oy + u, oz + w);
      else if (face === 3) v.set(ox + b, oy + u, oz + w);
      else if (face === 4) v.set(ox + u, oy, oz + w);
      else v.set(ox + u, oy + b, oz + w);
      put(s, i, v, top ? GREEN : STEEL, top ? 0.45 : 0.3, 0.75);
    }
  }
  const rot = new THREE.Euler(Math.atan(1 / Math.SQRT2), Math.PI / 4, 0, "YXZ");
  for (let i = 0; i < n; i++) {
    v.fromArray(s.pos, i * 3).multiplyScalar(1.25).applyEuler(rot);
    v.toArray(s.pos, i * 3);
  }
  return s;
}

const vertex = /* glsl */ `
  attribute vec3 posA; attribute vec3 posB; attribute vec3 posC;
  attribute vec3 colA; attribute vec3 colB; attribute vec3 colC;
  attribute float sizeA; attribute float sizeB; attribute float sizeC;
  attribute vec3 jitter; attribute float aRnd;
  uniform float uProgress; uniform float uTime; uniform float uSize; uniform float uPR;
  varying vec3 vColor; varying float vAlpha;
  float seg(float p) {
    float t = clamp((p - aRnd * 0.35) / 0.65, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }
  void main() {
    float t1 = seg(clamp(uProgress, 0.0, 1.0));
    float t2 = seg(clamp(uProgress - 1.0, 0.0, 1.0));
    vec3 p = mix(mix(posA, posB, t1), posC, t2);
    vec3 c = mix(mix(colA, colB, t1), colC, t2);
    float sz = mix(mix(sizeA, sizeB, t1), sizeC, t2);
    float burst = sin(t1 * 3.14159) + sin(t2 * 3.14159);
    p += jitter * burst * 0.55;
    p += jitter * 0.025 * sin(uTime * 0.9 + aRnd * 40.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * sz * uPR / -mv.z;
    vColor = c;
    vAlpha = 0.9 - burst * 0.3;
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d) * vAlpha;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

function buildCloud(n: number) {
  const r = rng(7);
  const A = shapeDocs(n, r);
  const B = shapeNetwork(n, r);
  const C = shapeRepo(n, r);
  const jitter = new Float32Array(n * 3);
  const rnd = new Float32Array(n);
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    v.set(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(0.6 + r());
    v.toArray(jitter, i * 3);
    rnd[i] = r();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(A.pos, 3));
  geometry.setAttribute("posA", new THREE.BufferAttribute(A.pos, 3));
  geometry.setAttribute("posB", new THREE.BufferAttribute(B.pos, 3));
  geometry.setAttribute("posC", new THREE.BufferAttribute(C.pos, 3));
  geometry.setAttribute("colA", new THREE.BufferAttribute(A.col, 3));
  geometry.setAttribute("colB", new THREE.BufferAttribute(B.col, 3));
  geometry.setAttribute("colC", new THREE.BufferAttribute(C.col, 3));
  geometry.setAttribute("sizeA", new THREE.BufferAttribute(A.size, 1));
  geometry.setAttribute("sizeB", new THREE.BufferAttribute(B.size, 1));
  geometry.setAttribute("sizeC", new THREE.BufferAttribute(C.size, 1));
  geometry.setAttribute("jitter", new THREE.BufferAttribute(jitter, 3));
  geometry.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 1));
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: { uProgress: { value: 0 }, uTime: { value: 0 }, uSize: { value: 26 }, uPR: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return { geometry, material };
}

function Cloud({
  progressRef,
  progress,
  reduce,
  mobile,
  pointer,
}: {
  progressRef?: MutableRefObject<number>;
  progress: number;
  reduce: boolean;
  mobile: boolean;
  pointer: MutableRefObject<{ x: number; y: number }>;
}) {
  const { geometry, material } = useMemo(() => buildCloud(mobile ? 3500 : 9000), [mobile]);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  const cur = useRef(progressRef ? progressRef.current : progress);
  const tilt = useRef({ x: 0, y: 0 });
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    invalidate();
  }, [progress, invalidate]);

  useFrame((state, delta) => {
    const target = progressRef ? progressRef.current : progress;
    if (reduce) cur.current = Math.round(target);
    else cur.current += (target - cur.current) * Math.min(1, delta * 4.5);
    const u = material.uniforms;
    u.uProgress.value = cur.current;
    u.uTime.value = reduce ? 0 : state.clock.elapsedTime;
    u.uPR.value = state.gl.getPixelRatio();
    u.uSize.value = mobile ? 22 : 26;
    if (group.current && !reduce) {
      tilt.current.x += (pointer.current.x - tilt.current.x) * Math.min(1, delta * 3);
      tilt.current.y += (pointer.current.y - tilt.current.y) * Math.min(1, delta * 3);
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3 + tilt.current.x * 0.3;
      group.current.rotation.x = tilt.current.y * 0.18;
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

export default function MorphScene({
  progress = 0,
  progressRef,
  className,
}: {
  progress?: number;
  progressRef?: MutableRefObject<number>;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [mobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  const [reduce] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [visible, setVisible] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    const onVis = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const frameloop = !visible || pageHidden ? "never" : reduce ? "demand" : "always";

  return (
    <div ref={wrap} className={className} aria-hidden>
      <Canvas
        frameloop={frameloop}
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, mobile ? 8.8 : 7.6], fov: 45 }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Cloud progressRef={progressRef} progress={progress} reduce={reduce} mobile={mobile} pointer={pointer} />
      </Canvas>
    </div>
  );
}
