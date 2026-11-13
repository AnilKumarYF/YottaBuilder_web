"use client";

/**
 * Design C hero visual — a polished rebuild of the original yottabuilder.ai
 * "vector embedding space": requirement queries are embedded, a context radius
 * expands, and the nearest epic / story / test / code artefacts are traced.
 * Illustrative only (sample identifiers).
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

export type TraceKind = "Epic" | "Story" | "Test" | "Code";
export type TraceQuery = { id: string; label: string; matches: { kind: TraceKind; id: string }[] };

type Props = {
  className?: string;
  onQuery?: (q: TraceQuery) => void;
  /** Optional HTML element positioned (via transform) at the query vector's tip. */
  tipLabel?: RefObject<HTMLElement | null>;
};

const CYCLE = 4.6; // seconds per query
const QUERIES = [
  { id: "REQ-014", label: "Supervisor approval above $10k" },
  { id: "REQ-012", label: "Adjusters upload claim documents" },
  { id: "REQ-021", label: "Track claim status in real time" },
  { id: "REQ-033", label: "Notify adjuster on status change" },
  { id: "REQ-047", label: "Record every approval in the audit trail" },
] as const;

const KINDS: TraceKind[] = ["Epic", "Story", "Test", "Code"];
const PREFIX: Record<Exclude<TraceKind, "Code">, string> = { Epic: "EP", Story: "ST", Test: "TEST" };
const CODE_FILES = [
  "claims.service.ts",
  "upload.controller.ts",
  "approval.guard.ts",
  "status.store.ts",
  "notify.worker.ts",
  "audit.repo.ts",
  "claim-form.tsx",
  "routes.ts",
];

const C = {
  steel: new THREE.Color("#9aa1ac"),
  cyan: new THREE.Color("#22c3c9"),
  cyan300: new THREE.Color("#7fe6e8"),
  green: new THREE.Color("#3dd68c"),
  white: new THREE.Color("#ffffff"),
};

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = { pos: THREE.Vector3; kind: TraceKind; id: string; base: THREE.Color };

function buildSpace(count: number): Pt[] {
  const r = mulberry32(7);
  const centers = [
    new THREE.Vector3(1, 0.55, 0.45),
    new THREE.Vector3(-0.9, 0.5, -0.45),
    new THREE.Vector3(-0.35, -0.7, 0.9),
    new THREE.Vector3(0.65, -0.55, -0.8),
  ].map((v) => v.normalize());
  const tint = [0.75, 0.35, 0.55, 0.15];
  const n: Record<TraceKind, number> = { Epic: 0, Story: 0, Test: 0, Code: 0 };
  const out: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const k = i % 4;
    const kind = KINDS[k];
    const dir = centers[k]
      .clone()
      .add(new THREE.Vector3((r() - 0.5) * 1.25, (r() - 0.5) * 1.25, (r() - 0.5) * 1.25))
      .normalize();
    const pos = dir.multiplyScalar(2.1 + r() * 1.5);
    const idx = n[kind]++;
    const id =
      kind === "Code"
        ? idx < CODE_FILES.length
          ? CODE_FILES[idx]
          : `module-${idx}.ts`
        : `${PREFIX[kind]}-${String(idx + 1).padStart(2, "0")}`;
    const base = C.steel.clone().lerp(C.cyan, tint[k] * (0.6 + r() * 0.4));
    out.push({ pos, kind, id, base });
  }
  return out;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

function circlePoints(radius: number, plane: "xz" | "xy", segments = 128) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(plane === "xz" ? new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius) : new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  return pts;
}

const ARC_SEGMENTS = 40;

