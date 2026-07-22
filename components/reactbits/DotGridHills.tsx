"use client";

/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef } from "react";

import * as THREE from "three";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

export interface DotGridHillsProps {
  /** Dot color, defaults to the site's cyan accent. */
  color?: string;
  /** Extra class name applied to the Canvas wrapper element. */
  className?: string;
}

interface Ripple {
  x: number;
  z: number;
  startTime: number;
}

const GRID = 90;
const SPACING = 0.5;
const HALF_EXTENT = ((GRID - 1) * SPACING) / 2;

const A1 = 0.6;
const A2 = 0.45;
const A3 = 0.35;

const RIPPLE_RAMP = 0.9;
const RIPPLE_LIFETIME = 4;

// Depth range (view-space distance from camera) over which points fade/tint
// from near (white, faint) to far (accent color, vivid). Tuned for the
// camera at [0, 6, 12] looking toward (0, 0, -2) and a field of ~±22.
const DEPTH_NEAR = 8.0;
const DEPTH_FAR = 34.0;

const POINT_SIZE = 0.075;

const DOT_VERTEX_SHADER = /* glsl */ `
  uniform float uSize;
  uniform float uScale;
  uniform float uNear;
  uniform float uFar;
  varying float vT;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float depth = -mvPosition.z;
    float t = clamp((depth - uNear) / max(uFar - uNear, 0.0001), 0.0, 1.0);
    vT = t;

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * (uScale / max(depth, 0.0001));
  }
`;

const DOT_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorNear;
  uniform vec3 uColorFar;
  uniform float uAlphaNear;
  uniform float uAlphaFar;
  varying float vT;

  void main() {
    if (length(gl_PointCoord - 0.5) > 0.5) discard;

    vec3 col = mix(uColorNear, uColorFar, vT);
    float alpha = mix(uAlphaNear, uAlphaFar, vT);
    gl_FragColor = vec4(col, alpha);
  }
`;

interface DotUniforms {
  [key: string]: THREE.IUniform<unknown>;
  uSize: THREE.IUniform<number>;
  uScale: THREE.IUniform<number>;
  uNear: THREE.IUniform<number>;
  uFar: THREE.IUniform<number>;
  uColorNear: THREE.IUniform<THREE.Color>;
  uColorFar: THREE.IUniform<THREE.Color>;
  uAlphaNear: THREE.IUniform<number>;
  uAlphaFar: THREE.IUniform<number>;
}

interface HillsProps {
  color: string;
}

function Hills({ color }: HillsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const targetPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const { basePositions, geometry, material } = useMemo(() => {
    const count = GRID * GRID;
    const positions = new Float32Array(count * 3);
    const bases = new Float32Array(count * 2); // baseX, baseZ per point

    let i = 0;
    for (let ix = 0; ix < GRID; ix++) {
      for (let iz = 0; iz < GRID; iz++) {
        const x = ix * SPACING - HALF_EXTENT;
        const z = iz * SPACING - HALF_EXTENT;
        positions[i * 3] = x;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z;
        bases[i * 2] = x;
        bases[i * 2 + 1] = z;
        i += 1;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    const uniforms: DotUniforms = {
      uSize: { value: POINT_SIZE },
      uScale: { value: 400 },
      uNear: { value: DEPTH_NEAR },
      uFar: { value: DEPTH_FAR },
      uColorNear: { value: new THREE.Color(0xffffff) },
      uColorFar: { value: new THREE.Color(0xffffff) },
      uAlphaNear: { value: 0.18 },
      uAlphaFar: { value: 0.9 }
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: DOT_VERTEX_SHADER,
      fragmentShader: DOT_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending
    });

    return { basePositions: bases, geometry: geo, material: mat };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    geometryRef.current = geometry;
    materialRef.current = material;
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // `color` no longer drives point color (all points render white); the
  // effect is kept as a no-op hook site to preserve the prop for
  // compatibility without triggering unused-variable lint errors.
  useEffect(() => {
    void color;
  }, [color]);

  const handlePointerMove = (event: PointerEvent) => {
    const nx = (event.clientX / window.innerWidth) * 2 - 1;
    const ny = (event.clientY / window.innerHeight) * 2 - 1;
    targetPointer.current = { x: nx, y: ny };
  };

  const handlePointerDown = (event: PointerEvent) => {
    const nx = (event.clientX / window.innerWidth) * 2 - 1;
    const ny = (event.clientY / window.innerHeight) * 2 - 1;
    // Map normalized pointer to grid X/Z extents (ny inverted: screen up -> far/-Z).
    const rx = nx * HALF_EXTENT;
    const rz = -ny * HALF_EXTENT;
    ripplesRef.current.push({ x: rx, z: rz, startTime: performance.now() / 1000 });
  };

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state: RootState) => {
    const points = pointsRef.current;
    const group = groupRef.current;
    if (!points || !group) return;

    const positionAttribute = points.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!positionAttribute) return;

    // Keep point-size attenuation in sync with the current viewport height
    // so points read at a consistent screen size across resizes/DPR.
    const uniforms = material.uniforms as unknown as DotUniforms;
    uniforms.uScale.value = state.size.height * 0.5;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const now = t;

    // prune expired ripples
    ripplesRef.current = ripplesRef.current.filter((r) => now - r.startTime < RIPPLE_LIFETIME);
    const activeRipples = ripplesRef.current;

    const count = GRID * GRID;
    for (let i = 0; i < count; i++) {
      const x = basePositions[i * 2];
      const z = basePositions[i * 2 + 1];

      let y = A1 * Math.sin(x * 0.35 + t * 0.6) + A2 * Math.sin(z * 0.5 + t * 0.45) + A3 * Math.sin((x + z) * 0.22 + t * 0.3);

      for (let r = 0; r < activeRipples.length; r++) {
        const ripple = activeRipples[r];
        const age = now - ripple.startTime;
        const dist = Math.hypot(x - ripple.x, z - ripple.z);
        y += RIPPLE_RAMP * Math.sin(dist * 4 - age * 6) * Math.exp(-dist * 0.35) * Math.exp(-age * 1.4);
      }

      positionAttribute.setY(i, y);
    }
    positionAttribute.needsUpdate = true;

    // Smooth pointer-driven pan/tilt of the field.
    currentPointer.current.x += (targetPointer.current.x - currentPointer.current.x) * 0.05;
    currentPointer.current.y += (targetPointer.current.y - currentPointer.current.y) * 0.05;

    group.rotation.x = -currentPointer.current.y * 0.12;
    group.rotation.y = currentPointer.current.x * 0.15;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </group>
  );
}

function ClearBackground() {
  const { gl, scene } = useThree();
  useEffect(() => {
    gl.setClearColor(0x000000, 0);
    scene.background = null;
  }, [gl, scene]);
  return null;
}

export default function DotGridHills({ color = "#5EC1F3", className }: DotGridHillsProps) {
  return (
    <Canvas
      className={className}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ClearBackground />
      <PerspectiveCamera makeDefault position={[0, 6, 12]} fov={55} onUpdate={(cam) => cam.lookAt(0, 0, -2)} />
      <Hills color={color} />
    </Canvas>
  );
}
