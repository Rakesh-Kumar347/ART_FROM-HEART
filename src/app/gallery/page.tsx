import type { Metadata } from "next";
import GalleryPageClient from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse our collection of custom pencil sketch portraits including portraits, couple sketches, family portraits, pet sketches, and celebrity art.",
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
