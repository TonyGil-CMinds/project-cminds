"use client";

import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useRouter } from "next/navigation";

const IMAGES = [
  { src: "/platforms/aiforbiodiversity/initiative-image-ai4manatees.png",  label: "AI For Manatees",    href: null },
  { src: "/platforms/aiforbiodiversity/initiative-image-ntl.png",          label: "NaturaTech LAC",      href: "/aiforbiodiversity/naturatechlac" },
  { src: "/platforms/aiforbiodiversity/initiative-image-vitalocenas.png",  label: "Vital Oceans",        href: "/aiforbiodiversity/vitaloceans" },
  { src: "/platforms/aiforbiodiversity/initiative-image-tech4nature.png",  label: "Tech4Nature México",  href: "/aiforbiodiversity/techfornature" },
];
const SRCS = IMAGES.map(i => i.src);

/* ── Cylinder constants ─────────────────────────────────────────────────────── */
const N          = 11;
const RADIUS     = 6.5;
const ANGLE_STEP = (Math.PI * 2) / N;
const Y_STEP     = 1.8;
const PITCH      = Y_STEP / ANGLE_STEP;
const LOOP_H     = N * Y_STEP;
const ROT_SPEED  = 0.18;

const _RAW_FRONT  = -(Math.PI / 2) * PITCH;
const LOOP_OFFSET = ((_RAW_FRONT % LOOP_H) + LOOP_H) % LOOP_H;

/* ── Card geometry ─────────────────────────────────────────────────────────── */
const CARD_W = 3.2;
const CARD_H = 2.2;
const CARD_R = 0.22;

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
  for (let v = 0; v < pos.count; v++) {
    uvs[v * 2]     = (pos.getX(v) + hw) / w;
    uvs[v * 2 + 1] = (pos.getY(v) + hh) / h;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  return geo;
}

/* ── Three.js scene ─────────────────────────────────────────────────────────── */
interface SceneProps {
  scrollVel:   React.MutableRefObject<number>;
  onGroupRef:  (el: THREE.Group | null, i: number) => void;
  onCardClick: (imgIdx: number) => void;
}

