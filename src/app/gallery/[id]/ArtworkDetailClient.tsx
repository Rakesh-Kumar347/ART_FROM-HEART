"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Maximize2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { CATEGORIES } from "@/lib/constants";
import { PortfolioItem } from "@/types/portfolio";

function getCategoryLabel(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.label || category;
}

export default function ArtworkDetailClient({ id }: { id: string }) {
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await fetch(`/api/portfolio/${id}`);
        if (!response.ok) { setError(true); return; }
        setItem(await response.json());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-950 pt-24">
        <section className="section-padding">
          <div className="container-width">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
              <Link href="/gallery" className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors text-sm font-medium">
                <ArrowLeft className="h-4 w-4" /> Back to Gallery
              </Link>
            </motion.div>

            {loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <div className="space-y-4 py-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-10 w-3/4 rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-2xl font-serif font-bold text-dark-200 mb-3">Artwork not found</h2>
                <p className="text-dark-400 mb-6">The artwork you are looking for does not exist or has been removed.</p>
                <Link href="/gallery"><Button variant="outline"><ArrowLeft className="h-4 w-4" /> Back to Gallery</Button></Link>
              </div>
            )}

            {item && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="overflow-hidden rounded-xl border border-dark-700/50 bg-dark-900">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-contain" />
                </div>
                <div className="flex flex-col justify-center py-2 lg:py-4">
                  <Badge variant="gold" className="self-start">{getCategoryLabel(item.category)}</Badge>
                  <h1 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark-50">{item.title}</h1>
                  {item.description && <p className="mt-4 text-dark-400 leading-relaxed">{item.description}</p>}
                  {(item.size || item.timeTaken) && (
                    <div className="mt-6 flex flex-wrap gap-6">
                      {item.size && (
                        <div className="flex items-center gap-2 text-dark-300">
                          <Maximize2 className="h-4 w-4 text-primary-400" />
                          <div>
                            <span className="text-xs uppercase tracking-wider text-dark-500 block">Size</span>
                            <span className="text-sm font-medium">{item.size}</span>
                          </div>
                        </div>
                      )}
                      {item.timeTaken && (
                        <div className="flex items-center gap-2 text-dark-300">
                          <Clock className="h-4 w-4 text-primary-400" />
                          <div>
                            <span className="text-xs uppercase tracking-wider text-dark-500 block">Time Taken</span>
                            <span className="text-sm font-medium">{item.timeTaken}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-8 border-t border-dark-800" />
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link href="/order"><Button variant="primary" size="lg">Order Similar</Button></Link>
                    <Link href="/gallery"><Button variant="outline" size="lg"><ArrowLeft className="h-4 w-4" /> Back to Gallery</Button></Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
