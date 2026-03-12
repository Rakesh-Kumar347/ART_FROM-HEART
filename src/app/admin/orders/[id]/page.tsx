"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, CheckCircle, XCircle, Eye, Image } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { Order, OrderStatus } from "@/types/order";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDateTime } from "@/lib/utils";

type BadgeVariant = "blue" | "yellow" | "green" | "purple" | "emerald" | "gold" | "red";
const STATUS_BADGE_MAP: Record<string, BadgeVariant> = {
  new: "blue", payment_pending: "yellow", confirmed: "green",
  in_progress: "purple", completed: "emerald", delivered: "gold",
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const orderId = params.id as string;

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          const o = data.order || data;
          setOrder(o);
          setSelectedStatus(o.status);
        } else {
          toast.error("Order not found");
          router.push("/admin/orders");
        }
      } catch { toast.error("Failed to load order"); } finally { setLoading(false); }
    }
    if (orderId) fetchOrder();
  }, [orderId, router]);

  async function handleStatusUpdate() {
    if (!selectedStatus || selectedStatus === order?.status) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: selectedStatus }) });
      if (res.ok) { const data = await res.json(); setOrder(data.order || data); toast.success("Status updated"); }
      else toast.error("Failed to update status");
    } catch { toast.error("Failed to update status"); } finally { setUpdating(false); }
  }

  async function handlePaymentToggle() {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentVerified: !order.paymentVerified }) });
      if (res.ok) { const data = await res.json(); setOrder(data.order || data); toast.success(data.order?.paymentVerified || data.paymentVerified ? "Payment verified" : "Verification removed"); }
      else toast.error("Failed to update payment");
    } catch { toast.error("Failed to update payment"); } finally { setUpdating(false); }
  }

  async function handleSketchUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "art-from-heart/orders");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) { toast.error("Failed to upload"); return; }
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url || uploadData.secure_url;
      const updateRes = await fetch(`/api/orders/${orderId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completedSketchUrl: imageUrl }) });
      if (updateRes.ok) { const data = await updateRes.json(); setOrder(data.order || data); toast.success("Sketch uploaded"); }
      else toast.error("Failed to save sketch");
    } catch { toast.error("Upload failed"); } finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  }

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-32" /><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Skeleton className="h-96" /><div className="space-y-4"><Skeleton className="h-48" /><Skeleton className="h-48" /></div></div></div>;
  if (!order) return <div className="text-center py-16"><p className="text-dark-400">Order not found</p><Button variant="outline" className="mt-4" onClick={() => router.push("/admin/orders")}>Back to Orders</Button></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/orders")}><ArrowLeft className="h-4 w-4" /> Back</Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-bold text-dark-50">{order.orderId}</h1>
            <Badge variant={STATUS_BADGE_MAP[order.status] || "gold"}>{ORDER_STATUSES.find((s) => s.value === order.status)?.label || order.status}</Badge>
          </div>
          <p className="text-dark-400 text-sm mt-1">Created {formatDateTime(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">Reference Image</h3>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-dark-800">
              {order.referenceImageUrl ? <img src={order.referenceImageUrl} alt="Reference" className="w-full h-full object-contain" /> : <div className="flex items-center justify-center h-full"><Image className="h-12 w-12 text-dark-600" /></div>}
            </div>
            {order.referenceImageUrl && <a href={order.referenceImageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 mt-2"><Eye className="h-3.5 w-3.5" /> View full size</a>}
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">Completed Sketch</h3>
            {order.completedSketchUrl ? (
              <>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-dark-800"><img src={order.completedSketchUrl} alt="Completed sketch" className="w-full h-full object-contain" /></div>
                <a href={order.completedSketchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 mt-2"><Eye className="h-3.5 w-3.5" /> View full size</a>
                <div className="mt-3">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleSketchUpload} className="hidden" />
                  <Button variant="ghost" size="sm" loading={uploading} onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /> Replace Sketch</Button>
                </div>
              </>
            ) : (
              <div className="border-2 border-dashed border-dark-700 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-dark-500 mx-auto mb-3" />
                <p className="text-dark-400 text-sm mb-3">Upload the completed sketch</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleSketchUpload} className="hidden" />
                <Button variant="outline" size="sm" loading={uploading} onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /> Choose File</Button>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">Status Management</h3>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label htmlFor="status-select" className="block text-sm font-medium text-dark-300 mb-1.5">Order Status</label>
                <select id="status-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-dark-50 focus:outline-none focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/30 appearance-none text-sm">
                  {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <Button size="sm" loading={updating} disabled={selectedStatus === order.status} onClick={handleStatusUpdate}>Update</Button>
            </div>
            <div className="mt-4 pt-4 border-t border-dark-800">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-dark-50">Payment Verification</p><p className="text-xs text-dark-400 mt-0.5">{order.paymentMarked ? "Customer marked as paid" : "Customer has not marked payment"}</p></div>
                <button onClick={handlePaymentToggle} disabled={updating}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${order.paymentVerified ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-dark-800 text-dark-400 hover:bg-dark-700"}`}>
                  {order.paymentVerified ? <><CheckCircle className="h-4 w-4" /> Verified</> : <><XCircle className="h-4 w-4" /> Not Verified</>}
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">Customer Information</h3>
            <dl className="space-y-2.5">
              <div className="flex justify-between"><dt className="text-sm text-dark-400">Name</dt><dd className="text-sm text-dark-50 font-medium">{order.customerName}</dd></div>
              <div className="flex justify-between"><dt className="text-sm text-dark-400">Email</dt><dd className="text-sm"><a href={`mailto:${order.customerEmail}`} className="text-primary-400 hover:text-primary-300">{order.customerEmail}</a></dd></div>
              <div className="flex justify-between"><dt className="text-sm text-dark-400">Phone</dt><dd className="text-sm"><a href={`tel:${order.customerPhone}`} className="text-primary-400 hover:text-primary-300">{order.customerPhone}</a></dd></div>
              {order.customerAddress && <div className="flex justify-between"><dt className="text-sm text-dark-400">Address</dt><dd className="text-sm text-dark-50 text-right max-w-[60%]">{order.customerAddress}</dd></div>}
            </dl>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">Order Specifications</h3>
            <dl className="space-y-2.5">
              <div className="flex justify-between"><dt className="text-sm text-dark-400">Size</dt><dd className="text-sm text-dark-50 font-medium">{order.size}</dd></div>
              <div className="flex justify-between"><dt className="text-sm text-dark-400">Framing</dt><dd className="text-sm text-dark-50 capitalize">{order.framing}</dd></div>
              <div className="flex justify-between"><dt className="text-sm text-dark-400">Urgency</dt><dd className="text-sm text-dark-50 capitalize">{order.urgency}</dd></div>
              {order.specialInstructions && <div className="pt-2 border-t border-dark-800"><dt className="text-sm text-dark-400 mb-1">Special Instructions</dt><dd className="text-sm text-dark-200 bg-dark-800/50 rounded-lg p-3">{order.specialInstructions}</dd></div>}
            </dl>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">AI Analysis Breakdown</h3>
            <div className="space-y-3">
              {[{ label: "Complexity Score", value: order.complexityScore }, { label: "Person Count", value: order.personCount }, { label: "Face Detail", value: order.faceDetailScore }, { label: "Clothing", value: order.clothingScore }, { label: "Accessories", value: order.accessoryScore }].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1"><span className="text-dark-400">{item.label}</span><span className="text-dark-50 font-medium">{item.value}</span></div>
                  <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden"><div className="h-full bg-primary-400 rounded-full transition-all duration-500" style={{ width: `${(item.value / 10) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">Price Breakdown</h3>
            <dl className="space-y-2">
              {[["Base Price", order.basePrice], ["Complexity", order.complexityPrice], [`Persons (${order.personCount})`, order.personPrice], [`Size (${order.size})`, order.sizePrice], ["Framing", order.framingPrice], ["Urgency", order.urgencyPrice]].map(([label, value]) => (
                <div key={label as string} className="flex justify-between"><dt className="text-sm text-dark-400">{label}</dt><dd className="text-sm text-dark-50">{formatCurrency(value as number)}</dd></div>
              ))}
              <div className="flex justify-between pt-2 border-t border-dark-700"><dt className="text-sm font-semibold text-dark-50">Total</dt><dd className="text-lg font-serif font-bold text-primary-400">{formatCurrency(order.totalPrice)}</dd></div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