function Space({ mobile, reduced, onQueryRef, tipLabel }: { mobile: boolean; reduced: boolean; onQueryRef: RefObject<Props["onQuery"]>; tipLabel?: RefObject<HTMLElement | null> }) {
  const count = mobile ? 70 : 180;
  const pts = useMemo(() => buildSpace(count), [count]);
  const world = useRef<THREE.Group>(null);
  const inst = useRef<THREE.InstancedMesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const rot = useRef({ auto: 0.4, x: 0.14, y: 0 });

  // ---------- static resources ----------
  const res = useMemo(() => {
    const pointGeo = new THREE.SphereGeometry(mobile ? 0.045 : 0.038, 10, 10);
    const pointMat = new THREE.MeshBasicMaterial({ toneMapped: false });

    // Spokes: origin -> every point (one draw call).
    const spokePos = new Float32Array(pts.length * 6);
    const spokeCol = new Float32Array(pts.length * 6);
    pts.forEach((p, i) => {
      spokePos.set([0, 0, 0, p.pos.x, p.pos.y, p.pos.z], i * 6);
      spokeCol.set([0.05, 0.06, 0.07, p.base.r, p.base.g, p.base.b], i * 6);
    });
    const spokeGeo = new THREE.BufferGeometry();
    spokeGeo.setAttribute("position", new THREE.BufferAttribute(spokePos, 3));
    spokeGeo.setAttribute("color", new THREE.BufferAttribute(spokeCol, 3));
    const spokeMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false });
    const spokes = new THREE.LineSegments(spokeGeo, spokeMat);

    // Instrument: axes + polar rings.
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-4.6, 0, 0), new THREE.Vector3(4.6, 0, 0),
      new THREE.Vector3(0, -4.6, 0), new THREE.Vector3(0, 4.6, 0),
      new THREE.Vector3(0, 0, -4.6), new THREE.Vector3(0, 0, 4.6),
    ]);
    const axisMat = new THREE.LineBasicMaterial({ color: C.steel, transparent: true, opacity: 0.22, depthWrite: false });
    const axes = new THREE.LineSegments(axisGeo, axisMat);

    const ringMat = new THREE.LineBasicMaterial({ color: C.steel, transparent: true, opacity: 0.1, depthWrite: false });
    const ringMatV = new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.07, depthWrite: false });
    const rings = [1.6, 3.2, 4.5].map((r) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(circlePoints(r, "xz")), ringMat));
    rings.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(circlePoints(3.2, "xy")), ringMatV));

    // Dust.
    const r = mulberry32(19);
    const dustN = mobile ? 220 : 650;
    const dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(3 + r() * 8);
      dustPos.set([v.x, v.y, v.z], i * 3);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: C.steel, size: 0.022, transparent: true, opacity: 0.5, sizeAttenuation: true, depthWrite: false });
    const dust = new THREE.Points(dustGeo, dustMat);

    // Origin.
    const originGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const originMat = new THREE.MeshBasicMaterial({ color: C.white, toneMapped: false });
    const haloGeo = new THREE.SphereGeometry(0.26, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false });

    // Query vector (unit-height cylinder whose base sits at the origin).
    const qGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 10, 1, true).translate(0, 0.5, 0);
    const qMat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0, toneMapped: false });
    const qGlowGeo = new THREE.CylinderGeometry(0.07, 0.07, 1, 10, 1, true).translate(0, 0.5, 0);
    const qGlowMat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const tipGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const tipMat = new THREE.MeshBasicMaterial({ color: C.white, transparent: true, opacity: 0, toneMapped: false });
    const tipGlowGeo = new THREE.SphereGeometry(0.34, 16, 16);
    const tipGlowMat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });

    // KNN / context radius ring (billboarded, dashed).
    const knnGeo = new THREE.BufferGeometry().setFromPoints(circlePoints(1, "xy", 96));
    const knnMat = new THREE.LineDashedMaterial({ color: C.cyan300, dashSize: 0.06, gapSize: 0.045, transparent: true, opacity: 0, depthWrite: false });
    const knn = new THREE.Line(knnGeo, knnMat);
    knn.computeLineDistances();

    // Trace arcs (one per kind).
    const arcMat = new THREE.LineBasicMaterial({ color: C.green, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const arcs = KINDS.map(() => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array((ARC_SEGMENTS + 1) * 3), 3));
      g.setDrawRange(0, 0);
      const line = new THREE.Line(g, arcMat);
      line.frustumCulled = false;
      return line;
    });

    return {
      pointGeo, pointMat, spokes, axes, rings, dust,
      originGeo, originMat, haloGeo, haloMat,
      qGeo, qMat, qGlowGeo, qGlowMat, tipGeo, tipMat, tipGlowGeo, tipGlowMat,
      knn, knnMat, arcs, arcMat,
      disposables: [
        pointGeo, pointMat, spokeGeo, spokeMat, axisGeo, axisMat, ringMat, ringMatV, ...rings.map((l) => l.geometry),
        dustGeo, dustMat, originGeo, originMat, haloGeo, haloMat, qGeo, qMat, qGlowGeo, qGlowMat,
        tipGeo, tipMat, tipGlowGeo, tipGlowMat, knnGeo, knnMat, arcMat, ...arcs.map((a) => a.geometry),
      ] as Array<{ dispose: () => void }>,
    };
  }, [pts, mobile]);

  useEffect(() => () => res.disposables.forEach((d) => d.dispose()), [res]);

  // ---------- instanced points ----------
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), s: new THREE.Vector3(), c: new THREE.Color(), v: new THREE.Vector3(), wq: new THREE.Quaternion() }), []);

  const setPoint = (i: number, scale: number, color: THREE.Color) => {
    const mesh = inst.current;
    if (!mesh) return;
    tmp.s.setScalar(scale);
    tmp.m.compose(pts[i].pos, tmp.q.identity(), tmp.s);
    mesh.setMatrixAt(i, tmp.m);
    mesh.setColorAt(i, color);
  };

  useLayoutEffect(() => {
    const mesh = inst.current;
    if (!mesh) return;
    pts.forEach((p, i) => setPoint(i, 1, p.base));
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    res.pointMat.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pts, res]);

  // ---------- mouse parallax (mouse only) ----------
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // ---------- query cycle ----------
  const cycle = useRef({ n: -1, tip: new THREE.Vector3(), dir: new THREE.Vector3(0, 1, 0), len: 3, matches: [] as number[] });
  const queryGroup = useRef<THREE.Group>(null);
  const tipGroup = useRef<THREE.Group>(null);

  const startCycle = (n: number) => {
    const c = cycle.current;
    // restore previous matches
    c.matches.forEach((i) => setPoint(i, 1, pts[i].base));

    const r = mulberry32(101 + n * 13);
    const a = pts[Math.floor(r() * pts.length)].pos;
    const b = pts[Math.floor(r() * pts.length)].pos;
    c.tip.copy(a).lerp(b, 0.35 + r() * 0.3);
    if (c.tip.lengthSq() < 0.5) c.tip.set(1, 1, 1);
    c.tip.setLength(2.7 + r() * 0.6);
    c.len = c.tip.length();
    c.dir.copy(c.tip).normalize();

    // nearest artefact of each kind => requirement trace
    c.matches = KINDS.map((kind) => {
      let best = -1;
      let bd = Infinity;
      pts.forEach((p, i) => {
        if (p.kind !== kind) return;
        const d = p.pos.distanceToSquared(c.tip);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      return best;
    });

    c.matches.forEach((mi, k) => {
      const end = pts[mi].pos;
      const ctrl = c.tip.clone().add(end).multiplyScalar(0.5);
      ctrl.setLength(ctrl.length() * 1.3 + 0.35);
      const curve = new THREE.QuadraticBezierCurve3(c.tip.clone(), ctrl, end.clone());
      const arr = (res.arcs[k].geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
      curve.getPoints(ARC_SEGMENTS).forEach((p, j) => arr.set([p.x, p.y, p.z], j * 3));
      res.arcs[k].geometry.getAttribute("position").needsUpdate = true;
      res.arcs[k].geometry.setDrawRange(0, 0);
    });

    queryGroup.current?.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), c.dir);
    const q = QUERIES[n % QUERIES.length];
    onQueryRef.current?.({ id: q.id, label: q.label, matches: c.matches.map((i) => ({ kind: pts[i].kind, id: pts[i].id })) });
    c.n = n;
  };

  useFrame((state, delta) => {
    const g = world.current;
    const mesh = inst.current;
    if (!g || !mesh) return;
    const t = reduced ? 2.9 : state.clock.elapsedTime;
    const n = reduced ? 0 : Math.floor(t / CYCLE);
    if (n !== cycle.current.n) startCycle(n);
    const ph = reduced ? 2.9 : t % CYCLE;
    const c = cycle.current;

    const grow = ease((ph - 0.1) / 0.9);
    const ring = ease((ph - 0.75) / 0.8);
    const arcs = ease((ph - 1.25) / 1.1);
    const fade = 1 - clamp01((ph - 3.8) / 0.7);

    // query vector
    const L = c.len * grow;
    queryGroup.current?.children.forEach((child) => child.scale.set(1, Math.max(L, 0.0001), 1));
    res.qMat.opacity = 0.95 * fade * Math.min(1, grow * 3);
    res.qGlowMat.opacity = 0.18 * fade * Math.min(1, grow * 3);
    tipGroup.current?.position.copy(c.dir).multiplyScalar(L);
    res.tipMat.opacity = fade * Math.min(1, grow * 2);
    res.tipGlowMat.opacity = (0.22 + Math.sin(t * 4) * 0.05) * fade * grow;

    // context radius
    res.knn.position.copy(c.tip);
    res.knn.scale.setScalar(0.25 + 0.75 * ring);
    res.knnMat.opacity = 0.85 * ring * fade;
    g.getWorldQuaternion(tmp.wq).invert().multiply(state.camera.quaternion);
    res.knn.quaternion.copy(tmp.wq);

    // trace arcs + matched artefacts
    const drawn = Math.floor((ARC_SEGMENTS + 1) * arcs);
    res.arcs.forEach((a) => a.geometry.setDrawRange(0, drawn));
    res.arcMat.opacity = 0.95 * fade;
    const hl = arcs * fade;
    c.matches.forEach((i) => setPoint(i, 1 + 1.8 * hl, tmp.c.copy(pts[i].base).lerp(C.green, hl)));
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // camera feel: slow orbit + lerped parallax
    if (!reduced) {
      rot.current.auto += delta * 0.06;
      const k = 1 - Math.pow(0.04, delta);
      rot.current.y += (mouse.current.x * 0.35 - rot.current.y) * k;
      rot.current.x += (0.14 + mouse.current.y * 0.18 - rot.current.x) * k;
    }
    g.rotation.y = rot.current.auto + rot.current.y;
    g.rotation.x = rot.current.x;

    // HTML label at the query tip
    const el = tipLabel?.current;
    if (el && tipGroup.current) {
      tipGroup.current.getWorldPosition(tmp.v).project(state.camera);
      const x = (tmp.v.x * 0.5 + 0.5) * state.size.width;
      const y = (-tmp.v.y * 0.5 + 0.5) * state.size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = String(Math.min(clamp01((ph - 0.7) / 0.4), fade));
    }
  });

  return (
    <group ref={world}>
      <primitive object={res.axes} />
      {res.rings.map((r, i) => (
        <primitive key={i} object={r} />
      ))}
      <primitive object={res.dust} />
      <primitive object={res.spokes} />
      <instancedMesh ref={inst} args={[res.pointGeo, res.pointMat, pts.length]} frustumCulled={false} />
      <mesh geometry={res.originGeo} material={res.originMat} />
      <mesh geometry={res.haloGeo} material={res.haloMat} />
      <group ref={queryGroup}>
        <mesh geometry={res.qGeo} material={res.qMat} />
        <mesh geometry={res.qGlowGeo} material={res.qGlowMat} />
      </group>
      <group ref={tipGroup}>
        <mesh geometry={res.tipGeo} material={res.tipMat} />
        <mesh geometry={res.tipGlowGeo} material={res.tipGlowMat} />
      </group>
      <primitive object={res.knn} />
      {res.arcs.map((a, i) => (
        <primitive key={i} object={a} />
      ))}
    </group>
  );
}

export default function EmbeddingScene({ className, onQuery, tipLabel }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const onQueryRef = useRef(onQuery);
  onQueryRef.current = onQuery;
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const [mobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let inView = true;
    const update = () => setActive(inView && !document.hidden);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div ref={wrap} className={className} style={{ opacity: ready ? 1 : 0, transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1)" }}>
      <Canvas
        frameloop={reduced ? "demand" : active ? "always" : "never"}
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.3, mobile ? 11 : 9.6], fov: 42, near: 0.1, far: 60 }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.fog = new THREE.FogExp2("#0a0b0d", 0.05);
          setReady(true);
        }}
      >
        <Space mobile={mobile} reduced={reduced} onQueryRef={onQueryRef} tipLabel={tipLabel} />
      </Canvas>
    </div>
  );
}
