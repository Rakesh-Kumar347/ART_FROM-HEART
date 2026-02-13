"use client";

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

let modelPromise: Promise<cocoSsd.ObjectDetection> | null = null;

function getModel(): Promise<cocoSsd.ObjectDetection> {
  if (!modelPromise) {
    modelPromise = cocoSsd.load({ base: "lite_mobilenet_v2" });
  }
  return modelPromise;
}

export interface DetectedObject {
  class: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

export interface PersonDetectionResult {
  persons: DetectedObject[];
  otherObjects: DetectedObject[];
  personCount: number;
  personScore: number;
}

export async function detectPersons(
  imageElement: HTMLImageElement | HTMLCanvasElement
): Promise<PersonDetectionResult> {
  const model = await getModel();
  const predictions = await model.detect(imageElement);

  const persons = predictions
    .filter((p) => p.class === "person" && p.score > 0.3)
    .map((p) => ({
      class: p.class,
      score: p.score,
      bbox: p.bbox as [number, number, number, number],
    }));

  // Objects that could be accessories near persons
  const accessoryClasses = [
    "tie",
    "handbag",
    "backpack",
    "umbrella",
    "suitcase",
    "hat",
    "sunglasses",
    "watch",
    "necklace",
    "cell phone",
    "book",
    "bottle",
    "cup",
  ];

  const otherObjects = predictions
    .filter(
      (p) => accessoryClasses.includes(p.class) && p.score > 0.25
    )
    .map((p) => ({
      class: p.class,
      score: p.score,
      bbox: p.bbox as [number, number, number, number],
    }));

  const personCount = persons.length;

  // Score: 1 person = 3, 2 = 6, 3 = 8, 4+ = 10
  let personScore: number;
  if (personCount === 0) personScore = 1;
  else if (personCount === 1) personScore = 3;
  else if (personCount === 2) personScore = 6;
  else if (personCount === 3) personScore = 8;
  else personScore = 10;

  return {
    persons,
    otherObjects,
    personCount,
    personScore,
  };
}
