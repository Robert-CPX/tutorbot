"use client"

import createAnimation from "@/lib/converter";
import {
  useGLTF,
  useTexture,
  useFBX,
  useAnimations,
} from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import blendData from "@/constants/blendDataBlink.json";
import { useFrame } from "@react-three/fiber";

type AvatarProps = {
  url: string;
  speak: boolean;
  setSpeak: (speak: boolean) => void;
  text: string;
  setAudioSource: (audioSource: string) => void;
  playing: boolean;
};

const Avatar = ({ url, speak, setSpeak, text, setAudioSource, playing }: AvatarProps) => {
  let gltf = useGLTF(url);
  let morphTargetDictionaryBody: { [key: string]: number; } | null | undefined = null;
  let morphTargetDictionaryLowerTeeth = null;

  const [
    bodyTexture,
    eyesTexture,
    teethTexture,
    bodySpecularTexture,
    bodyRoughnessTexture,
    bodyNormalTexture,
    teethNormalTexture,
    hairTexture,
    tshirtDiffuseTexture,
    tshirtNormalTexture,
    tshirtRoughnessTexture,
    hairAlphaTexture,
    hairNormalTexture,
    hairRoughnessTexture,
  ] = useTexture([
    "/images/body.webp",
    "/images/eyes.webp",
    "/images/teeth_diffuse.webp",
    "/images/body_specular.webp",
    "/images/body_roughness.webp",
    "/images/body_normal.webp",
    "/images/teeth_normal.webp",
    "/images/h_color.webp",
    "/images/tshirt_diffuse.webp",
    "/images/tshirt_normal.webp",
    "/images/tshirt_roughness.webp",
    "/images/h_alpha.webp",
    "/images/h_normal.webp",
    "/images/h_roughness.webp",
  ]);

  gltf.scene.traverse((node) => {
    if (
      node.type === "Mesh" ||
      node.type === "LineSegments" ||
      node.type === "SkinnedMesh"
    ) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = false;

      if (node.name.includes("Body")) {
        const meshNode = node as THREE.Mesh;
        meshNode.castShadow = true;
        meshNode.receiveShadow = true;

        const material = new THREE.MeshStandardMaterial();
        material.map = bodyTexture;
        material.roughness = 1.7;

        material.roughnessMap = bodyRoughnessTexture;
        material.normalMap = bodyNormalTexture;
        material.normalScale = new THREE.Vector2(0.6, 0.6);
        material.envMapIntensity = 0.8;
        meshNode.material = material;

        morphTargetDictionaryBody = (node as THREE.Mesh).morphTargetDictionary;

      }

      if (node.name.includes("Eyes")) {
        const meshNode = node as THREE.Mesh;
        const material = new THREE.MeshStandardMaterial();
        material.map = eyesTexture;
        material.roughness = 0.1;
        material.envMapIntensity = 0.5;

        meshNode.material = material;
      }

      if (node.name.includes("Brows")) {
        const lineNode = node as THREE.Line;
        const material = new THREE.LineBasicMaterial({ color: 0x000000 });
        material.linewidth = 1;
        material.opacity = 0.5;
        material.transparent = true;

        lineNode.material = material;
        lineNode.visible = false;
      }

      if (node.name.includes("Teeth")) {
        node.receiveShadow = true;
        node.castShadow = true;
        const meshNode = node as THREE.Mesh; // Cast node to THREE.Mesh type
        const material = new THREE.MeshStandardMaterial();
        material.roughness = 0.1;
        material.map = teethTexture;
        material.normalMap = teethNormalTexture;
        material.envMapIntensity = 0.7;

        meshNode.material = material;
      }

      if (node.name.includes("Hair")) {
        const material = new THREE.MeshStandardMaterial();
        material.map = hairTexture;
        material.alphaMap = hairAlphaTexture;
        material.normalMap = hairNormalTexture;
        material.roughnessMap = hairRoughnessTexture;
        material.transparent = true;
        material.depthWrite = false;
        material.side = 2;
        material.color.setHex(0x000000);
        material.envMapIntensity = 0.3;

        const meshNode = node as THREE.Mesh; // Cast node to THREE.Mesh type
        meshNode.material = material;
      }

      if (node.name.includes("TSHIRT")) {
        const material = new THREE.MeshStandardMaterial();
        material.map = tshirtDiffuseTexture;
        material.roughnessMap = tshirtRoughnessTexture;
        material.normalMap = tshirtNormalTexture;
        material.color.setHex(0xffffff);
        material.envMapIntensity = 0.5;

        const meshNode = node as THREE.Mesh; // Cast node to THREE.Mesh type
        meshNode.material = material;
      }

      if (node.name.includes("TeethLower")) {
        morphTargetDictionaryLowerTeeth = (node as THREE.Mesh).morphTargetDictionary;
      }
    }
  });

  const [clips, setClips] = useState([]);

  const mixer = useMemo(
    () => new THREE.AnimationMixer(gltf.scene),
    [gltf.scene]
  );

  let idleFbx = useFBX("/idle.fbx");
  let { clips: idleClips } = useAnimations(idleFbx.animations);

  idleClips[0].tracks = idleClips[0].tracks.filter((track) => {
    return (
      track.name.includes("Head") ||
      track.name.includes("Neck") ||
      track.name.includes("Spine2")
    );
  });

  idleClips[0].tracks = idleClips[0].tracks.map((track) => {
    if (track.name.includes("Head")) {
      track.name = "head.quaternion";
    }

    if (track.name.includes("Neck")) {
      track.name = "neck.quaternion";
    }

    if (track.name.includes("Spine")) {
      track.name = "spine2.quaternion";
    }

    return track;
  });

  useEffect(() => {
    let idleClipAction = mixer.clipAction(idleClips[0]);
    idleClipAction.play();

    let blinkClip = createAnimation(
      blendData,
      morphTargetDictionaryBody,
      "HG_Body"
    );
    let blinkAction: THREE.AnimationAction | null = null;
    if (blinkClip) {
      blinkAction = mixer.clipAction(blinkClip);
      blinkAction.play();
    }
  }, []);

  // Play animation clips when available
  useEffect(() => {
    if (playing === false) return;
    clips.forEach((clip) => {
      let clipAction = mixer.clipAction(clip);
      clipAction.setLoop(THREE.LoopOnce, 1);
      clipAction.play();
    });
  }, [playing]);

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return (
    <group name="avatar" position={[-0.2, 0.06, 0]}>
      <primitive object={gltf.scene} dispose={null} />
    </group>
  )
}

export default Avatar
