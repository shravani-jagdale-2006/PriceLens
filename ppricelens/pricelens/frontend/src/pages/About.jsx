import React from "react";
import { Sparkles, ShieldCheck, Zap, Award, Layers, Target, Scale, HelpCircle } from "lucide-react";

export default function About({ onNavigate }) {
  const breakdownWeights = [
    { name: "Price Competitiveness", weight: "40%", desc: "Evaluates the lowest absolute price relative to current market competitors and official MRP.", color: "bg-brand-500" },
    { name: "Seller & Store Rating", weight: "20%", desc: "Considers verified customer feedback scores and merchant fulfillment credibility.", color: "bg-indigo-500" },
    { name: "Authentic Discounts", weight: "15%", desc: "Filters out artificial markups to verify genuine price cuts compared to past 90-day averages.", color: "bg-deal-500" },
    { name: "Bank & Cashback Rewards", weight: "15%", desc: "Calculates instant card discounts (HDFC, ICICI, Axis) and wallet cashbacks for true net cost.", color: "bg-teal-500" },
    { name: "Delivery Speed & Cost", weight: "10%", desc: "Favors same-day, next-day, and free shipping over delayed transit or steep shipping fees.", color: "bg-amber-500" }
  ];

  const faqs = [
    {
      q: "How does PriceLens compare prices across platforms?",
      a: "PriceLens checks multiple verified retailer feeds from Amazon India, Flipkart, Croma, and Reliance Digital. We match SKUs, model numbers, and variant specifications to ensure apples-to-apples comparisons."
    },
    {
      q: "What makes the Smart Deal Score different from just lowest price?",
      a: "The cheapest price isn't always the best deal if shipping costs ₹500, delivery takes two weeks, or the seller has poor ratings. The Smart Deal Score balances cost, ratings, authentic discounts, cashbacks, and delivery to highlight the truly superior offer."
    },
    {
      q: "Can I upload a picture of a product to compare?",
      a: "Yes! Use the Image Upload feature in 'Find & Compare'. Our engine previews your uploaded picture and identifies the device category to fetch live retailer prices immediately."
    },
    {
      q: "Is PriceLens free to use?",
      a: "100% free for all shoppers. You can search, compare, save wishlists, and create price alerts with zero subscription fees."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
          Our Purpose & Technology
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
          Democratizing E-Commerce Price Transparency
        </h1>
        <p className="text-base text-slate-600 mt-4 leading-relaxed">
          PriceLens was created to solve modern e-commerce fragmentation. Instead of juggling dozens of browser tabs across Amazon, Flipkart, Croma, and Reliance Digital, we give shoppers a single, crystal-clear lens to compare and decide.
        </p>
      </div>

      {/* Mission / Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/90 shadow-glass">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Search Once</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eliminate repetitive queries. Enter a gadget name once or upload a photo to immediately scrape all major retail options.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/90 shadow-glass">
          <div className="w-12 h-12 rounded-2xl bg-deal-50 text-deal-600 flex items-center justify-center mb-4">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Unbiased Calculations</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No sponsored retail bias. Deals are ranked strictly by mathematical value, taking into account genuine bank offers and shipping.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/90 shadow-glass">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Instant Action</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Direct deep links to each platform allow you to complete your checkout in seconds without middleman markups.
          </p>
        </div>
      </div>

      {/* SMART DEAL ALGORITHM DEEP DIVE */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/95 shadow-glass">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-deal-600 mb-1">
              <Sparkles className="w-4 h-4 text-deal-500" />
              <span>Proprietary Methodology</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The Smart Deal Score Algorithm
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Our 100-point composite algorithm dynamically evaluates 5 critical purchase vectors:
            </p>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-white shadow-sm text-center flex-shrink-0">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Formula Scale</span>
            <span className="text-xl font-extrabold text-brand-600">0 – 100 Points</span>
          </div>
        </div>

        <div className="space-y-5">
          {breakdownWeights.map((w, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/60 border border-white/80">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${w.color}`}></span>
                  <span className="text-sm font-bold text-slate-800">{w.name}</span>
                </div>
                <span className="text-sm font-extrabold text-slate-900 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  {w.weight}
                </span>
              </div>
              <p className="text-xs text-slate-500 pl-6">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ SECTION */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-500 mt-1">Everything you need to know about comparing deals on PriceLens.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl border border-white/85 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass-panel p-8 rounded-3xl border border-white/90 shadow-glass text-center max-w-xl mx-auto">
        <h3 className="text-xl font-bold text-slate-900">Ready to save on your next gadget?</h3>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Search over 50,000+ live prices or upload an image to find the top discount today.
        </p>
        <button
          onClick={() => onNavigate("find")}
          className="btn-primary py-3 px-8 text-sm font-semibold shadow-md shadow-brand-500/25"
        >
          Start Comparing Now
        </button>
      </div>

    </div>
  );
}
