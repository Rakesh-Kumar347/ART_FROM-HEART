"use client";

import { DetectedObject } from "./person-detection";

export interface AccessoryDetectionResult {
  accessoryScore: number;
  accessoryCount: number;
  detectedAccessories: string[];
  description: string;
}

export function analyzeAccessories(
  persons: DetectedObject[],
  otherObjects: DetectedObject[]
): AccessoryDetectionResult {
  if (persons.length === 0) {
    return {
      accessoryScore: 1,
      accessoryCount: 0,
      detectedAccessories: [],
      description: "No persons detected for accessory analysis",
    };
  }

  // Find objects that are near or overlapping with person bounding boxes
  const nearbyAccessories: DetectedObject[] = [];

  for (const obj of otherObjects) {
    for (const person of persons) {
      if (isNearPerson(obj.bbox, person.bbox)) {
        nearbyAccessories.push(obj);
        break; // Don't count same accessory twice
      }
    }
  }

  const detectedAccessories = [
    ...new Set(nearbyAccessories.map((a) => a.class)),
  ];
  const accessoryCount = nearbyAccessories.length;

  // Score based on count
  let accessoryScore: number;
  if (accessoryCount === 0) accessoryScore = 1;
  else if (accessoryCount === 1) accessoryScore = 3;
  else if (accessoryCount === 2) accessoryScore = 5;
  else if (accessoryCount <= 4) accessoryScore = 7;
  else accessoryScore = 9;

  let description: string;
  if (accessoryCount === 0) description = "No visible accessories";
  else if (accessoryCount <= 2)
    description = `${accessoryCount} accessory/item detected: ${detectedAccessories.join(", ")}`;
  else
    description = `${accessoryCount} accessories/items found: ${detectedAccessories.join(", ")} - adds detail complexity`;

  return {
    accessoryScore,
    accessoryCount,
    detectedAccessories,
    description,
  };
}

function isNearPerson(
  objBbox: [number, number, number, number],
  personBbox: [number, number, number, number]
): boolean {
  const [ox, oy, ow, oh] = objBbox;
  const [px, py, pw, ph] = personBbox;

  // Expand person bbox by 20% margin
  const margin = 0.2;
  const expandedPx = px - pw * margin;
  const expandedPy = py - ph * margin;
  const expandedPw = pw * (1 + 2 * margin);
  const expandedPh = ph * (1 + 2 * margin);

  // Check overlap
  const overlapX = ox < expandedPx + expandedPw && ox + ow > expandedPx;
  const overlapY = oy < expandedPy + expandedPh && oy + oh > expandedPy;

  return overlapX && overlapY;
}
