"use client";

import { ComplexityResult } from "@/types/pricing";
import { detectPersons } from "./person-detection";
import { detectFaces } from "./face-detection";
import { analyzeClothingComplexity } from "./clothing-analysis";
import { analyzeAccessories } from "./accessory-detection";

export type AnalysisStep = {
  step: string;
  percent: number;
};

export type ProgressCallback = (progress: AnalysisStep) => void;

export async function analyzeImageComplexity(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  onProgress?: ProgressCallback
): Promise<ComplexityResult> {
  // Step 1: Detect persons and objects
  onProgress?.({ step: "Detecting people in the image...", percent: 10 });
  const personResult = await detectPersons(imageElement);

  onProgress?.({ step: "Analyzing facial details...", percent: 35 });
  // Step 2: Detect faces
  const faceResult = await detectFaces(imageElement);

  // Step 3: Analyze clothing complexity
  onProgress?.({ step: "Checking clothing & dress detail...", percent: 60 });
  const clothingResult = await analyzeClothingComplexity(
    imageElement,
    personResult.persons
  );

  // Step 4: Detect accessories
  onProgress?.({ step: "Identifying accessories...", percent: 80 });
  const accessoryResult = analyzeAccessories(
    personResult.persons,
    personResult.otherObjects
  );

  // Calculate weighted overall score
  // Weights: persons 30%, faces 25%, clothing 25%, accessories 20%
  const weights = {
    persons: 0.3,
    faces: 0.25,
    clothing: 0.25,
    accessories: 0.2,
  };

  const weightedScore =
    personResult.personScore * weights.persons +
    faceResult.faceDetailScore * weights.faces +
    clothingResult.clothingScore * weights.clothing +
    accessoryResult.accessoryScore * weights.accessories;

  // Clamp to 1-10
  const overallScore = Math.max(1, Math.min(10, Math.round(weightedScore)));

  onProgress?.({ step: "Analysis complete!", percent: 100 });

  // Build person count description
  let personDescription: string;
  if (personResult.personCount === 0) personDescription = "No people detected";
  else if (personResult.personCount === 1) personDescription = "1 person detected";
  else personDescription = `${personResult.personCount} people detected`;

  return {
    overallScore,
    personCount: personResult.personCount,
    faceDetailScore: faceResult.faceDetailScore,
    clothingScore: clothingResult.clothingScore,
    accessoryScore: accessoryResult.accessoryScore,
    breakdown: {
      persons: {
        score: personResult.personScore,
        count: personResult.personCount,
        description: personDescription,
      },
      faces: {
        score: faceResult.faceDetailScore,
        count: faceResult.faceCount,
        description: faceResult.description,
      },
      clothing: {
        score: clothingResult.clothingScore,
        description: clothingResult.description,
      },
      accessories: {
        score: accessoryResult.accessoryScore,
        count: accessoryResult.accessoryCount,
        description: accessoryResult.description,
      },
    },
  };
}
