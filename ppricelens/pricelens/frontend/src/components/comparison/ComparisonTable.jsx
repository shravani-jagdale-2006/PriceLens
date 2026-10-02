import React from "react";
import { Star, Truck, Gift, ExternalLink, Award, Sparkles, Check, ArrowUpRight } from "lucide-react";
import { formatCurrency, formatNumber } from "../../utils/formatters";
import SmartDealBadge from "./SmartDealBadge";
import PlatformBadge from "../common/PlatformBadge";
import { getPlatformSearchUrl } from "../../utils/platformUtils";

export default function ComparisonTable({ product, selectedPlatforms = [] }) {
  if (!product || !product.prices || product.prices.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center text-slate-500">
        No platform pricing available for this product.
      </div>
    );
  }

  // Filter prices by selected platforms if any
  let displayPrices = product.prices;
  if (selectedPlatforms && selectedPlatforms.length > 0) {
    displayPrices = product.prices.filter(p => selectedPlatforms.includes(p.platformId));
    if (displayPrices.length === 0) {
      displayPrices = product.prices; // fallback to all
    }
  }

  // The highest deal score is the Best Deal
  const bestDealItem = displayPrices.reduce((prev, current) => 
    (current.smartScore > prev.smartScore) ? current : prev
  , displayPrices[0]);

  return (
    <div className="w-full space-y-4">
      {/* Header Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 rounded-2xl border border-white/80">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Lowest Price</span>
          <span className="text-base sm:text-lg font-extrabold text-deal-600">
            {formatCurrency(product.lowestPrice)}
          </span>
        </div>
        <div className="glass-panel p-3.5 rounded-2xl border border-white/80">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Max Savings</span>
          <span className="text-base sm:text-lg font-extrabold text-brand-600">
            {formatCurrency(product.maxSavings || (product.mrp - product.lowestPrice))}
          </span>
        </div>
        <div className="glass-panel p-3.5 rounded-2xl border border-white/80">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Best Recommended Store</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <PlatformBadge platform={bestDealItem?.platform || "Amazon"} size="xs" />
            <span className="text-base sm:text-lg font-extrabold text-slate-800 truncate block">
              {bestDealItem?.platform?.name || "Amazon"}
            </span>
          </div>
        </div>
        <div className="glass-panel p-3.5 rounded-2xl border border-white/80">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Smart Deal Score</span>
          <span className="text-base sm:text-lg font-extrabold text-brand-500">
            {bestDealItem?.smartScore || 95}/100
          </span>
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="space-y-3">
        {displayPrices.map((item, index) => {
          const isBest = item.platformId === bestDealItem.platformId;
          const plat = item.platform || { name: item.platformId, slug: item.platformId };

          return (
            <div
              key={item.id || item.platformId}
              className={`glass-panel p-4 sm:p-5 rounded-3xl border transition-all duration-200 relative overflow-hidden ${
                isBest
                  ? "border-deal-400/80 bg-white/85 shadow-lg shadow-deal-500/10 ring-1 ring-deal-400/40"
                  : "border-white/80 bg-white/65 hover:bg-white/80 shadow-glass"
              }`}
            >
              {/* Top Accent Strip for Best Deal */}
              {isBest && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-deal-400 via-deal-500 to-teal-400" />
              )}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Platform Identity & Best Deal Badge */}
                <div className="flex items-center gap-3.5 min-w-[200px]">
                  <PlatformBadge platform={plat} size="lg" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{plat.name}</h4>
                      {isBest && (
                        <span className="badge-best-deal">
                          <Award className="w-3 h-3 text-deal-500 fill-deal-500" />
                          Best Deal
                        </span>
                      )}
                    </div>
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="ml-1 text-slate-700">{item.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{formatNumber(item.reviewsCount)} ratings</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Discounts */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-8">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Store Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        {formatCurrency(item.currentPrice)}
                      </span>
                      {item.originalPrice && item.originalPrice > item.currentPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>
                    {item.discountPercent > 0 && (
                      <span className="text-xs font-bold text-deal-600">
                        Save {item.discountPercent.toFixed(0)}% ({formatCurrency(item.originalPrice - item.currentPrice)})
                      </span>
                    )}
                  </div>

                  {/* Cashback & Bank Offers */}
                  <div className="max-w-[220px]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                      <Gift className="w-3 h-3 text-brand-500" /> Cashback / Offers
                    </span>
                    <p className="text-xs font-medium text-slate-700 mt-0.5 line-clamp-2">
                      {item.cashbackDescription || "Standard store cashback & coupon benefits apply."}
                    </p>
                    {item.cashbackAmount > 0 && (
                      <span className="text-[11px] font-bold text-brand-600 block mt-0.5">
                        +{formatCurrency(item.cashbackAmount)} effective reward
                      </span>
                    )}
                  </div>

                  {/* Delivery Info */}
                  <div className="min-w-[160px]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                      <Truck className="w-3 h-3 text-slate-500" /> Delivery
                    </span>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                      {item.deliveryText || (item.deliveryDays <= 1 ? "FREE 1-Day Express" : `Standard in ${item.deliveryDays} Days`)}
                    </p>
                    <span className="text-[11px] text-slate-500 block">
                      {item.deliveryCost === 0 ? "Free Shipping" : `Delivery: ${formatCurrency(item.deliveryCost)}`}
                    </span>
                  </div>

                  {/* Smart Deal Score Badge */}
                  <div className="text-center sm:text-right min-w-[130px]">
                    <SmartDealBadge
                      score={item.smartScore}
                      breakdown={item.scoreBreakdown}
                      isBestDeal={false}
                    />
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="flex-shrink-0 pt-2 lg:pt-0">
                  <a
                    href={getPlatformSearchUrl(plat, product?.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      isBest ? "btn-deal" : "btn-secondary"
                    } text-xs sm:text-sm py-2.5 px-5 flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-sm`}
                  >
                    <span>Buy on {plat.name}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
