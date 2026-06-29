"use client";

import { useRef, useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import HexPattern from "./HexPattern";

gsap.registerPlugin(ScrollTrigger);

/* ── Spiral physics ────────────────────────────────────────
   Y is derived directly from angle so they stay in sync.
   Front card (angle = π/2) always lands at y = 0 (viewport center).
   ─────────────────────────────────────────────────────────── */
const N           = 11;
const RADIUS      = 6.5;                   // must be > CARD_W/(2·sin(ANGLE_STEP/2)) ≈ 5.66
const ANGLE_STEP  = (Math.PI * 2) / N;     // ≈ 32.7° — 11 unique slots
const Y_STEP      = 2.0;                   // slight Y overlap (0.2) — Z-depth gives visual gap
const PITCH       = Y_STEP / ANGLE_STEP;   // y-descent per radian
const LOOP_H      = N * Y_STEP;            // one revolution in Y
const ROT_SPEED   = 0.20;
const CARD_W      = 3.2;
const CARD_H      = 2.2;
const CARD_R      = 0.26;                  // ≈ 40 px border radius

// Hover effect — card shrinks slightly, image darkens
const SCALE_NORMAL = 1.0;
const SCALE_HOVER  = 0.88;
const LERP_SPEED   = 0.10;
const COLOR_NORMAL = new THREE.Color(1.0, 1.0, 1.0);
const COLOR_HOVER  = new THREE.Color(0.45, 0.45, 0.45);

// Pre-compute so front card (angle = π/2) is at y = 0
const _RAW_FRONT  = -(Math.PI / 2) * PITCH;
const LOOP_OFFSET = ((_RAW_FRONT % LOOP_H) + LOOP_H) % LOOP_H;

/* ── Rounded rectangle geometry with correct UVs ──────────
   THREE.ShapeGeometry gives us a flat polygon with the given
   rounded shape. We manually remap UVs from world coords to
   [0,1]² so textures map correctly.
   ─────────────────────────────────────────────────────────── */
function createRoundedPlane(w: number, h: number, r: number): THREE.BufferGeometry {
  const hw = w / 2, hh = h / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo( hw - r, -hh);
  shape.quadraticCurveTo( hw, -hh,  hw, -hh + r);
  shape.lineTo( hw,  hh - r);
  shape.quadraticCurveTo( hw,  hh,  hw - r,  hh);
  shape.lineTo(-hw + r,  hh);
  shape.quadraticCurveTo(-hw,  hh, -hw,  hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

  const geo = new THREE.ShapeGeometry(shape, 8);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uvs[i * 2]     = (pos.getX(i) + hw) / w;
    uvs[i * 2 + 1] = (pos.getY(i) + hh) / h;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  return geo;
}

/* ── Grid positions for List view (3 columns) ─────────────── */
function gridPos(i: number) {
  const cols = 3;
  const gapX = CARD_W + 0.55;
  const gapY = CARD_H + 0.55;
  const col  = i % cols;
  const row  = Math.floor(i / cols);
  const wOff = ((cols - 1) * gapX) / 2;
  const hOff = (Math.ceil(N / cols) - 1) * gapY / 2;
  return { x: col * gapX - wOff, y: -(row * gapY) + hOff, z: 0 };
}

/* ── Deterministic per-card tilt (subtle, spiral only) ─────── */
function tilt(i: number) {
  return {
    rx: Math.sin(i * 1.234) * 0.07,
    rz: Math.cos(i * 2.567) * 0.05,
  };
}

/* ── Data ──────────────────────────────────────────────────── */
const ITEMS = [
  { id:  0, name: "NaturaTech LAC",     tag: "Technology for nature conservation",  image: "/platforms/aiforbiodiversity/wherewecomefrom-img1.png" },
  { id:  1, name: "BioMap Initiative",  tag: "Real-time biodiversity mapping",       image: "/platforms/aiforbiodiversity/wherewecomefrom-img2.png" },
  { id:  2, name: "Climate AI Lab",     tag: "AI models for climate prediction",     image: "/platforms/aiforbiodiversity/hero-bg-image.png" },
  { id:  3, name: "Species Monitor",    tag: "Endangered species tracking",          image: "/platforms/aiforbiodiversity/wherewecomefrom-img1.png" },
  { id:  4, name: "EcoData Platform",   tag: "Open environmental data",              image: "/platforms/aiforbiodiversity/wherewecomefrom-img2.png" },
  { id:  5, name: "Conservation Net",   tag: "Global network of conservationists",   image: "/platforms/aiforbiodiversity/hero-bg-image.png" },
  { id:  6, name: "Wetlands Watch",     tag: "Protecting aquatic ecosystems",        image: "/platforms/aiforbiodiversity/wherewecomefrom-img2.png" },
  { id:  7, name: "Forest AI",          tag: "Real-time deforestation alerts",       image: "/platforms/aiforbiodiversity/wherewecomefrom-img1.png" },
  { id:  8, name: "Pollinator Network", tag: "Bee & butterfly habitat mapping",      image: "/platforms/aiforbiodiversity/hero-bg-image.png" },
  { id:  9, name: "Ocean Data Lab",     tag: "Marine biodiversity intelligence",     image: "/platforms/aiforbiodiversity/wherewecomefrom-img2.png" },
  { id: 10, name: "Carbon Tracker",     tag: "Automated carbon sequestration",       image: "/platforms/aiforbiodiversity/wherewecomefrom-img1.png" },
];

/* ── R3F scene ─────────────────────────────────────────────── */
interface SceneProps {
  scrollVel:  React.MutableRefObject<number>;
  viewRef:    React.MutableRefObject<"spiral" | "list">;
  onHover:    (idx: number | null) => void;
  onGroupRef: (el: THREE.Group | null, i: number) => void;
}

function SpiralScene({ scrollVel, viewRef, onHover, onGroupRef }: SceneProps) {
  const { gl, scene } = useThree();
  const mouseNDC  = useRef(new THREE.Vector2(-9999, -9999));
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const meshRefs  = useRef<(THREE.Mesh  | null)[]>([]);
  const matRefs   = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const phaseRef  = useRef(0);
  const hovIdx    = useRef<number | null>(null);
  const textures  = useTexture(ITEMS.map(it => it.image)) as THREE.Texture[];

  /* Shared rounded geometry — dep on dimensions so it rebuilds if constants change */
  const roundedGeo = useMemo(
    () => createRoundedPlane(CARD_W, CARD_H, CARD_R),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [CARD_W, CARD_H, CARD_R],
  );

  /* Transparent canvas — must set both clearColor alpha AND nullify scene.background */
  useEffect(() => {
    gl.setClearColor(0x000000, 0);
    scene.background = null;
  }, [gl, scene]);

  /* Track mouse in NDC space directly on the WebGL canvas */
  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseNDC.current.set(
        ((e.clientX - r.left) / r.width)  * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      );
    };
    const onOut = () => mouseNDC.current.set(-9999, -9999);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onOut);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onOut);
    };
  }, [gl]);

  const setGroup = useCallback((el: THREE.Group | null, i: number) => {
    groupRefs.current[i] = el;
    onGroupRef(el, i);
  }, [onGroupRef]);

  useFrame((state, delta) => {
    /* ── Velocity decay ── */
    const vel = scrollVel.current;
    scrollVel.current *= 0.88;
    if (Math.abs(scrollVel.current) < 0.00005) scrollVel.current = 0;

    /* ── Spiral positions (skip in list mode — GSAP owns transforms there) ── */
    if (viewRef.current !== "list") {
      phaseRef.current += delta * ROT_SPEED + vel;

      groupRefs.current.forEach((group, i) => {
        if (!group) return;
        const angle    = i * ANGLE_STEP + phaseRef.current;
        const rawY     = -(angle * PITCH);
        const y        = ((rawY % LOOP_H) + LOOP_H) % LOOP_H - LOOP_OFFSET;
        group.position.set(RADIUS * Math.cos(angle), y, RADIUS * Math.sin(angle));
        group.rotation.y = Math.PI / 2 - angle;
      });
    }

    /* ── Hover: scale down + darken the hovered card ── */
    groupRefs.current.forEach((group, i) => {
      if (!group) return;
      const targetScale = i === hovIdx.current ? SCALE_HOVER : SCALE_NORMAL;
      group.scale.setScalar(
        group.scale.x + (targetScale - group.scale.x) * LERP_SPEED
      );
    });
    matRefs.current.forEach((mat, i) => {
      if (!mat) return;
      mat.color.lerp(
        i === hovIdx.current ? COLOR_HOVER : COLOR_NORMAL,
        LERP_SPEED
      );
      /* Fade cards that are nearly edge-on (side-facing) so they dissolve
         instead of appearing as slivers at the spiral extremes.
         facing = cos(angle - π/2): 1 = front, 0 = side, -1 = back */
      if (viewRef.current !== "list") {
        const angle   = i * ANGLE_STEP + phaseRef.current;
        const facing  = Math.cos(angle - Math.PI / 2);
        const opacity = Math.max(0, Math.min(1, facing * 2.5));
        mat.opacity     = opacity;
        mat.transparent = true;
      }
    });

    /* ── Continuous raycasting: chip updates even with stationary cursor ── */
    state.raycaster.setFromCamera(mouseNDC.current, state.camera);
    const meshes  = meshRefs.current.filter(Boolean) as THREE.Mesh[];
    const hits    = state.raycaster.intersectObjects(meshes);
    const newHov  = hits.length > 0 ? meshes.indexOf(hits[0].object as THREE.Mesh) : null;
    if (newHov !== hovIdx.current) {
      hovIdx.current = newHov;
      onHover(newHov);
    }
  });

  return (
    <>
      <ambientLight intensity={1.9} />
      {ITEMS.map((item, i) => (
        <group key={item.id} ref={el => setGroup(el, i)}>
          <mesh
            geometry={roundedGeo}
            ref={el => { meshRefs.current[i] = el; }}
          >
            <meshBasicMaterial
              ref={el => { matRefs.current[i] = el; }}
              map={textures[i]}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ── Section shell ─────────────────────────────────────────── */
type View = "spiral" | "list";

export default function AfbInitiativesSection() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const stRef     = useRef<ScrollTrigger | null>(null);
  const scrollVel = useRef(0);
  const viewRef   = useRef<View>("spiral");
  const groupRefs = useRef<(THREE.Group | null)[]>([]);

  const [hovered, setHovered] = useState<number | null>(null);
  const [view,    setView]    = useState<View>("spiral");

  /* Wheel → velocity while section is pinned */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!stRef.current?.isActive) return;
      scrollVel.current += e.deltaY * 0.0007;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  /* ScrollTrigger pin + GSAP entrance */
  useGSAP(() => {
    stRef.current = ScrollTrigger.create({
      trigger: wrapRef.current,
      start:   "top top",
      end:     "+=280%",
      pin:     true,
    });
    ScrollTrigger.create({
      trigger: wrapRef.current,
      start:   "top 68%",
      once:    true,
      onEnter: () => {
        gsap.fromTo(".afb-init-eyebrow",
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.55, ease: "power2.out" }
        );
        gsap.fromTo(".afb-init-title",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.08 }
        );
        gsap.fromTo(".afb-init-nav-btn",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.09, ease: "power2.out", delay: 0.1 }
        );
      },
    });
  }, { scope: wrapRef });

  const switchView = useCallback((next: View) => {
    if (next === viewRef.current) return;
    viewRef.current = next;
    setView(next);

    if (next === "list") {
      groupRefs.current.forEach((group, i) => {
        if (!group) return;
        const p = gridPos(i);
        /* Animate all 3 rotation axes to 0 so grid is perfectly flat */
        gsap.to(group.position, { x: p.x, y: p.y, z: p.z, duration: 0.7, delay: i * 0.04, ease: "power3.out" });
        gsap.to(group.rotation, { x: 0, y: 0, z: 0,       duration: 0.65, delay: i * 0.04, ease: "power3.out" });
      });
    } else {
      /* Kill GSAP tweens — useFrame takes over immediately */
      groupRefs.current.forEach(group => {
        if (!group) return;
        gsap.killTweensOf(group.position);
        gsap.killTweensOf(group.rotation);
      });
    }
  }, []);

  const onGroupRef = useCallback((el: THREE.Group | null, i: number) => {
    groupRefs.current[i] = el;
  }, []);

  const hovItem = hovered !== null ? ITEMS[hovered] : null;

  return (
    <section
      ref={wrapRef}
      id="initiatives"
      className="afb-section afb-section-init"
    >
      <div className="afb-init-glow" aria-hidden="true" />

      {/* Header */}
      <div className="afb-init-header">
        <div className="afb-init-header-left">
          <span className="afb-init-eyebrow" style={{ opacity: 0 }}>INITIATIVES</span>
          <h2 className="afb-init-title" style={{ opacity: 0 }}>
            Featured<br />
            <span className="afb-init-title-green">Initiatives</span>
          </h2>
        </div>
        <div className="afb-init-toggle">
          <button
            className={`afb-init-nav-btn${view === "spiral" ? " active" : ""}`}
            onClick={() => switchView("spiral")}
            style={{ opacity: 0 }}
          >
            Spiral
          </button>
          <button
            className={`afb-init-nav-btn${view === "list" ? " active" : ""}`}
            onClick={() => switchView("list")}
            style={{ opacity: 0 }}
          >
            List
          </button>
        </div>
      </div>

      {/* Three.js canvas — HexPattern sits underneath via z-index 0 */}
      <div className="afb-init-canvas-wrap">
        <HexPattern className="afb-init-hex" />
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ fov: 70, near: 0.1, far: 100, position: [0, 0, 13] }}
        >
          <Suspense fallback={null}>
            <SpiralScene
              scrollVel={scrollVel}
              viewRef={viewRef}
              onHover={setHovered}
              onGroupRef={onGroupRef}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Hover chip */}
      <div className={`afb-init-chip${hovItem ? " visible" : ""}`}>
        <div className="afb-init-chip-icon">
          <img src="/platforms/aiforbiodiversity/logo.svg" alt="" />
        </div>
        <div className="afb-init-chip-text">
          <span className="afb-init-chip-name">{hovItem?.name ?? " "}</span>
          <span className="afb-init-chip-tag">{hovItem?.tag  ?? " "}</span>
        </div>
      </div>
    </section>
  );
}
