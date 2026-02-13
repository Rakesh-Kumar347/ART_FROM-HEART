"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const placeholderItems = [
  { title: "Wedding Portrait", category: "Couple" },
  { title: "Family Gathering", category: "Family" },
  { title: "Pet Sketch", category: "Pet Sketches" },
  { title: "Solo Portrait", category: "Portraits" },
  { title: "Celebrity Sketch", category: "Celebrity" },
  { title: "Custom Art", category: "Custom" },
];

export default function FeaturedWork() {
  return (
    <section className="section-padding">
      <div className="container-width">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-dark-50">
            Featured <span className="gold-text">Sketches</span>
          </h2>
          <p className="mt-4 text-dark-400 max-w-lg mx-auto">
            A glimpse of our recent pencil sketch masterpieces
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderItems.map((item, i) => (
            <motion.div
              key={item.title}
              className="group relative overflow-hidden rounded-xl bg-dark-900 border border-dark-700/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="aspect-[4/5] flex items-center justify-center bg-dark-800/50">
                <Pencil className="w-12 h-12 text-dark-600 group-hover:text-primary-400/40 transition-colors" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <Badge variant="gold">{item.category}</Badge>
                  <h3 className="text-dark-50 font-serif font-semibold mt-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/gallery">
            <Button variant="outline">View All Gallery</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
