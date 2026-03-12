"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryFilter from "@/components/gallery/CategoryFilter";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import Lightbox from "@/components/gallery/Lightbox";
import { ArtCategory, PortfolioItem } from "@/types/portfolio";

export default function GalleryPageClient() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ArtCategory | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchItems = useCallback(async (category: ArtCategory | "all") => {
    setLoading(true);
    try {
      const params = category !== "all" ? `?category=${category}` : "";
      const response = await fetch(`/api/portfolio${params}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch {
      // Grid will show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(selectedCategory);
  }, [selectedCategory, fetchItems]);

  function handleItemClick(item: PortfolioItem) {
    const index = items.findIndex((i) => i._id === item._id);
    if (index !== -1) setLightboxIndex(index);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-950 pt-24">
        <section className="section-padding pb-8 sm:pb-10">
          <div className="container-width">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-dark-50">
                Our <span className="gold-text">Gallery</span>
              </h1>
              <p className="mt-4 text-dark-400 max-w-lg mx-auto">
                Explore our collection of hand-drawn pencil sketch portraits,
                each crafted with care and attention to detail.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <CategoryFilter
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </motion.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24">
          <div className="container-width">
            <GalleryGrid
              items={items}
              onItemClick={handleItemClick}
              loading={loading}
            />
          </div>
        </section>
      </main>
      <Footer />

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
