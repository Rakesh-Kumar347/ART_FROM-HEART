"use client";

import { motion } from "framer-motion";
import { Upload, Brain, Smartphone, Package } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Photo",
    description: "Upload your favourite photo that you want sketched",
  },
  {
    icon: Brain,
    title: "AI Analyzes",
    description: "Our AI analyzes complexity and gives you an instant quote",
  },
  {
    icon: Smartphone,
    title: "Make Payment",
    description: "Pay securely via PhonePe UPI and confirm your order",
  },
  {
    icon: Package,
    title: "Receive Sketch",
    description: "Get your hand-drawn pencil sketch delivered to your doorstep",
  },
];

export default function ProcessSection() {
  return (
    <section className="section-padding bg-dark-900/30">
      <div className="container-width">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-dark-50">
            How It <span className="gold-text">Works</span>
          </h2>
          <p className="mt-4 text-dark-400 max-w-lg mx-auto">
            Four simple steps from your photo to a beautiful pencil sketch
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-primary-400/20 via-primary-400/40 to-primary-400/20" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-dark-900 border border-primary-400/30 mb-6">
                <step.icon className="w-10 h-10 text-primary-400" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-400 text-dark-950 text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-serif font-semibold text-dark-50 mb-2">
                {step.title}
              </h3>
              <p className="text-dark-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
