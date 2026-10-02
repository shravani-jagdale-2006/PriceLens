import React from "react";
import { Search, ShieldCheck, Zap, Heart, Sparkles, ExternalLink } from "lucide-react";

export default function GlassFooter({ setActiveTab }) {
  return (
    <footer className="mt-20 border-t border-white/60 bg-white/40 backdrop-blur-xl py-12 px-4 sm:px-8 text-slate-600">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-400 flex items-center justify-center text-white shadow-sm">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800">
              Price<span className="text-brand-500">Lens</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Search Once. Compare Everywhere. Buy Smarter. Real-time e-commerce price comparison across India's leading shopping platforms.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-deal-600">
            <ShieldCheck className="w-4 h-4" /> 100% Unbiased Smart Deal Score
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveTab("home")} className="hover:text-brand-600 transition">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab("find")} className="hover:text-brand-600 transition">
                Find & Compare Products
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab("about")} className="hover:text-brand-600 transition">
                About PriceLens & Deal Score
              </button>
            </li>
          </ul>
        </div>

        {/* Supported Platforms */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Tracked Platforms</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Amazon India
            </li>
            <li className="flex items-center gap-2 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Flipkart
            </li>
            <li className="flex items-center gap-2 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> Croma Electronics
            </li>
            <li className="flex items-center gap-2 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Reliance Digital
            </li>
          </ul>
        </div>

        {/* Smart Deal Scoring summary */}
        <div className="glass-panel p-4 rounded-2xl border border-white/80">
          <div className="flex items-center gap-2 mb-2 text-brand-600 font-semibold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Smart Deal Algorithm</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Calculated dynamically considering: Lowest Price (40%), Seller Rating (20%), Live Discounts (15%), Bank Cashback (15%), and Delivery Speed (10%).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 PriceLens. All product trademarks and logos belong to their respective owners.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> in Liquid Glass aesthetics
        </p>
      </div>
    </footer>
  );
}
