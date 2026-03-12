"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useOrderStore } from "@/store/order-store";

export default function ImageUploader() {
  const { imageFile, imagePreview, setImageFile, setImagePreview, nextStep } = useOrderStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, [setImageFile, setImagePreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  function handleRemove() {
    setImageFile(null);
    setImagePreview(null);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-dark-50">Upload Your Photo</h2>
        <p className="text-dark-400 mt-2">Upload the image you want turned into a pencil sketch</p>
      </div>

      <AnimatePresence mode="wait">
        {imagePreview ? (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative max-w-lg mx-auto">
            <div className="rounded-xl overflow-hidden border border-dark-700/50 bg-dark-900">
              <img src={imagePreview} alt="Upload preview" className="w-full h-auto max-h-[400px] object-contain" />
            </div>
            <button onClick={handleRemove} className="absolute top-3 right-3 p-2 rounded-full bg-dark-900/80 text-dark-300 hover:text-red-400 hover:bg-dark-900 transition-colors" aria-label="Remove image">
              <X className="h-5 w-5" />
            </button>
            <div className="mt-2 text-center">
              <p className="text-sm text-dark-400">{imageFile?.name}</p>
              <p className="text-xs text-dark-500">{imageFile && (imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors max-w-lg mx-auto",
                isDragActive ? "border-primary-400 bg-primary-400/5" : "border-dark-700 hover:border-dark-500 bg-dark-900/30"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className={cn("h-16 w-16 rounded-full flex items-center justify-center", isDragActive ? "bg-primary-400/10" : "bg-dark-800")}>
                  {isDragActive ? <Upload className="h-8 w-8 text-primary-400" /> : <ImageIcon className="h-8 w-8 text-dark-500" />}
                </div>
                <div>
                  <p className="text-dark-200 font-medium">{isDragActive ? "Drop your image here" : "Drag & drop your image here"}</p>
                  <p className="text-dark-500 text-sm mt-1">or click to browse (PNG, JPG, WEBP up to 10MB)</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {imagePreview && (
        <div className="flex justify-center">
          <Button onClick={nextStep} size="lg">Continue to Analysis</Button>
        </div>
      )}
    </div>
  );
}
