import {
  AnimationClip,
  KeyframeTrack,
  NumberKeyframeTrack,
} from 'three';

var fps = 60

const modifiedKey = (key: string) => {

  if (["eyeLookDownLeft", "eyeLookDownRight", "eyeLookInLeft", "eyeLookInRight", "eyeLookOutLeft", "eyeLookOutRight", "eyeLookUpLeft", "eyeLookUpRight"].includes(key)) {
    return key
  }

  if (key.endsWith("Right")) {
    return key.replace("Right", "_R");
  }
  if (key.endsWith("Left")) {
    return key.replace("Left", "_L");
  }
  return key;
}

const createAnimation = (recordedData: any, morphTargetDictionary: any, bodyPart: any) => {

  if (recordedData.length != 0) {
    let animation: string[][] = []
    for (let i = 0; i < Object.keys(morphTargetDictionary).length; i++) {
      animation.push([])
    }
    let time: number[] = []
    let finishedFrames = 0
    recordedData.forEach((d: { blendshapes: { [s: string]: string; } | string[]; }, i: any) => {
      Object.entries(d.blendshapes).forEach(([key, value]) => {

        if (!(modifiedKey(key) in morphTargetDictionary)) { return };

        if (key == 'mouthShrugUpper') {
          value += 0.4;
        }

        animation[morphTargetDictionary[modifiedKey(key)]].push(value)
      });
      time.push(finishedFrames / fps)
      finishedFrames++

    });

    let tracks: KeyframeTrack[] | undefined = []

    let flag = false;
    Object.entries(recordedData[0].blendshapes).forEach(([key, value]) => {

      if (!(modifiedKey(key) in morphTargetDictionary)) { return };

      let i = morphTargetDictionary[modifiedKey(key)]
      let track = new NumberKeyframeTrack(`${bodyPart}.morphTar·getInfluences[${i}]`, time, animation[i].map(Number)) // Convert strings to numbers
      tracks?.push(track)
    });

    const clip = new AnimationClip('animation', -1, tracks);
    return clip
  }
  return null
}

export default createAnimation;