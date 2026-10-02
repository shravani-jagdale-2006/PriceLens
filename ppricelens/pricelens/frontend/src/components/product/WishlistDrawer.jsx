import React from "react";
import { X, Trash2, ExternalLink, ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { formatCurrency } from "../../utils/formatters";
import PlatformBadge from "../common/PlatformBadge";

export default function WishlistDrawer({ onSelectProduct, onCompareDeals }) {
  const { wishlist, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeWishlist} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel p-6 shadow-2xl border-l border-white/80 flex flex-col h-full bg-white/85 backdrop-blur-xl animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-200/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Saved Wishlist</h3>
                <p className="text-xs text-slate-500">{wishlist.length} item{wishlist.length === 1 ? "" : "s"} tracked</p>
              </div>
            </div>
            <button
              onClick={closeWishlist}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {wishlist.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-12 h-12 stroke-[1.5] mb-2 opacity-50" />
                <p className="text-sm font-semibold text-slate-600">Your wishlist is empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                  Click the heart icon on any product to track its live price across platforms.
                </p>
              </div>
            ) : (
              wishlist.map((item) => {
                const lowest = item.lowestPrice || item.mrp;
                const bestPlat = item.bestDeal?.platform?.name || "Amazon";
                return (
                  <div
                    key={item.id || item.productId}
                    className="p-3.5 rounded-2xl glass-card border border-white/90 shadow-sm hover:shadow-md transition-all flex gap-3 items-center"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-white p-1 border border-slate-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{item.brand} • {item.category}</p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-brand-600">
                          {formatCurrency(lowest)}
                        </span>
                        {item.mrp && item.mrp > lowest && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(item.mrp)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <PlatformBadge platform={bestPlat} size="xs" />
                          <span>Best on {bestPlat}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 items-end">
                      <button
                        onClick={() => {
                          closeWishlist();
                          if (onCompareDeals) onCompareDeals(item);
                        }}
                        className="p-2 rounded-xl text-brand-600 hover:bg-brand-50 transition"
                        title="Compare Deals"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id || item.productId)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span>Prices automatically updated</span>
              <span className="font-semibold text-slate-700">{wishlist.length} item{wishlist.length === 1 ? "" : "s"}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
