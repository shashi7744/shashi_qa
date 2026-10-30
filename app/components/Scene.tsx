"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Float } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const TEAL = new THREE.Color("#3ee0cf");
const AMBER = new THREE.Color("#f2a649");
const BUG = new THREE.Color("#ff5d6c");
const VIOLET = new THREE.Color("#9b8cff");
const SIGNAL = new THREE.Color("#a8fff4");
const BG = "#0a0d1c";
const RADIUS = 2.4;
const TRAIL = 8;

/* Where the lattice sits on each page (x, y, scale) */
const layouts: Record<string, [number, number, number]> = {
  "/": [3.4, 0.15, 1],
  "/services": [4.9, 2.1, 0.55],
  "/projects": [5.0, 2.2, 0.55],
  "/about": [4.8, 1.9, 0.6],
  "/contact": [4.9, 2.2, 0.55],
  "/check": [4.9, 2.2, 0.55],
};

type Motion = {
  pointer: React.MutableRefObject<[number, number]>;
  scroll: React.MutableRefObject<number>;
  hover: React.MutableRefObject<boolean>;
  flick: React.MutableRefObject<number>;
  tint: React.MutableRefObject<THREE.Color>; // colour of the section in view (data-tint)
  color: THREE.Color; // current colour, eased toward tint every frame
  speed: number;
};

/* Soft round sprite used for every glowing point */
let glowTexture: THREE.Texture | null = null;
function getGlow() {
  if (glowTexture) return glowTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(255,255,255,0.85)");
  g.addColorStop(0.5, "rgba(255,255,255,0.22)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  glowTexture = new THREE.CanvasTexture(c);
  return glowTexture;
}

/* Unique vertices, edges and neighbours of the icosahedron lattice */
function buildGraph() {
  const geo = new THREE.IcosahedronGeometry(RADIUS, 1);
  const pos = geo.attributes.position;
  const lookup = new Map<string, number>();
  const verts: THREE.Vector3[] = [];
  const ids: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);
    const key = v.toArray().map((n) => Math.round(n * 100) + 0).join();
    let id = lookup.get(key);
    if (id === undefined) {
      id = verts.length;
      lookup.set(key, id);
      verts.push(v);
    }
    ids.push(id);
  }
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (let i = 0; i < ids.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const a = ids[i + k];
      const b = ids[i + ((k + 1) % 3)];
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, b]);
      }
    }
  }
  const neighbors: number[][] = verts.map(() => []);
  edges.forEach(([a, b]) => {
    neighbors[a].push(b);
    neighbors[b].push(a);
  });
  geo.dispose();
  return { verts, edges, neighbors };
}

const additive = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } as const;

function Orbit({ radius, tilt, speed, color, sats, motion, follow = false }: {
  radius: number; tilt: [number, number, number]; speed: number; color: THREE.Color; sats: number; motion: Motion; follow?: boolean;
}) {
  const glow = useMemo(getGlow, []);
  const refs = useRef<THREE.Sprite[]>([]);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime * motion.speed;
    refs.current.forEach((s, k) => {
      const a = t * speed + (k / sats) * Math.PI * 2;
      s.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      if (follow) (s.material as THREE.SpriteMaterial).color.copy(motion.color);
    });
    if (follow) ringMat.current.color.copy(motion.color);
  });
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.005, 6, 200]} />
        <meshBasicMaterial ref={ringMat} color={color} opacity={0.3} {...additive} />
      </mesh>
      {Array.from({ length: sats }, (_, k) => (
        <sprite key={k} ref={(el) => { if (el) refs.current[k] = el; }} scale={0.38}>
          <spriteMaterial map={glow} color={color} {...additive} />
        </sprite>
      ))}
    </group>
  );
}

/* A small atom at the very centre: a tight, bright white nucleus,
   gently pulsing, with three electrons on tilted orbits. Sits inside the violet core shape. */