function SpiralCards({ scrollVel, onGroupRef, onCardClick }: SceneProps) {
  const textures  = useTexture(SRCS) as THREE.Texture[];
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const meshRefs  = useRef<(THREE.Mesh  | null)[]>([]);
  const matRefs   = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const phaseRef  = useRef(0);
  const hovIdx    = useRef<number | null>(null);
  const mouseNDC  = useRef(new THREE.Vector2(-9999, -9999));
  const { gl, scene, camera } = useThree();
  const cameraRef = useRef<THREE.Camera>(camera);

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
    scene.background = null;
  }, [gl, scene]);

  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseNDC.current.set(
        ((e.clientX - r.left)  / r.width)  * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      );
    };
    const onOut = () => mouseNDC.current.set(-9999, -9999);
    // Fresh raycast on click — doesn't depend on hover state
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - r.left) / r.width)  *  2 - 1,
        -((e.clientY - r.top) / r.height) *  2 + 1,
      );
      const ray = new THREE.Raycaster();
      ray.setFromCamera(ndc, cameraRef.current);
      const meshes = meshRefs.current.filter(Boolean) as THREE.Mesh[];
      const hits   = ray.intersectObjects(meshes);
      if (hits.length) {
        const hitIdx = meshes.indexOf(hits[0].object as THREE.Mesh);
        onCardClick(hitIdx % 4);
      }
    };
    canvas.addEventListener("mousemove",  onMove);
    canvas.addEventListener("mouseleave", onOut);
    canvas.addEventListener("click",      onClick);
    return () => {
      canvas.removeEventListener("mousemove",  onMove);
      canvas.removeEventListener("mouseleave", onOut);
      canvas.removeEventListener("click",      onClick);
    };
  }, [gl]);

  const setGroup = useCallback((el: THREE.Group | null, i: number) => {
    groupRefs.current[i] = el;
    onGroupRef(el, i);
  }, [onGroupRef]);

  const cardGeo = useMemo(() => createRoundedPlane(CARD_W, CARD_H, CARD_R), []);

  useFrame((state, delta) => {
    cameraRef.current = state.camera;

    const vel = scrollVel.current;
    scrollVel.current *= 0.90;
    if (Math.abs(scrollVel.current) < 0.0001) scrollVel.current = 0;

    phaseRef.current += delta * ROT_SPEED + vel;

    groupRefs.current.forEach((group, i) => {
      if (!group) return;
      const angle = i * ANGLE_STEP + phaseRef.current;
      group.position.set(
        RADIUS * Math.cos(angle),
        ((-(angle * PITCH) % LOOP_H) + LOOP_H) % LOOP_H - LOOP_OFFSET,
        RADIUS * Math.sin(angle),
      );
      group.rotation.y = Math.PI / 2 - angle;
    });

    matRefs.current.forEach((mat, i) => {
      if (!mat) return;
      const angle  = i * ANGLE_STEP + phaseRef.current;
      const facing = Math.cos(angle - Math.PI / 2);
      mat.opacity     = Math.max(0, Math.min(1, facing * 3.0 + 0.2));
      mat.transparent = true;
    });

    // Hover raycasting
    state.raycaster.setFromCamera(mouseNDC.current, state.camera);
    const meshes = meshRefs.current.filter(Boolean) as THREE.Mesh[];
    const hits   = state.raycaster.intersectObjects(meshes);
    const newHov = hits.length > 0 ? meshes.indexOf(hits[0].object as THREE.Mesh) : null;

    if (newHov !== hovIdx.current) {
      if (hovIdx.current !== null) {
        const pg = groupRefs.current[hovIdx.current];
        const pm = matRefs.current[hovIdx.current];
        if (pg) gsap.to(pg.scale, { x: 1, y: 1, z: 1, duration: 0.35, ease: "power2.out", overwrite: "auto" });
        if (pm) gsap.to(pm.color, { r: 1, g: 1, b: 1, duration: 0.35, overwrite: "auto" });
      }
      if (newHov !== null) {
        const ng = groupRefs.current[newHov];
        const nm = matRefs.current[newHov];
        if (ng) gsap.to(ng.scale, { x: 0.88, y: 0.88, z: 0.88, duration: 0.28, ease: "power2.out", overwrite: "auto" });
        if (nm) gsap.to(nm.color, { r: 0.30, g: 0.30, b: 0.30, duration: 0.28, overwrite: "auto" });
      }
      hovIdx.current = newHov;
    }
  });

  return (
    <>
      {Array.from({ length: N }, (_, i) => (
        <group key={i} ref={el => setGroup(el, i)}>
          <mesh geometry={cardGeo} ref={el => { meshRefs.current[i] = el; }}>
            <meshBasicMaterial
              ref={el => { matRefs.current[i] = el; }}
              map={textures[i % 4]}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ── React shell ────────────────────────────────────────────────────────────── */
export default function AfbInitiatives() {
  const scrollVelRef  = useRef(0);
  const groupsRef     = useRef<(THREE.Group | null)[]>([]);
  const listItemRefs  = useRef<(HTMLParagraphElement | null)[]>([]);
  const transitRef    = useRef(false);
  const sectionRef    = useRef<HTMLElement>(null);
  const touchYRef     = useRef<number | null>(null);
  const router        = useRouter();

  const [activeTab,  setActiveTab]  = useState<"spiral" | "list">("spiral");
  const [hovListIdx, setHovListIdx] = useState<number | null>(null);

  const onGroupRef = useCallback((el: THREE.Group | null, i: number) => {
    groupsRef.current[i] = el;
  }, []);

  const handleCardClick = useCallback((imgIdx: number) => {
    const href = IMAGES[imgIdx]?.href;
    if (!href) return;
    // Exit: scale all spiral cards to 0 staggered — same as switchView("list")
    groupsRef.current.forEach((group, i) => {
      if (!group) return;
      gsap.to(group.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.32, delay: i * 0.032, ease: "power3.in",
        overwrite: "auto",
        onComplete: i === N - 1 ? () => router.push(href) : undefined,
      });
    });
  }, [router]);

  // Hide list items on mount so they're invisible until animated in
  useEffect(() => {
    const items = listItemRefs.current.filter(Boolean) as HTMLElement[];
    gsap.set(items, { opacity: 0, y: -32 });
  }, []);

  // Animate list items IN after React sets activeTab = "list"
  useEffect(() => {
    if (activeTab !== "list") return;
    const items = listItemRefs.current.filter(Boolean) as HTMLElement[];
    gsap.fromTo(
      items,
      { y: -32, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.48, stagger: 0.10, ease: "power3.out",
        onComplete: () => {
          // Clear inline styles so CSS hover dim can work
          gsap.set(items, { clearProps: "opacity,transform" });
          transitRef.current = false;
        },
      },
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      scrollVelRef.current += e.deltaY * 0.0005;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Touch swipe — same velocity unit as the wheel handler
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchYRef.current === null) return;
      const deltaY = touchYRef.current - e.touches[0].clientY; // swipe up = positive = rotate forward
      scrollVelRef.current += deltaY * 0.003;
      touchYRef.current = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      touchYRef.current = null;
    };

    section.addEventListener("touchstart", onTouchStart, { passive: true });
    section.addEventListener("touchmove",  onTouchMove,  { passive: true });
    section.addEventListener("touchend",   onTouchEnd,   { passive: true });

    return () => {
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchmove",  onTouchMove);
      section.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  const switchView = useCallback((next: "spiral" | "list") => {
    if (next === activeTab || transitRef.current) return;
    transitRef.current = true;

    if (next === "list") {
      // Collapse 3-D cards, then show list (useEffect above handles item animation)
      groupsRef.current.forEach((group, i) => {
        if (!group) return;
        gsap.to(group.scale, {
          x: 0, y: 0, z: 0,
          duration: 0.32,
          delay: i * 0.032,
          ease: "power3.in",
          overwrite: "auto",
          onComplete: i === N - 1 ? () => setActiveTab("list") : undefined,
        });
      });

    } else {
      // Animate list items OUT (bottom → top = reversed stagger)
      const items = [...(listItemRefs.current.filter(Boolean) as HTMLElement[])].reverse();
      gsap.timeline({
        onComplete: () => {
          setActiveTab("spiral");
          // Grow cards back with bounce stagger after canvas is visible
          setTimeout(() => {
            groupsRef.current.forEach((group, i) => {
              if (!group) return;
              gsap.to(group.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.65,
                delay: i * 0.055,
                ease: "back.out(1.8)",
                overwrite: "auto",
                onComplete: i === N - 1 ? () => { transitRef.current = false; } : undefined,
              });
            });
          }, 80);
        },
      }).to(items, {
        y: -22, opacity: 0,
        duration: 0.28, stagger: 0.07, ease: "power2.in",
      });
    }
  }, [activeTab]);

  return (
    <section ref={sectionRef} id="initiatives" className="afb-initiatives">

      <div className="afb-init-toggle">
        <button
          className={`afb-init-tab${activeTab === "spiral" ? " afb-init-tab--active" : ""}`}
          onClick={() => switchView("spiral")}
        >spiral</button>
        <span className="afb-init-dot" aria-hidden="true">•</span>
        <button
          className={`afb-init-tab${activeTab === "list" ? " afb-init-tab--active" : ""}`}
          onClick={() => switchView("list")}
        >list</button>
      </div>

      <div className={`afb-init-canvas-wrap${activeTab !== "spiral" ? " afb-init-canvas-wrap--hidden" : ""}`}>
        <Canvas
          camera={{ fov: 70, near: 0.1, far: 100, position: [0, 0, 13] }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <SpiralCards scrollVel={scrollVelRef} onGroupRef={onGroupRef} onCardClick={handleCardClick} />
          </Suspense>
        </Canvas>
        <div className="afb-init-vignette" aria-hidden="true" />
      </div>

      {/* Text list — large names, cascade in/out, hover dims others */}
      <div
        className={`afb-init-list${activeTab === "list" ? " afb-init-list--visible" : ""}`}
        onMouseLeave={() => setHovListIdx(null)}
      >
        {IMAGES.map((item, i) => (
          <p
            key={item.label}
            ref={el => { listItemRefs.current[i] = el; }}
            className={`afb-init-list-item${hovListIdx !== null && hovListIdx !== i ? " afb-init-list-item--dim" : ""}${item.href ? " afb-init-list-item--link" : ""}`}
            onMouseEnter={() => setHovListIdx(i)}
            onClick={() => {
              if (!item.href) return;
              const dest = item.href;
              // Exit: slide list items up + fade — mirrors switchView("spiral") list-out
              const items = [...(listItemRefs.current.filter(Boolean) as HTMLElement[])].reverse();
              gsap.to(items, {
                y: -22, opacity: 0, duration: 0.28, stagger: 0.07, ease: "power2.in",
                onComplete: () => router.push(dest),
              });
            }}
          >
            {item.label}
          </p>
        ))}
      </div>

    </section>
  );
}
