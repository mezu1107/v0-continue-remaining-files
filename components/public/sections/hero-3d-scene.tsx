"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Html } from "@react-three/drei"
import { Group, Color } from "three"
import { motion } from "framer-motion"

// 3D Floating Objects Component
function FloatingShapes() {
  const groupRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.001
      groupRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={groupRef}>
      {/* Rotating Icosahedron */}
      <mesh position={[0, 0, 0]} scale={2.5}>
        <icosahedronGeometry args={[1, 4]} />
        <meshPhongMaterial
          color="#6366f1"
          emissive="#4f46e5"
          shininess={100}
          wireframe={false}
        />
      </mesh>

      {/* Orbiting Spheres */}
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
          <mesh position={[3, 0, 0]}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshPhongMaterial
              color={["#ec4899", "#f59e0b", "#10b981"][i]}
              emissive={["#be123c", "#d97706", "#059669"][i]}
              shininess={100}
            />
          </mesh>
        </group>
      ))}

      {/* Floating Cubes */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`cube-${i}`}
          position={[
            Math.cos((i * Math.PI) / 2) * 4,
            Math.sin((i * Math.PI) / 2) * 4,
            Math.cos(i) * 2,
          ]}
          rotation={[Math.PI / 4, Math.PI / 4, 0]}
        >
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshPhongMaterial
            color={["#6366f1", "#ec4899", "#f59e0b", "#10b981"][i]}
            emissive={["#4f46e5", "#be123c", "#d97706", "#059669"][i]}
            wireframe={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// Lights Component
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#6366f1" />
      <pointLight position={[10, -10, -10]} intensity={0.8} color="#ec4899" />
      <pointLight position={[-10, 10, -10]} intensity={0.6} color="#10b981" />
    </>
  )
}

// Main Canvas Component
export function Hero3DScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <SceneLights />
        <FloatingShapes />
        <Environment preset="studio" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.7}
        />
      </Canvas>
    </div>
  )
}
