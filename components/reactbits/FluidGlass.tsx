/* eslint-disable react/no-unknown-property */
"use client";
import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { useFBO, useGLTF, MeshTransmissionMaterial, useTexture } from "@react-three/drei";
import { easing } from "maath";

interface LensProps {
  scale?: number;
  ior?: number;
  thickness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
  imageUrl?: string;
}

function LensMesh({
  scale = 0.22,
  ior = 1.18,
  thickness = 5,
  chromaticAberration = 0.08,
  anisotropy = 0.01,
  imageUrl = "",
}: LensProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF("/assets/3d/lens.glb") as any;
  const buffer = useFBO();
  const [scene] = useState(() => new THREE.Scene());
  const { gl, viewport, camera } = useThree();
  const texture = useTexture(imageUrl);

  useFrame((state, delta) => {
    const { pointer } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    easing.damp3(
      ref.current.position,
      [(pointer.x * v.width) / 2, (pointer.y * v.height) / 2, 15],
      0.12,
      delta
    );
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      {/* Render the card image into the FBO scene so the lens refracts it */}
      {createPortal(
        <mesh scale={[viewport.width, viewport.height, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={texture} />
        </mesh>,
        scene
      )}
      {/* Glass lens mesh */}
      <mesh ref={ref} scale={scale} rotation-x={Math.PI / 2} geometry={nodes["Cylinder"]?.geometry}>
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior}
          thickness={thickness}
          anisotropy={anisotropy}
          chromaticAberration={chromaticAberration}
        />
      </mesh>
    </>
  );
}

interface FluidGlassProps {
  lensProps?: LensProps;
}

export default function FluidGlass({ lensProps = {} }: FluidGlassProps) {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      <LensMesh {...lensProps} />
    </Canvas>
  );
}
