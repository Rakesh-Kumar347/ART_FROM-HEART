import type { Metadata } from "next";
import ArtworkDetailClient from "./ArtworkDetailClient";

export const metadata: Metadata = {
  title: "Artwork Detail",
  description: "View the full details of this custom pencil sketch portrait.",
};

export default function ArtworkDetailPage({ params }: { params: { id: string } }) {
  return <ArtworkDetailClient id={params.id} />;
}