function Nucleus({ motion }: { motion: Motion }) {
  const glow = useMemo(getGlow, []);
  const cluster = useRef<THREE.Group>(null!);
  const electrons = useRef<THREE.Sprite[]>([]);
  const particles = useMemo(() => {
    const n = 12; // around a centre particle, spread evenly on a small sphere
    const out: { p: [number, number, number]; proton: boolean }[] = [{ p: [0, 0, 0], proton: true }];
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * 2.39996; // golden angle
      out.push({ p: [Math.cos(th) * r * 0.16, y * 0.16, Math.sin(th) * r * 0.16], proton: i % 2 === 0 });
    }
    return out;
  }, []);
  const orbits: [number, number, number][] = [[0, 0, 0], [Math.PI / 3, 0, Math.PI / 4], [-Math.PI / 3, 0, -Math.PI / 4]];

  useFrame((state, dt) => {
    const s = motion.speed;
    const t = state.clock.elapsedTime * s;
    cluster.current.rotation.y += dt * 0.9 * s;
    cluster.current.rotation.x += dt * 0.5 * s;
    cluster.current.scale.setScalar(1 + 0.07 * Math.sin(t * 3));
    electrons.current.forEach((e, k) => {
      const a = t * 2.2 + k * 2.1;
      e.position.set(Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0);
    });
  });

  return (
    <group>
      <group ref={cluster}>
        {particles.map((q, i) => (
          <mesh key={i} position={q.p}>
            <sphereGeometry args={[0.072, 16, 16]} />
            <meshBasicMaterial color={q.proton ? "#ffffff" : "#e6ecff"} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <sprite scale={0.85}>
        <spriteMaterial map={glow} color="#ffffff" opacity={0.55} {...additive} />
      </sprite>
      {orbits.map((rot, k) => (
        <group key={k} rotation={rot}>
          <mesh>
            <torusGeometry args={[0.42, 0.004, 6, 96]} />
            <meshBasicMaterial color={SIGNAL} opacity={0.35} {...additive} />
          </mesh>
          <sprite ref={(el) => { if (el) electrons.current[k] = el; }} scale={0.16}>
            <spriteMaterial map={glow} color={SIGNAL} {...additive} />
          </sprite>
        </group>
      ))}
    </group>
  );
}

function Lattice({ target, motion, pulseCount }: { target: [number, number, number]; motion: Motion; pulseCount: number }) {
  const glow = useMemo(getGlow, []);
  const { verts, edges, neighbors } = useMemo(buildGraph, []);
  const isBug = useMemo(() => verts.map((_, i) => i % 9 === 4), [verts]);
  const bugIds = useMemo(() => verts.map((_, i) => i).filter((i) => isBug[i]), [verts, isBug]);
  const level = useMemo(() => new Float32Array(verts.length), [verts]);

  const group = useRef<THREE.Group>(null!);
  const spin = useRef<THREE.Group>(null!);
  const lean = useRef({ x: 0, y: 0 });
  const spinBoost = useRef(0);
  const excite = useRef(0);
  const scanPhase = useRef(0);
  const core =useRef<THREE.Mesh>(null!);
  const shell = useRef<THREE.Mesh>(null!);
  const coreGlow = useRef<THREE.Sprite>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const disc = useRef<THREE.Mesh>(null!);
  const nodeMat = useRef<THREE.PointsMaterial>(null!);
  const bugMat = useRef<THREE.PointsMaterial>(null!);
  const pulseMat = useRef<THREE.PointsMaterial>(null!);
  const shocks = useRef<THREE.Mesh[]>([]);
  const atmoMat = useRef<THREE.SpriteMaterial>(null!);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null!);
  const discMat = useRef<THREE.MeshBasicMaterial>(null!);

  const edgeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      verts[a].toArray(p, i * 6);
      verts[b].toArray(p, i * 6 + 3);
    });
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(edges.length * 6), 3));
    return g;
  }, [verts, edges]);

  const nodeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(verts);
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(verts.length * 3), 3));
    return g;
  }, [verts]);

  const bugGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(bugIds.map((i) => verts[i])), [verts, bugIds]);

  // signals that travel along the lattice edges, hopping node to node
  const pulses = useMemo(
    () =>
      Array.from({ length: pulseCount }, (_, i) => {
        const [a, b] = edges[Math.floor(Math.random() * edges.length)];
        return { prev: a, from: a, to: b, t: Math.random(), speed: 0.5 + Math.random() * 0.8, color: i % 4 === 0 ? AMBER : SIGNAL };
      }),
    [edges, pulseCount]
  );
  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pulseCount * TRAIL * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(pulseCount * TRAIL * 3), 3));
    return g;
  }, [pulseCount]);

  useFrame((state, dt) => {
    const s = motion.speed;
    const t = state.clock.elapsedTime * s;
    const C = motion.color;
    atmoMat.current.color.copy(C);
    ringMat.current.color.copy(C);
    discMat.current.color.copy(C);
    const [px, py] = motion.pointer.current;
    const g = group.current;
    const hover = motion.hover.current;
    const { width, height } = state.viewport;
    // cursor in world units, relative to where the lattice wants to sit
    const dx = hover ? px * width + state.camera.position.x - target[0] : 0;
    const dy = hover ? -py * height + state.camera.position.y - target[1] : 0;

    // magnetic lean toward the cursor (less to the left, so it stays off the text)
    const l = lean.current;
    l.x += (THREE.MathUtils.clamp(dx * 0.1, -0.45, 0.8) - l.x) * 0.05;
    l.y += (THREE.MathUtils.clamp(dy * 0.1, -0.5, 0.5) - l.y) * 0.05;
    g.position.x += (target[0] + l.x - g.position.x) * 0.04;
    g.position.y += (target[1] + l.y - g.position.y) * 0.04;
    const sc = g.scale.x + (target[2] - g.scale.x) * 0.04;
    g.scale.setScalar(sc);

    // turn to face the cursor
    const aimY = hover ? THREE.MathUtils.clamp(dx * 0.09, -0.6, 0.6) : 0;
    const aimX = hover ? THREE.MathUtils.clamp(-dy * 0.09, -0.45, 0.45) : 0;
    g.rotation.y += (aimY - g.rotation.y) * 0.05;
    g.rotation.x += (aimX - g.rotation.x) * 0.05;
    g.rotation.z += (px * 0.2 - g.rotation.z) * 0.05;

    // a quick mouse flick adds spin that eases off
    spinBoost.current = THREE.MathUtils.clamp(spinBoost.current + motion.flick.current * 6, -4, 4);
    motion.flick.current = 0;
    spinBoost.current *= Math.exp(-dt * 1.4);
    const sp = spin.current;
    sp.rotation.y += dt * (0.16 + motion.scroll.current * 3 + spinBoost.current) * s;
    sp.rotation.x = 0.25 + Math.sin(t * 0.3) * 0.08;

    // cursor close to the lattice excites it
    const gap = Math.hypot(dx - l.x, dy - l.y) - RADIUS * sc;
    const near = hover ? THREE.MathUtils.clamp(1 - gap / 1.5, 0, 1) : 0;
    excite.current += (near - excite.current) * 0.06;
    const ex = excite.current;
    const rush = 1 + ex * 1.6;

    core.current.rotation.y -= dt * 0.6 * s * rush;
    core.current.rotation.z += dt * 0.25 * s * rush;
    shell.current.rotation.x += dt * 0.35 * s * rush;
    shell.current.rotation.y -= dt * 0.2 * s * rush;
    coreGlow.current.scale.setScalar(2.4 * (1 + 0.12 * Math.sin(t * 2.2) + ex * 0.35));

    // scanning ring sweeps up and down through the lattice
    scanPhase.current += dt * 0.8 * s * rush;
    const scanY = Math.sin(scanPhase.current) * RADIUS * 0.95;
    const r = Math.sqrt(Math.max(0.05, RADIUS * RADIUS - scanY * scanY));
    ring.current.position.y = scanY;
    ring.current.scale.setScalar(r);
    disc.current.position.y = scanY;
    disc.current.scale.setScalar(r * 2.3);

    // nodes and edges light up as the scanner passes them
    const nc = nodeGeo.attributes.color.array as Float32Array;
    for (let i = 0; i < verts.length; i++) {
      const hit = Math.exp(-((verts[i].y - scanY) ** 2) / 0.1);
      level[i] = hit;
      const col = isBug[i] ? BUG : C;
      const k = isBug[i] ? 1.1 + 0.6 * hit + ex * 0.4 : 0.45 + 1.3 * hit + ex * 0.45;
      nc[i * 3] = col.r * k;
      nc[i * 3 + 1] = col.g * k;
      nc[i * 3 + 2] = col.b * k;
    }
    nodeGeo.attributes.color.needsUpdate = true;

    const ec = edgeGeo.attributes.color.array as Float32Array;
    edges.forEach(([a, b], i) => {
      const ka = 0.2 + 0.9 * level[a] + ex * 0.25;
      const kb = 0.2 + 0.9 * level[b] + ex * 0.25;
      ec[i * 6] = C.r * ka; ec[i * 6 + 1] = C.g * ka; ec[i * 6 + 2] = C.b * ka;
      ec[i * 6 + 3] = C.r * kb; ec[i * 6 + 4] = C.g * kb; ec[i * 6 + 5] = C.b * kb;
    });
    edgeGeo.attributes.color.needsUpdate = true;

    // move signals along edges, leaving a fading trail
    const pp = pulseGeo.attributes.position.array as Float32Array;
    const pc = pulseGeo.attributes.color.array as Float32Array;
    pulses.forEach((p, i) => {
      p.t += dt * p.speed * s * rush;
      if (p.t >= 1) {
        p.t %= 1;
        const options = neighbors[p.to].filter((n) => n !== p.from);
        p.prev = p.from;
        p.from = p.to;
        p.to = options[Math.floor(Math.random() * options.length)];
      }
      for (let k = 0; k < TRAIL; k++) {
        let tt = p.t - k * 0.035;
        let A = verts[p.from];
        let B = verts[p.to];
        if (tt < 0) {
          A = verts[p.prev];
          B = verts[p.from];
          tt += 1;
        }
        const o = (i * TRAIL + k) * 3;
        pp[o] = A.x + (B.x - A.x) * tt;
        pp[o + 1] = A.y + (B.y - A.y) * tt;
        pp[o + 2] = A.z + (B.z - A.z) * tt;
        const f = 1.4 * (1 - k / TRAIL) ** 2;
        pc[o] = p.color.r * f;
        pc[o + 1] = p.color.g * f;
        pc[o + 2] = p.color.b * f;
      }
    });
    pulseGeo.attributes.position.needsUpdate = true;
    pulseGeo.attributes.color.needsUpdate = true;

    // point sizes don't follow group scale, so scale them by hand
    nodeMat.current.size = 0.3 * sc;
    bugMat.current.size = (0.85 + 0.25 * Math.sin(t * 4)) * sc;
    pulseMat.current.size = 0.24 * sc;

    shocks.current.forEach((m, k) => {
      const ph = (t * 0.45 + k * 0.29) % 1;
      m.scale.setScalar(0.12 + ph * 0.42);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - ph) * 0.75;
    });
  });

  return (
    <group ref={group}>
      <group ref={spin}>
      {/* atmosphere behind the lattice */}
      <sprite scale={11} renderOrder={-1}>
        <spriteMaterial ref={atmoMat} map={glow} color={TEAL} opacity={0.07} {...additive} />
      </sprite>

      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial vertexColors opacity={0.85} {...additive} />
      </lineSegments>
      <points geometry={nodeGeo}>
        <pointsMaterial ref={nodeMat} map={glow} vertexColors size={0.3} {...additive} />
      </points>
      <points geometry={bugGeo}>
        <pointsMaterial ref={bugMat} map={glow} color={BUG} size={0.85} opacity={0.9} {...additive} />
      </points>
      <points geometry={pulseGeo} frustumCulled={false}>
        <pointsMaterial ref={pulseMat} map={glow} vertexColors size={0.24} {...additive} />
      </points>

      {bugIds.map((vi, k) => (
        <Billboard key={vi} position={verts[vi]}>
          <mesh ref={(el) => { if (el) shocks.current[k] = el; }}>
            <ringGeometry args={[0.85, 1, 48]} />
            <meshBasicMaterial color={BUG} side={THREE.DoubleSide} {...additive} />
          </mesh>
        </Billboard>
      ))}

      {/* core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial color={AMBER} wireframe opacity={0.7} {...additive} />
      </mesh>
      <mesh ref={shell}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial color={VIOLET} wireframe opacity={0.6} {...additive} />
      </mesh>
      <sprite ref={coreGlow} scale={2.4}>
        <spriteMaterial map={glow} color={AMBER} opacity={0.45} {...additive} />
      </sprite>
      <Nucleus motion={motion} />

      {/* scanner */}
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.01, 8, 128]} />
        <meshBasicMaterial ref={ringMat} color={TEAL} opacity={1} {...additive} />
      </mesh>
      <mesh ref={disc} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={discMat} map={glow} color={TEAL} opacity={0.22} side={THREE.DoubleSide} {...additive} />
      </mesh>

      <Orbit radius={3.15} tilt={[1.15, 0, 0.35]} speed={0.5} color={TEAL} sats={2} motion={motion} follow />
      <Orbit radius={3.6} tilt={[1.9, 0.4, -0.5]} speed={-0.32} color={VIOLET} sats={1} motion={motion} />
      </group>
    </group>
  );
}

