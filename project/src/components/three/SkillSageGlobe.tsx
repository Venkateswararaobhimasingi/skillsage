// import React, { useRef, useMemo } from 'react'
// import { useFrame } from '@react-three/fiber'
// import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
// import * as THREE from 'three'

// interface Particle {
//   position: [number, number, number]
//   speed: number
//   color: string
// }

// export function SkillSageGlobe() {
//   const meshRef = useRef<THREE.Mesh>(null)
//   const particlesRef = useRef<THREE.Points>(null)

//   // Generate particles around the globe
//   const particles = useMemo(() => {
//     const particleCount = 100
//     const positions = new Float32Array(particleCount * 3)
//     const colors = new Float32Array(particleCount * 3)
    
//     for (let i = 0; i < particleCount; i++) {
//       const i3 = i * 3
//       const radius = 3 + Math.random() * 2
//       const theta = Math.random() * Math.PI * 2
//       const phi = Math.random() * Math.PI
      
//       positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
//       positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
//       positions[i3 + 2] = radius * Math.cos(phi)
      
//       // Random color between accent blue and green
//       const isBlue = Math.random() > 0.5
//       if (isBlue) {
//         colors[i3] = 30/255     // R for blue
//         colors[i3 + 1] = 144/255 // G for blue
//         colors[i3 + 2] = 1       // B for blue
//       } else {
//         colors[i3] = 0           // R for green
//         colors[i3 + 1] = 1       // G for green
//         colors[i3 + 2] = 127/255 // B for green
//       }
//     }
    
//     return { positions, colors }
//   }, [])

//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += delta * 0.2
//       meshRef.current.rotation.x += delta * 0.1
//     }
    
//     if (particlesRef.current) {
//       particlesRef.current.rotation.y += delta * 0.1
//     }
//   })

//   return (
//     <group>
//       {/* Main Globe */}
//       <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
//         <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
//           <MeshDistortMaterial
//             color="#1E90FF"
//             attach="material"
//             distort={0.3}
//             speed={2}
//             roughness={0.1}
//             metalness={0.8}
//             transparent
//             opacity={0.8}
//           />
//         </Sphere>
//       </Float>

//       {/* Particles */}
//       <points ref={particlesRef}>
//         <bufferGeometry>
//           <bufferAttribute
//             attach="attributes-position"
//             count={particles.positions.length / 3}
//             array={particles.positions}
//             itemSize={3}
//           />
//           <bufferAttribute
//             attach="attributes-color"
//             count={particles.colors.length / 3}
//             array={particles.colors}
//             itemSize={3}
//           />
//         </bufferGeometry>
//         <pointsMaterial
//           size={0.05}
//           vertexColors
//           transparent
//           opacity={0.8}
//           sizeAttenuation={false}
//         />
//       </points>

//       {/* Ambient lighting */}
//       <ambientLight intensity={0.3} />
//       <pointLight position={[10, 10, 10]} intensity={1} color="#1E90FF" />
//       <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00FF7F" />
//     </group>
//   )
// }
// client/src/components/three/SkillSageGlobe.tsx
import React from 'react';
// useTheme is no longer directly needed here if not switching Spline URLs
// import { useTheme } from 'next-themes'; 
import Spline from '@splinetool/react-spline'; // Import Spline component

export const SkillSageGlobe = () => {
  // Your single Spline URL (using .splinecode)
  const splineUrl = "https://prod.spline.design/z454zb599MppBk-W/scene.splinecode"; 

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}> {/* Added position: 'relative' for good measure */}
      {/* Use the Spline React component */}
      <Spline 
        scene={splineUrl} 
        style={{ 
          position: 'absolute', // Ensure it's absolutely positioned within its 100% parent
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          border: 'none' 
        }} 
      />
    </div>
  );
};
