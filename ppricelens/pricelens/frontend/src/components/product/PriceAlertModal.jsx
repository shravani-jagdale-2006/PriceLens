import React, { useState } from "react";
import { X, Bell, TrendingDown, Check, Trash2, Sparkles } from "lucide-react";
import { useAlert } from "../../context/AlertContext";
import { formatCurrency } from "../../utils/formatters";

export default function PriceAlertModal() {
  const {
    isAlertModalOpen,
    closeAlertModal,
    selectedProduct,
    createAlert,
    alerts,
    deleteAlert
  } = useAlert();

  const [targetPrice, setTargetPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState("create"); // 'create' or 'active'

  if (!isAlertModalOpen) return null;

  const currentLowest = selectedProduct?.lowestPrice || selectedProduct?.mrp || 0;

  const handlePercentagePreset = (percent) => {
    const discounted = Math.round(currentLowest * (1 - percent / 100));
    setTargetPrice(discounted.toString());
  };

  const handleSaveAlert = async (e) => {
    e.preventDefault();
    if (!targetPrice || Number(targetPrice) <= 0) return;

    setLoading(true);
    setSuccessMsg("");
    try {
      await createAlert(selectedProduct.id, Number(targetPrice));
      setSuccessMsg("Price alert active! We will notify you when price drops below your target.");
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/95 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAlertModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200/60 pb-3">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTab === "create"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Set New Alert
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === "active"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Active Alerts</span>
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">
              {alerts.length}
            </span>
          </button>
        </div>

        {activeTab === "create" ? (
          <div>
            {selectedProduct && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-white/90 shadow-sm mb-5">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-14 h-14 object-cover rounded-xl bg-white p-1 border border-slate-100 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{selectedProduct.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">Current Lowest:</span>
                    <span className="text-sm font-extrabold text-deal-600">{formatCurrency(currentLowest)}</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveAlert} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Enter Target Price (₹)</span>
                  <span className="text-[11px] text-slate-400">Must be lower than current price</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    max={currentLowest > 0 ? currentLowest - 1 : 1000000}
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder={currentLowest ? (currentLowest * 0.9).toFixed(0) : "e.g. 110000"}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/80 border border-white focus:border-brand-500 focus:bg-white focus:outline-none text-sm font-semibold transition"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              {currentLowest > 0 && (
                <div>
                  <span className="block text-[11px] font-medium text-slate-500 mb-2">Quick percentage drops:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 15].map((pct) => {
                      const val = Math.round(currentLowest * (1 - pct / 100));
                      return (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handlePercentagePreset(pct)}
                          className="py-2 px-3 rounded-xl border border-white/80 bg-white/60 hover:bg-white text-xs font-semibold text-slate-700 hover:text-brand-600 hover:border-brand-300 transition shadow-xs text-center"
                        >
                          <span className="text-deal-600">-{pct}%</span> ({formatCurrency(val)})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-deal-50 border border-deal-200 text-deal-700 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-deal-600" />
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-brand-500/20"
              >
                <Bell className="w-4 h-4" />
                {loading ? "Activating Alert..." : "Create Smart Price Alert"}
              </button>
            </form>
          </div>
        ) : (
          /* Active Alerts List */
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Bell className="w-10 h-10 mx-auto stroke-[1.5] mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-600">No active price alerts</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Set alerts on products to track major drops.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-2xl glass-card border border-white/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold text-slate-800 truncate">
                      {alert.product?.name || "Tracked Product"}
                    </h5>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-slate-500">
                        Target: <strong className="text-brand-600 font-bold">{formatCurrency(alert.targetPrice)}</strong>
                      </span>
                      {alert.product?.lowestPrice && (
                        <span className="text-[11px] text-slate-500">
                          Now: {formatCurrency(alert.product.lowestPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
