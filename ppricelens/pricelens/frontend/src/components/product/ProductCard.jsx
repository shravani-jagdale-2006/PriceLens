import React from "react";
import { Heart, Bell, Star, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { formatCurrency, formatNumber } from "../../utils/formatters";
import { useWishlist } from "../../context/WishlistContext";
import { useAlert } from "../../context/AlertContext";
import SmartDealBadge from "../comparison/SmartDealBadge";
import PlatformBadge from "../common/PlatformBadge";

export default function ProductCard({ product, onSelectProduct, onCompareDeals }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openAlertModal } = useAlert();

  if (!product) return null;

  const lowest = product.lowestPrice || product.mrp;
  const bestDeal = product.bestDeal || (product.prices && product.prices[0]);
  const isSaved = isInWishlist(product.id);

  // Platform badges
  const availablePlatforms = product.prices?.map(p => p.platform?.name || p.platformId) || [];

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-5 border border-white/85 shadow-glass flex flex-col justify-between relative group">
      
      {/* Top Badges & Actions */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-col gap-1.5 items-start">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
            {product.category}
          </span>
          {bestDeal && (
            <SmartDealBadge
              score={bestDeal.smartScore || 90}
              isBestDeal={true}
              breakdown={bestDeal.scoreBreakdown}
              compact={true}
            />
          )}
        </div>

        {/* Wishlist & Alert Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openAlertModal(product);
            }}
            className="p-2 rounded-full bg-white/70 hover:bg-white text-slate-400 hover:text-brand-600 border border-white transition shadow-2xs"
            title="Set Price Alert"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-full border border-white transition shadow-2xs ${
              isSaved
                ? "bg-rose-50 text-rose-500 border-rose-200"
                : "bg-white/70 hover:bg-white text-slate-400 hover:text-rose-500"
            }`}
            title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div
        onClick={() => onSelectProduct && onSelectProduct(product)}
        className="relative w-full h-44 my-2 rounded-2xl overflow-hidden bg-white/60 p-3 flex items-center justify-center cursor-pointer group-hover:scale-[1.02] transition-transform duration-300"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-h-full max-w-full object-contain drop-shadow-sm"
          loading="lazy"
        />
      </div>

      {/* Product Title & Brand */}
      <div className="mt-2">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{product.brand}</p>
        <h3
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-brand-600 transition cursor-pointer mt-0.5"
          title={product.name}
        >
          {product.name}
        </h3>
      </div>

      {/* Rating & Review count */}
      {bestDeal?.rating && (
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-200">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>{bestDeal.rating}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            ({formatNumber(bestDeal.reviewsCount || 1200)} reviews)
          </span>
        </div>
      )}

      {/* Pricing & Best Deal Summary */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Starts from</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(lowest)}
            </span>
            {product.mrp && product.mrp > lowest && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.mrp)}
              </span>
            )}
          </div>
        </div>

        {bestDeal?.discountPercent && (
          <span className="text-xs font-bold text-deal-600 bg-deal-50 px-2.5 py-1 rounded-full border border-deal-200">
            {bestDeal.discountPercent.toFixed(0)}% OFF
          </span>
        )}
      </div>

      {/* Store Availability Pills */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-slate-400 font-medium">Available on:</span>
        {availablePlatforms.slice(0, 4).map((plat, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-white/80 px-2 py-0.5 rounded-lg border border-slate-200/60 shadow-2xs"
          >
            <PlatformBadge platform={plat} size="xs" />
            <span>{plat}</span>
          </span>
        ))}
      </div>

      {/* Compare Button */}
      <div className="mt-4 pt-3 flex items-center gap-2">
        <button
          onClick={() => onCompareDeals ? onCompareDeals(product) : (onSelectProduct && onSelectProduct(product))}
          className="w-full btn-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <span>Compare Deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
