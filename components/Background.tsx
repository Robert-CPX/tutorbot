"use client"
import { useTexture } from "@react-three/drei"

const Background = () => {
  const texture = useTexture("/images/background.webp")
  return (
    <mesh position={[0, 1.5, -4]} scale={[1.2, 1.2, 1.2]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

export default Background
