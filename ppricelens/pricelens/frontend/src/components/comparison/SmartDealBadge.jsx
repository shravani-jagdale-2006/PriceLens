import React, { useState } from "react";
import { Sparkles, HelpCircle, Check, Award } from "lucide-react";

export default function SmartDealBadge({ score, isBestDeal = false, breakdown = null, compact = false }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Score color tiers
  const getScoreBadgeStyles = (val) => {
    if (val >= 90) return "bg-emerald-50 text-emerald-700 border-emerald-300";
    if (val >= 75) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      {/* Best Deal Pill Badge if top match */}
      {isBestDeal && (
        <span className="badge-best-deal animate-pulse-subtle">
          <Award className="w-3.5 h-3.5 text-deal-500 fill-deal-500" />
          <span>Best Deal</span>
        </span>
      )}

      {/* Smart Deal Score Indicator */}
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold transition-all cursor-help ${getScoreBadgeStyles(
          score
        )}`}
      >
        <Sparkles className="w-3 h-3 text-brand-500" />
        <span>Deal Score {score}/100</span>
      </div>

      {/* Detailed Breakdown Tooltip */}
      {showTooltip && breakdown && (
        <div className="absolute bottom-full left-0 mb-2 w-64 p-3.5 rounded-2xl glass-panel shadow-xl border border-white/95 text-left z-30 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Score Breakdown
            </span>
            <span className="text-xs font-extrabold text-deal-600">{score}/100</span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex justify-between items-center">
              <span>Price Value (40%)</span>
              <span className="font-semibold text-slate-800">{breakdown.priceScore || 0}/40</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Seller Rating (20%)</span>
              <span className="font-semibold text-slate-800">{breakdown.ratingScore || 0}/20</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Discounts (15%)</span>
              <span className="font-semibold text-slate-800">{breakdown.discountScore || 0}/15</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cashback & Offers (15%)</span>
              <span className="font-semibold text-slate-800">{breakdown.cashbackScore || 0}/15</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Delivery Speed & Cost (10%)</span>
              <span className="font-semibold text-slate-800">{breakdown.deliveryScore || 0}/10</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
