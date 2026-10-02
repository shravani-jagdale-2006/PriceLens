import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  Bell,
  Heart,
  Smartphone,
  Laptop,
  Headphones,
  Tv,
  Watch,
  Home as HomeIcon,
  CheckCircle2,
  Award,
  Layers
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/product/ProductCard";

export default function Home({ onNavigate, onSelectCategory, onCompareDeals, onSelectProduct }) {
  const { user, openAuthModal } = useAuth();
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await api.getFeaturedDeals();
        if (res && res.data) {
          setFeaturedDeals(res.data);
        }
      } catch (err) {
        console.warn("Failed to load featured deals:", err.message);
      } finally {
        setLoadingDeals(false);
      }
    }
    loadDeals();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("find", { search: searchQuery });
    }
  };

  const categories = [
    { name: "Mobiles", icon: Smartphone, count: "4 Flagships", color: "from-blue-500 to-indigo-500" },
    { name: "Laptops", icon: Laptop, count: "4 Ultrabooks", color: "from-indigo-500 to-purple-500" },
    { name: "Headphones", icon: Headphones, count: "4 Audio Gear", color: "from-purple-500 to-pink-500" },
    { name: "TVs", icon: Tv, count: "3 OLED Displays", color: "from-teal-500 to-emerald-500" },
    { name: "Smart Watches", icon: Watch, count: "3 Wearables", color: "from-emerald-500 to-cyan-500" },
    { name: "Home Appliances", icon: HomeIcon, count: "3 Smart Living", color: "from-amber-500 to-orange-500" }
  ];

  const steps = [
    {
      num: "01",
      title: "Search Product",
      desc: "Type any device name or simply upload a picture to instantly find matches.",
      icon: Search
    },
    {
      num: "02",
      title: "Select Platforms",
      desc: "Choose from Amazon, Flipkart, Croma, and Reliance Digital in one click.",
      icon: Layers
    },
    {
      num: "03",
      title: "Compare Deals",
      desc: "Analyze price, ratings, bank cashback, and express delivery side-by-side.",
      icon: SlidersHorizontal
    },
    {
      num: "04",
      title: "Make a Decision",
      desc: "Leverage our Smart Deal Score to grab the optimal discount with peace of mind.",
      icon: Award
    }
  ];

  const features = [
    {
      icon: TrendingDown,
      title: "Price Comparison",
      desc: "Track real-time pricing discrepancies across platforms and never pay more than necessary."
    },
    {
      icon: Layers,
      title: "Multi-Platform Search",
      desc: "Search once across Amazon, Flipkart, Croma, and Reliance Digital simultaneously."
    },
    {
      icon: Sparkles,
      title: "Smart Deal Recommendation",
      desc: "Our proprietary algorithm weighs price, seller rating, cashback, and delivery to crown the true Best Deal."
    },
    {
      icon: SlidersHorizontal,
      title: "Product Comparison",
      desc: "Examine detailed specifications, delivery dates, and return policies side-by-side."
    },
    {
      icon: Heart,
      title: "Synchronized Wishlist",
      desc: "Save your favorite gadgets and monitor price fluctuations effortlessly from your private drawer."
    },
    {
      icon: Bell,
      title: "Instant Price Alerts",
      desc: "Set your target price budget and receive instant notification the moment a store drops below it."
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      
      {/* HERO SECTION */}
      <section className="relative isolate pt-12 sm:pt-20 pb-10 text-center max-w-4xl mx-auto px-4">
        {/* Looping Hero Background Video Layer */}
        <div
          className="absolute inset-0 -z-10 overflow-hidden rounded-3xl pointer-events-none select-none bg-indigo-50/10"
          aria-hidden="true"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/videos/hero-bg-poster.svg"
            className="w-full h-full object-cover opacity-[0.18]"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-white/80 shadow-xs mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-deal-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-700 tracking-wide">
            Live Retail Comparison Engine • Multi-Store Intel
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
          Search Once. <br />
          <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
            Compare Everywhere.
          </span> <br />
          Buy Smarter.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
          PriceLens monitors prices, bank cashback, delivery days, and seller ratings across Amazon, Flipkart, Croma, and Reliance Digital so you save both money and time.
        </p>

        {/* Hero Search Box */}
        <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto relative mb-8">
          <div className="glass-panel p-2 rounded-full shadow-xl border border-white/95 flex items-center gap-2">
            <div className="pl-4 text-slate-400">
              <Search className="w-5 h-5 text-brand-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search iPhone 15 Pro, MacBook M3, Sony XM5, OLED TV..."
              className="w-full py-2.5 px-2 bg-transparent text-sm sm:text-base font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="btn-primary text-xs sm:text-sm py-3 px-6 shadow-md shadow-brand-500/25 flex-shrink-0"
            >
              Compare Deals
            </button>
          </div>
        </form>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate("find")}
            className="btn-primary py-3 px-8 text-sm font-semibold flex items-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {!user && (
            <button
              onClick={() => openAuthModal("login")}
              className="btn-secondary py-3 px-7 text-sm font-semibold"
            >
              Sign In to Save Deals
            </button>
          )}
        </div>

        {/* Platform trust strip */}
        <div className="mt-12 pt-8 border-t border-slate-200/50 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-400 text-xs font-semibold">
          <span>Comparing Live Prices On:</span>
          <span className="text-slate-700 font-bold hover:text-brand-600 transition">Amazon India</span>
          <span className="text-slate-700 font-bold hover:text-brand-600 transition">Flipkart</span>
          <span className="text-slate-700 font-bold hover:text-brand-600 transition">Croma</span>
          <span className="text-slate-700 font-bold hover:text-brand-600 transition">Reliance Digital</span>
        </div>
      </section>


      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Frictionless Flow
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            How PriceLens Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Four simple steps from finding a product to securing the best deal in the market.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="glass-panel glass-panel-hover rounded-3xl p-6 border border-white/80 shadow-glass flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-brand-300 font-mono">{st.num}</span>
                    <div className="w-10 h-10 rounded-2xl bg-white/80 shadow-xs flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{st.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100/60 flex items-center gap-1.5 text-[11px] font-semibold text-brand-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-deal-500" />
                  <span>Step {i + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* PRODUCT CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Explore Catalog
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Product Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Filter by category to see top gadgets, laptops, audio gear, and appliances.
            </p>
          </div>
          <button
            onClick={() => onNavigate("find")}
            className="btn-secondary text-xs font-semibold py-2.5 px-5 self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(cat.name);
                  onNavigate("find", { category: cat.name });
                }}
                className="glass-panel glass-panel-hover rounded-3xl p-5 border border-white/85 shadow-glass cursor-pointer text-center flex flex-col items-center justify-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-indigo-500/10 text-brand-600 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 stroke-[2]" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition">
                  {cat.name}
                </h4>
                <span className="text-[11px] text-slate-400 mt-0.5 font-medium">{cat.count}</span>
              </div>
            );
          })}
        </div>
      </section>


      {/* FEATURED TOP DEALS SHOWCASE */}
      {featuredDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-deal-700 bg-deal-50 px-3 py-1 rounded-full border border-deal-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-deal-600" /> Today's Smart Deal Highlights
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Highest Scored Deals
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Products with outstanding discounts, prime seller ratings, and instant bank cashbacks.
              </p>
            </div>
            <button
              onClick={() => onNavigate("find")}
              className="btn-primary text-xs font-semibold py-2.5 px-5 self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Explore All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDeals.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelectProduct={onSelectProduct}
                onCompareDeals={onCompareDeals}
              />
            ))}
          </div>
        </section>
      )}


      {/* FEATURES GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Engine Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Features Crafted for Smart Shoppers
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Everything you need to bypass deceptive discounts and purchase with absolute confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="glass-panel glass-panel-hover rounded-3xl p-6 border border-white/85 shadow-glass flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/90 text-brand-600 shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
