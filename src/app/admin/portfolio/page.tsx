"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, Image, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Skeleton from "@/components/ui/Skeleton";
import { PortfolioItem, ArtCategory } from "@/types/portfolio";
import { CATEGORIES } from "@/lib/constants";

interface PortfolioFormData {
  title: string; description: string; category: ArtCategory; size: string; timeTaken: string; isFeatured: boolean; displayOrder: number;
}
const EMPTY_FORM: PortfolioFormData = { title: "", description: "", category: "portraits", size: "", timeTaken: "", isFeatured: false, displayOrder: 0 };

export default function AdminPortfolioPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState<PortfolioFormData>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetchPortfolio(); }, []);

  async function fetchPortfolio() {
    try { const res = await fetch("/api/portfolio"); if (res.ok) { const data = await res.json(); setItems(data.items || data || []); } }
    catch { toast.error("Failed to load portfolio"); } finally { setLoading(false); }
  }

  function openAddModal() { setEditingItem(null); setFormData(EMPTY_FORM); setImageFile(null); setImagePreview(""); setModalOpen(true); }
  function openEditModal(item: PortfolioItem) {
    setEditingItem(item);
    setFormData({ title: item.title, description: item.description || "", category: item.category, size: item.size || "", timeTaken: item.timeTaken || "", isFeatured: item.isFeatured, displayOrder: item.displayOrder });
    setImageFile(null); setImagePreview(item.imageUrl); setModalOpen(true);
  }
  function closeModal() { setModalOpen(false); setEditingItem(null); setFormData(EMPTY_FORM); setImageFile(null); setImagePreview(""); }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setImageFile(file);
    const reader = new FileReader(); reader.onloadend = () => setImagePreview(reader.result as string); reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!formData.title.trim()) { toast.error("Title is required"); return; }
    if (!editingItem && !imageFile) { toast.error("Please select an image"); return; }
    setSaving(true);
    try {
      let imageUrl = editingItem?.imageUrl || "";
      if (imageFile) {
        const uploadForm = new FormData(); uploadForm.append("file", imageFile); uploadForm.append("folder", "art-from-heart/portfolio");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm });
        if (!uploadRes.ok) { toast.error("Failed to upload image"); setSaving(false); return; }
        const uploadData = await uploadRes.json(); imageUrl = uploadData.url || uploadData.secure_url;
      }
      const payload = { title: formData.title, description: formData.description || undefined, category: formData.category, imageUrl, size: formData.size || undefined, timeTaken: formData.timeTaken || undefined, isFeatured: formData.isFeatured, displayOrder: formData.displayOrder };
      const res = editingItem
        ? await fetch(`/api/portfolio/${editingItem._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { toast.success(editingItem ? "Item updated" : "Item added"); closeModal(); fetchPortfolio(); }
      else toast.error(editingItem ? "Failed to update" : "Failed to add");
    } catch { toast.error("Something went wrong"); } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setDeletingId(id);
    try { const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" }); if (res.ok) { toast.success("Item deleted"); setItems((prev) => prev.filter((item) => item._id !== id)); } else toast.error("Failed to delete"); }
    catch { toast.error("Failed to delete"); } finally { setDeletingId(null); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-serif font-bold text-dark-50">Portfolio</h1><p className="text-dark-400 text-sm mt-1">Manage your gallery showcase</p></div>
        <Button onClick={openAddModal} size="sm"><Plus className="h-4 w-4" /> Add New</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-72" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-16 w-16 rounded-full bg-dark-800/50 flex items-center justify-center mx-auto mb-4"><Image className="h-8 w-8 text-dark-500" /></div>
          <p className="text-dark-400 text-lg font-medium">No portfolio items yet</p>
          <Button onClick={openAddModal} size="sm" className="mt-4"><Plus className="h-4 w-4" /> Add First Item</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }}
                className="bg-dark-900/50 border border-dark-700/50 rounded-xl overflow-hidden group">
                <div className="relative aspect-[4/3] bg-dark-800 overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  {item.isFeatured && <div className="absolute top-2 right-2"><Badge variant="gold">Featured</Badge></div>}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-dark-50 truncate">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="purple">{CATEGORIES.find((c) => c.value === item.category)?.label || item.category}</Badge>
                    {item.size && <span className="text-xs text-dark-500">{item.size}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(item)} className="flex-1"><Edit3 className="h-3.5 w-3.5" /> Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item._id)} loading={deletingId === item._id} className="flex-1 text-red-400 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Image</label>
            {imagePreview ? <div className="relative aspect-video rounded-lg overflow-hidden bg-dark-800 mb-2"><img src={imagePreview} alt="Preview" className="w-full h-full object-contain" /></div>
            : <div className="border-2 border-dashed border-dark-700 rounded-lg p-8 text-center mb-2"><Upload className="h-8 w-8 text-dark-500 mx-auto mb-2" /><p className="text-dark-400 text-sm">Click below to upload</p></div>}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /> {imagePreview ? "Change Image" : "Select Image"}</Button>
          </div>
          <Input label="Title" placeholder="Enter artwork title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Textarea label="Description" placeholder="Brief description (optional)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <Select label="Category" options={CATEGORIES} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as ArtCategory })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Size" placeholder="e.g. A4" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} />
            <Input label="Time Taken" placeholder="e.g. 8 hours" value={formData.timeTaken} onChange={(e) => setFormData({ ...formData, timeTaken: e.target.value })} />
          </div>
          <Input label="Display Order" type="number" value={formData.displayOrder.toString()} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="h-4 w-4 rounded border-dark-700 bg-dark-900 text-primary-400" />
            <span className="text-sm text-dark-300">Mark as featured artwork</span>
          </label>
          <div className="flex items-center gap-3 pt-2">
            <Button variant="secondary" onClick={closeModal} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} loading={saving} className="flex-1">{editingItem ? "Save Changes" : "Add Item"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
