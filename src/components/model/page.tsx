"use client"
import { useRef, useEffect } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/store/store';
import styles from './model.module.css'

// Define types for the shader material
type SphereShaderMaterialImpl = {
  pointSize: number
  color1: THREE.Color
  color2: THREE.Color
  color3: THREE.Color
} & THREE.ShaderMaterial

// Create a custom shader material
const SphereShaderMaterialBase = shaderMaterial(
  {
    pointSize: 7,
    color1: new THREE.Color("#4158D0"),
    color2: new THREE.Color("#C850C0"),
    color3: new THREE.Color("#FFCC70"),
  },
  // Vertex shader
  `
    uniform float pointSize;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_PointSize = pointSize;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    varying vec2 vUv;
    void main() {
      float mixValue = mod((vUv.x * 95.0), 1.0);
      vec3 gradientColor = mix(color1, color2, mixValue);
      gradientColor = mix(gradientColor, color3, vUv.y);
      gl_FragColor = vec4(gradientColor, 1.0);
    }
  `
)

// Extend THREE with our custom material
extend({ SphereShaderMaterial: SphereShaderMaterialBase })

// Augment JSX.IntrinsicElements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      sphereShaderMaterial: React.PropsWithChildren<
        Partial<SphereShaderMaterialImpl> & {
          transparent?: boolean
          ref?: React.RefObject<SphereShaderMaterialImpl>
        }
      >
    }
  }
}

const AnimatedSphere = () => {
  const { tenthAmplitudeValue } = useStore()
  const pointsRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.SphereGeometry>(null)
  const originalPositions = useRef<Float32Array>()

  // Store original positions once on mount
  useEffect(() => {
    if (geometryRef.current) {
      originalPositions.current = new Float32Array(geometryRef.current.attributes.position.array)
    }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current || !geometryRef.current || !originalPositions.current) return

    const positions = geometryRef.current.attributes.position.array as Float32Array
    const now = clock.getElapsedTime()
    const maxExpansion = 0.05
    const minExpansion = 0
    const ampValue = tenthAmplitudeValue / 10

    for (let i = 0; i < positions.length; i += 3) {
      const originalX = originalPositions.current[i]
      const originalY = originalPositions.current[i + 1]
      const originalZ = originalPositions.current[i + 2]

      const distance = Math.sqrt(
        originalX ** 2 + originalY ** 2 + originalZ ** 2
      )

      const angle = now + distance * 2
      const expansionFactor = ((Math.sin(angle) + 1) / 2) * maxExpansion + minExpansion
      const scaleFactor = 1 + (expansionFactor * ampValue)

      positions[i] = originalX * scaleFactor
      positions[i + 1] = originalY * scaleFactor
      positions[i + 2] = originalZ * scaleFactor
    }

    geometryRef.current.attributes.position.needsUpdate = true
    pointsRef.current.rotation.x += 0.001
    pointsRef.current.rotation.y += 0.001
  })

  return (
    <points ref={pointsRef}>
      <sphereGeometry
        ref={geometryRef}
        args={[2.5, 30, 20, 3, Math.PI / 0.5]}
      />
      <sphereShaderMaterial transparent={true} />
    </points>
  )
}

const ThreeScene = () => {
  return (
    <div className={styles.container}>
      <Canvas
        camera={{ position: [5, 0, 5] }}
        style={{ background: 'transparent' }}
      >
        <OrbitControls />
        <AnimatedSphere />
      </Canvas>
    </div>
  )
}

export default ThreeScene