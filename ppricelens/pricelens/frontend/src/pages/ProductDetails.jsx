import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Bell,
  Star,
  ShieldCheck,
  Truck,
  Gift,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { api } from "../services/api";
import { useWishlist } from "../context/WishlistContext";
import { useAlert } from "../context/AlertContext";
import { formatCurrency, formatNumber } from "../utils/formatters";
import ComparisonTable from "../components/comparison/ComparisonTable";
import SmartDealBadge from "../components/comparison/SmartDealBadge";
import PlatformBadge from "../components/common/PlatformBadge";
import { getPlatformSearchUrl } from "../utils/platformUtils";

export default function ProductDetails({
  productId,
  productData = null,
  onBack,
  onSelectProduct,
  onCompareDeals
}) {
  const [product, setProduct] = useState(productData);
  const [loading, setLoading] = useState(!productData);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openAlertModal } = useAlert();

  useEffect(() => {
    async function loadData() {
      if (!productId) return;
      try {
        setLoading(true);
        const res = await api.getProductById(productId);
        if (res && res.data) {
          setProduct(res.data);
          // Load similar products in the same category
          const simRes = await api.getProducts({ category: res.data.category });
          if (simRes && simRes.data) {
            setSimilarProducts(simRes.data.filter((p) => p.id !== res.data.id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Product load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Sparkles className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Loading Product Specifications...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h3 className="text-base font-bold text-slate-800">Product not found</h3>
        <button onClick={onBack} className="btn-primary text-xs py-2 px-5 mt-4">
          Back to Search
        </button>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const bestDeal = product.bestDeal;
  const lowest = product.lowestPrice || product.mrp;
  const specs = product.specs || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white px-4 py-2 rounded-full border border-white shadow-xs transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAlertModal(product)}
            className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 shadow-2xs"
          >
            <Bell className="w-3.5 h-3.5 text-brand-500" />
            <span>Set Price Alert</span>
          </button>
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 shadow-2xs ${
              isSaved ? "bg-rose-50 text-rose-600 border-rose-200" : ""
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
            <span>{isSaved ? "Saved" : "Save to Wishlist"}</span>
          </button>
        </div>
      </div>

      {/* PRODUCT OVERVIEW & BUY BOX */}
      <div className="glass-panel p-6 sm:p-10 rounded-4xl border border-white/95 shadow-glass grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Product Image */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full h-80 sm:h-96 rounded-3xl bg-white p-6 shadow-sm border border-slate-100 flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-deal-600" />
            <span>Verified 100% genuine retail SKU & manufacturer warranty</span>
          </div>
        </div>

        {/* Right: Info, Price, Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                {product.category}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">{product.brand}</span>
              {bestDeal && (
                <SmartDealBadge
                  score={bestDeal.smartScore}
                  isBestDeal={true}
                  breakdown={bestDeal.scoreBreakdown}
                />
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {bestDeal?.rating && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{bestDeal.rating}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {formatNumber(bestDeal.reviewsCount)} customer reviews across platforms
                </span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Highlight Card */}
          <div className="p-5 rounded-3xl bg-white/70 border border-white shadow-sm space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 block">Lowest Available Price</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-deal-600">
                    {formatCurrency(lowest)}
                  </span>
                  {product.mrp && product.mrp > lowest && (
                    <span className="text-sm text-slate-400 line-through">
                      MRP {formatCurrency(product.mrp)}
                    </span>
                  )}
                </div>
              </div>

              {bestDeal?.discountPercent > 0 && (
                <span className="text-xs font-bold text-deal-700 bg-deal-50 px-3 py-1 rounded-full border border-deal-200">
                  {bestDeal.discountPercent.toFixed(0)}% Off MRP
                </span>
              )}
            </div>

            {/* Best Platform CTA */}
            {bestDeal && (
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-600 flex items-center gap-2.5">
                  <PlatformBadge platform={bestDeal.platform || "Amazon"} size="sm" />
                  <div>
                    <div>
                      <span>Best deal currently on </span>
                      <strong className="text-slate-900">{bestDeal.platform?.name || "Amazon"}</strong>
                    </div>
                    <span className="text-slate-400 block text-[11px]">
                      {bestDeal.cashbackDescription || "With extra bank offers applied"}
                    </span>
                  </div>
                </div>

                <a
                  href={getPlatformSearchUrl(bestDeal.platform, product?.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-deal text-xs font-semibold py-2.5 px-6 flex items-center gap-1.5 w-full sm:w-auto justify-center"
                >
                  <span>Buy on {bestDeal.platform?.name || "Store"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Quick Perks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/50 border border-white/80">
              <Truck className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span>Fast 1-2 Day Delivery</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/50 border border-white/80">
              <Gift className="w-4 h-4 text-deal-500 flex-shrink-0" />
              <span>Card Cashbacks Included</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/50 border border-white/80 col-span-2 sm:col-span-1">
              <ShieldCheck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>100% Brand Warranty</span>
            </div>
          </div>

        </div>
      </div>

      {/* CROSS-PLATFORM PRICE COMPARISON MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Live Platform Price Comparison
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side comparison across all major e-commerce platforms.
            </p>
          </div>
        </div>

        <ComparisonTable product={product} />
      </div>

      {/* FULL SPECIFICATIONS TABLE */}
      {Object.keys(specs).length > 0 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/95 shadow-glass space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-4">
            <Info className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-bold text-slate-900">Technical Specifications</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {Object.entries(specs).map(([key, value], idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/60 border border-white/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
              >
                <span className="text-xs font-semibold text-slate-500">{key}</span>
                <span className="text-xs font-bold text-slate-800 text-left sm:text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIMILAR RECOMMENDED PRODUCTS */}
      {similarProducts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Similar Products in {product.category}</h3>
            <button
              onClick={() => onBack()}
              className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
            >
              <span>Explore More</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarProducts.map((sim) => (
              <div
                key={sim.id}
                onClick={() => onSelectProduct && onSelectProduct(sim)}
                className="glass-panel glass-panel-hover p-4 rounded-3xl border border-white/80 shadow-glass cursor-pointer flex flex-col justify-between"
              >
                <div className="w-full h-32 rounded-2xl bg-white p-3 flex items-center justify-center mb-3">
                  <img src={sim.imageUrl} alt={sim.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-600 uppercase">{sim.brand}</span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">{sim.name}</h4>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      {formatCurrency(sim.lowestPrice)}
                    </span>
                    {sim.bestDeal?.discountPercent > 0 && (
                      <span className="text-[10px] font-bold text-deal-600">
                        {sim.bestDeal.discountPercent.toFixed(0)}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