function Dust({ count, size, inner, depth, phase, motion }: {
  count: number; size: number; inner: number; depth: number; phase: number; motion: Motion;
}) {
  const glow = useMemo(getGlow, []);
  const ref = useRef<THREE.Points>(null!);
  const mat = useRef<THREE.PointsMaterial>(null!);
  const geo = useMemo(() => {
    const palette = [new THREE.Color("#c9d0ff"), new THREE.Color("#c9d0ff"), new THREE.Color("#8d96c9"), TEAL, VIOLET, AMBER];
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = inner + Math.random() * depth;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(ph) * Math.cos(th);
      p[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      p[i * 3 + 2] = r * Math.cos(ph) - 5;
      palette[Math.floor(Math.random() * palette.length)].toArray(c, i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setAttribute("color", new THREE.BufferAttribute(c, 3));
    return g;
  }, [count, inner, depth]);

  useFrame((state, dt) => {
    ref.current.rotation.y += dt * 0.015 * (1 + phase) * motion.speed;
    ref.current.rotation.x += motion.scroll.current * 0.02;
    mat.current.opacity = 0.55 + 0.35 * Math.sin(state.clock.elapsedTime * (0.8 + phase) + phase * 4);
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial ref={mat} map={glow} vertexColors size={size} {...additive} />
    </points>
  );
}

function Cubes({ count = 12 }: { count?: number }) {
  // small floating "test case" cubes and diamonds
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        pos: [(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 9, -2 - Math.random() * 5] as [number, number, number],
        size: 0.18 + Math.random() * 0.25,
        color: i % 4 === 0 ? AMBER : i % 5 === 0 ? VIOLET : TEAL,
        diamond: i % 3 === 0,
      })),
    [count]
  );
  return (
    <>
      {items.map((c, i) => (
        <Float key={i} speed={1 + (i % 3)} rotationIntensity={2} floatIntensity={1.5}>
          <mesh position={c.pos}>
            {c.diamond ? <octahedronGeometry args={[c.size * 0.8, 0]} /> : <boxGeometry args={[c.size, c.size, c.size]} />}
            <meshBasicMaterial color={c.color} wireframe opacity={0.55} {...additive} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Floor({ motion }: { motion: Motion }) {
  // perspective grid far below that drifts toward the camera
  const ref = useRef<THREE.GridHelper>(null!);
  const offset = useRef(0);
  useEffect(() => {
    const m = ref.current.material as THREE.LineBasicMaterial;
    m.transparent = true;
    m.opacity = 0.16;
    m.depthWrite = false;
  }, []);
  useFrame((_, dt) => {
    offset.current = (offset.current + dt * (0.35 + Math.abs(motion.scroll.current) * 12) * motion.speed) % 1.5;
    ref.current.position.z = -6 + offset.current;
  });
  return <gridHelper ref={ref} args={[60, 40, "#2a3170", "#2a3170"]} position={[0, -4.6, -6]} />;
}

function ShootingStar() {
  const line = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array([1, 1, 1, 0, 0, 0]), 3));
    const l = new THREE.Line(g, new THREE.LineBasicMaterial({ vertexColors: true, ...additive }));
    l.frustumCulled = false;
    l.visible = false;
    return l;
  }, []);
  const st = useRef({ start: -10, dur: 1.1, from: new THREE.Vector3(), dir: new THREE.Vector3() });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = st.current;
    const p = (t - s.start) / s.dur;
    if (p > 1) {
      s.start = t + 3 + Math.random() * 6;
      s.from.set(-2 + Math.random() * 12, 3 + Math.random() * 3, -6 - Math.random() * 4);
      s.dir.set(-(0.6 + Math.random() * 0.4), -(0.3 + Math.random() * 0.3), 0).normalize();
      line.visible = false;
      return;
    }
    line.visible = p >= 0;
    if (p < 0) return;
    const fade = Math.sin(p * Math.PI);
    const pos = line.geometry.attributes.position.array as Float32Array;
    const hx = s.from.x + s.dir.x * p * 9;
    const hy = s.from.y + s.dir.y * p * 9;
    pos[0] = hx; pos[1] = hy; pos[2] = s.from.z;
    pos[3] = hx - s.dir.x * 2 * fade; pos[4] = hy - s.dir.y * 2 * fade; pos[5] = s.from.z;
    line.geometry.attributes.position.needsUpdate = true;
    (line.material as THREE.LineBasicMaterial).opacity = fade;
  });

  return <primitive object={line} />;
}

