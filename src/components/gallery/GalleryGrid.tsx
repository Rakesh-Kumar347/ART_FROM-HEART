"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import GalleryCard from "@/components/gallery/GalleryCard";
import { PortfolioItem } from "@/types/portfolio";

interface GalleryGridProps {
  items: PortfolioItem[];
  onItemClick: (item: PortfolioItem) => void;
  loading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl">
          <Skeleton className="aspect-[3/4] w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="rounded-full bg-dark-800/50 p-6 mb-6">
        <Pencil className="h-10 w-10 text-dark-600" />
      </div>
      <h3 className="text-xl font-serif font-semibold text-dark-200 mb-2">
        No artworks found
      </h3>
      <p className="text-dark-400 max-w-sm">
        No artworks match the selected category. Try selecting a different
        category or check back later for new additions.
      </p>
    </motion.div>
  );
}

export default function GalleryGrid({
  items,
  onItemClick,
  loading = false,
}: GalleryGridProps) {
  if (loading) {
    return <SkeletonGrid />;
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <GalleryCard
            key={item._id}
            item={item}
            onClick={() => onItemClick(item)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
