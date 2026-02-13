"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Clock, Maximize2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { CATEGORIES } from "@/lib/constants";
import { PortfolioItem } from "@/types/portfolio";

interface LightboxProps {
  items: PortfolioItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function getCategoryLabel(category: string): string {
  const found = CATEGORIES.find((c) => c.value === category);
  return found ? found.label : category;
}

export default function Lightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const currentItem = items[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, handlePrev, handleNext]);

  if (!currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Viewing ${currentItem.title}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 rounded-full bg-dark-800/80 p-2.5 text-dark-300 hover:text-dark-50 hover:bg-dark-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50"
          aria-label="Close lightbox"
        >
          <X className="h-6 w-6" />
        </button>

        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-dark-800/80 p-2.5 text-dark-300 hover:text-dark-50 hover:bg-dark-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50"
            aria-label="Previous artwork"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-dark-800/80 p-2.5 text-dark-300 hover:text-dark-50 hover:bg-dark-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50"
            aria-label="Next artwork"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        <div
          className="relative flex max-h-[90vh] max-w-5xl w-full flex-col items-center px-4 sm:px-12"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full flex items-center justify-center"
            >
              <img
                src={currentItem.imageUrl}
                alt={currentItem.title}
                className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain"
              />
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 w-full max-w-2xl text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Badge variant="gold">
                {getCategoryLabel(currentItem.category)}
              </Badge>
              <span className="text-dark-500 text-sm">
                {currentIndex + 1} / {items.length}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-dark-50">
              {currentItem.title}
            </h2>

            {currentItem.description && (
              <p className="mt-2 text-dark-400 text-sm leading-relaxed">
                {currentItem.description}
              </p>
            )}

            {(currentItem.size || currentItem.timeTaken) && (
              <div className="mt-3 flex items-center justify-center gap-4 text-sm text-dark-400">
                {currentItem.size && (
                  <span className="inline-flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5" />
                    {currentItem.size}
                  </span>
                )}
                {currentItem.timeTaken && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {currentItem.timeTaken}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
