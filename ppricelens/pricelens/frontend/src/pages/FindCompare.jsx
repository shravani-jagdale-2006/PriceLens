import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowUpDown,
  Camera
} from "lucide-react";
import { api } from "../services/api";
import ProductCard from "../components/product/ProductCard";
import ImageUploadPreview from "../components/product/ImageUploadPreview";
import PlatformBadge from "../components/common/PlatformBadge";

export default function FindCompare({
  initialSearch = "",
  initialCategory = "All",
  onSelectProduct,
  onCompareDeals
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    "plat-amazon",
    "plat-flipkart",
    "plat-croma",
    "plat-reliance"
  ]);
  const [sortOption, setSortOption] = useState("smartScore");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);

  const categories = [
    "All",
    "Mobiles",
    "Laptops",
    "Headphones",
    "TVs",
    "Smart Watches",
    "Home Appliances"
  ];

  const platforms = [
    { id: "plat-amazon", name: "Amazon" },
    { id: "plat-flipkart", name: "Flipkart" },
    { id: "plat-croma", name: "Croma" },
    { id: "plat-reliance", name: "Reliance Digital" }
  ];

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts({
        search,
        category: selectedCategory,
        minPrice,
        maxPrice,
        platforms: selectedPlatforms,
        sort: sortOption
      });
      if (res && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Products query error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedPlatforms, sortOption]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const togglePlatform = (id) => {
    if (selectedPlatforms.includes(id)) {
      if (selectedPlatforms.length === 1) return; // Keep at least one
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const handleSelectAllPlatforms = () => {
    setSelectedPlatforms(platforms.map((p) => p.id));
  };

  const handleImageRecognized = (data) => {
    if (data.suggestedQuery) {
      setSearch(data.suggestedQuery);
    }
    if (data.suggestedCategory && categories.includes(data.suggestedCategory)) {
      setSelectedCategory(data.suggestedCategory);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedPlatforms(platforms.map((p) => p.id));
    setMinPrice("");
    setMaxPrice("");
    setSortOption("smartScore");
    setShowImageUpload(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Title & Subheading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Smart Search Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Find & Compare Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare across Amazon, Flipkart, Croma, and Reliance Digital in real time.
          </p>
        </div>

        {/* Toggle Image Upload Option */}
        <button
          onClick={() => setShowImageUpload(!showImageUpload)}
          className={`btn-secondary text-xs font-semibold py-2.5 px-4 flex items-center gap-2 border ${
            showImageUpload ? "bg-brand-50 border-brand-300 text-brand-600" : ""
          }`}
        >
          <Camera className="w-4 h-4 text-brand-500" />
          <span>{showImageUpload ? "Hide Visual Upload" : "Upload Image to Compare"}</span>
        </button>
      </div>

      {/* Visual Image Uploader Drawer */}
      {showImageUpload && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <ImageUploadPreview
            onImageRecognized={handleImageRecognized}
            onClear={() => setSearch("")}
          />
        </div>
      )}

      {/* SEARCH BAR & PLATFORM SELECTORS */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/95 shadow-glass space-y-5">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, model, brand (e.g. iPhone 15 Pro, S24 Ultra, Sony XM5)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 border border-white/80 focus:border-brand-500 focus:bg-white focus:outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="btn-primary text-sm font-semibold px-6 py-3 flex-shrink-0"
          >
            Search
          </button>
        </form>

        {/* Platform Checkbox Selection */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-1">
              <Layers className="w-3.5 h-3.5 text-brand-500" /> Platforms:
            </span>
            {platforms.map((plat) => {
              const isChecked = selectedPlatforms.includes(plat.id);
              return (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => togglePlatform(plat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                    isChecked
                      ? "bg-white text-slate-800 border-brand-300 shadow-xs"
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

          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAllPlatforms}
              className="text-xs text-brand-600 hover:underline font-semibold"
            >
              Select All
            </button>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-brand-500 text-white shadow-sm shadow-brand-500/25"
                  : "bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900 border border-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Filter & Sort Dropdown */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          {/* Price Range inputs */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Price (₹):</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="w-24 px-3 py-1.5 rounded-xl bg-white/80 border border-white focus:outline-none focus:border-brand-400 text-xs font-semibold text-slate-800"
            />
            <span className="text-slate-400">–</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="w-24 px-3 py-1.5 rounded-xl bg-white/80 border border-white focus:outline-none focus:border-brand-400 text-xs font-semibold text-slate-800"
            />
            <button
              onClick={fetchProducts}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-semibold text-slate-700 shadow-2xs"
            >
              Apply
            </button>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Sort:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/80 border border-white font-semibold text-slate-700 focus:outline-none focus:border-brand-500 shadow-2xs"
            >
              <option value="smartScore">Smart Deal Score (Highest)</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="discount">Biggest Discount %</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

      </div>

      {/* RESULTS COUNT & STATUS */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{products.length}</strong> matching products across{" "}
          <strong>{selectedPlatforms.length}</strong> platforms
        </span>
        {loading && <span className="text-brand-500 font-semibold animate-pulse">Updating live prices...</span>}
      </div>

      {/* PRODUCTS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-panel p-6 rounded-3xl h-80 animate-pulse border border-white/60">
              <div className="w-full h-40 bg-slate-200/50 rounded-2xl mb-4" />
              <div className="w-3/4 h-4 bg-slate-200/50 rounded mb-2" />
              <div className="w-1/2 h-4 bg-slate-200/50 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center max-w-lg mx-auto border border-white/80 shadow-glass">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No products found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            Try adjusting your search query, clearing filters, or checking all platforms.
          </p>
          <button onClick={handleResetFilters} className="btn-secondary text-xs py-2 px-4">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onCompareDeals={onCompareDeals}
            />
          ))}
        </div>
      )}

    </div>
  );
}
