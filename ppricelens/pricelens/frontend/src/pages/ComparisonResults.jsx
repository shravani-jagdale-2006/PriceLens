import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Share2,
  Heart,
  Bell,
  Sparkles,
  Layers,
  Award,
  ShieldCheck,
  Check,
  ArrowUpRight
} from "lucide-react";
import { api } from "../services/api";
import { useWishlist } from "../context/WishlistContext";
import { useAlert } from "../context/AlertContext";
import { formatCurrency } from "../utils/formatters";
import ComparisonTable from "../components/comparison/ComparisonTable";
import SmartDealBadge from "../components/comparison/SmartDealBadge";
import PlatformBadge from "../components/common/PlatformBadge";

export default function ComparisonResults({
  productId,
  productData = null,
  onBack,
  onOpenDetails
}) {
  const [product, setProduct] = useState(productData);
  const [loading, setLoading] = useState(!productData);
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    "plat-amazon",
    "plat-flipkart",
    "plat-croma",
    "plat-reliance"
  ]);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openAlertModal } = useAlert();

  const platforms = [
    { id: "plat-amazon", name: "Amazon" },
    { id: "plat-flipkart", name: "Flipkart" },
    { id: "plat-croma", name: "Croma" },
    { id: "plat-reliance", name: "Reliance Digital" }
  ];

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      try {
        setLoading(true);
        const res = await api.getProductById(productId, selectedPlatforms);
        if (res && res.data) {
          setProduct(res.data);
        }
      } catch (err) {
        console.error("Comparison load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId, selectedPlatforms]);

  const togglePlatform = (id) => {
    if (selectedPlatforms.includes(id)) {
      if (selectedPlatforms.length === 1) return; // Keep at least 1
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel p-10 rounded-3xl max-w-md mx-auto">
          <Sparkles className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Calculating Multi-Platform Comparison...</h3>
          <p className="text-xs text-slate-500 mt-1">Aggregating live prices, ratings, and cashback data.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel p-10 rounded-3xl">
          <h3 className="text-base font-bold text-slate-800">Product not found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">We couldn't load comparison data for this item.</p>
          <button onClick={onBack} className="btn-primary text-xs py-2 px-5">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const bestDeal = product.bestDeal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white px-4 py-2 rounded-full border border-white shadow-xs transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
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

      {/* PRODUCT SPOTLIGHT HEADER */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/95 shadow-glass flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        {/* Product Image */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain drop-shadow-sm"
          />
        </div>

        {/* Details & Live Deal Highlight */}
        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
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

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {product.name}
          </h1>

          <p className="text-xs text-slate-500 mt-2 line-clamp-2 max-w-2xl">
            {product.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Best Deal Price</span>
              <span className="text-2xl font-black text-deal-600">
                {formatCurrency(product.lowestPrice)}
              </span>
            </div>
            {product.mrp && product.mrp > product.lowestPrice && (
              <div className="border-l border-slate-200/80 pl-4">
                <span className="text-[11px] text-slate-400 font-medium block">Standard MRP</span>
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {formatCurrency(product.mrp)}
                </span>
              </div>
            )}
            <div className="border-l border-slate-200/80 pl-4">
              <span className="text-[11px] text-slate-400 font-medium block">Calculated Savings</span>
              <span className="text-sm font-bold text-brand-600">
                Save up to {formatCurrency(product.maxSavings || (product.mrp - product.lowestPrice))}
              </span>
            </div>
          </div>
        </div>

        {/* View Detailed Specs Button */}
        <div className="flex-shrink-0">
          <button
            onClick={() => onOpenDetails && onOpenDetails(product)}
            className="btn-secondary text-xs font-semibold py-3 px-5 shadow-xs"
          >
            View Full Specifications
          </button>
        </div>
      </div>

      {/* PLATFORM FILTER STRIP */}
      <div className="glass-panel p-4 rounded-2xl border border-white/90 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-1">
            <Layers className="w-3.5 h-3.5 text-brand-500" /> Filter Compared Stores:
          </span>
          {platforms.map((plat) => {
            const isChecked = selectedPlatforms.includes(plat.id);
            return (
              <button
                key={plat.id}
                type="button"
                onClick={() => togglePlatform(plat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                  isChecked
                    ? "bg-white text-slate-800 border-brand-300 shadow-2xs"
                    : "bg-white/40 text-slate-400 border-transparent hover:bg-white/70"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border ${
                    isChecked
                      ? "bg-brand-500 border-brand-500 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <PlatformBadge platform={plat} size="xs" />
                <span>{plat.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-deal-500" />
          <span>Real-time store prices verified</span>
        </div>
      </div>

      {/* FULL COMPARISON TABLE */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Cross-Platform Deal Comparison Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Ranked by Smart Deal Score considering net effective price, seller reputation, bank cashback, and delivery speeds.
          </p>
        </div>

        <ComparisonTable
          product={product}
          selectedPlatforms={selectedPlatforms}
        />
      </div>

    </div>
  );
}