function Swarm({ count, motion }: { count: number; motion: Motion }) {
  // data particles spread across the whole screen, drifting on a slow flow field;
  // the cursor pushes them away and lights them up, scrolling sweeps them along
  const glow = useMemo(getGlow, []);
  const mat = useRef<THREE.PointsMaterial>(null!);
  const { geo, vel, base, boost, tinted } = useMemo(() => {
    const palette = [null, null, SIGNAL, VIOLET, AMBER]; // null = follows the section colour
    const p = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const tinted = new Uint8Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 22;
      p[i * 3 + 1] = (Math.random() - 0.5) * 12;
      p[i * 3 + 2] = -3 + Math.random() * 5;
      const pick = palette[Math.floor(Math.random() * palette.length)];
      if (pick) pick.toArray(base, i * 3);
      else tinted[i] = 1;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return { geo, vel: new Float32Array(count * 2), base, boost: new Float32Array(count), tinted };
  }, [count]);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05) * motion.speed;
    const t = state.clock.elapsedTime * 0.15;
    const { width, height } = state.viewport;
    const hw = width * 0.65;
    const hh = height * 0.65;
    const [px, py] = motion.pointer.current;
    const mx = px * width + state.camera.position.x;
    const my = -py * height + state.camera.position.y;
    const hover = motion.hover.current;
    const sweep = motion.scroll.current * 6;
    const p = geo.attributes.position.array as Float32Array;
    const c = geo.attributes.color.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const o = i * 3;
      const x = p[o];
      const y = p[o + 1];
      const z = p[o + 2];
      // flow field
      const fx = Math.sin(y * 0.35 + t) * 0.35 + Math.cos(z * 0.6 + t * 1.3) * 0.15;
      const fy = Math.cos(x * 0.3 - t) * 0.22 + 0.05;
      let vx = vel[i * 2] + (fx - vel[i * 2]) * Math.min(1, d * 1.5);
      let vy = vel[i * 2 + 1] + (fy - vel[i * 2 + 1]) * Math.min(1, d * 1.5);
      // cursor repel
      if (hover) {
        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.0001;
        if (dist < 1.8) {
          const f = 1 - dist / 1.8;
          vx += (dx / dist) * f * 6 * d;
          vy += (dy / dist) * f * 6 * d;
          boost[i] = Math.min(1, boost[i] + f * 0.2);
        }
      }
      boost[i] *= 0.96;
      vel[i * 2] = vx;
      vel[i * 2 + 1] = vy;
      let nx = x + vx * d;
      let ny = y + (vy + sweep) * d;
      // wrap around the screen edges
      if (nx > hw) nx -= hw * 2; else if (nx < -hw) nx += hw * 2;
      if (ny > hh) ny -= hh * 2; else if (ny < -hh) ny += hh * 2;
      p[o] = nx;
      p[o + 1] = ny;
      const k = 0.55 + boost[i] * 2;
      const C = motion.color;
      c[o] = (tinted[i] ? C.r : base[o]) * k;
      c[o + 1] = (tinted[i] ? C.g : base[o + 1]) * k;
      c[o + 2] = (tinted[i] ? C.b : base[o + 2]) * k;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    mat.current.opacity = 0.75 + 0.15 * Math.sin(state.clock.elapsedTime * 1.3);
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial ref={mat} map={glow} vertexColors size={0.13} {...additive} />
    </points>
  );
}

