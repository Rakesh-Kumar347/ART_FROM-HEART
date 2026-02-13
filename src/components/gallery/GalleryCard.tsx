"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { CATEGORIES } from "@/lib/constants";
import { PortfolioItem } from "@/types/portfolio";

interface GalleryCardProps {
  item: PortfolioItem;
  onClick: () => void;
}

function getCategoryLabel(category: string): string {
  const found = CATEGORIES.find((c) => c.value === category);
  return found ? found.label : category;
}

export default function GalleryCard({ item, onClick }: GalleryCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-dark-900 border border-dark-700/50 focus-within:ring-2 focus-within:ring-primary-400/50"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={item.thumbnailUrl || item.imageUrl}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-end",
          "bg-gradient-to-t from-dark-950/90 via-dark-950/40 to-transparent",
          "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
          "transition-opacity duration-300"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-primary-400/20 p-3 backdrop-blur-sm border border-primary-400/30">
            <Eye className="h-6 w-6 text-primary-400" />
          </div>
        </div>

        <div className="w-full p-4">
          <Badge variant="gold">{getCategoryLabel(item.category)}</Badge>
          <h3 className="mt-2 text-lg font-serif font-semibold text-dark-50 line-clamp-2">
            {item.title}
          </h3>
        </div>
      </div>
    </motion.article>
  );
}
