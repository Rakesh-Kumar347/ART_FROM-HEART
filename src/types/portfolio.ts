export type ArtCategory =
  | "portraits"
  | "couple"
  | "family"
  | "pet_sketches"
  | "celebrity"
  | "custom";

export interface PortfolioItem {
  _id: string;
  title: string;
  description?: string;
  category: ArtCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  size?: string;
  timeTaken?: string;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioInput {
  title: string;
  description?: string;
  category: ArtCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  size?: string;
  timeTaken?: string;
  isFeatured?: boolean;
  displayOrder?: number;
}
