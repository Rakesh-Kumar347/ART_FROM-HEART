"use client";

import * as faceDetection from "@tensorflow-models/face-detection";
import "@tensorflow/tfjs";

let detectorPromise: Promise<faceDetection.FaceDetector> | null = null;

function getDetector(): Promise<faceDetection.FaceDetector> {
  if (!detectorPromise) {
    detectorPromise = faceDetection.createDetector(
      faceDetection.SupportedModels.MediaPipeFaceDetector,
      {
        runtime: "tfjs",
        maxFaces: 10,
      }
    );
  }
  return detectorPromise;
}

export interface FaceDetectionResult {
  faceCount: number;
  faceDetailScore: number;
  faces: Array<{
    box: { xMin: number; yMin: number; width: number; height: number };
    sizeRatio: number;
  }>;
  description: string;
}

export async function detectFaces(
  imageElement: HTMLImageElement | HTMLCanvasElement
): Promise<FaceDetectionResult> {
  const detector = await getDetector();
  const faces = await detector.estimateFaces(imageElement);

  const imageWidth =
    imageElement instanceof HTMLImageElement
      ? imageElement.naturalWidth
      : imageElement.width;
  const imageHeight =
    imageElement instanceof HTMLImageElement
      ? imageElement.naturalHeight
      : imageElement.height;
  const imageArea = imageWidth * imageHeight;

  const faceDetails = faces.map((face) => {
    const box = face.box;
    const faceArea = box.width * box.height;
    const sizeRatio = faceArea / imageArea;

    return {
      box: {
        xMin: box.xMin,
        yMin: box.yMin,
        width: box.width,
        height: box.height,
      },
      sizeRatio,
    };
  });

  const faceCount = faceDetails.length;

  // Score based on face count and size
  // Larger faces (closer up) = more detail work = higher score
  let faceDetailScore: number;
  if (faceCount === 0) {
    faceDetailScore = 1;
  } else {
    const avgSizeRatio =
      faceDetails.reduce((sum, f) => sum + f.sizeRatio, 0) / faceCount;

    // Base score from count
    let countScore: number;
    if (faceCount === 1) countScore = 4;
    else if (faceCount === 2) countScore = 6;
    else if (faceCount === 3) countScore = 7;
    else countScore = 8;

    // Size bonus: large faces mean close-up detail
    let sizeBonus: number;
    if (avgSizeRatio > 0.15) sizeBonus = 2; // Very close-up
    else if (avgSizeRatio > 0.08) sizeBonus = 1; // Medium close
    else sizeBonus = 0; // Far away / small faces

    faceDetailScore = Math.min(10, countScore + sizeBonus);
  }

  let description: string;
  if (faceCount === 0) description = "No faces detected";
  else if (faceCount === 1) {
    const ratio = faceDetails[0].sizeRatio;
    if (ratio > 0.15) description = "Close-up portrait with high facial detail";
    else if (ratio > 0.08) description = "Medium portrait with good detail";
    else description = "Distant portrait with less facial detail";
  } else {
    description = `${faceCount} faces detected requiring individual attention`;
  }

  return {
    faceCount,
    faceDetailScore,
    faces: faceDetails,
    description,
  };
}
