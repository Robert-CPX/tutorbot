"use client"

import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrthographicCamera,
} from "@react-three/drei";
import { Suspense } from "react";
import Background from "./Background";
import Avatar from "./Avatar";

const Tutor = () => {
  return (
    <div className="w-screen h-screen">
      <Canvas dpr={2}>
        <OrthographicCamera makeDefault zoom={1200} position={[0.01, 1.6, 1]} />
        <Suspense fallback={null}>
          <Environment
            background={false}
            files="/images/photo_studio_loft_hall_1k.hdr"
          />
        </Suspense>
        <Suspense fallback={null}>
          <Background />
        </Suspense>
        <Suspense fallback={null}>
          <Avatar
            url="/model.glb"
            speak={false}
            setSpeak={() => { }}
            text=""
            setAudioSource={() => { }}
            playing={false}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Tutor
