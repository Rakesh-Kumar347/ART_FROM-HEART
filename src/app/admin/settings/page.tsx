"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Upload, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { PricingConfig } from "@/types/pricing";
import { DEFAULT_PRICING } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const STORAGE_KEY = "afh_pricing_config";
const QR_STORAGE_KEY = "afh_qr_image";
const UPI_STORAGE_KEY = "afh_upi_id";

export default function AdminSettingsPage() {
  const qrInputRef = useRef<HTMLInputElement>(null);
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [upiId, setUpiId] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY); if (stored) setConfig(JSON.parse(stored));
      const storedQr = localStorage.getItem(QR_STORAGE_KEY); if (storedQr) setQrImageUrl(storedQr);
      const storedUpi = localStorage.getItem(UPI_STORAGE_KEY); if (storedUpi) setUpiId(storedUpi);
    } catch {}
  }, []);

  const previewPrice = useMemo(() => {
    const base = config.basePrice;
    const complexityCharge = 7 * config.complexityMultiplier;
    const personCharge = 2 * config.personCharge;
    const sizeCharge = config.sizeFactors["A3"] || 0;
    const framingCharge = config.framingFactors["basic"] || 0;
    const urgencyCharge = config.urgencyFactors["standard"] || 0;
    return { base, complexityCharge, personCharge, sizeCharge, framingCharge, urgencyCharge, total: base + complexityCharge + personCharge + sizeCharge + framingCharge + urgencyCharge };
  }, [config]);

  function handleSave() {
    setSaving(true);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); localStorage.setItem(UPI_STORAGE_KEY, upiId); toast.success("Settings saved"); }
    catch { toast.error("Failed to save"); } finally { setSaving(false); }
  }

  async function handleQrUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingQr(true);
    try {
      const formData = new FormData(); formData.append("file", file); formData.append("folder", "art-from-heart/settings");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) { const data = await res.json(); const url = data.url || data.secure_url; setQrImageUrl(url); localStorage.setItem(QR_STORAGE_KEY, url); toast.success("QR code uploaded"); }
      else toast.error("Failed to upload QR");
    } catch { toast.error("Upload failed"); } finally { setUploadingQr(false); if (qrInputRef.current) qrInputRef.current.value = ""; }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-serif font-bold text-dark-50">Settings</h1><p className="text-dark-400 text-sm mt-1">Configure pricing and payment options</p></div>
        <Button onClick={handleSave} loading={saving} size="sm"><Save className="h-4 w-4" /> Save Settings</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-serif font-semibold text-dark-50 mb-4">Base Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Base Price" type="number" value={config.basePrice.toString()} onChange={(e) => setConfig({ ...config, basePrice: parseFloat(e.target.value) || 0 })} />
              <Input label="Complexity Multiplier" type="number" value={config.complexityMultiplier.toString()} onChange={(e) => setConfig({ ...config, complexityMultiplier: parseFloat(e.target.value) || 0 })} />
              <Input label="Per Person Charge" type="number" value={config.personCharge.toString()} onChange={(e) => setConfig({ ...config, personCharge: parseFloat(e.target.value) || 0 })} />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-serif font-semibold text-dark-50 mb-4">Size Charges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(config.sizeFactors).map(([size, value]) => (
                <Input key={size} label={size.toUpperCase()} type="number" value={value.toString()} onChange={(e) => setConfig((prev) => ({ ...prev, sizeFactors: { ...prev.sizeFactors, [size]: parseFloat(e.target.value) || 0 } }))} />
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-serif font-semibold text-dark-50 mb-4">Framing Charges</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(config.framingFactors).map(([option, value]) => (
                <Input key={option} label={option.charAt(0).toUpperCase() + option.slice(1)} type="number" value={value.toString()} onChange={(e) => setConfig((prev) => ({ ...prev, framingFactors: { ...prev.framingFactors, [option]: parseFloat(e.target.value) || 0 } }))} />
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-serif font-semibold text-dark-50 mb-4">Urgency Charges</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(config.urgencyFactors).map(([option, value]) => (
                <Input key={option} label={option.charAt(0).toUpperCase() + option.slice(1)} type="number" value={value.toString()} onChange={(e) => setConfig((prev) => ({ ...prev, urgencyFactors: { ...prev.urgencyFactors, [option]: parseFloat(e.target.value) || 0 } }))} />
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-serif font-semibold text-dark-50 mb-4">Payment Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="UPI ID" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">PhonePe QR Code</label>
                {qrImageUrl ? (
                  <div className="space-y-2">
                    <div className="w-40 h-40 rounded-lg overflow-hidden bg-white p-2"><img src={qrImageUrl} alt="PhonePe QR" className="w-full h-full object-contain" /></div>
                    <input ref={qrInputRef} type="file" accept="image/*" onChange={handleQrUpload} className="hidden" />
                    <Button variant="ghost" size="sm" loading={uploadingQr} onClick={() => qrInputRef.current?.click()}><Upload className="h-4 w-4" /> Replace QR</Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-dark-700 rounded-lg p-6 text-center">
                    <Upload className="h-6 w-6 text-dark-500 mx-auto mb-2" /><p className="text-dark-400 text-xs mb-2">Upload QR code image</p>
                    <input ref={qrInputRef} type="file" accept="image/*" onChange={handleQrUpload} className="hidden" />
                    <Button variant="outline" size="sm" loading={uploadingQr} onClick={() => qrInputRef.current?.click()}>Upload QR</Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card>
                <div className="flex items-center gap-2 mb-4"><IndianRupee className="h-5 w-5 text-primary-400" /><h2 className="text-lg font-serif font-semibold text-dark-50">Live Preview</h2></div>
                <p className="text-xs text-dark-400 mb-4">Example: 2-person A3 portrait, complexity 7, basic frame, standard delivery</p>
                <dl className="space-y-2.5">
                  <div className="flex justify-between"><dt className="text-sm text-dark-400">Base Price</dt><dd className="text-sm text-dark-50">{formatCurrency(previewPrice.base)}</dd></div>
                  <div className="flex justify-between"><dt className="text-sm text-dark-400">Complexity (7 x {config.complexityMultiplier})</dt><dd className="text-sm text-dark-50">{formatCurrency(previewPrice.complexityCharge)}</dd></div>
                  <div className="flex justify-between"><dt className="text-sm text-dark-400">Persons (2 x {config.personCharge})</dt><dd className="text-sm text-dark-50">{formatCurrency(previewPrice.personCharge)}</dd></div>
                  <div className="flex justify-between"><dt className="text-sm text-dark-400">Size (A3)</dt><dd className="text-sm text-dark-50">{formatCurrency(previewPrice.sizeCharge)}</dd></div>
                  <div className="flex justify-between"><dt className="text-sm text-dark-400">Framing (Basic)</dt><dd className="text-sm text-dark-50">{formatCurrency(previewPrice.framingCharge)}</dd></div>
                  <div className="flex justify-between"><dt className="text-sm text-dark-400">Urgency (Standard)</dt><dd className="text-sm text-dark-50">{formatCurrency(previewPrice.urgencyCharge)}</dd></div>
                  <div className="flex justify-between pt-3 border-t border-dark-700"><dt className="text-sm font-semibold text-dark-50">Total</dt><dd className="text-xl font-serif font-bold text-primary-400">{formatCurrency(previewPrice.total)}</dd></div>
                </dl>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
