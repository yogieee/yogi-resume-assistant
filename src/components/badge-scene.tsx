"use client";

import * as THREE from "three";
import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import {
  Environment,
  useTexture,
  useGLTF,
  Lightformer,
} from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

const TAG_URL =
  "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb";
const BAND_URL =
  "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg";
const BADGE_URL = "/badge.png";

function Band({ maxSpeed = 50, minSpeed = 10, canvasHovered = false }) {
  const band = useRef(null!), fixed = useRef<RapierRigidBody>(null!), j1 = useRef<RapierRigidBody>(null!), j2 = useRef<RapierRigidBody>(null!), j3 = useRef<RapierRigidBody>(null!), card = useRef<RapierRigidBody>(null!) // prettier-ignore
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3() // prettier-ignore
  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };
  const { nodes, materials } = useGLTF(TAG_URL) as any;
  const badgeTexture = useTexture(BADGE_URL);
  /* eslint-disable react-hooks/immutability */
  badgeTexture.anisotropy = 16;
  badgeTexture.minFilter = THREE.LinearMipmapLinearFilter;
  badgeTexture.magFilter = THREE.LinearFilter;
  badgeTexture.generateMipmaps = true;
  badgeTexture.needsUpdate = true;
  /* eslint-enable react-hooks/immutability */
  const bandTexture = useTexture(BAND_URL);
  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  });
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.8]) // prettier-ignore
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.8]) // prettier-ignore
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.8]) // prettier-ignore
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]) // prettier-ignore

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    } else if (card.current) {
      // Gentle floating sway when idle
      const t = state.clock.elapsedTime;
      const swayX = Math.sin(t * 0.8) * 0.4;
      const swayZ = Math.cos(t * 0.6) * 0.15;
      card.current.wakeUp();
      card.current.applyImpulse(
        { x: swayX * delta, y: 0, z: swayZ * delta },
        true,
      );

      // Slight tilt opposite to mouse position (only when mouse is over canvas)
      if (canvasHovered) {
        const mx = -state.pointer.x * 0.3;
        const my = -state.pointer.y * 0.15;
        card.current.applyTorqueImpulse(
          { x: my * delta, y: mx * delta, z: 0 },
          true,
        );
      }
    }
    if (
      fixed.current &&
      j1.current &&
      j2.current &&
      j3.current &&
      band.current
    ) {
      [j1, j2].forEach((ref) => {
        const rb = ref.current as any;
        if (!rb.lerped) rb.lerped = new THREE.Vector3().copy(rb.translation());
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, rb.lerped.distanceTo(rb.translation())),
        );
        rb.lerped.lerp(
          rb.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy((j2.current as any).lerped);
      curve.points[2].copy((j1.current as any).lerped);
      curve.points[3].copy(fixed.current.translation());
      // @ts-ignore
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel() as any);
      rot.copy(card.current.rotation() as any);
      card.current.setAngvel(
        { x: ang.x, y: ang.y - rot.y * 0.4, z: ang.z },
        true,
      );
    }
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.8, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.6, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2.4, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2.6, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, 0.01]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            // @ts-ignore
            onPointerUp={(e) => (
              (e.target as HTMLElement).releasePointerCapture(e.pointerId),
              drag(false)
            )}
            // @ts-ignore
            onPointerDown={(e) => (
              (e.target as HTMLElement).setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current?.translation() as any)),
              )
            )}
          >
            {/* Card body — writes to stencil buffer for rounded corner clipping */}
            <mesh
              geometry={nodes.card.geometry}
              renderOrder={1}
              onBeforeRender={(renderer) => {
                const gl = renderer.getContext();
                gl.enable(gl.STENCIL_TEST);
                gl.stencilFunc(gl.ALWAYS, 1, 0xff);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
              }}
            >
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.1}
                roughness={0.25}
                metalness={0.5}
                iridescence={0.3}
                iridescenceIOR={1.3}
                reflectivity={0.5}
                envMapIntensity={0.8}
              />
            </mesh>
            {/* Badge image overlay — clipped by card stencil (rounded corners) */}
            <mesh
              position={[0, 0.523, 0.008]}
              renderOrder={2}
              onBeforeRender={(renderer) => {
                const gl = renderer.getContext();
                gl.enable(gl.STENCIL_TEST);
                gl.stencilFunc(gl.EQUAL, 1, 0xff);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
              }}
              onAfterRender={(renderer) => {
                const gl = renderer.getContext();
                gl.disable(gl.STENCIL_TEST);
              }}
            >
              <planeGeometry args={[0.7, 0.98]} />
              <meshBasicMaterial
                map={badgeTexture}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            {/* Clip and clamp — render above badge overlay */}
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
              renderOrder={3}
            />
            <mesh
              geometry={nodes.clamp.geometry}
              material={materials.metal}
              renderOrder={3}
            />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={bandTexture}
          repeat={[-3, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

// Preload assets to avoid Suspense re-triggers
useGLTF.preload(TAG_URL);
useTexture.preload(BADGE_URL);
useTexture.preload(BAND_URL);

export function BadgeScene() {
  const [canvasHovered, setCanvasHovered] = useState(false);
  return (
    <div
      className="w-full h-full"
      onPointerEnter={() => setCanvasHovered(true)}
      onPointerLeave={() => setCanvasHovered(false)}
    >
      <Canvas camera={{ position: [0, 2, 13], fov: 25 }} gl={{ stencil: true }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <spotLight
          position={[-5, 8, 10]}
          intensity={0.8}
          angle={0.5}
          penumbra={1}
        />
        <Suspense fallback={null}>
          <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
            <Band canvasHovered={canvasHovered} />
          </Physics>
        </Suspense>
        <Environment background blur={0.75}>
          <color attach="background" args={["black"]} />
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}