function Rig({ motion }: { motion: Motion }) {
  // gentle camera parallax with the pointer; scroll momentum decays here
  useFrame((state) => {
    const [px, py] = motion.pointer.current;
    const cam = state.camera;
    cam.position.x += (px * 0.9 - cam.position.x) * 0.03;
    cam.position.y += (-py * 0.6 - cam.position.y) * 0.03;
    cam.lookAt(0, 0, 0);
    motion.scroll.current *= 0.92;
    motion.color.lerp(motion.tint.current, 0.04); // fade smoothly to the colour of the section in view
  });
  return null;
}

export default function Scene() {
  const pathname = usePathname();
  const pointer = useRef<[number, number]>([0, 0]);
  const scroll = useRef(0);
  const hover = useRef(false);
  const flick = useRef(0);
  const tint = useRef(TEAL.clone());
  const color = useRef(TEAL.clone());
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden); // stop rendering in background tabs
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // The scene takes on the colour of whichever [data-tint] section is in the middle of the screen
  useEffect(() => {
    const pick = () => {
      const mid = window.innerHeight * 0.45;
      let hex: string | undefined;
      document.querySelectorAll<HTMLElement>("[data-tint]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < mid && r.bottom > mid) hex = el.dataset.tint;
      });
      tint.current.set(hex || "#3ee0cf");
    };
    const t = setTimeout(pick, 300); // wait for the new page to render
    window.addEventListener("scroll", pick, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", pick);
    };
  }, [pathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastX: number | null = null;
    const onMove = (e: PointerEvent) => {
      pointer.current = [e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5];
      hover.current = e.pointerType === "mouse";
      if (hover.current && lastX !== null) flick.current += pointer.current[0] - lastX;
      lastX = pointer.current[0];
    };
    const onLeave = () => { hover.current = false; lastX = null; };
    const onScroll = () => {
      const y = window.scrollY;
      scroll.current = Math.max(-0.6, Math.min(0.6, scroll.current + (y - lastY) * 0.0015));
      lastY = y;
    };
    const onResize = () => setMobile(window.innerWidth < 900);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReduced(mq.matches);
    onResize();
    onMotion();
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onMotion);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onMotion);
    };
  }, []);

  const motion = useMemo<Motion>(
    () => ({ pointer, scroll, hover, flick, tint, color: color.current, speed: reduced ? 0.25 : 1 }),
    [reduced]
  );
  // sub-pages (/services/websites, /blog/…) use their section's position
  const base =
    layouts[pathname] ??
    (/^\/((de|fr|nl)\/)?services/.test(pathname) ? layouts["/services"] : pathname.startsWith("/blog") ? layouts["/about"] : layouts["/"]);
  const target: [number, number, number] = mobile ? [0, -2.2, base[2] * 0.7] : base;
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"} // stop rendering in background tabs; nothing visible changes
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={[BG, 11, 30]} />
        <Rig motion={motion} />
        <Lattice target={target} motion={motion} pulseCount={mobile ? 12 : 22} />
        <Dust count={mobile ? 350 : 700} size={0.09} inner={6} depth={12} phase={0} motion={motion} />
        <Dust count={mobile ? 120 : 260} size={0.16} inner={7} depth={8} phase={0.6} motion={motion} />
        <Dust count={mobile ? 40 : 80} size={0.3} inner={8} depth={6} phase={1.3} motion={motion} />
        <Cubes />
        <Floor motion={motion} />
        <Swarm count={mobile ? 160 : 420} motion={motion} />
        {!reduced && <ShootingStar />}
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.2} luminanceSmoothing={0.3} radius={0.7} />
        </EffectComposer>
      </Canvas>
      <div className="scene-fade" />
    </div>
  );
}
