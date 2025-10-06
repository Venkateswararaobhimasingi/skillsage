import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

interface InterviewBotProps {
  isAnimating?: boolean
}

export function InterviewBot({ isAnimating = false }: InterviewBotProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const eyeLeftRef = useRef<THREE.Mesh>(null)
  const eyeRightRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
      
      if (isAnimating && headRef.current) {
        // Subtle head movement when "speaking"
        headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.1
      }
      
      // Eye blinking animation
      const blinkTime = Math.sin(state.clock.elapsedTime * 2) > 0.95 ? 0.1 : 1
      if (eyeLeftRef.current && eyeRightRef.current) {
        eyeLeftRef.current.scale.y = blinkTime
        eyeRightRef.current.scale.y = blinkTime
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head */}
      <Sphere ref={headRef} args={[0.8]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#1E90FF" metalness={0.7} roughness={0.3} />
      </Sphere>

      {/* Eyes */}
      <Sphere ref={eyeLeftRef} args={[0.15]} position={[-0.3, 1.6, 0.6]}>
        <meshStandardMaterial color="#00FF7F" emissive="#00FF7F" emissiveIntensity={0.3} />
      </Sphere>
      <Sphere ref={eyeRightRef} args={[0.15]} position={[0.3, 1.6, 0.6]}>
        <meshStandardMaterial color="#00FF7F" emissive="#00FF7F" emissiveIntensity={0.3} />
      </Sphere>

      {/* Body */}
      <Cylinder args={[0.6, 0.8, 1.5]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#1E90FF" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Arms */}
      <Cylinder args={[0.15, 0.15, 0.8]} position={[-1, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color="#1E90FF" metalness={0.7} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.8]} position={[1, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color="#1E90FF" metalness={0.7} roughness={0.3} />
      </Cylinder>

      {/* Hands */}
      <Sphere args={[0.2]} position={[-1.4, 0.2, 0]}>
        <meshStandardMaterial color="#00FF7F" metalness={0.6} roughness={0.4} />
      </Sphere>
      <Sphere args={[0.2]} position={[1.4, 0.2, 0]}>
        <meshStandardMaterial color="#00FF7F" metalness={0.6} roughness={0.4} />
      </Sphere>

      {/* Lighting */}
      <pointLight position={[0, 3, 2]} intensity={1} color="#1E90FF" />
      <spotLight
        position={[2, 2, 2]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
        color="#00FF7F"
      />
    </group>
  )
}